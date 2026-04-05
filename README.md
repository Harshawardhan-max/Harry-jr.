# FocusFlow AI

Full-stack productivity web app with React + Vite frontend and Express + MongoDB backend.

## Structure
- `client` - React/Tailwind dashboard app
- `server` - Node/Express REST API

## Local development
1. Configure env files from examples in `client/.env.example` and `server/.env.example`.
2. Start backend:
   ```bash
   cd server && npm install && npm run dev
   ```
3. Start frontend:
   ```bash
   cd client && npm install && npm run dev
   ```

## Deploy
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
