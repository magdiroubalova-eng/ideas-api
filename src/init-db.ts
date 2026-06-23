import { pool } from './db';

// Creates the ideas table if it does not exist. Safe to run repeatedly.
async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ideas (
      id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      status VARCHAR(20) NOT NULL DEFAULT 'ready',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  console.log('Schema ready.');
}

init()
  .catch((err) => {
    console.error('Schema setup failed:', err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());