# MERN Shop — Complete Runnable E-commerce Starter

A full-stack e-commerce application built with React, Vite, Node.js, Express, MongoDB/Mongoose, JWT authentication, and Stripe Checkout.

## Features

- Product browsing, search, category filtering, price sorting
- Product detail pages
- JWT register/login and protected routes
- Persistent shopping cart for authenticated users
- Guest cart in localStorage
- Checkout with Stripe Checkout
- Stripe webhook that marks orders paid
- Order history
- Admin product CRUD and order-status management
- Responsive UI
- Seed script with demo products

## Requirements

- Node.js 20+
- MongoDB 6+ (local or MongoDB Atlas)
- Stripe account for live/test checkout

## Setup

### 1. Install dependencies

From the project root:

```bash
npm install
npm run install:all
```

### 2. Configure the server

Copy `server/.env.example` to `server/.env` and fill in:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/mern_shop
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

`STRIPE_WEBHOOK_SECRET` is only needed for webhook verification.

### 3. Seed products

```bash
npm run seed
```

This creates an admin account:

- Email: `admin@example.com`
- Password: `Admin123!`

Change these credentials before using the app outside a local demo.

### 4. Start development servers

```bash
npm run dev
```

Open http://localhost:5173

The API runs at http://localhost:5000.

## Stripe local webhook

Install the Stripe CLI and authenticate it. Then run:

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

Copy the displayed `whsec_...` into `STRIPE_WEBHOOK_SECRET`, restart the server, and test checkout.

## Production notes

- Use a strong random `JWT_SECRET`.
- Keep Stripe secret keys server-side only.
- Use HTTPS.
- Configure Stripe webhook endpoint in the Stripe Dashboard.
- Replace the demo admin credentials.
- Add rate limiting, CSRF strategy appropriate to your auth design, email verification/password reset, image storage, and more extensive validation before production.
