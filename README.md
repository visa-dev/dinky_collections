# Dinky's Collection - E-commerce Platform

A modern, full-featured e-commerce platform built with Next.js 16, Prisma, PostgreSQL, and Vercel Blob Storage.

## Features

- 🛍️ **Product Catalog** - Browse and filter products by category, size, and price
- 🛒 **Shopping Cart** - Full cart management with localStorage persistence
- 💳 **Checkout** - Complete checkout flow with form validation
- 👤 **Admin Panel** - Manage products and categories with image uploads
- 🔐 **Authentication** - Secure admin authentication with NextAuth
- 📸 **Image Storage** - Vercel Blob storage for product images
- 🗄️ **Database** - PostgreSQL with Prisma ORM and Prisma Accelerate

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL (Prisma Data Platform)
- **Storage**: Vercel Blob
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS 4
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (or use Prisma Data Platform)
- Vercel account for Blob storage

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dinkys-collection
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Update `.env.local` with your credentials:
- `DATABASE_URL` - Your PostgreSQL connection string
- `POSTGRES_URL` - Direct PostgreSQL connection (for migrations)
- `PRISMA_DATABASE_URL` - Prisma Accelerate connection (optional)
- `BLOB_READ_WRITE_TOKEN` - Your Vercel Blob token
- `NEXTAUTH_SECRET` - Random secret for NextAuth
- `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for dev)

4. Set up the database:
```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# (Optional) Seed the database
npm run prisma:seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
dinkys-collection/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seed script
├── src/
│   ├── app/               # Next.js app router pages
│   │   ├── admin/         # Admin panel pages
│   │   ├── api/           # API routes
│   │   ├── cart/          # Shopping cart page
│   │   ├── checkout/      # Checkout page
│   │   └── products/      # Product pages
│   ├── components/        # React components
│   ├── contexts/          # React contexts (Cart)
│   └── lib/               # Utilities and configs
└── public/                # Static assets
```

## Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL="postgres://..."
POSTGRES_URL="postgres://..."
PRISMA_DATABASE_URL="prisma+postgres://..." # Optional, for Prisma Accelerate

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Storage
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```

## Database Schema

The application uses PostgreSQL with the following main models:
- `User` - User accounts and authentication
- `Product` - Product catalog
- `Category` - Product categories
- `ProductImage` - Product images stored in Vercel Blob
- `Account`, `Session`, `VerificationToken` - NextAuth tables

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The app will automatically:
- Use Prisma Accelerate for database connections
- Use Vercel Blob for image storage
- Handle serverless functions

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Admin Access

To create an admin user:

1. Use Prisma Studio or a database client to create a user
2. Set the `role` field to `ADMIN`
3. Hash a password using bcrypt and set `passwordHash`

Or create a seed script to set up an admin user.

## Features in Detail

### Shopping Cart
- Persistent cart using localStorage
- Add/remove items
- Update quantities
- Size selection per product

### Product Management
- Create, edit, and delete products
- Upload multiple images per product
- Category assignment
- Stock management

### Image Upload
- Secure upload to Vercel Blob
- Automatic cleanup on product deletion
- Image optimization handled by Vercel

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues and questions, please open an issue on GitHub.
