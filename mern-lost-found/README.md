# SJBIT Lost & Found Portal (MERN)

Campus Lost & Found system for the **Department of Computer Science & Engineering, SJB Institute of Technology**.

## Tech stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18, React Router, Vite, Axios |
| Backend  | Node.js, Express                    |
| Database | MongoDB (Mongoose)                  |
| Auth     | JWT + bcrypt                        |

## Project structure

```
mern-lost-found/
├── backend/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/          User, Item, Claim, Notification
│   ├── routes/          auth, items, claims, notifications, reports
│   ├── seed.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/client.js
    │   ├── context/AuthContext.jsx
    │   ├── components/  Layout, ItemCard, Toast
    │   ├── pages/       Home, Browse, ItemDetail, Report, Claims,
    │   │                Notifications, Admin, Reports, Login
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Setup

### 1. MongoDB

Install and start MongoDB locally, or use MongoDB Atlas.  
Copy env file:

```bash
cd backend
cp .env.example .env
# Edit MONGO_URI and JWT_SECRET if needed
```

### 2. Backend

```bash
cd backend
npm install
npm run seed    # demo users + sample items
npm run dev     # http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev     # http://localhost:5173
```

Vite proxies `/api` → `http://localhost:5000`.

## Demo accounts

Password for all: **`Test@1234`**

| Email             | Role    |
|-------------------|---------|
| admin@sjbit.edu   | admin   |
| ravi@sjbit.edu    | student |
| priya@sjbit.edu   | student |

## Features

- Register / login (JWT)
- Browse & filter items (type, category, status, search)
- Post lost/found items with optional photo (base64)
- Claim found items with proof of ownership
- Notifications for claims and matches
- Admin: approve/reject claims, mark returned
- Reports: aggregation by category, status, type, claim outcome
- College branding (SJBIT / CSE)

## API overview

| Method | Path                         | Auth   | Description        |
|--------|------------------------------|--------|--------------------|
| POST   | /api/auth/register           | —      | Register student   |
| POST   | /api/auth/login              | —      | Login              |
| GET    | /api/auth/me                 | JWT    | Current user       |
| GET    | /api/items                   | —      | List / filter      |
| GET    | /api/items/:id               | —      | Item detail        |
| POST   | /api/items                   | JWT    | Create item        |
| GET    | /api/items/stats/summary     | —      | Counts             |
| POST   | /api/claims                  | JWT    | Submit claim       |
| GET    | /api/claims/mine             | JWT    | My claims          |
| GET    | /api/claims/pending          | Admin  | Pending claims     |
| PATCH  | /api/claims/:id/decide       | Admin  | Approve / reject   |
| GET    | /api/notifications           | JWT    | My notifications   |
| GET    | /api/reports                 | Admin  | Aggregation stats |

## Notes

- Photos are stored as base64 strings on the item document (fine for prototype; use S3/Cloudinary in production).
- Replace the “SJ” crest with a real SJBIT logo image in `Layout.jsx` when available.
