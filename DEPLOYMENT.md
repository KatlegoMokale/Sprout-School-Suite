# Deployment Guide

## 1. Pre-deploy checks

Run these commands from the project root:

```bash
npm install
npm run build
```

If `npm run build` passes, the app is ready to deploy.

## 2. Environment variables

1. Copy `.env.example` to your platform environment settings.
2. Fill in all real values before deploying.

`MONGODB_URI` is required for API routes and data persistence.

## 3. Deploy on Vercel (recommended)

1. Import this repo/project into Vercel.
2. Set the framework to `Next.js` (auto-detected in most cases).
3. Add all environment variables from `.env.example`.
4. Deploy.

Build command: `npm run build`  
Start command: `npm run start`

## 4. Deploy on a Node server

```bash
npm install
npm run build
npm run start
```

Expose port `3000` (or set `PORT` in your host environment).
