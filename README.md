# CraftShop

CraftShop is a full-stack handmade services marketplace where customers can browse creative services, place custom orders, and communicate directly with administrators throughout the order process.

Built as a portfolio project using Node.js, Express, MongoDB Atlas, and EJS, the application demonstrates authentication, role-based authorization, shopping cart functionality, order management, and production-ready security practices.

---

## Live Demo

**Website:** https://craftshop-pbe8.onrender.com/

---

## Features

### Customer

- Register and log in securely
- Browse available handmade services
- View service details
- Add services to a shopping cart
- Checkout and place orders
- View order history
- Track order status
- Cancel pending orders with an optional reason
- Communicate with administrators through an order workspace

### Administrator

- Secure administrator dashboard
- Create, edit, and delete services
- View and manage customer orders
- Update order status
- Communicate with customers
- View complete order status history

---

## Technology Stack

### Backend

- Node.js
- Express.js 5
- MongoDB Atlas
- Mongoose

### Frontend

- EJS
- Bootstrap 5
- Bootstrap Icons

### Authentication & Security

- express-session
- connect-mongo
- bcrypt
- Helmet
- express-rate-limit
- Zod

### Development Tools

- pnpm
- Nodemon
- Git
- GitHub

---

## Project Structure

```
craftshop/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── app.js
│   └── server.js
│
├── public/
│
├── views/
│
├── .env.example
├── package.json
└── README.md
```

---

## Security Features

- Password hashing with bcrypt
- Session authentication
- MongoDB session storage
- Session regeneration after login
- Secure session cookies
- HTTP security headers using Helmet
- Request rate limiting
- Input normalization
- Environment variable validation using Zod
- Production-safe error handling
- Role-based authorization
- Order ownership validation

---

## Installation

### Clone the repository

```bash
git clone https://github.com/shwan26/craftshop.git

cd craftshop
```

### Install dependencies

```bash
pnpm install
```

### Create environment variables

Create a `.env` file.

```env
NODE_ENV=development

PORT=3000

MONGODB_URI=your_mongodb_connection_string

SESSION_SECRET=your_long_random_secret
```

### Run the application

Development

```bash
pnpm dev
```

Production

```bash
pnpm start
```

Open

```
http://localhost:3000
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| NODE_ENV | Application environment |
| PORT | Server port |
| MONGODB_URI | MongoDB Atlas connection string |
| SESSION_SECRET | Secret used to sign sessions |

---

## Demo Account

### Administrator

Create an administrator account using:

```bash
pnpm create-admin
```

Configure the following environment variables before running:

```
ADMIN_NAME
ADMIN_EMAIL
ADMIN_PASSWORD
```

---

## Screenshots

### Home

> Add screenshot here

### Services

> Add screenshot here

### Service Details

> Add screenshot here

### Shopping Cart

> Add screenshot here

### Checkout

> Add screenshot here

### Customer Dashboard

> Add screenshot here

### Order Workspace

> Add screenshot here

### Admin Dashboard

> Add screenshot here

---

## Future Improvements

- Image upload with Cloudinary
- Search and filtering
- Customer reviews
- Wishlist
- Email notifications
- Payment gateway integration (Stripe)
- Seller accounts
- Order analytics
- Responsive admin dashboard
- REST API version

---

## Learning Outcomes

This project demonstrates experience with:

- Full-stack web development
- MVC architecture
- Authentication and authorization
- Session management
- CRUD operations
- MongoDB data modeling
- Production deployment
- Web security best practices
- Responsive UI development
- Git version control

---

## License

This project was created for educational and portfolio purposes.

---

## Author

**Your Name**

GitHub: https://github.com/shwan26

LinkedIn: https://linkedin.com/in/shwan-myat-nay-chi