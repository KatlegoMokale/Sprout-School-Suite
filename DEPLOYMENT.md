# Deployment Guide

## 1. Pre-deploy checks

Run these commands from the project root:

```bash
npm install
npm run lint
npm run build
```

If `npm run build` passes, the app is ready to deploy.

## 2. Environment variables

1. Copy `.env.example` to your platform environment settings.
2. Fill in all real values before deploying.

Required:
- `MONGODB_URI` for database access
- `AUTH_SECRET` for signed login sessions

## 3. Seed first admin user

Before first login, create your admin account:

```bash
ADMIN_EMAIL="admin@yourdomain.com" \
ADMIN_PASSWORD="strong-password-here" \
ADMIN_FULL_NAME="Your Admin Name" \
npm run seed:admin
```

## 4. Deploy on Vercel (recommended)

1. Import this repo/project into Vercel.
2. Set the framework to `Next.js` (auto-detected in most cases).
3. Add all environment variables from `.env.example`.
4. Deploy.

Build command: `npm run build`  
Start command: `npm run start`

## 5. Deploy on a Node server

```bash
npm install
npm run build
npm run start
```

Expose port `3000` (or set `PORT` in your host environment).
