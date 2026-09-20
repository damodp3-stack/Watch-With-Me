import { Episode, FilterState, MediaItem, PlaybackSource, Season, SubtitleTrack } from '../types';
import { IMediaProvider } from './MediaProvider';
import { MockProvider } from './MockProvider';

class ProviderManagerService {
  private providers: Map<string, IMediaProvider> = new Map();
  private activeProviderId: string = 'mock-cinema-provider';

  constructor() {
    const defaultProvider = new MockProvider();
    this.registerProvider(defaultProvider);
    this.activeProviderId = defaultProvider.id;
  }

  registerProvider(provider: IMediaProvider) {
    this.providers.set(provider.id, provider);
  }

  getProviders(): { id: string; name: string; version: string; isAuthorized: boolean; description: string }[] {
    return Array.from(this.providers.values()).map((p) => ({
      id: p.id,
      name: p.name,
      version: p.version,
      isAuthorized: p.isAuthorized,
      description: p.description,
    }));
  }

  setActiveProvider(providerId: string): boolean {
    if (this.providers.has(providerId)) {
      this.activeProviderId = providerId;
      return true;
    }
    return false;
  }

  getActiveProvider(): IMediaProvider {
    const provider = this.providers.get(this.activeProviderId);
    if (!provider) {
      throw new Error(`Active provider with ID ${this.activeProviderId} is not available.`);
    }
    return provider;
  }

  // Gateway methods delegating to active provider
  async search(query: string, filters?: Partial<FilterState>): Promise<MediaItem[]> {
    return this.getActiveProvider().search(query, filters);
  }

  async getDetails(id: string): Promise<MediaItem | null> {
    return this.getActiveProvider().getDetails(id);
  }

  async getMovies(filters?: Partial<FilterState>): Promise<MediaItem[]> {
    return this.getActiveProvider().getMovies(filters);
  }

  async getSeries(filters?: Partial<FilterState>): Promise<MediaItem[]> {
    return this.getActiveProvider().getSeries(filters);
  }

  async getAnime(filters?: Partial<FilterState>): Promise<MediaItem[]> {
    return this.getActiveProvider().getAnime(filters);
  }

  async getSeasons(seriesId: string): Promise<Season[]> {
    return this.getActiveProvider().getSeasons(seriesId);
  }

  async getEpisodes(seriesId: string, seasonNumber: number): Promise<Episode[]> {
    return this.getActiveProvider().getEpisodes(seriesId, seasonNumber);
  }

  async getPlayback(
    mediaId: string,
    episodeId?: string
  ): Promise<{ sources: PlaybackSource[]; subtitles: SubtitleTrack[] }> {
    return this.getActiveProvider().getPlayback(mediaId, episodeId);
  }

  async getSubtitles(mediaId: string, episodeId?: string): Promise<SubtitleTrack[]> {
    return this.getActiveProvider().getSubtitles(mediaId, episodeId);
  }
}

export const providerManager = new ProviderManagerService();
