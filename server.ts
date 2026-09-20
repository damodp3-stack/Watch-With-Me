import express from 'express';
import path from 'path';
import { APP_CONFIG, GENRE_LIST, SUPPORTED_LANGUAGES } from './src/config/app.config.js';
import { providerManager } from './src/providers/ProviderManager.js';
import { FilterState, WatchHistoryItem, WatchlistItem } from './src/types/index.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store for Watchlist and History during session
let inMemoryWatchlist: WatchlistItem[] = [];
let inMemoryHistory: WatchHistoryItem[] = [];

// Seed initial continue watching item from Leo and Kalki 2898 AD for realistic feel
providerManager.getDetails('m-1').then((leo) => {
  if (leo) {
    inMemoryHistory.push({
      id: 'hist-1',
      userId: 'user-demo-1',
      mediaId: 'm-1',
      mediaType: 'movie',
      progressPercent: 68,
      currentTimeSeconds: 6690,
      durationSeconds: 9840,
      updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      media: leo,
    });
  }
});

providerManager.getDetails('s-1').then((familyMan) => {
  if (familyMan) {
    inMemoryHistory.push({
      id: 'hist-2',
      userId: 'user-demo-1',
      mediaId: 's-1',
      mediaType: 'series',
      seasonNumber: 1,
      episodeNumber: 3,
      episodeId: 's-1-s1-e3',
      progressPercent: 42,
      currentTimeSeconds: 1260,
      durationSeconds: 3000,
      updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      media: familyMan,
    });
  }
});

// Seed initial watchlist
providerManager.getDetails('m-2').then((kalki) => {
  if (kalki) {
    inMemoryWatchlist.push({
      id: 'wl-1',
      userId: 'user-demo-1',
      mediaId: 'm-2',
      mediaType: 'movie',
      addedAt: new Date(Date.now() - 86400000).toISOString(),
      media: kalki,
    });
  }
});

// --- API ENDPOINTS ---

// Health & System Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    name: APP_CONFIG.name,
    version: APP_CONFIG.version,
  });
});

// Central App Config
app.get('/api/config', (req, res) => {
  res.json({ success: true, data: APP_CONFIG });
});

// Languages list
app.get('/api/languages', (req, res) => {
  res.json({ success: true, data: SUPPORTED_LANGUAGES });
});

// Genres list
app.get('/api/genres', (req, res) => {
  res.json({ success: true, data: GENRE_LIST });
});

// Providers list
app.get('/api/providers', (req, res) => {
  const providers = providerManager.getProviders();
  res.json({ success: true, data: providers });
});

// Movies
app.get('/api/movies', async (req, res) => {
  try {
    const { language, genre, yearMin, yearMax, minRating, sort } = req.query;
    const filters: Partial<FilterState> = {};
    if (language) filters.languages = (language as string).split(',');
    if (genre) filters.genres = (genre as string).split(',');
    if (minRating) filters.minRating = parseFloat(minRating as string);
    if (yearMin || yearMax) {
      filters.yearRange = [
        yearMin ? parseInt(yearMin as string, 10) : 1950,
        yearMax ? parseInt(yearMax as string, 10) : 2030,
      ];
    }
    if (sort) filters.sortBy = sort as FilterState['sortBy'];

    const movies = await providerManager.getMovies(filters);
    res.json({ success: true, data: movies, count: movies.length });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.get('/api/media/:id', async (req, res) => {
  try {
    const item = await providerManager.getDetails(req.params.id);
    if (!item) {
      res.status(404).json({ success: false, message: 'Media not found' });
      return;
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.get('/api/movies/:id', async (req, res) => {
  try {
    const item = await providerManager.getDetails(req.params.id);
    if (!item) {
      res.status(404).json({ success: false, message: 'Movie not found' });
      return;
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

// Series
app.get('/api/series', async (req, res) => {
  try {
    const { language, genre, minRating, sort } = req.query;
    const filters: Partial<FilterState> = {};
    if (language) filters.languages = (language as string).split(',');
    if (genre) filters.genres = (genre as string).split(',');
    if (minRating) filters.minRating = parseFloat(minRating as string);
    if (sort) filters.sortBy = sort as FilterState['sortBy'];

    const series = await providerManager.getSeries(filters);
    res.json({ success: true, data: series, count: series.length });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.get('/api/series/:id', async (req, res) => {
  try {
    const item = await providerManager.getDetails(req.params.id);
    if (!item) {
      res.status(404).json({ success: false, message: 'Series not found' });
      return;
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

// Anime
app.get('/api/anime', async (req, res) => {
  try {
    const { language, genre, minRating, sort } = req.query;
    const filters: Partial<FilterState> = {};
    if (language) filters.languages = (language as string).split(',');
    if (genre) filters.genres = (genre as string).split(',');
    if (minRating) filters.minRating = parseFloat(minRating as string);
    if (sort) filters.sortBy = sort as FilterState['sortBy'];

    const anime = await providerManager.getAnime(filters);
    res.json({ success: true, data: anime, count: anime.length });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.get('/api/anime/:id', async (req, res) => {
  try {
    const item = await providerManager.getDetails(req.params.id);
    if (!item) {
      res.status(404).json({ success: false, message: 'Anime not found' });
      return;
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

// Trending & Recommendations
app.get('/api/trending', async (req, res) => {
  try {
    const all = await providerManager.search('');
    const trending = all.filter((m) => m.isTrending || m.rating >= 8.5);
    res.json({ success: true, data: trending });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.get('/api/recommendations', async (req, res) => {
  try {
    const { mediaId } = req.query;
    const all = await providerManager.search('');
    let recommended = all;
    if (mediaId) {
      const current = await providerManager.getDetails(mediaId as string);
      if (current) {
        recommended = all.filter(
          (m) =>
            m.id !== current.id &&
            (m.genres.some((g) => current.genres.includes(g)) ||
              m.languages.some((l) => current.languages.includes(l)))
        );
      }
    }
    res.json({ success: true, data: recommended.slice(0, 10) });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

// Search API with multi-field support
app.get('/api/search', async (req, res) => {
  try {
    const { q, type, language, genre, minRating, sort } = req.query;
    const filters: Partial<FilterState> = {};
    if (type && type !== 'all') filters.contentType = type as FilterState['contentType'];
    if (language) filters.languages = (language as string).split(',');
    if (genre) filters.genres = (genre as string).split(',');
    if (minRating) filters.minRating = parseFloat(minRating as string);
    if (sort) filters.sortBy = sort as FilterState['sortBy'];

    const results = await providerManager.search((q as string) || '', filters);
    res.json({ success: true, data: results, count: results.length });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

// Playback Sources
app.get('/api/playback/:id', async (req, res) => {
  try {
    const { episodeId } = req.query;
    const playback = await providerManager.getPlayback(req.params.id, episodeId as string);
    res.json({ success: true, data: playback });
  } catch (error) {
    res.status(404).json({ success: false, message: (error as Error).message });
  }
});

// Subtitles
app.get('/api/subtitles/:id', async (req, res) => {
  try {
    const { episodeId } = req.query;
    const subtitles = await providerManager.getSubtitles(req.params.id, episodeId as string);
    res.json({ success: true, data: subtitles });
  } catch (error) {
    res.status(404).json({ success: false, message: (error as Error).message });
  }
});

// Watchlist CRUD
app.get('/api/watchlist', (req, res) => {
  res.json({ success: true, data: inMemoryWatchlist });
});

app.post('/api/watchlist', async (req, res) => {
  try {
    const { mediaId, userId = 'user-demo-1' } = req.body;
    if (!mediaId) {
      res.status(400).json({ success: false, message: 'mediaId is required' });
      return;
    }
    const existing = inMemoryWatchlist.find((item) => item.mediaId === mediaId);
    if (existing) {
      res.json({ success: true, data: existing, message: 'Already in watchlist' });
      return;
    }
    const media = await providerManager.getDetails(mediaId);
    if (!media) {
      res.status(404).json({ success: false, message: 'Media not found' });
      return;
    }
    const newItem: WatchlistItem = {
      id: `wl-${Date.now()}`,
      userId,
      mediaId,
      mediaType: media.type,
      addedAt: new Date().toISOString(),
      media,
    };
    inMemoryWatchlist.unshift(newItem);
    res.json({ success: true, data: newItem, message: 'Added to watchlist' });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.delete('/api/watchlist/:id', (req, res) => {
  const targetId = req.params.id;
  inMemoryWatchlist = inMemoryWatchlist.filter(
    (item) => item.id !== targetId && item.mediaId !== targetId
  );
  res.json({ success: true, message: 'Removed from watchlist' });
});

// Watch History & Continue Watching CRUD
app.get('/api/history', (req, res) => {
  res.json({ success: true, data: inMemoryHistory });
});

app.post('/api/history', async (req, res) => {
  try {
    const { mediaId, episodeId, seasonNumber, episodeNumber, currentTimeSeconds, durationSeconds } =
      req.body;
    if (!mediaId) {
      res.status(400).json({ success: false, message: 'mediaId is required' });
      return;
    }

    const media = await providerManager.getDetails(mediaId);
    if (!media) {
      res.status(404).json({ success: false, message: 'Media not found' });
      return;
    }

    const progressPercent = durationSeconds > 0 ? Math.min(100, Math.round((currentTimeSeconds / durationSeconds) * 100)) : 0;

    // Remove existing entry for same media/episode
    inMemoryHistory = inMemoryHistory.filter(
      (h) => !(h.mediaId === mediaId && (episodeId ? h.episodeId === episodeId : true))
    );

    const record: WatchHistoryItem = {
      id: `hist-${Date.now()}`,
      userId: 'user-demo-1',
      mediaId,
      mediaType: media.type,
      episodeId,
      seasonNumber,
      episodeNumber,
      progressPercent,
      currentTimeSeconds: Math.round(currentTimeSeconds),
      durationSeconds: Math.round(durationSeconds),
      updatedAt: new Date().toISOString(),
      media,
    };

    inMemoryHistory.unshift(record);
    res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.delete('/api/history/:id', (req, res) => {
  const targetId = req.params.id;
  inMemoryHistory = inMemoryHistory.filter((item) => item.id !== targetId);
  res.json({ success: true, message: 'History record removed' });
});

app.delete('/api/history', (req, res) => {
  inMemoryHistory = [];
  res.json({ success: true, message: 'All history cleared' });
});

// --- VITE MIDDLEWARE / PRODUCTION STATIC SERVING ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Streamora] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
