import { Response } from 'express';
import { ApiResponse } from '../../types';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  meta?: { total?: number; page?: number; limit?: number },
  statusCode = 200
) {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(message ? { message } : {}),
    ...(meta ? { meta } : {}),
  };
  return res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string
) {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
}
