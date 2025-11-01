# Book Rental (book-rental)

A simple full-stack Book Rental / Store application with a Node.js + Express backend and a React + Vite frontend. This repository contains the backend API (in `backend/`) and the frontend client (in `frontend/`).

## Contents

- `backend/` — Express API, MongoDB models, routes and middleware.
- `frontend/` — React (Vite) client, components, pages and Redux slices.

## Features

- Books listing, add/edit (admin), and search
- Cart, checkout and order management
- Admin dashboard and statistics
- JWT/session based auth and role middleware

## Tech stack

- Backend: Node.js, Express, MongoDB (Mongoose)
- Frontend: React, Vite, Tailwind CSS, Redux Toolkit

## Prerequisites

- Node.js (v16+ recommended)
- npm (or yarn)
- MongoDB (local or Atlas)

## Quick start (development)

Open two terminals (one for backend, one for frontend).

1. Backend

```powershell
cd backend
npm install
# copy or create a .env file (see example below)
npm run dev
```

2. Frontend

```powershell
cd frontend
npm install
npm run dev
```

By default the backend runs on port 5000 (see `backend/index.js`) and the frontend runs on Vite's default port (usually 5173).

## Backend environment variables (.env example)

Create a `backend/.env` file with at least the following values:

```
# Server
PORT=5000
NODE_ENV=development

# MongoDB connection URL
DB_URL=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/bookdb?retryWrites=true&w=majority

# Session secret used by express-session
SESSION_SECRET=your_session_secret_here
```

Adjust other environment variables as required by your deployment (Firebase service account, JWT secrets, etc.).

## API

The API base path is `/api`. Example endpoints:

- `GET /api/books` — list books
- `POST /api/auth` — admin auth
- `POST /api/orders` — create order

Check the `backend/src/` folder for full routes and controllers.

## Project structure (high-level)

- `backend/`
  - `index.js` — app entrypoint
  - `src/` — controllers, models, routes, middleware
- `frontend/`
  - `src/` — React app, pages, components, Redux slices

## Running in production

Build and serve the frontend using the host/static server of your choice. For backend, use `npm start` or a process manager such as PM2.

Example (backend production start):

```powershell
cd backend
npm install --production
npm start
```

## Contribution

If you'd like to contribute, please fork the repo and open a pull request with a clear description of your changes. Add tests for new features where possible.

## License

This project includes a `LICENSE` file in the repository root. Check it for license details.

---

If you want any specific content added to this README (screenshots, API docs, deployment steps, or CI), tell me what you'd like and I will add it.
