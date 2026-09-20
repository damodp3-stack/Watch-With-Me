import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { userStoreService } from '../src/server/services/store.service';
import { MediaItem } from '../src/types';

describe('User Store & Persistence Layer', () => {
  const sampleMedia: MediaItem = {
    id: 'test-media-1',
    slug: 'test-media-1',
    title: 'Test Movie',
    type: 'movie',
    poster: 'https://example.com/poster.jpg',
    backdrop: 'https://example.com/backdrop.jpg',
    synopsis: 'A test synopsis',
    rating: 8.5,
    votesCount: 100,
    releaseYear: 2024,
    releaseDate: '2024-01-01',
    languages: ['English'],
    originalLanguage: 'English',
    genres: ['Action'],
    country: 'US',
    cast: [{ name: 'Actor 1', role: 'Hero' }],
    contentRating: 'PG',
    playbackSources: [],
    subtitleTracks: [],
  };

  test('adds and retrieves watchlist items', () => {
    const item = userStoreService.addToWatchlist('user-unit-test', sampleMedia);
    assert.equal(item.mediaId, sampleMedia.id);
    assert.equal(item.userId, 'user-unit-test');

    const list = userStoreService.getWatchlist('user-unit-test');
    assert.ok(list.some((w) => w.mediaId === sampleMedia.id));
  });

  test('deduplicates duplicate watchlist additions', () => {
    userStoreService.addToWatchlist('user-unit-test', sampleMedia);
    userStoreService.addToWatchlist('user-unit-test', sampleMedia);

    const list = userStoreService.getWatchlist('user-unit-test');
    const matches = list.filter((w) => w.mediaId === sampleMedia.id);
    assert.equal(matches.length, 1);
  });

  test('removes item from watchlist', () => {
    const removed = userStoreService.removeFromWatchlist('user-unit-test', sampleMedia.id);
    assert.equal(removed, true);

    const list = userStoreService.getWatchlist('user-unit-test');
    assert.ok(!list.some((w) => w.mediaId === sampleMedia.id));
  });

  test('records and retrieves watch history with accurate progress', () => {
    const history = userStoreService.saveHistory('user-unit-test', {
      media: sampleMedia,
      currentTimeSeconds: 120,
      durationSeconds: 240,
      progressPercent: 50,
    });

    assert.equal(history.mediaId, sampleMedia.id);
    assert.equal(history.progressPercent, 50);
    assert.equal(history.currentTimeSeconds, 120);

    const records = userStoreService.getHistory('user-unit-test');
    assert.ok(records.some((r) => r.mediaId === sampleMedia.id));
  });

  test('updates existing watch history without creating duplicates', () => {
    userStoreService.saveHistory('user-unit-test', {
      media: sampleMedia,
      currentTimeSeconds: 180,
      durationSeconds: 240,
      progressPercent: 75,
    });

    const records = userStoreService.getHistory('user-unit-test');
    const matches = records.filter((r) => r.mediaId === sampleMedia.id);
    assert.equal(matches.length, 1);
    assert.equal(matches[0].progressPercent, 75);
  });

  test('clears all watch history for user', () => {
    userStoreService.clearHistory('user-unit-test');
    const records = userStoreService.getHistory('user-unit-test');
    assert.equal(records.length, 0);
  });
});
