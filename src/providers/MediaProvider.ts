import {
  Episode,
  FilterState,
  MediaItem,
  PlaybackSource,
  ProviderCapabilities,
  Season,
  SubtitleTrack,
} from '../types';

export interface IMediaProvider {
  id: string;
  name: string;
  version: string;
  isAuthorized: boolean;
  isConfigured: boolean;
  description: string;
  capabilities: ProviderCapabilities;

  search(query: string, filters?: Partial<FilterState>): Promise<MediaItem[]>;
  getDetails(id: string): Promise<MediaItem | null>;
  getMovies(filters?: Partial<FilterState>): Promise<MediaItem[]>;
  getSeries(filters?: Partial<FilterState>): Promise<MediaItem[]>;
  getAnime(filters?: Partial<FilterState>): Promise<MediaItem[]>;
  getTrending?(): Promise<MediaItem[]>;
  getRecommendations?(mediaId?: string, language?: string): Promise<MediaItem[]>;
  getSeasons(seriesId: string): Promise<Season[]>;
  getEpisodes(seriesId: string, seasonNumber: number): Promise<Episode[]>;
  getPlayback(mediaId: string, episodeId?: string): Promise<{ sources: PlaybackSource[]; subtitles: SubtitleTrack[] }>;
  getSubtitles(mediaId: string, episodeId?: string): Promise<SubtitleTrack[]>;
}
