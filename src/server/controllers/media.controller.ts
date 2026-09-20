import { Request, Response } from 'express';
import { providerManager } from '../../providers/ProviderManager';
import { FilterState } from '../../types';
import { sendError, sendSuccess } from '../utils/response';

function parseFilters(query: Request['query']): Partial<FilterState> {
  const filters: Partial<FilterState> = {};

  if (query.languages) {
    filters.languages = Array.isArray(query.languages)
      ? (query.languages as string[])
      : (query.languages as string).split(',').map((s) => s.trim());
  }

  if (query.genres) {
    filters.genres = Array.isArray(query.genres)
      ? (query.genres as string[])
      : (query.genres as string).split(',').map((s) => s.trim());
  }

  if (query.minRating) {
    const r = parseFloat(query.minRating as string);
    if (!isNaN(r)) filters.minRating = r;
  }

  if (query.minYear || query.maxYear) {
    const min = query.minYear ? parseInt(query.minYear as string, 10) : 1900;
    const max = query.maxYear ? parseInt(query.maxYear as string, 10) : 2030;
    filters.yearRange = [min, max];
  }

  if (query.country && query.country !== 'all') {
    filters.country = query.country as string;
  }

  if (query.sortBy) {
    filters.sortBy = query.sortBy as FilterState['sortBy'];
  }

  return filters;
}

function handleProviderError(res: Response, error: unknown) {
  const msg = (error as Error).message || 'Provider operation failed';
  if (msg.includes('not configured')) {
    return sendError(res, 400, msg, { code: 'PROVIDER_NOT_CONFIGURED' });
  }
  if (msg.includes('TMDB_API_KEY') || msg.includes('TMDB API') || msg.includes('upstream')) {
    return sendError(res, 502, msg, { code: 'UPSTREAM_PROVIDER_ERROR' });
  }
  return sendError(res, 500, msg);
}

export async function getMovies(req: Request, res: Response) {
  try {
    const filters = parseFilters(req.query);
    const movies = await providerManager.getMovies(filters);
    return sendSuccess(res, movies, undefined, { total: movies.length });
  } catch (error) {
    return handleProviderError(res, error);
  }
}

export async function getMovieById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) return sendError(res, 400, 'Movie ID is required');

    const item = await providerManager.getDetails(id);
    if (!item || item.type !== 'movie') {
      return sendError(res, 404, `Movie with ID '${id}' not found`);
    }
    return sendSuccess(res, item);
  } catch (error) {
    return handleProviderError(res, error);
  }
}

export async function getSeries(req: Request, res: Response) {
  try {
    const filters = parseFilters(req.query);
    const series = await providerManager.getSeries(filters);
    return sendSuccess(res, series, undefined, { total: series.length });
  } catch (error) {
    return handleProviderError(res, error);
  }
}

export async function getSeriesById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) return sendError(res, 400, 'Series ID is required');

    const item = await providerManager.getDetails(id);
    if (!item || item.type !== 'series') {
      return sendError(res, 404, `Series with ID '${id}' not found`);
    }
    return sendSuccess(res, item);
  } catch (error) {
    return handleProviderError(res, error);
  }
}

export async function getAnime(req: Request, res: Response) {
  try {
    const filters = parseFilters(req.query);
    const anime = await providerManager.getAnime(filters);
    return sendSuccess(res, anime, undefined, { total: anime.length });
  } catch (error) {
    return handleProviderError(res, error);
  }
}

export async function getAnimeById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) return sendError(res, 400, 'Anime ID is required');

    const item = await providerManager.getDetails(id);
    if (!item || item.type !== 'anime') {
      return sendError(res, 404, `Anime with ID '${id}' not found`);
    }
    return sendSuccess(res, item);
  } catch (error) {
    return handleProviderError(res, error);
  }
}

export async function getMediaById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) return sendError(res, 400, 'Media ID is required');

    const item = await providerManager.getDetails(id);
    if (!item) {
      return sendError(res, 404, `Media item '${id}' not found`);
    }
    return sendSuccess(res, item);
  } catch (error) {
    return handleProviderError(res, error);
  }
}

export async function searchMedia(req: Request, res: Response) {
  try {
    const q = (req.query.q as string) || '';
    const filters = parseFilters(req.query);
    const results = await providerManager.search(q, filters);
    return sendSuccess(res, results, undefined, { total: results.length });
  } catch (error) {
    return handleProviderError(res, error);
  }
}

export async function getTrending(req: Request, res: Response) {
  try {
    const trending = await providerManager.getTrending();
    return sendSuccess(res, trending, undefined, { total: trending.length });
  } catch (error) {
    return handleProviderError(res, error);
  }
}

export async function getRecommendations(req: Request, res: Response) {
  try {
    const mediaId = req.query.mediaId as string | undefined;
    const language = req.query.language as string | undefined;
    const recs = await providerManager.getRecommendations(mediaId, language);
    return sendSuccess(res, recs, undefined, { total: recs.length });
  } catch (error) {
    return handleProviderError(res, error);
  }
}

export async function getSeasons(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) return sendError(res, 400, 'Series ID is required');

    const seasons = await providerManager.getSeasons(id);
    return sendSuccess(res, seasons);
  } catch (error) {
    return handleProviderError(res, error);
  }
}

export async function getEpisodes(req: Request, res: Response) {
  try {
    const { id, seasonNumber } = req.params;
    if (!id) return sendError(res, 400, 'Series ID is required');

    const sNum = parseInt(seasonNumber, 10);
    if (isNaN(sNum)) return sendError(res, 400, 'Invalid season number');

    const episodes = await providerManager.getEpisodes(id, sNum);
    return sendSuccess(res, episodes);
  } catch (error) {
    return handleProviderError(res, error);
  }
}

export async function getPlayback(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const episodeId = req.query.episodeId as string | undefined;
    if (!id) return sendError(res, 400, 'Media ID is required');

    const playback = await providerManager.getPlayback(id, episodeId);
    if (!playback || playback.sources.length === 0) {
      return sendError(res, 404, 'Playback is unavailable for this title.', {
        code: 'PLAYBACK_UNAVAILABLE',
        mediaId: id,
        episodeId,
      });
    }
    return sendSuccess(res, playback);
  } catch (error) {
    return sendError(res, 404, (error as Error).message, { code: 'PLAYBACK_ERROR' });
  }
}

export async function getSubtitles(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const episodeId = req.query.episodeId as string | undefined;
    if (!id) return sendError(res, 400, 'Media ID is required');

    const subtitles = await providerManager.getSubtitles(id, episodeId);
    return sendSuccess(res, subtitles);
  } catch (error) {
    return sendError(res, 404, (error as Error).message);
  }
}

export function getProviders(req: Request, res: Response) {
  try {
    const providers = providerManager.getProviders();
    const active = providerManager.getActiveProvider();
    const playback = providerManager.getPlaybackProvider();
    return sendSuccess(res, {
      activeProviderId: active.id,
      playbackProviderId: playback.id,
      mockFallbackEnabled: providerManager.isMockFallbackEnabled(),
      providers,
    });
  } catch (error) {
    return sendError(res, 500, (error as Error).message);
  }
}

export function setActiveProvider(req: Request, res: Response) {
  try {
    const { providerId } = req.body;
    if (!providerId) return sendError(res, 400, 'providerId is required');

    const ok = providerManager.setActiveProvider(providerId);
    if (!ok) return sendError(res, 404, `Provider '${providerId}' not found`);

    return sendSuccess(res, { activeProviderId: providerId }, 'Active provider updated successfully');
  } catch (error) {
    return sendError(res, 500, (error as Error).message);
  }
}
