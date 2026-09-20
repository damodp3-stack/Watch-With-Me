import { Request, Response } from 'express';
import { providerManager } from '../../providers/ProviderManager';
import { userStoreService } from '../services/store.service';
import { sendError, sendSuccess } from '../utils/response';

export function getWatchlist(req: Request, res: Response) {
  try {
    const list = userStoreService.getWatchlist();
    return sendSuccess(res, list, undefined, { total: list.length });
  } catch (error) {
    return sendError(res, 500, (error as Error).message);
  }
}

export async function addToWatchlist(req: Request, res: Response) {
  try {
    const { media, mediaId } = req.body;

    let mediaItem = media;
    if (!mediaItem && mediaId) {
      const fetched = await providerManager.getDetails(mediaId);
      if (fetched) mediaItem = fetched;
    }

    if (!mediaItem || !mediaItem.id) {
      return sendError(res, 400, 'A valid media item or mediaId is required to add to watchlist');
    }

    const item = userStoreService.addToWatchlist('user-demo-1', mediaItem);
    return sendSuccess(res, item, 'Item added to watchlist', undefined, 201);
  } catch (error) {
    return sendError(res, 500, (error as Error).message);
  }
}

export function removeFromWatchlist(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) return sendError(res, 400, 'Watchlist item ID or media ID is required');

    const removed = userStoreService.removeFromWatchlist('user-demo-1', id);
    if (!removed) {
      return sendError(res, 404, `Watchlist item '${id}' not found`);
    }

    return sendSuccess(res, { id, removed: true }, 'Item removed from watchlist');
  } catch (error) {
    return sendError(res, 500, (error as Error).message);
  }
}

export function getHistory(req: Request, res: Response) {
  try {
    const history = userStoreService.getHistory();
    return sendSuccess(res, history, undefined, { total: history.length });
  } catch (error) {
    return sendError(res, 500, (error as Error).message);
  }
}

export async function saveHistory(req: Request, res: Response) {
  try {
    const {
      media,
      mediaId,
      episodeId,
      seasonNumber,
      episodeNumber,
      progressPercent = 0,
      currentTimeSeconds = 0,
      durationSeconds = 0,
    } = req.body;

    let mediaItem = media;
    if (!mediaItem && mediaId) {
      const fetched = await providerManager.getDetails(mediaId);
      if (fetched) mediaItem = fetched;
    }

    if (!mediaItem || !mediaItem.id) {
      return sendError(res, 400, 'A valid media item or mediaId is required to record watch history');
    }

    const record = userStoreService.saveHistory('user-demo-1', {
      media: mediaItem,
      episodeId,
      seasonNumber,
      episodeNumber,
      progressPercent,
      currentTimeSeconds,
      durationSeconds,
    });

    return sendSuccess(res, record, 'Watch progress saved');
  } catch (error) {
    return sendError(res, 500, (error as Error).message);
  }
}

export function removeHistoryItem(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) return sendError(res, 400, 'History item ID is required');

    const removed = userStoreService.removeHistoryItem('user-demo-1', id);
    if (!removed) {
      return sendError(res, 404, `History record '${id}' not found`);
    }

    return sendSuccess(res, { id, removed: true }, 'History item removed');
  } catch (error) {
    return sendError(res, 500, (error as Error).message);
  }
}

export function clearHistory(req: Request, res: Response) {
  try {
    userStoreService.clearHistory('user-demo-1');
    return sendSuccess(res, { cleared: true }, 'Watch history cleared');
  } catch (error) {
    return sendError(res, 500, (error as Error).message);
  }
}
