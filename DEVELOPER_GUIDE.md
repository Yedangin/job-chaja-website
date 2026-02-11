# JobChaja Frontend - Developer Setup Guide

## Prerequisites

- **Node.js** 20+ (recommended: use `nvm`)
- **Backend server** running at `http://localhost:8000` (see backend repo)
- **Git**

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/your-org/job-chaja-website.git
cd job-chaja-website
git checkout feat/admin-profile-auth
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the backend first

The frontend proxies all API calls to the backend. Make sure the backend is running at `http://localhost:8000` before starting the frontend.

See the **backend repo's DEVELOPER_GUIDE.md** for setup instructions.

### 4. Run the frontend

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### 5. Test it

- Open `http://localhost:3000` in your browser
- Login with admin credentials (ask the team lead)
- Or register a new account

---

## Environment Variables

For **local development**, no environment variables are needed. The defaults work out of the box:

| Variable | Default | Description |
|----------|---------|-------------|
| `BACKEND_URL` | `http://localhost:8000` | Backend API URL (auto-used by API proxy) |
| `NEXT_PUBLIC_API_URL` | - | Public backend URL (only for production) |

> **Note:** `BACKEND_URL` is only needed in production (Docker) where the backend runs on a separate container. Locally, the default `http://localhost:8000` is used automatically.

---

## Project Structure

```
job-chaja-website/
├── src/
│   └── app/
│       ├── (main)/             # Main layout group
│       ├── admin/              # Admin dashboard page
│       │   └── page.tsx
│       ├── profile/            # User profile page
│       │   └── page.tsx
│       ├── alba/               # Part-time job listings (skeleton)
│       │   └── page.tsx
│       ├── fulltime/           # Full-time job listings (skeleton)
│       │   └── page.tsx
│       ├── recruit-info/       # Recruitment info (skeleton)
│       │   └── page.tsx
│       ├── api/
│       │   ├── auth/[...path]/ # Auth API proxy → backend /auth/*
│       │   │   └── route.ts
│       │   └── profile/[...path]/ # Profile API proxy → backend /profile/*
│       │       └── route.ts
│       ├── layout.tsx          # Root layout
│       └── page.tsx            # Home page
├── features/
│   └── auth/
│       └── api/
│           └── auth.api.ts     # API client functions
├── next.config.ts              # Next.js config (includes API rewrite)
├── docker-compose.yml          # Production Docker config
├── Dockerfile                  # Production Docker build
└── package.json
```

## How API Proxying Works

All `/api/*` requests are proxied to the backend:

```
Browser → http://localhost:3000/api/auth/login
       → Next.js rewrite → http://localhost:8000/auth/login
       → Backend processes and responds
```

This is configured in `next.config.ts`:

```ts
async rewrites() {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
```

Additionally, custom route handlers in `app/api/auth/[...path]/route.ts` handle specific cases like OAuth redirects and cookie forwarding.

---

## Key Pages

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Home / Landing page | No |
| `/profile` | User dashboard & settings | Yes |
| `/admin` | Admin dashboard (ADMIN users only) | Yes (Admin) |
| `/alba` | Part-time job listings | No |
| `/fulltime` | Full-time job listings | No |
| `/recruit-info` | Recruitment guides & info | No |

## User Types

| Type | Description |
|------|-------------|
| `INDIVIDUAL` | Job seeker (individual member) |
| `CORPORATE` | Employer (corporate member) |
| `ADMIN` | Administrator |

---

## Production Deployment (Server)

### Docker Setup

The production server uses Docker Compose with an external `webnet` network shared between frontend and backend.

```yaml
# docker-compose.yml (production)
services:
  frontend:
    build:
      context: .
      args:
        - NEXT_PUBLIC_API_URL=http://jobchaja.com:8000
    container_name: job-frontend
    environment:
      - BACKEND_URL=http://job-backend:8000
    networks:
      - webnet

  nginx:
    image: nginx:alpine
    container_name: nginx-proxy
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - frontend
    networks:
      - webnet

networks:
  webnet:
    external: true
```

### Deployment steps

```bash
# On the server
cd ~/job-chaja-website
git pull origin feat/admin-profile-auth

# Rebuild and restart
docker compose up --build -d

# Verify
docker logs job-frontend --tail 5
```

> **Important:** Both frontend and backend docker-compose files must reference the same `webnet` external network. This allows `job-frontend` to reach `job-backend` by container name.

---

## Troubleshooting

### "Internal Server Error" on login
Check that the backend is running and accessible:
```bash
curl http://localhost:8000/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email","password":"your-password"}'
```

### API calls returning 500
Check the browser console for the actual error URL. If it shows `ECONNREFUSED`, the backend is not running or not reachable.

### OAuth login not working (Kakao/Google)
OAuth callbacks must match the URLs configured in the OAuth provider console. For local development:
- Kakao callback: `http://localhost:8000/auth/kakao/callback`
- Google callback: `http://localhost:8000/auth/google/callback`
