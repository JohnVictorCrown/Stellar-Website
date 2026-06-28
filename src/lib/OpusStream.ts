import { writable, type Writable, type Readable } from 'svelte/store';

const BITRATE = 96000;
const SAMPLE_RATE = 48000;
const MIME_TYPE = 'audio/webm;codecs=opus';

class OpusStream {
  private mediaRecorder: MediaRecorder | null = null;
  private mediaStream: MediaStream | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private decoder: AudioDecoder | null = null;
  private nextPlayTime = 0;

  private initializedWritable: Writable<boolean> = writable(false);

  initialized: Readable<boolean> = this.initializedWritable;

  async initDecoder(): Promise<void> {
    if (this.decoder) return;
    if (!('AudioDecoder' in window)) return;

    this.audioContext = new AudioContext({ sampleRate: SAMPLE_RATE });
    this.nextPlayTime = this.audioContext.currentTime;

    this.decoder = new AudioDecoder({
      output: (audioData) => {
        const buffer = this.audioContext!.createBuffer(
          audioData.numberOfChannels,
          audioData.numberOfFrames,
          audioData.sampleRate
        );
        for (let ch = 0; ch < audioData.numberOfChannels; ch++) {
          audioData.copyTo(buffer.getChannelData(ch), { planeIndex: ch });
        }
        const source = this.audioContext!.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext!.destination);
        const playTime = Math.max(this.nextPlayTime, this.audioContext!.currentTime);
        source.start(playTime);
        this.nextPlayTime = playTime + buffer.duration;
        audioData.close();
      },
      error: (e) => console.error('AudioDecoder error:', e)
    });

    this.decoder.configure({
      codec: 'opus',
      sampleRate: SAMPLE_RATE,
      numberOfChannels: 1
    });

    this.initializedWritable.set(true);
  }

  async startRecording(): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      if (!MediaRecorder.isTypeSupported(MIME_TYPE)) {
        reject(new Error(`${MIME_TYPE} not supported`));
        return;
      }

      navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      }).then((stream) => {
        this.mediaStream = stream;
        this.mediaRecorder = new MediaRecorder(stream, {
          mimeType: MIME_TYPE,
          audioBitsPerSecond: BITRATE
        });

        this.mediaRecorder.ondataavailable = async (event) => {
          if (!event.data || event.data.size === 0) return;
          const buffer = await event.data.arrayBuffer();
          resolve(new Uint8Array(buffer));
        };

        this.mediaRecorder.start();
      }).catch(reject);
    });
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this.mediaRecorder = null;
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
    }
  }

  async playPacket(packet: Uint8Array): Promise<void> {
    if (this.decoder) {
      try {
        const chunk = new EncodedAudioChunk({
          type: 'key',
          timestamp: performance.now() * 1000,
          data: packet
        });
        this.decoder.decode(chunk);
        return;
      } catch (e) {
        console.warn('AudioDecoder decode failed, falling back to <audio>:', e);
      }
    }

    const blob = new Blob([packet], { type: MIME_TYPE });
    const url = URL.createObjectURL(blob);

    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
    }

    const audio = new Audio(url);
    this.audioElement = audio;
    audio.onended = () => URL.revokeObjectURL(url);
    await audio.play();
  }

  stop(): void {
    this.stopRecording();

    if (this.decoder) {
      this.decoder.close();
      this.decoder = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.nextPlayTime = 0;

    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
      this.audioElement = null;
    }
  }

  free(): void {
    this.stop();
    this.initializedWritable.set(false);
  }
}

export const opusStream = new OpusStream();
