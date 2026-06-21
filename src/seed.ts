import { faker } from '@faker-js/faker';
import { pool } from './db';

const COUNT = 50;
const statuses = ['spark', 'lit', 'archived'] as const;

async function seed() {
  // Reset the table so re-running gives a clean, reproducible dataset
  await pool.query('TRUNCATE TABLE ideas RESTART IDENTITY');

  for (let i = 0; i < COUNT; i++) {
    const title = faker.lorem.sentence({ min: 3, max: 8 }).slice(0, 200);
    const description = faker.lorem.paragraph();
    const status = faker.helpers.arrayElement(statuses);
    const createdAt = faker.date.past();

    await pool.query(
      'INSERT INTO ideas (title, description, status, created_at) VALUES ($1, $2, $3, $4)',
      [title, description, status, createdAt]
    );
  }

  console.log(`Seeded ${COUNT} ideas.`);
}

seed()
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());