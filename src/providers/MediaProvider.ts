import { Episode, FilterState, MediaItem, PlaybackSource, Season, SubtitleTrack } from '../types';

export interface IMediaProvider {
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
