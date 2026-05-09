# Iskill

Minimal internal collaboration platform for organizations.

## Stack

- Backend: Laravel 12 API with Sanctum token auth
- Frontend: React + Vite
- Database target: PostgreSQL
- File storage: Laravel local disk (`storage/app/private`)

## Product Scope

- Authentication
- People directory
- Shared documents
- 1-to-1 chat
- Chat file attachments

## Project Structure

- `backend/` Laravel API
- `frontend/` React workspace UI

## Backend Setup

1. Copy `backend/.env.example` to `backend/.env`
2. Set PostgreSQL credentials
3. Run:

```bash
cd backend
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

## Frontend Setup

1. Copy `frontend/.env.example` to `frontend/.env`
2. Confirm `VITE_API_URL` points at the Laravel API
3. Run:

```bash
cd frontend
npm install
npm run dev
```

## Seeded Accounts

All seeded users use:

- Password: `password`

Examples:

- `amina@iskill.local`
- `brian@iskill.local`
- `carla@iskill.local`

## API Surface

- `POST /api/login`
- `POST /api/logout`
- `GET /api/me`
- `GET /api/users`
- `GET /api/conversations`
- `GET /api/messages/{userId}`
- `POST /api/messages`
- `POST /api/messages/attachment`
- `GET /api/messages/attachments/{attachment}/download`
- `GET /api/documents`
- `POST /api/documents`
- `GET /api/documents/{id}/download`
- `DELETE /api/documents/{id}`

## Validation Rules

- Documents and chat attachments accept: `PDF`, `DOCX`, `XLSX`, `PNG`, `JPG`, `ZIP`
- Max upload size: `10MB`
- All file access requires authentication

## Verification

- Backend tests: `php artisan test`
- Frontend lint: `npm run lint`
- Frontend build: `npm run build`
