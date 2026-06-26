import { writable, get, type Writable, type Readable } from 'svelte/store';
import { opusStream } from '../lib/OpusStream';

type CallState = 'idle' | 'calling' | 'in_call' | 'ended' | 'no_answer' | 'failed';

class CallClient {
  private ws: WebSocket | null = null;
  private callTimeout: ReturnType<typeof setTimeout> | null = null;
  private isStreaming = false;

  private callStateWritable: Writable<CallState> = writable('idle');
  private isMutedWritable: Writable<boolean> = writable(false);
  private errorTextWritable: Writable<string> = writable('');

  callState: Readable<CallState> = this.callStateWritable;
  isMuted: Readable<boolean> = this.isMutedWritable;
  errorText: Readable<string> = this.errorTextWritable;

  private handleSignalingMessage(msg: any) {
    switch (msg.type) {
      case 'call_accepted':
        if (this.callTimeout) clearTimeout(this.callTimeout);
        this.callStateWritable.set('in_call');
        this.startAudioStream();
        break;
      case 'error':
        if (this.callTimeout) clearTimeout(this.callTimeout);
        this.callStateWritable.set('failed');
        this.errorTextWritable.set(msg.message || 'Call failed');
        this.stopAudioStream();
        break;
      case 'hangup':
        if (this.callTimeout) clearTimeout(this.callTimeout);
        this.callStateWritable.set('ended');
        this.stopAudioStream();
        break;
    }
  }

  private async startAudioStream(): Promise<void> {
    this.isStreaming = true;
    this.isMutedWritable.set(false);
    try {
      const ws = this.ws;
      await opusStream.startCapture((packet) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(packet);
        }
      });
    } catch (e) {
      console.error('Audio stream start failed:', e);
    }
  }

  private stopAudioStream(): void {
    this.isStreaming = false;
    opusStream.stop();
  }

  private setupWebSocket(): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const ws = new WebSocket(wsUrl);
      this.ws = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'register', role: 'browser' }));
        resolve(ws);
      };

      ws.onmessage = (event) => {
        if (typeof event.data === 'string') {
          try {
            const msg = JSON.parse(event.data);
            this.handleSignalingMessage(msg);
          } catch (e) {
            console.warn('Failed to parse WebSocket message', e);
          }
          return;
        }
        if (event.data instanceof Blob) {
          event.data.arrayBuffer().then((buf) => {
            opusStream.playPacket(new Uint8Array(buf)).catch((e: any) => console.error('playPacket error:', e));
          });
          return;
        }
        if (event.data instanceof ArrayBuffer) {
          opusStream.playPacket(new Uint8Array(event.data)).catch((e: any) => console.error('playPacket error:', e));
          return;
        }
      };

      ws.onclose = () => {
        const currentState = get(this.callStateWritable);
        if (currentState === 'in_call') {
          this.callStateWritable.set('ended');
        }
        this.stopAudioStream();
      };

      setTimeout(() => reject(new Error('Connection timeout')), 5000);
    });
  }

  checkMediaSupport(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  async startCall(): Promise<void> {
    if (!this.checkMediaSupport()) {
      this.errorTextWritable.set('Microphone access required for calls. Use the message form instead.');
      this.callStateWritable.set('failed');
      return;
    }

    this.errorTextWritable.set('');

    let ws: WebSocket;
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      try {
        ws = await this.setupWebSocket();
      } catch {
        this.errorTextWritable.set('Connection failed. Try again.');
        this.callStateWritable.set('failed');
        return;
      }
    } else {
      ws = this.ws;
    }

    if (ws.readyState !== WebSocket.OPEN) {
      this.errorTextWritable.set('Connection failed. Try again.');
      this.callStateWritable.set('failed');
      return;
    }

    this.callStateWritable.set('calling');

    this.callTimeout = setTimeout(() => {
      const currentState = get(this.callStateWritable);
      if (currentState !== 'in_call') {
        this.errorTextWritable.set('No answer. Try again.');
        ws.send(JSON.stringify({ type: 'hangup' }));
        ws.close();
        this.callStateWritable.set('no_answer');
      }
    }, 30000);

    ws.send(JSON.stringify({ type: 'call_start' }));
  }

  endCall(): void {
    if (this.callTimeout) clearTimeout(this.callTimeout);
    const ws = this.ws;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'hangup' }));
      ws.close();
    }
    this.callStateWritable.set('ended');
    this.stopAudioStream();
  }

  resetCall(): void {
    this.callStateWritable.set('idle');
    this.errorTextWritable.set('');
    if (this.callTimeout) clearTimeout(this.callTimeout);
    opusStream.stop();
  }

  toggleMute(): void {
    const newMuted = !get(this.isMutedWritable);
    this.isMutedWritable.set(newMuted);
    opusStream.toggleMute();
  }
}

export const callClient = new CallClient();
