import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

function isNative(): boolean {
  return typeof (window as any).Capacitor !== 'undefined' && (window as any).Capacitor.isNativePlatform();
}

function base64FromBytes(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function fetchPdf(url: string): Promise<Uint8Array> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch PDF: ${res.status}`);
  return new Uint8Array(await res.arrayBuffer());
}

export async function openPdf(url: string, filename: string) {
  if (isNative()) {
    const data = await fetchPdf(url);
    const base64 = base64FromBytes(data);
    const saved = await Filesystem.writeFile({
      path: `temp/${filename}`,
      data: base64,
      directory: Directory.Cache,
    });
    await Share.share({ url: saved.uri, title: filename });
  } else {
    window.open(url, '_blank');
  }
}

export async function savePdf(url: string, filename: string) {
  if (isNative()) {
    const data = await fetchPdf(url);
    const base64 = base64FromBytes(data);
    const saved = await Filesystem.writeFile({
      path: filename,
      data: base64,
      directory: Directory.Documents,
    });
    await Share.share({ url: saved.uri, title: filename });
  } else {
    const blob = new Blob([await (await fetch(url)).arrayBuffer()], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  }
}
