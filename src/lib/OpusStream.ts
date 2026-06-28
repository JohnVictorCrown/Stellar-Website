import { writable, type Writable, type Readable } from 'svelte/store';

const BITRATE = 96000;
const PREFERRED_TYPES = ['audio/webm;codecs=opus', 'audio/webm'];

class OpusStream {
  private mediaRecorder: MediaRecorder | null = null;
  private mediaStream: MediaStream | null = null;
  private resolveCurrent: ((data: Uint8Array) => void) | null = null;

  private selectedMimeType = '';

  private initializedWritable: Writable<boolean> = writable(false);
  private recordingWritable: Writable<boolean> = writable(false);
  private micBlockedWritable: Writable<boolean> = writable(false);
  private micHintWritable: Writable<string> = writable('');

  initialized: Readable<boolean> = this.initializedWritable;
  recording: Readable<boolean> = this.recordingWritable;
  micBlocked: Readable<boolean> = this.micBlockedWritable;
  micHint: Readable<string> = this.micHintWritable;

  init(): void {
    this.initializedWritable.set(true);
  }

  private async tryAllGetUserMedia(constraints: MediaStreamConstraints): Promise<MediaStream | null> {
    const apis: [string, () => Promise<MediaStream>][] = [
      ['navigator.mediaDevices.getUserMedia', () => navigator.mediaDevices!.getUserMedia(constraints)],
    ];
    if (typeof (navigator as any).getUserMedia === 'function') {
      apis.push(['navigator.getUserMedia', () => new Promise((res, rej) => (navigator as any).getUserMedia(constraints, res, rej))]);
    }
    if (typeof (navigator as any).webkitGetUserMedia === 'function') {
      apis.push(['navigator.webkitGetUserMedia', () => new Promise((res, rej) => (navigator as any).webkitGetUserMedia(constraints, res, rej))]);
    }
    if (typeof (navigator as any).mozGetUserMedia === 'function') {
      apis.push(['navigator.mozGetUserMedia', () => new Promise((res, rej) => (navigator as any).mozGetUserMedia(constraints, res, rej))]);
    }
    for (const [name, fn] of apis) {
      try {
        const stream = await fn();
        console.log('getUserMedia succeeded via', name);
        return stream;
      } catch (e) {
        console.log('getUserMedia failed via', name, e);
      }
    }
    return null;
  }

  private detectMicBlockReason(): string {
    if (typeof navigator.mediaDevices === 'undefined') {
      const isFirefox = navigator.userAgent.includes('Firefox');
      const isTor = navigator.userAgent.includes('Tor');
      if (isTor || isFirefox) {
        return 'Tor Browser blocks microphone at "Safer"/"Safest" level, or about:config flag "media.navigator.enabled" is false. Verify your security level via the shield icon in the URL bar, then check about:config → search "media.navigator.enabled" → set to true.';
      }
      return 'navigator.mediaDevices is undefined. Ensure you are on HTTPS and your browser supports getUserMedia.';
    }
    return '';
  }

  async initStream(): Promise<void> {
    if (this.mediaStream) return;

    const supported = PREFERRED_TYPES.find(t => MediaRecorder.isTypeSupported(t));
    if (!supported) {
      this.micBlockedWritable.set(true);
      this.micHintWritable.set('Your browser does not support audio recording.');
      return;
    }
    this.selectedMimeType = supported;

    const stream = await this.tryAllGetUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
    });

    if (!stream) {
      this.micBlockedWritable.set(true);
      this.micHintWritable.set(this.detectMicBlockReason());
      return;
    }

    this.mediaStream = stream;
    this.mediaRecorder = new MediaRecorder(this.mediaStream, {
      mimeType: this.selectedMimeType,
      audioBitsPerSecond: BITRATE
    });

    this.mediaRecorder.ondataavailable = (event) => {
      if (!event.data || event.data.size === 0) return;
      event.data.arrayBuffer().then((buffer) => {
        this.resolveCurrent?.(new Uint8Array(buffer));
        this.resolveCurrent = null;
      });
    };
  }

  async startRecording(): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this.mediaStream) {
        reject(new Error('Not initialized. Call initStream() first.'));
        return;
      }
      if (this.mediaRecorder.state === 'recording') {
        reject(new Error('Already recording'));
        return;
      }

      this.resolveCurrent = resolve;
      this.mediaRecorder.start();
      this.recordingWritable.set(true);
    });
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this.recordingWritable.set(false);
  }

  releaseStream(): void {
    this.stopRecording();
    this.mediaRecorder = null;
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
    }
    this.initializedWritable.set(false);
  }

  async playPacket(packet: Uint8Array): Promise<void> {
    const blob = new Blob([packet], { type: this.selectedMimeType || PREFERRED_TYPES[0] });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.onended = () => URL.revokeObjectURL(url);
    await audio.play();
  }

  stop(): void {
    this.releaseStream();
  }

  free(): void {
    this.releaseStream();
  }
}

export const opusStream = new OpusStream();
