# Flexo

Flexo is a simple file manager.

## What it does

- user registration and login with cookie-based auth
- automatic creation of a root folder for each account
- nested folders inside the workspace
- file uploads by picker or drag and drop
- file rename, folder rename, delete, and download
- file metadata stored in Postgres
- file contents stored in an S3-compatible bucket

## Project layout

This repo is split into two apps:

- `hatch/` – React + Vite frontend
- `hatchBack/` – Express + TypeScript backend

## Stack

Frontend:

- React
- Vite
- TypeScript
- Tailwind CSS
- Zustand
- React Router

Backend:

- Express
- TypeScript
- PostgreSQL
- JWT
- bcrypt
- multer
- AWS S3 SDK, pointed at a Cloudflare R2 bucket

## How it works

A few implementation notes that help make sense of the repo:

- accounts are created through `/users/register`
- login sets an HTTP-only cookie with a JWT
- the frontend sends requests with `credentials: include`
- every new user gets a `Root` folder
- folders and file records live in Postgres
- uploaded file blobs are written to the bucket, keyed by the database file id

That split keeps the database focused on ownership and structure, while object storage handles the actual file payloads.

## Local setup

### 1. Clone and install

Install dependencies in both apps.

```bash
cd hatch
npm install

cd ../hatchBack
npm install
```

### 2. Set up Postgres

Create a database, then run the schema in:

- `hatchBack/db/schema.sql`

You will need the `users`, `folders`, and `files` tables from that file.

### 3. Create backend environment variables

Create a `.env` file in `hatchBack/` with values for:

```env
POSTGRES_USER=
POSTGRES_HOST=
DATABASE_NAME=
POSTGRES_PW=
POSTGRES_PORT=
JWT_SECRET=
S3_API_ENDPOINT=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
```

The storage client is configured for an S3-compatible provider. In the current code, the bucket name is expected to be:

```txt
hatch-bucket
```

If your bucket uses a different name, update it in `hatchBack/cloudflare/services.ts`.

### 4. Start the backend

From `hatchBack/`:

```bash
npm run dev
```

The API listens on:

```txt
http://localhost:3000
```

### 5. Start the frontend

From `hatch/`:

```bash
npm run dev
```

The Vite app runs on:

```txt
http://localhost:5173
```

The backend CORS setup already expects that origin.

## Main routes

### Frontend

- `/` – landing page / workspace
- `/auth/register` – sign up
- `/auth/login` – sign in
- `/profile` – profile page stub

### Backend

- `POST /users/register`
- `POST /users/login`
- `GET /folders`
- `POST /folders`
- `PUT /folders/:parent_folder_id/:folderName`
- `DELETE /folders/:folderName`
- `DELETE /folders/:parent_folder_id/:folderName`
- `GET /files`
- `POST /files`
- `PUT /files/:fileName`
- `DELETE /files/:folder_id/:fileName`
- `GET /files/:fileName`

## A couple of details worth knowing

- file uploads are checked against a local extension-to-mime map on the frontend
- downloads are streamed back from object storage through the API
- deleting a folder cascades in Postgres and also clears matching stored objects
- the visual design intentionally goes for a Windows 98 style file explorer feel

## Current state

This is a working prototype with the core flow in place: auth, folders, uploads, downloads, and basic file management.

A few parts are still clearly in progress, especially around polish:

- the profile page is only a stub
- error handling could be tightened up in a few places
- some backend pieces still have rough edges that would benefit from cleanup before production use

## Scripts

### `hatch/`

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### `hatchBack/`

```bash
npm run dev
```

## Notes

This project makes the most sense when both apps are running together. The frontend assumes the backend is available at `localhost:3000`, and authenticated requests depend on the login cookie being present.

If you want to extend it, the natural next steps are probably sharing, previews, better profile settings, and a cleaner deploy story.
