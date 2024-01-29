import { Request, Response, NextFunction } from 'express';
import { ServerError } from './ServerError';
import { NotFoundError } from './NotFoundError';
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ServerError) {
    res.status(500).json({ error: 'Internal server error' });
  } else if (err instanceof NotFoundError) {
    res.status(404).json({ error: 'Not found' });
  } else {
    res.status(400).json({ error: 'Bad request' });
  }
};
