import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { MockProvider } from '../src/providers/MockProvider';
import { OpenMediaProvider } from '../src/providers/OpenMediaProvider';
import { providerManager } from '../src/providers/ProviderManager';
import { TmdbProvider } from '../src/providers/TmdbProvider';

describe('Provider Contract & Implementations', () => {
  describe('OpenMediaProvider (Legitimate CC & Open Cinema)', () => {
    const provider = new OpenMediaProvider();

    test('implements IMediaProvider contract with required metadata', () => {
      assert.equal(provider.id, 'open-media');
      assert.equal(typeof provider.name, 'string');
      assert.equal(typeof provider.version, 'string');
      assert.equal(provider.isAuthorized, true);
      assert.equal(provider.isConfigured, true);
      assert.equal(provider.capabilities.canStream, true);
      assert.equal(provider.capabilities.hasSubtitles, true);
    });

    test('returns normalized movies with required fields', async () => {
      const movies = await provider.getMovies();
      assert.ok(movies.length > 0, 'Should have open movies');
      for (const m of movies) {
        assert.equal(m.type, 'movie');
        assert.ok(m.id, 'Movie must have an ID');
        assert.ok(m.title, 'Movie must have a title');
        assert.ok(m.poster, 'Movie must have a poster');
        assert.ok(m.rating >= 0 && m.rating <= 10, 'Rating between 0 and 10');
        assert.ok(Array.isArray(m.languages) && m.languages.length > 0, 'Languages array');
        assert.ok(Array.isArray(m.genres) && m.genres.length > 0, 'Genres array');
      }
    });

    test('returns episodic series with seasons and episodes', async () => {
      const series = await provider.getSeries();
      assert.ok(series.length > 0, 'Should have open series');
      const item = series[0];
      assert.equal(item.type, 'series');

      const seasons = await provider.getSeasons(item.id);
      assert.ok(seasons.length > 0, 'Should have at least 1 season');
      assert.equal(seasons[0].seasonNumber, 1);

      const episodes = await provider.getEpisodes(item.id, 1);
      assert.ok(episodes.length > 0, 'Should have episodes in season 1');
      assert.equal(episodes[0].episodeNumber, 1);
      assert.ok(episodes[0].playbackSources.length > 0, 'Episode has playback sources');
    });

    test('provides real playable streams and subtitles', async () => {
      const movies = await provider.getMovies();
      const playback = await provider.getPlayback(movies[0].id);
      assert.ok(playback.sources.length > 0, 'Should have playback sources');
      assert.ok(playback.sources[0].streamUrl.startsWith('http'), 'Stream URL must be valid');
      assert.ok(playback.subtitles.length > 0, 'Should have subtitle tracks');
      assert.ok(playback.subtitles[0].src.length > 0, 'Subtitle src must be present');
    });

    test('searches and filters catalog accurately', async () => {
      const searchResults = await provider.search('sintel');
      assert.ok(searchResults.length > 0, 'Search should find Sintel');
      assert.equal(searchResults[0].slug, 'sintel');

      const filteredByRating = await provider.getMovies({ minRating: 8.7 });
      for (const m of filteredByRating) {
        assert.ok(m.rating >= 8.7);
      }
    });
  });

  describe('MockProvider (Development Fallback)', () => {
    const provider = new MockProvider();

    test('implements IMediaProvider contract', () => {
      assert.equal(provider.id, 'mock-cinema-provider');
      assert.equal(provider.isConfigured, true);
      assert.ok(provider.capabilities.canSearch);
    });

    test('filtering and sorting work accurately', async () => {
      const sortedByRating = await provider.getMovies({ sortBy: 'rating' });
      for (let i = 0; i < sortedByRating.length - 1; i++) {
        assert.ok(sortedByRating[i].rating >= sortedByRating[i + 1].rating);
      }

      const anime = await provider.getAnime();
      assert.ok(anime.every((a) => a.type === 'anime'));
    });
  });

  describe('TmdbProvider (Live Metadata Specification)', () => {
    test('reports unconfigured state gracefully when API key missing', () => {
      const unconfigured = new TmdbProvider('');
      assert.equal(unconfigured.isConfigured, false);
      assert.equal(unconfigured.capabilities.canStream, false);
    });

    test('returns honest capability for playback (metadata only)', async () => {
      const provider = new TmdbProvider('');
      const playback = await provider.getPlayback('tmdb-m-123');
      assert.deepEqual(playback.sources, []);
      assert.deepEqual(playback.subtitles, []);
    });
  });

  describe('ProviderManager (Registry & Routing)', () => {
    test('lists all registered providers with capabilities and status', () => {
      const list = providerManager.getProviders();
      assert.ok(list.length >= 3, 'Must have at least OpenMedia, Mock, and TMDB');
      const openMedia = list.find((p) => p.id === 'open-media');
      assert.ok(openMedia);
      assert.equal(openMedia.isConfigured, true);
    });

    test('active provider switching functions properly', () => {
      const ok = providerManager.setActiveProvider('mock-cinema-provider');
      assert.equal(ok, true);
      assert.equal(providerManager.getActiveProvider().id, 'mock-cinema-provider');

      // Switch back to open-media
      providerManager.setActiveProvider('open-media');
      assert.equal(providerManager.getActiveProvider().id, 'open-media');
    });

    test('fetches trending and recommendations via manager', async () => {
      const trending = await providerManager.getTrending();
      assert.ok(Array.isArray(trending) && trending.length > 0);

      const recs = await providerManager.getRecommendations();
      assert.ok(Array.isArray(recs));
    });
  });
});
