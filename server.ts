import express from 'express';
import path from 'path';
import { apiRouter } from './src/server/routes/api.routes';

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Global Error Handler for API
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Watch With Me Error]', err.stack || err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error occurred',
  });
});

// Vite Middleware (Development) / Static Serving (Production)
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
    console.log(`[Watch With Me] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
