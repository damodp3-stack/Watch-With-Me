import { Router } from 'express';
import { APP_CONFIG } from '../../config/app.config';
import { providerManager } from '../../providers/ProviderManager';
import {
  getAnime,
  getAnimeById,
  getEpisodes,
  getMediaById,
  getMovieById,
  getMovies,
  getPlayback,
  getProviders,
  getRecommendations,
  getSeasons,
  getSeries,
  getSeriesById,
  getSubtitles,
  getTrending,
  searchMedia,
  setActiveProvider,
} from '../controllers/media.controller';
import {
  addToWatchlist,
  clearHistory,
  getHistory,
  getWatchlist,
  removeHistoryItem,
  removeFromWatchlist,
  saveHistory,
} from '../controllers/user.controller';
import { sendSuccess } from '../utils/response';

export const apiRouter = Router();

// Health Check Endpoint
apiRouter.get('/health', (req, res) => {
  const activeProvider = providerManager.getActiveProvider();
  return sendSuccess(res, {
    status: 'ok',
    app: APP_CONFIG.name,
    version: APP_CONFIG.version,
    activeProvider: {
      id: activeProvider.id,
      name: activeProvider.name,
      isConfigured: activeProvider.isConfigured,
      capabilities: activeProvider.capabilities,
    },
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// App Configuration Endpoint (Safe public frontend config)
apiRouter.get('/config', (req, res) => {
  return sendSuccess(res, {
    name: APP_CONFIG.name,
    shortName: APP_CONFIG.shortName,
    tagline: APP_CONFIG.tagline,
    description: APP_CONFIG.description,
    version: APP_CONFIG.version,
    features: APP_CONFIG.features,
    links: APP_CONFIG.links,
    copyrightNotice: APP_CONFIG.copyrightNotice,
  });
});

// Provider Registry & Selection
apiRouter.get('/providers', getProviders);
apiRouter.get('/system/providers', getProviders);
apiRouter.post('/providers/active', setActiveProvider);

// Media Catalog Endpoints
apiRouter.get('/movies', getMovies);
apiRouter.get('/movies/:id', getMovieById);

apiRouter.get('/series', getSeries);
apiRouter.get('/series/:id', getSeriesById);

apiRouter.get('/anime', getAnime);
apiRouter.get('/anime/:id', getAnimeById);

apiRouter.get('/media/:id', getMediaById);

// Discovery & Search Endpoints
apiRouter.get('/search', searchMedia);
apiRouter.get('/trending', getTrending);
apiRouter.get('/recommendations', getRecommendations);

// Episodic Media Endpoints
apiRouter.get('/series/:id/seasons', getSeasons);
apiRouter.get('/series/:id/seasons/:seasonNumber/episodes', getEpisodes);

// Playback & Subtitles
apiRouter.get('/playback/:id', getPlayback);
apiRouter.get('/subtitles/:id', getSubtitles);

// User State: Watchlist
apiRouter.get('/watchlist', getWatchlist);
apiRouter.post('/watchlist', addToWatchlist);
apiRouter.delete('/watchlist/:id', removeFromWatchlist);

// User State: Watch History
apiRouter.get('/history', getHistory);
apiRouter.post('/history', saveHistory);
apiRouter.delete('/history/:id', removeHistoryItem);
apiRouter.delete('/history', clearHistory);
