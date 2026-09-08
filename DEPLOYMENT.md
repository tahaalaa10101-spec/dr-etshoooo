# Dr.Etshoooo - Production Deployment Guide

## Prerequisites

- Node.js 18+ (recommended: 20 LTS)
- PostgreSQL 14+ (production database)
- npm or yarn

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd dr-etshoooo
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

**Required variables:**

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/dr_etshoooo?schema=public` |
| `JWT_SECRET` | Secret key for JWT tokens (min 32 chars) | Generate with: `openssl rand -base64 64` |

**Optional variables:**

| Variable | Description | Default |
|----------|-------------|---------|
| `STORAGE_PROVIDER` | File storage backend (`local` or `s3`) | `local` |
| `STORAGE_BUCKET` | S3/R2 bucket name | - |
| `STORAGE_ENDPOINT` | S3-compatible endpoint URL | - |
| `STORAGE_ACCESS_KEY` | Storage access key | - |
| `STORAGE_SECRET_KEY` | Storage secret key | - |
| `STORAGE_REGION` | Storage region | `auto` |
| `NEXT_PUBLIC_APP_URL` | Public site URL | `http://localhost:3000` |

### 3. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (production)
npx prisma migrate deploy

# Seed admin + student users
npx prisma db seed
```

### 4. Build and Run

```bash
# Production build
npm run build

# Start production server
npm start
```

### 5. Run Tests

```bash
npm test
```

## Deployment Options

### Vercel (Recommended)

1. Push to GitHub/GitLab
2. Import project in Vercel dashboard
3. Set environment variables in Vercel settings
4. Deploy automatically

**Note:** Use Vercel Postgres or an external PostgreSQL provider (Supabase, Neon, Railway).

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["npm", "start"]
```

### Self-Hosted (PM2)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start npm --name "dr-etshoooo" -- start

# Save process list
pm2 save
pm2 startup
```

## Database Management

### Run Migrations

```bash
# Production
npx prisma migrate deploy

# Development (create new migration)
npx prisma migrate dev --name <migration-name>
```

### Reset Database

```bash
npx prisma migrate reset
npx prisma db seed
```

### View Database

```bash
npx prisma studio
```

## Default Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@dr-etshoooo.com | admin123 |
| Student | student@dr-etshoooo.com | student123 |

**⚠️ Change these passwords in production!**

## Security Checklist

- [ ] Set strong `JWT_SECRET` (32+ random characters via `openssl rand -base64 64`)
- [ ] Change default admin password
- [ ] Enable HTTPS (via reverse proxy or hosting provider)
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS if needed
- [ ] Set up database backups
- [ ] Set up monitoring/logging

## Architecture

### Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS v4
- **Backend:** Next.js API Routes (39 endpoints)
- **Database:** PostgreSQL via Prisma ORM 5.22
- **Auth:** JWT (jose) + httpOnly cookies + token revocation
- **Validation:** Zod schemas on all write endpoints
- **Testing:** Jest + ts-jest (34 tests)

### Content Hierarchy

```
Academic Year
  └── Semester
        └── Subject
              └── Topic
                    ├── Lectures
                    ├── MCQs
                    ├── Essays
                    ├── Notes
                    ├── Clinical Cases
                    ├── Flashcards
                    └── Exams
```

### API Endpoints (39 total)

| Category | Endpoints |
|----------|-----------|
| Auth | login, register, me, logout |
| Admin | admin stats, admin overview |
| Content CRUD | years, semesters, subjects, topics, lectures, mcqs, essays, notes, cases, flashcards, exams |
| Medical | terms, apps, how-to-study, dictionary |
| User | favorites, bookmarks, progress, completions |
| Utility | search, stats, upload |
| Student | students (admin-only) |

## File Storage

The application supports two storage backends:

1. **Local (default):** Files stored in `public/uploads/` — suitable for development
2. **S3/R2 (production):** Configure `STORAGE_PROVIDER=s3` with appropriate credentials

Supported file types: JPEG, PNG, WebP, GIF (images), PDF (documents)
Max file sizes: 5MB (images), 20MB (documents)

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

Test coverage:
- Authentication (JWT sign/verify)
- Validation schemas (15 Zod schemas)
- API error helpers
- Token revocation

## Troubleshooting

### Build Errors

```bash
# Clear cache
rm -rf .next node_modules
npm install
npx prisma generate
npm run build
```

### Database Connection Issues

```bash
# Test connection
npx prisma db push

# Check logs
npx prisma studio
```

### Port Already in Use

```bash
# Find process on port 3000
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F
```

## Support

For issues, check:
- Application logs
- Database connection
- Environment variables
- Prisma schema alignment
