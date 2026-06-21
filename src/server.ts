import express from 'express';
import { pool } from './db';
import { ideaSchema, idParamSchema, formatZodError } from './schemas';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is alive' });
});

// Create a new idea
app.post('/ideas', async (req, res) => {
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
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get all ideas
app.get('/ideas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ideas ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
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
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Update an idea by id
app.put('/ideas/:id', async (req, res) => {
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
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Delete an idea by id
app.delete('/ideas/:id', async (req, res) => {
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
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  try {
    const result = await pool.query('SELECT now()');
    console.log('Database connected. Server time:', result.rows[0].now);
  } catch (err) {
    console.error('Database connection FAILED:', err);
  }
});