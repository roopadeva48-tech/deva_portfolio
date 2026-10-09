import express, { Express } from 'express';
import { profileRouter } from './routes/profile';
import { projectsRouter } from './routes/projects';
import { landmarksRouter } from './routes/landmarks';
import { contactRouter } from './routes/contact';
import { certificatesRouter } from './routes/certificates';

export function createApiApp(): Express {
  const app = express();

  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: '3D Globe Portfolio API'
    });
  });

  // Mount modular routes
  app.use('/api/profile', profileRouter);
  app.use('/api/projects', projectsRouter);
  app.use('/api/landmarks', landmarksRouter);
  app.use('/api/contact', contactRouter);
  app.use('/api/certificates', certificatesRouter);

  return app;
}
