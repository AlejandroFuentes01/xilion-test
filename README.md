# 📚 Library Management System

Full-stack library management system with dual database architecture.

**Live Demo:** [Frontend](https://library-frontend-snowy.vercel.app) | [API](https://xilion-test-production.up.railway.app)

## Tech Stack
- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, MySQL (dual databases), Prisma
- **Features:** JWT Auth, PDF Reader, Infinite Scroll, Responsive Design

## Requirements
- Node.js 18+
- MySQL 8.0+

## Setup

### 1. Clone & Install
```bash
git clone https://github.com/your-username/xilion-test.git
cd xilion-test
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env`:
```env
DATABASE_BOOKS_URL="mysql://user:password@localhost:3306/library_books"
DATABASE_AUTHORS_URL="mysql://user:password@localhost:3306/library_authors"
JWT_SECRET="your-secret-key"
PORT=3000
FRONTEND_URL="http://localhost:3001"
```

Setup databases:
```bash
mysql -u root -p
CREATE DATABASE library_books;
CREATE DATABASE library_authors;
EXIT;

npm run generate:all
npm run migrate:all
npm run seed
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

```bash
npm run dev
```

**Access:** Frontend at http://localhost:3001

## API Endpoints
- `POST /api/auth/login` - Login
- `GET /api/books` - Get books (with search/filter)
- `GET /api/books/:id` - Book details
- `GET /api/authors/:id` - Author details

## Deployment

**Backend (Railway):**
```bash
npm install -g @railway/cli
railway login && railway up
```

**Frontend (Vercel):**
```bash
npm i -g vercel
cd frontend && vercel --prod
```

## Test Data
- **User:** `admin` / `password123`
- **Content:** 5000+ books, PDF reader for "The Way of Kings"

---

Built for **Xilion Technical Test**
