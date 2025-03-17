import { PIPED_INSTANCE } from '@/config/piped'

interface PipedSearchItem {
  type: string;
  title: string;
  url: string;
  duration: number;
  uploaded: string;
  uploadedDate: string;
  uploaderName: string;
  uploaderUrl: string;
  uploaderAvatar: string;
  thumbnail: string;
  description: string;
  views: number;
  uploaded_timestamp: number;
}

interface PipedSearchResponse {
  items: PipedSearchItem[];
  nextpage: string | null;
  suggestion: string | null;
  corrected: boolean;
}

export interface PipedSearchResult {
  title: string;
  url: string;
  id: string;
  duration: number;
  uploaded: string;
  uploaderName: string;
  uploaderUrl: string;
  thumbnail: string;
}

function sanitizeQuery(query: string): string {
  // Remove special characters and unnecessary terms
  return query
    .replace(/[^\w\s-]/g, '') // Remove special chars except hyphen
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()
}

export async function searchMusic(query: string): Promise<PipedSearchResult | null> {
  try {
    const cleanQuery = sanitizeQuery(query)
    const searchQuery = `${cleanQuery} audio`
    
    console.log('Searching for:', searchQuery)

    const response = await fetch(
      `/api/piped?q=${encodeURIComponent(searchQuery)}&filter=music`
    )

    if (!response.ok) {
      console.error('API Response not OK:', response.status);
      throw new Error('Failed to fetch from Piped API');
    }

    const data = await response.json() as PipedSearchResponse;
    console.log('Raw search results:', data);

    
    if (!data.items?.length) {
      console.log('No results found for query:', searchQuery);
      return null;
    }

    // Find the best match from the first 5 results
    const bestMatch = data.items
      .slice(0, 5)
      .find((item: PipedSearchItem) => {
        const title = item.title.toLowerCase();
        const terms = cleanQuery.toLowerCase().split(' ');
        return terms.every(term => title.includes(term));
      }) || data.items[0];

    const videoId = bestMatch.url.split('watch?v=')[1];
    console.log('Selected match:', bestMatch.title);

    return {
      title: bestMatch.title,
      url: `${PIPED_INSTANCE}/watch?v=${videoId}`,
      id: videoId,
      duration: bestMatch.duration,
      uploaded: bestMatch.uploaded,
      uploaderName: bestMatch.uploaderName,
      uploaderUrl: bestMatch.uploaderUrl,
      thumbnail: bestMatch.thumbnail
    };
  } catch (error) {
    console.error('Piped search error:', error);
    return null;
  }
}

export async function getAudioStream(videoId: string): Promise<string | null> {
  try {
    const response = await fetch(`/api/piped?videoId=${videoId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch audio stream');
    }
    
    const data = await response.json();
    return data.audioStreams?.[0]?.url || null;
  } catch (error) {
    console.error('Error fetching audio stream:', error);
    return null;
  }
}