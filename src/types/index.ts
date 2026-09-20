/**
 * Normalized Data Architecture & Types for Watch With Me
 */

export type MediaType = 'movie' | 'series' | 'anime';

export interface ProviderCapabilities {
  metadata?: boolean;
  search: boolean;
  canSearch?: boolean; // backwards compatibility alias
  canFilter?: boolean;
  movies?: boolean;
  series?: boolean;
  anime?: boolean;
  seasons?: boolean;
  episodes?: boolean;
  playback: boolean;
  canStream?: boolean; // backwards compatibility alias
  subtitles: boolean;
  hasSubtitles?: boolean; // backwards compatibility alias
  trending?: boolean;
  recommendations?: boolean;
  supportedTypes: MediaType[];
}

export interface ProviderInfo {
  id: string;
  name: string;
  version: string;
  isAuthorized: boolean;
  isConfigured: boolean;
  description: string;
  capabilities?: ProviderCapabilities;
}

export interface CastMember {
  name: string;
  role: string;
  photo?: string;
  avatar?: string;
}

export interface SubtitleCue {
  startTime: number;
  endTime: number;
  text: string;
}

export interface SubtitleTrack {
  id: string;
  language: string;
  label: string;
  src: string; // VTT file or data URL
  format: 'vtt' | 'srt';
  isDefault?: boolean;
  cues?: SubtitleCue[];
}

export interface PlaybackSource {
  id: string;
  providerId: string;
  label: string;
  quality: '4K' | '1080p' | '720p' | '480p' | 'Auto';
  streamUrl: string;
  url?: string;
  resolution?: string;
  format: 'mp4' | 'webm' | 'hls';
  isDefault?: boolean;
}

export interface Episode {
  id: string;
  seasonId: string;
  mediaId: string;
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  synopsis: string;
  overview?: string;
  runtimeMinutes: number;
  durationMinutes?: number;
  thumbnail: string;
  releaseDate?: string;
  airDate?: string;
  playbackSources: PlaybackSource[];
  subtitleTracks: SubtitleTrack[];
}

export interface Season {
  id: string;
  mediaId: string;
  seasonNumber: number;
  title: string;
  synopsis: string;
  episodeCount: number;
  releaseYear: number;
  episodes: Episode[];
}

export interface MediaItem {
  id: string;
  slug: string;
  title: string;
  originalTitle?: string;
  type: MediaType;
  poster: string;
  backdrop: string;
  synopsis: string;
  rating: number; // 0 - 10
  votesCount: number;
  releaseYear: number;
  releaseDate: string;
  runtimeMinutes?: number; // for movies
  durationLabel?: string; // e.g. "2h 24m" or "3 Seasons"
  languages: string[]; // e.g. ['Tamil', 'Telugu', 'Hindi', 'English']
  originalLanguage: string;
  genres: string[];
  country: string;
  director?: string;
  writer?: string;
  productionCompany?: string;
  totalSeasons?: number;
  cast: CastMember[];
  seasonsCount?: number;
  episodesCount?: number;
  seasons?: Season[];
  contentRating: string; // 'U/A 13+', 'PG-13', 'TV-MA', etc.
  trailerUrl?: string;
  playbackSources: PlaybackSource[];
  subtitleTracks: SubtitleTrack[];
  isFeatured?: boolean;
  isTrending?: boolean;
  isPopular?: boolean;
  isTopRated?: boolean;
  isRecentlyAdded?: boolean;
  animeInfo?: {
    isDubbed: boolean;
    isSubbed: boolean;
    studio: string;
    japaneseTitle: string;
    episodeDuration: string;
  };
}

export interface WatchlistItem {
  id: string;
  userId: string;
  mediaId: string;
  mediaType: MediaType;
  addedAt: string;
  media: MediaItem;
}

export interface WatchHistoryItem {
  id: string;
  userId: string;
  mediaId: string;
  mediaType: MediaType;
  episodeId?: string;
  seasonNumber?: number;
  episodeNumber?: number;
  progressPercent: number; // 0 - 100
  currentTimeSeconds: number;
  durationSeconds: number;
  updatedAt: string;
  media: MediaItem;
}

export interface FilterState {
  languages: string[];
  genres: string[];
  yearRange: [number, number];
  minRating: number;
  country: string;
  contentType: 'all' | 'movie' | 'series' | 'anime';
  sortBy: 'trending' | 'rating' | 'newest' | 'title';
  searchQuery?: string;
}

export interface UserPreferences {
  preferredLanguages: string[];
  theme: 'dark' | 'light' | 'system';
  autoplayNextEpisode: boolean;
  defaultSubtitleLanguage: string;
  defaultQuality: 'Auto' | '4K' | '1080p' | '720p' | '480p';
  volume: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin';
  preferences: UserPreferences;
  createdAt: string;
}

export interface MediaProvider {
  id: string;
  name: string;
  version: string;
  isAuthorized: boolean;
  description: string;
  search(query: string, filters?: Partial<FilterState>): Promise<MediaItem[]>;
  getDetails(id: string): Promise<MediaItem | null>;
  getMovies(filters?: Partial<FilterState>): Promise<MediaItem[]>;
  getSeries(filters?: Partial<FilterState>): Promise<MediaItem[]>;
  getAnime(filters?: Partial<FilterState>): Promise<MediaItem[]>;
  getSeasons(seriesId: string): Promise<Season[]>;
  getEpisodes(seriesId: string, seasonNumber: number): Promise<Episode[]>;
  getPlayback(mediaId: string, episodeId?: string): Promise<{ sources: PlaybackSource[]; subtitles: SubtitleTrack[] }>;
  getSubtitles(mediaId: string, episodeId?: string): Promise<SubtitleTrack[]>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}
