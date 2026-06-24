# Ideas API

A small REST API for storing and managing ideas, built from scratch as a portfolio project. It demonstrates a full CRUD resource backed by PostgreSQL, input validation, bearer-token auth on write operations, and a focus on safe, well-tested endpoints. Every push runs an automated API test suite in CI.

## Tech stack

- **Node.js** + **Express** — web framework
- **TypeScript** — type safety
- **PostgreSQL** — database, via the `pg` library
- **Zod** — request validation
- **Bruno** — API tests, run locally and in CI
- **GitHub Actions** — continuous integration

## Features

- Full CRUD for `ideas` (create, read, update, delete)
- Bearer-token authentication required for all write operations (`POST`, `PUT`, `DELETE`)
- Input validation with clear `400` responses listing the offending field
- Parameterized SQL queries (protection against SQL injection)
- Correct HTTP status codes (`200`, `201`, `204`, `400`, `401`, `404`, `500`)
- A `/health` endpoint for uptime checks

## Prerequisites

- Node.js 18+
- A running PostgreSQL instance

## Setup

1. Clone and install:

   ```bash
   git clone https://github.com/magdiroubalova-eng/ideas-api.git
   cd ideas-api
   npm install
   ```

2. Create a `.env` file in the project root:

   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/ideas_db
   API_TOKEN=your-secret-token
   ```

   `API_TOKEN` is the bearer token required for write requests. Choose any value; clients must send the same value.

3. Create the database, then create the table:

   ```sql
   CREATE DATABASE ideas_db;
   ```

   ```bash
   npm run init-db
   ```

   Optionally seed sample data:

   ```bash
   npm run seed
   ```

4. Start the server:

   ```bash
   npm run dev
   ```

   The API runs at `http://localhost:3000`.

## Authentication

Write operations require a bearer token in the `Authorization` header:

```
Authorization: Bearer <API_TOKEN>
```

Requests without a valid token receive `401`:

- Missing or malformed header → `{ "error": "Authentication required" }`
- Wrong token → `{ "error": "Invalid token" }`

Read operations (`GET /ideas`, `GET /ideas/:id`) and `/health` are public.

## API endpoints

| Method | Path       | Auth | Description        |
| ------ | ---------- | ---- | ------------------ |
| GET    | /health    | No   | Health check       |
| POST   | /ideas     | Yes  | Create an idea     |
| GET    | /ideas     | No   | List all ideas     |
| GET    | /ideas/:id | No   | Get one idea by id |
| PUT    | /ideas/:id | Yes  | Update an idea     |
| DELETE | /ideas/:id | Yes  | Delete an idea     |

## API documentation

With the server running, interactive Swagger UI is available at:

http://localhost:3000/api-docs

It documents every endpoint and lets you send requests directly from the browser.

### Idea fields

| Field       | Type      | Notes                                  |
| ----------- | --------- | -------------------------------------- |
| id          | integer   | Auto-generated                         |
| title       | string    | Required, 1–200 characters             |
| description | string    | Optional                               |
| status      | string    | One of `ready`, `in_progress`, `done`  |
| created_at  | timestamp | Auto-generated                         |

## Testing

A Bruno collection in `bruno/MOJE_API` covers happy paths, validation failures (`400`), authentication failures (`401` for missing and wrong tokens), a not-found case (`404`), and a SQL-injection attempt, each with automated assertions.

Run it locally with the Bruno CLI:

```bash
cd bruno/MOJE_API
npx @usebruno/cli run . -r --env ci --env-var token=$API_TOKEN
```

The same suite runs automatically in GitHub Actions on every push (see `.github/workflows/ci.yml`). The workflow spins up a PostgreSQL service, initialises and seeds the database, starts the API, and runs the full Bruno collection against it.

## Scripts

- `npm run dev` — start the server with auto-reload
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run the compiled output
- `npm run init-db` — create the `ideas` table
- `npm run seed` — populate sample data
