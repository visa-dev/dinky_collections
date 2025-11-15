# Migration Guide: Cloudinary → Vercel Blob & MongoDB → PostgreSQL

This document outlines the changes made to migrate from Cloudinary to Vercel Blob storage and from MongoDB to PostgreSQL.

## Changes Made

### 1. Database Migration (MongoDB → PostgreSQL)

**Schema Changes:**
- Changed `datasource` provider from `mongodb` to `postgresql`
- Updated all `@id @default(auto()) @map("_id") @db.ObjectId` to `@id @default(uuid())`
- Removed all `@db.ObjectId` type annotations
- Changed `String[]` arrays to work with PostgreSQL (no changes needed, Prisma handles this)
- Added `@db.Text` for longer text fields (refresh_token, access_token, id_token, etc.)
- Added `directUrl` for migrations using `POSTGRES_URL`

**Files Modified:**
- `prisma/schema.prisma` - Complete schema rewrite for PostgreSQL

### 2. Storage Migration (Cloudinary → Vercel Blob)

**Removed:**
- `src/lib/cloudinary.ts` - Cloudinary configuration
- `src/app/api/cloudinary/sign/route.ts` - Cloudinary signature endpoint
- `cloudinary` package from `package.json`

**Added:**
- `src/lib/blob.ts` - Vercel Blob upload/delete utilities
- `@vercel/blob` package in `package.json`

**Updated:**
- `src/app/api/upload/route.ts` - Now uses Vercel Blob instead of Cloudinary
- `src/lib/validators.ts` - Changed `publicId` to `blobId` in product schema
- `src/app/api/products/route.ts` - Updated to use `blobId` instead of `publicId`
- `src/app/api/products/id/[id]/route.ts` - Added blob cleanup on update/delete
- `src/app/admin/products/new/page.tsx` - Updated to use new blob response format
- `src/app/admin/products/[id]/edit/page.tsx` - Updated to use new blob response format

**Database Schema:**
- `ProductImage` model: Changed `publicId` field to `blobId`

## Environment Variables

### Old (Cloudinary):
```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_UPLOAD_FOLDER=...
```

### New (Vercel Blob):
```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

### Database:
```env
DATABASE_URL=postgres://...
POSTGRES_URL=postgres://...
PRISMA_DATABASE_URL=prisma+postgres://...
```

## Migration Steps

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Update Environment Variables:**
   - Add `BLOB_READ_WRITE_TOKEN` to your `.env.local`
   - Update database URLs to PostgreSQL
   - Remove Cloudinary environment variables

3. **Regenerate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

4. **Push Schema to Database:**
   ```bash
   npm run prisma:push
   ```

5. **Migrate Existing Data (if any):**
   - If you have existing MongoDB data, you'll need to export and transform it
   - Update image URLs to use Vercel Blob URLs
   - Import data into PostgreSQL

## Breaking Changes

1. **Image Storage:**
   - Old images stored in Cloudinary won't automatically migrate
   - You'll need to re-upload images or migrate them manually

2. **Database:**
   - All IDs changed from MongoDB ObjectIds to UUIDs
   - Existing data needs to be migrated

3. **API Responses:**
   - Upload endpoint now returns `{ url, blobId }` instead of Cloudinary format
   - Frontend code updated to handle new format

## Testing Checklist

- [ ] Image uploads work correctly
- [ ] Product creation with images works
- [ ] Product editing updates images correctly
- [ ] Product deletion removes images from blob
- [ ] All database queries work with PostgreSQL
- [ ] Authentication still works
- [ ] Cart functionality works
- [ ] Checkout process works

## Rollback Plan

If you need to rollback:

1. Restore `prisma/schema.prisma` from backup
2. Restore Cloudinary configuration files
3. Reinstall `cloudinary` package
4. Update environment variables
5. Regenerate Prisma client

## Notes

- Vercel Blob automatically handles CDN and optimization
- No need for separate image transformation APIs
- Blob storage is integrated with Vercel deployment
- PostgreSQL provides better relational data integrity
- Prisma Accelerate can be used for faster queries

