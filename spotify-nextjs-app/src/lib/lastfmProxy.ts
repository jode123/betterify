interface LastFmMetadata {
  name: string;
  artist: string;
  image: string[];
  playcount?: string;
  listeners?: string;
  tracks?: any[];
}

export async function getLastFmMetadata(method: string, params: Record<string, string>): Promise<LastFmMetadata | null> {
  const API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY;
  const BASE_URL = 'https://ws.audioscrobbler.com/2.0';

  try {
    const searchParams = new URLSearchParams({
      method,
      api_key: API_KEY || '',
      format: 'json',
      ...params
    });

    const response = await fetch(`${BASE_URL}/?${searchParams}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Musish/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`LastFM API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching LastFM metadata:', error);
    return null;
  }
}