# Vercel Deployment Guide

## Environment Variables

Make sure to set these environment variables in your Vercel project settings:

### Required Variables:

1. **DATABASE_URL** - Direct PostgreSQL connection string
   ```
   postgres://user:password@host:port/database?sslmode=require
   ```

2. **POSTGRES_URL** - Same as DATABASE_URL (for Prisma migrations)
   ```
   postgres://user:password@host:port/database?sslmode=require
   ```

3. **PRISMA_DATABASE_URL** - Prisma Accelerate connection string (recommended for Vercel)
   ```
   prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY
   ```

4. **BLOB_READ_WRITE_TOKEN** - Vercel Blob storage token
   ```
   vercel_blob_rw_YOUR_TOKEN
   ```

5. **NEXTAUTH_SECRET** - Secret for NextAuth.js
   ```
   Generate with: openssl rand -base64 32
   ```

6. **NEXTAUTH_URL** - Your Vercel deployment URL
   ```
   https://your-project.vercel.app
   ```

### Optional Variables:

- **ADMIN_EMAIL** - Admin user email (default: admin@dinkys.com)
- **ADMIN_PASSWORD** - Admin user password (default: Admin@123)

## Build Configuration

The project is configured to:
- Generate Prisma Client during build (`postinstall` script)
- Include the correct binary target for Vercel's serverless environment
- Use Prisma Accelerate in production (if `PRISMA_DATABASE_URL` is set)

## Troubleshooting

If you encounter the "Query Engine not found" error:

1. Ensure `PRISMA_DATABASE_URL` is set (recommended for Vercel)
2. Verify `binaryTargets = ["native", "rhel-openssl-3.0.x"]` in `prisma/schema.prisma`
3. Check that `postinstall` script runs during build
4. Ensure generated Prisma files are not excluded in `.gitignore`

## Database Setup

After deployment, run migrations and seed data:

```bash
# Run migrations (if needed)
npx prisma migrate deploy

# Seed the database
npm run prisma:seed
```

Or use Vercel's CLI:
```bash
vercel env pull
npx prisma migrate deploy
npm run prisma:seed
```

