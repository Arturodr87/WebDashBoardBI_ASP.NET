/**
 * DroDev BI & Reporting Studio - Express Full-Stack Server
 * Integrates REST API routes with Vite SPA middlewares on port 3000
 */

import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { dashboardRouter } from './server/routes/dashboardRoutes';
import { getSqlPool } from './server/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function bootstrap() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Body parsing & logging
  app.use(express.json());

  // Basic request logger for audit
  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API ${req.method}] ${req.path}`);
    }
    next();
  });

  // Mount BI API routes
  app.use('/api', dashboardRouter);

  // Health check endpoint
  app.get('/healthz', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Background warm-up of SQL Server pool
  getSqlPool().catch((err) => {
    console.log('[SQL Server pool init]:', err.message);
  });

  // Serve with Vite middlewares in dev or static dist in prod
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CBSA BI Engine] Listo en http://0.0.0.0:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('[Fatal Bootstrap Error]', err);
  process.exit(1);
});
