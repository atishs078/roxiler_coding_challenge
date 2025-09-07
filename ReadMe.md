# FullStack Intern Coding Challenge – Final Submission

**Author:** Atish Shinde
**Repository:** [https://github.com/atishs078/roxiler\_coding\_challenge](https://github.com/atishs078/roxiler_coding_challenge)


---

## 1) Project Overview

A role-based web application where users can register/login and submit ratings (1–5) for registered stores. The platform supports three roles:

* **System Administrator** – manage stores and users, view dashboard metrics.
* **Store Owner** – view raters for their store and average rating.
* **Normal User** – browse stores, search, submit/modify ratings.

---

## 2) Tech Stack

* **Frontend:** React.js
* **Backend:** Express.js (Node.js)
* **Auth:** JWT-based authentication + role guards (middleware)
* **Database:** MySQL (via `mysql2`), following a normalized relational schema

> Note: The backend is modular and can be adapted to other SQL engines with minor changes in the DB connector.

---

## 3) Key Features

* **Single Sign-In** for all roles (role determines access & UI).
* **Admin Dashboard** with total users, stores, and ratings.
* **Users & Stores Management** (admin): create/list/filter/sort.
* **Store Listing & Search** (normal users): by name & address.
* **Rating System**: 1–5 rating, add & update per user per store.
* **Store Owner Panel**: see users who rated their store + average rating.
* **Form Validations** (frontend & backend):

  * Name: 20–60 chars
  * Address: ≤ 400 chars
  * Password: 8–16 chars, ≥1 uppercase & ≥1 special character
  * Email: RFC-like email pattern
* **Tables with Sorting** on key fields (Name, Email, Address, Role, Rating).

---

## 4) Repository Structure (high level)

```
roxiler_coding_challenge/
├─ backend/
│  ├─ router/                # Express routers (auth, stores, ratings, admin)
│  ├─ middleware/            # verifyJWT, isAdmin, isStoreOwner, isNormalUser
│  ├─ db.js                  # mysql2 pool & export (promise-based)
│  ├─ server.js              # Express app bootstrap
│  └─ .env.example           # Sample environment variables
└─ frontend/
   ├─ src/                   # React app (routes, pages, components)
   ├─ package.json
   └─ .env.example
```

> Actual layout may vary slightly; see repo for the latest structure.

---

## 5) Setup & Run

### Prerequisites

* Node.js >= 18
* MySQL >= 8 (or compatible server)

### Backend

1. **Clone repo & install deps**

   ```bash
   git clone https://github.com/atishs078/roxiler_coding_challenge
   cd roxiler_coding_challenge/backend
   npm install
   ```
2. **Create `.env`** from `.env.example`:

   ```env
   PORT=5000
   JWT_SECRET=your_strong_secret
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_db_password
   DB_NAME=roxiler
   ```
3. **Create Database & Tables** (sample schema below) and ensure credentials match.
4. **Start backend**

   ```bash
   npm run dev   # or: npm start
   ```

### Frontend

1. Open a new terminal:

   ```bash
   cd ../frontend
   npm install
   ```
2. **Create `.env`** from `.env.example`:

   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
3. **Start frontend**

   ```bash
   npm run dev
   ```

---

## 6) Database Schema (MySQL)

### `users`

| column    | type                                 | notes                |
| --------- | ------------------------------------ | -------------------- |
| id        | INT PK AUTO\_INC                     | user id              |
| name      | VARCHAR(60)                          | validate 20–60 chars |
| email     | VARCHAR(255)                         | unique, email format |
| password  | VARCHAR(255)                         | hashed (bcrypt)      |
| address   | VARCHAR(400)                         | ≤ 400 chars          |
| role      | ENUM('admin','storeowner','user')    | access control       |
| createdAt | TIMESTAMP DEFAULT CURRENT\_TIMESTAMP |                      |

### `stores`

| column            | type                                 | notes                           |
| ----------------- | ------------------------------------ | ------------------------------- |
| id                | INT PK AUTO\_INC                     | store id                        |
| name              | VARCHAR(100)                         |                                 |
| email             | VARCHAR(255)                         | unique                          |
| address           | VARCHAR(400)                         |                                 |
| ownerUserId       | INT                                  | FK → users.id (role=storeowner) |
| isPasswordUpdated | TINYINT(1) DEFAULT 0                 | onboarding flag                 |
| created\_at       | TIMESTAMP DEFAULT CURRENT\_TIMESTAMP |                                 |

### `store_ratings`

| column    | type                                        | notes                            |
| --------- | ------------------------------------------- | -------------------------------- |
| id        | INT PK AUTO\_INC                            | rating id                        |
| storeId   | INT                                         | FK → stores.id                   |
| userId    | INT                                         | FK → users.id                    |
| rating    | TINYINT                                     | 1–5                              |
| name      | VARCHAR(60)                                 | denormalized snapshot (optional) |
| email     | VARCHAR(255)                                | denormalized snapshot (optional) |
| createdAt | TIMESTAMP DEFAULT CURRENT\_TIMESTAMP        |                                  |
| updatedAt | TIMESTAMP NULL ON UPDATE CURRENT\_TIMESTAMP |                                  |

**Constraints/Indexes**

* `UNIQUE KEY uq_store_user (storeId, userId)` – one rating per user per store.
* Indexes on `users.email`, `stores.email`, and `store_ratings.storeId`.

---

## 7) Security & Validation

* **JWT Auth**: Access token in `Authorization: Bearer <token>`.
* **Password Hashing**: bcrypt with salt.
* **Role Guards**: `isAdmin`, `isStoreOwner`, `isNormalUser` check `req.user.role`.
* **Input Validation**: server-side checks for name length, address length, password strength, and email format.
* **CORS** configured for local dev (frontend → backend).

---

## 8) API Endpoints (high level)

Base path: `/api`

### Auth

* `POST /auth/register` – create user (role defaults to `user` unless admin creates otherwise)
* `POST /auth/login` – returns JWT
* `POST /auth/update-password` – auth required

### Admin

* `POST /admin/users` – create user (admin/storeowner/admin)
* `GET /admin/users` – list users (filter/sort by name/email/address/role)
* `GET /admin/stores` – list stores with `name,email,address,avgRating`
* `POST /admin/stores` – add store
* `GET /admin/metrics` – totals: users, stores, ratings

### Stores / Ratings

* `GET /stores` – list/search stores (name/address)
* `POST /ratings/rate` – **user only**: create/update rating `{ storeId, rating }`
* `GET /ratings/by-store/:id` – list ratings for a store (joined with user name/email)
* `GET /stores/:id/raters` – **store owner only**: same as above but role-guarded

> Exact routes may vary slightly in the repo; refer to route files in `/backend/router/`.

---

## 9) How to Test (Postman)

1. **Auth**

   * Register a normal user → Login → get token.
   * (Optional) Create admin/store owner using an admin token.
2. **Stores**

   * As admin, create stores; assign `ownerUserId`.
   * As user, `GET /stores` and search.
3. **Ratings**

   * As user, `POST /ratings/rate` with `{ storeId, rating }`.
   * Re-post to update rating.
   * Verify via `GET /ratings/by-store/:id`.
4. **Store Owner View**

   * Login as store owner → `GET /stores/:id/raters` → see list & average.

---

## 10) Frontend (React) – UI Summary

* **Login / Signup** forms with client-side validation.
* **Role-based Navigation** (Admin | Store Owner | User).
* **Admin Dashboard** (cards for totals) and data tables with sorting/filters.
* **Store List** (search by name/address) and **Rate** action for users.
* **My Store** page for owners: raters list + average rating.
* **SweetAlert** notifications for success/error feedback.

---

## 11) Notes & Trade-offs

* Unique constraint on `(storeId, userId)` ensures idempotent rating updates.
* Denormalized `name/email` in `store_ratings` kept for snapshot consistency and faster owner views; canonical values still live in `users`.
* Email is not used as a primary identifier; IDs are used internally for joins and updates.

---

## 12) Future Enhancements

* Pagination on all tables, server-side filtering.
* Export (CSV) for admin lists.
* Password reset (email OTP) flow.
* Docker compose for one-command setup.
* E2E tests (Playwright) and API tests (Jest + Supertest).

---

## 13) How to Grade Quickly

* Run backend & frontend (see **Setup & Run**).
* Create one admin, one store owner, and one normal user.
* Add a store; submit a rating from the normal user.
* Verify the owner sees raters & average; admin dashboard counts update.

---

**Thank you for reviewing my submission.**
For any queries, please reach out via the contact details in my GitHub profile.
