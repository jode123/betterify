interface PipedInstance {
  name: string;
  api_url: string;
  locations: string[];
  version: string;
}

export class PipedService {
  private static instance: PipedService;
  private baseUrl: string = '';

  private constructor() {}

  static getInstance(): PipedService {
    if (!PipedService.instance) {
      PipedService.instance = new PipedService();
    }
    return PipedService.instance;
  }

  async initialize() {
    // Fetch available instances from Piped API
    const response = await fetch('https://piped-instances.kavin.rocks/');
    const instances: PipedInstance[] = await response.json();
    
    // Select the best instance (first available)
    if (instances.length > 0) {
      this.baseUrl = instances[0].api_url;
    }
  }

  async getStreamUrl(videoId: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/streams/${videoId}`);
      const data = await response.json();
      return data.audioStreams[0].url;
    } catch (error) {
      console.error('Error fetching stream URL:', error);
      throw error;
    }
  }

  async searchMusic(query: string) {
    try {
      const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}&filter=music`);
      const data = await response.json();
      return data.items;
    } catch (error) {
      console.error('Error searching music:', error);
      throw error;
    }
  }
}