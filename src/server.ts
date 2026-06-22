import express from 'express';
import pinoHttp from 'pino-http';
import { pool } from './db';
import { logger } from './logger';
import { ideaSchema, idParamSchema, listQuerySchema, formatZodError } from './schemas';
import swaggerUi from 'swagger-ui-express';
import { openApiSpec } from './openapi';
import { requireAuth } from './auth';

const app = express();
app.use(express.json());
app.use(pinoHttp({ logger }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is alive' });
});

// Create a new idea
app.post('/ideas', requireAuth, async (req, res) => {
  const parsed = ideaSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', details: formatZodError(parsed.error) });
    return;
  }
  const { title, description, status } = parsed.data;

  try {
    const result = await pool.query(
      'INSERT INTO ideas (title, description, status) VALUES ($1, $2, $3) RETURNING *',
      [title, description ?? null, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get all ideas (with filtering, sorting, pagination)
app.get('/ideas', async (req, res) => {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid query', details: formatZodError(parsed.error) });
    return;
  }
  const { status, sort, order, limit, offset } = parsed.data;

  const values: unknown[] = [];
  let whereClause = '';
  if (status) {
    values.push(status);
    whereClause = `WHERE status = $${values.length}`;
  }

  values.push(limit);
  const limitParam = `$${values.length}`;
  values.push(offset);
  const offsetParam = `$${values.length}`;

  const query = `SELECT * FROM ideas ${whereClause} ORDER BY ${sort} ${order} LIMIT ${limitParam} OFFSET ${offsetParam}`;

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get one idea by id
app.get('/ideas/:id', async (req, res) => {
  const idParsed = idParamSchema.safeParse(req.params);
  if (!idParsed.success) {
    res.status(400).json({ error: 'Invalid id', details: formatZodError(idParsed.error) });
    return;
  }
  const id = idParsed.data.id;

  try {
    const result = await pool.query('SELECT * FROM ideas WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Idea not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Update an idea by id
app.put('/ideas/:id', requireAuth, async (req, res) => {
  const idParsed = idParamSchema.safeParse(req.params);
  if (!idParsed.success) {
    res.status(400).json({ error: 'Invalid id', details: formatZodError(idParsed.error) });
    return;
  }
  const id = idParsed.data.id;

  const parsed = ideaSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', details: formatZodError(parsed.error) });
    return;
  }
  const { title, description, status } = parsed.data;

  try {
    const result = await pool.query(
      'UPDATE ideas SET title = $1, description = $2, status = $3 WHERE id = $4 RETURNING *',
      [title, description ?? null, status, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Idea not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Delete an idea by id
app.delete('/ideas/:id', requireAuth, async (req, res) => {
  const idParsed = idParamSchema.safeParse(req.params);
  if (!idParsed.success) {
    res.status(400).json({ error: 'Invalid id', details: formatZodError(idParsed.error) });
    return;
  }
  const id = idParsed.data.id;

  try {
    const result = await pool.query('DELETE FROM ideas WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Idea not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, async () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  try {
    const result = await pool.query('SELECT now()');
    logger.info({ serverTime: result.rows[0].now }, 'Database connected');
  } catch (err) {
    logger.error(err, 'Database connection FAILED');
  }
});