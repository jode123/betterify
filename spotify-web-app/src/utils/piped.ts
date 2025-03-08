const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks',
  'https://pipedapi.syncpundit.io',
  'https://api-piped.mha.fi',
  'https://piped-api.garudalinux.org',
];

interface PipedStream {
  url: string;
  quality: string;
  mimeType: string;
  bitrate: number;
}

export async function getPipedStreams(videoId: string): Promise<PipedStream[]> {
  let lastError;

  for (const instance of PIPED_INSTANCES) {
    try {
      const response = await fetch(`${instance}/streams/${videoId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      return data.audioStreams.map((stream: any) => ({
        url: stream.url,
        quality: stream.quality,
        mimeType: stream.mimeType,
        bitrate: stream.bitrate || 0
      }));
    } catch (error) {
      lastError = error;
      continue;
    }
  }

  throw lastError;
}