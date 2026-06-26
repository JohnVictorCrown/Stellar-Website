import { writable, get, type Writable, type Readable } from 'svelte/store';

const SAMPLE_RATE = 48000;
const CHANNELS = 1;
const BITRATE = 96000;
const MIME_TYPE = 'audio/webm;codecs=opus';

class OpusStream {
  private playbackContext: AudioContext | null = null;
  private decoder: AudioDecoder | null = null;
  private nextPlayTime = 0;

  private mediaRecorder: MediaRecorder | null = null;
  private mediaStream: MediaStream | null = null;

  private mutedWritable: Writable<boolean> = writable(false);
  private initializedWritable: Writable<boolean> = writable(false);

  muted: Readable<boolean> = this.mutedWritable;
  initialized: Readable<boolean> = this.initializedWritable;

  async init(): Promise<void> {
    if (this.decoder) return;
    this.playbackContext = new AudioContext({ sampleRate: SAMPLE_RATE });
    this.nextPlayTime = this.playbackContext.currentTime;

    this.decoder = new AudioDecoder({
      output: (audioData) => {
        const buffer = this.playbackContext!.createBuffer(
          audioData.numberOfChannels,
          audioData.numberOfFrames,
          audioData.sampleRate
        );
        for (let ch = 0; ch < audioData.numberOfChannels; ch++) {
          audioData.copyTo(buffer.getChannelData(ch), { planeIndex: ch });
        }
        const source = this.playbackContext!.createBufferSource();
        source.buffer = buffer;
        source.connect(this.playbackContext!.destination);
        const playTime = Math.max(this.nextPlayTime, this.playbackContext!.currentTime);
        source.start(playTime);
        this.nextPlayTime = playTime + buffer.duration;
        audioData.close();
      },
      error: (e) => console.error('WebCodecs decode error:', e)
    });

    this.decoder.configure({
      codec: 'opus',
      sampleRate: SAMPLE_RATE,
      numberOfChannels: CHANNELS
    });

    this.initializedWritable.set(true);
  }

  async startCapture(onEncodedPacket: (packet: Uint8Array) => void): Promise<void> {
    if (!MediaRecorder.isTypeSupported(MIME_TYPE)) {
      throw new Error(`${MIME_TYPE} not supported`);
    }

    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, googEchoCancellation: true, googAutoGainControl: true, googNoiseSuppression: true }
    });

    this.mediaRecorder = new MediaRecorder(this.mediaStream, {
      mimeType: MIME_TYPE,
      audioBitsPerSecond: BITRATE
    });

    this.mediaRecorder.ondataavailable = async (event) => {
      if (get(this.mutedWritable) || !event.data || event.data.size === 0) return;
      const buffer = await event.data.arrayBuffer();
      onEncodedPacket(new Uint8Array(buffer));
    };

    this.mediaRecorder.start(40);
  }

  async playPacket(packet: Uint8Array): Promise<void> {
    if (!this.decoder) await this.init();
    if (!this.decoder) throw new Error('Decoder not initialized');

    const chunk = new EncodedAudioChunk({
      type: 'key',
      timestamp: performance.now() * 1000,
      data: packet
    });
    this.decoder.decode(chunk);
  }

  toggleMute(): void {
    this.mutedWritable.update(v => !v);
  }

  stop(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this.mediaRecorder = null;

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
    }

    if (this.decoder) {
      this.decoder.close();
      this.decoder = null;
    }
    if (this.playbackContext) {
      this.playbackContext.close();
      this.playbackContext = null;
    }
    this.nextPlayTime = 0;
  }

  free(): void {
    this.stop();
    this.initializedWritable.set(false);
  }
}

export const opusStream = new OpusStream();
