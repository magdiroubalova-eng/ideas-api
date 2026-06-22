import { Request, Response, NextFunction } from 'express';

// Protects a route: requires a valid bearer token in the Authorization header.
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const token = header.slice('Bearer '.length).trim();

  if (token !== process.env.API_TOKEN) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  next();
}