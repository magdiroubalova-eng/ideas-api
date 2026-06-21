# Ideas API

A small REST API for storing and managing ideas, built from scratch as a portfolio project. It demonstrates a full CRUD resource backed by PostgreSQL, input validation, and a focus on safe, well-tested endpoints.

## Tech stack

- **Node.js** + **Express** — web framework
- **TypeScript** — type safety
- **PostgreSQL** — database, via the `pg` library
- **Zod** — request validation

## Features

- Full CRUD for `ideas` (create, read, update, delete)
- Input validation with clear `400` responses listing the offending field
- Parameterized SQL queries (protection against SQL injection)
- Correct HTTP status codes (`200`, `201`, `204`, `400`, `404`, `500`)
- A `/health` endpoint for uptime checks

## Prerequisites

- Node.js 18+
- A running PostgreSQL instance

## Setup

1. Clone and install:

```bash
   git clone https://github.com/<magdiroubalova-eng>/ideas-api.git
   cd ideas-api
   npm install
```

2. Create the database and table:

```sql
   CREATE DATABASE ideas_db;

   CREATE TABLE ideas (
     id SERIAL PRIMARY KEY,
     title VARCHAR(200) NOT NULL,
     description TEXT,
     status VARCHAR(20) NOT NULL DEFAULT 'spark',
     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
   );
```

3. Create a `.env` file in the project root:

```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/ideas_db
```

4. Start the server:

```bash
   npm run dev
```

   The API runs at `http://localhost:3000`.

## API endpoints

| Method | Path       | Description        |
| ------ | ---------- | ------------------ |
| GET    | /health    | Health check       |
| POST   | /ideas     | Create an idea     |
| GET    | /ideas     | List all ideas     |
| GET    | /ideas/:id | Get one idea by id |
| PUT    | /ideas/:id | Update an idea     |
| DELETE | /ideas/:id | Delete an idea     |

### Idea fields

| Field       | Type      | Notes                             |
| ----------- | --------- | --------------------------------- |
| id          | integer   | Auto-generated                    |
| title       | string    | Required, 1–200 characters        |
| description | string    | Optional                          |
| status      | string    | One of `spark`, `lit`, `archived` |
| created_at  | timestamp | Auto-generated                    |

## Testing

A Bruno collection is included, covering happy paths, validation failures, a not-found case, and a SQL-injection attempt, each with automated assertions.

## Scripts

- `npm run dev` — start the server with auto-reload
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run the compiled output