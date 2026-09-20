import {
  Episode,
  FilterState,
  MediaItem,
  PlaybackSource,
  ProviderInfo,
  Season,
  SubtitleTrack,
} from '../types';
import { IMediaProvider } from './MediaProvider';
import { MockProvider } from './MockProvider';
import { OpenMediaProvider } from './OpenMediaProvider';
import { TmdbProvider } from './TmdbProvider';

class ProviderManagerService {
  private providers: Map<string, IMediaProvider> = new Map();
  private activeProviderId: string = 'open-media';
  private fallbackProvider: IMediaProvider;

  constructor() {
    const openMedia = new OpenMediaProvider();
    const mockProvider = new MockProvider();
    const tmdbProvider = new TmdbProvider();

    this.registerProvider(openMedia);
    this.registerProvider(mockProvider);
    this.registerProvider(tmdbProvider);

    this.fallbackProvider = mockProvider;

    // Detect active provider from environment variable if present
    const envProvider = typeof process !== 'undefined' ? process.env.MEDIA_PROVIDER : undefined;
    if (envProvider && this.providers.has(envProvider)) {
      this.activeProviderId = envProvider;
    } else {
      this.activeProviderId = 'open-media';
    }
  }

  registerProvider(provider: IMediaProvider) {
    this.providers.set(provider.id, provider);
  }

  getProviders(): ProviderInfo[] {
    return Array.from(this.providers.values()).map((p) => ({
      id: p.id,
      name: p.name,
      version: p.version,
      isAuthorized: p.isAuthorized,
      isConfigured: p.isConfigured,
      description: p.description,
      capabilities: p.capabilities,
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
      return this.fallbackProvider;
    }
    return provider;
  }

  private async executeWithFallback<T>(
    operation: (provider: IMediaProvider) => Promise<T>,
    operationName: string
  ): Promise<T> {
    const primary = this.getActiveProvider();
    try {
      if (!primary.isConfigured && primary.id !== this.fallbackProvider.id) {
        console.warn(
          `[Watch With Me] Primary provider '${primary.id}' is not configured. Falling back to development provider for ${operationName}.`
        );
        return await operation(this.fallbackProvider);
      }
      return await operation(primary);
    } catch (err) {
      if (primary.id !== this.fallbackProvider.id) {
        console.warn(
          `[Watch With Me] Primary provider '${primary.id}' failed during ${operationName}: ${(err as Error).message}. Using development fallback.`
        );
        return await operation(this.fallbackProvider);
      }
      throw err;
    }
  }

  async search(query: string, filters?: Partial<FilterState>): Promise<MediaItem[]> {
    return this.executeWithFallback((p) => p.search(query, filters), 'search');
  }

  async getDetails(id: string): Promise<MediaItem | null> {
    return this.executeWithFallback((p) => p.getDetails(id), 'getDetails');
  }

  async getMovies(filters?: Partial<FilterState>): Promise<MediaItem[]> {
    return this.executeWithFallback((p) => p.getMovies(filters), 'getMovies');
  }

  async getSeries(filters?: Partial<FilterState>): Promise<MediaItem[]> {
    return this.executeWithFallback((p) => p.getSeries(filters), 'getSeries');
  }

  async getAnime(filters?: Partial<FilterState>): Promise<MediaItem[]> {
    return this.executeWithFallback((p) => p.getAnime(filters), 'getAnime');
  }

  async getTrending(): Promise<MediaItem[]> {
    return this.executeWithFallback(async (p) => {
      if (p.getTrending) return p.getTrending();
      return p.getMovies({ sortBy: 'trending' });
    }, 'getTrending');
  }

  async getRecommendations(mediaId?: string, language?: string): Promise<MediaItem[]> {
    return this.executeWithFallback(async (p) => {
      if (p.getRecommendations) return p.getRecommendations(mediaId, language);
      return p.getMovies();
    }, 'getRecommendations');
  }

  async getSeasons(seriesId: string): Promise<Season[]> {
    return this.executeWithFallback((p) => p.getSeasons(seriesId), 'getSeasons');
  }

  async getEpisodes(seriesId: string, seasonNumber: number): Promise<Episode[]> {
    return this.executeWithFallback((p) => p.getEpisodes(seriesId, seasonNumber), 'getEpisodes');
  }

  async getPlayback(
    mediaId: string,
    episodeId?: string
  ): Promise<{ sources: PlaybackSource[]; subtitles: SubtitleTrack[] }> {
    return this.executeWithFallback((p) => p.getPlayback(mediaId, episodeId), 'getPlayback');
  }

  async getSubtitles(mediaId: string, episodeId?: string): Promise<SubtitleTrack[]> {
    return this.executeWithFallback((p) => p.getSubtitles(mediaId, episodeId), 'getSubtitles');
  }
}

export const providerManager = new ProviderManagerService();
