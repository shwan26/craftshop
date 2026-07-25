# CraftShop

CraftShop is a full-stack marketplace for discovering handmade
services, placing custom orders, and communicating throughout the
order lifecycle.

## Live Demo

[Open CraftShop](YOUR_DEPLOYED_URL)

## Features

- Customer registration and authentication
- Role-based customer and administrator access
- Service browsing and service-detail pages
- Session-based shopping cart
- Checkout and order creation
- Customer order history
- Dedicated order workspace
- Customer and administrator messaging
- Order-status timeline
- Customer cancellation with reason
- Administrator service management
- Administrator order management
- Persistent MongoDB sessions
- Rate limiting and security headers

## Technology Stack

- Node.js
- Express 5
- MongoDB Atlas
- Mongoose
- EJS
- Bootstrap 5
- express-session
- connect-mongo
- bcrypt
- Helmet
- express-rate-limit
- Zod
- pnpm

## Screenshots

### Home Page

![Home page](docs/screenshots/home.png)

### Service Details

![Service details](docs/screenshots/service-detail.png)

### Customer Order Workspace

![Order workspace](docs/screenshots/order-workspace.png)

### Administrator Dashboard

![Administrator dashboard](docs/screenshots/admin-dashboard.png)

## Local Installation

1. Clone the repository.

```bash
git clone YOUR_REPOSITORY_URL
cd craftshop