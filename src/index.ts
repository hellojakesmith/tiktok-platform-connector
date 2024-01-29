import express from 'express';
import bodyParser from 'body-parser';
import { Request, Response, NextFunction } from 'express';
import { ServerError } from './errors/ServerError';
import { NotFoundError } from './errors/NotFoundError';
import TikTokRoutes from './routes/TikTokRoutes';

const app = express();

app.use(bodyParser.json());

app.use('/tiktok', TikTokRoutes);


// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ServerError) {
    res.status(500).json({ error: 'Internal server error' });
  } else if (err instanceof NotFoundError) {
    res.status(404).json({ error: 'Not found' });
  } else {
    res.status(400).json({ error: 'Bad request' });
  }
});

// Not Found handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Route not found'));
});

// Server Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    error: {
      message: 'Internal Server Error',
    },
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
