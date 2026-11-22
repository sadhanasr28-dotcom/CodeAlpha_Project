# ShopEase — CodeAlpha Task 1: Simple E-commerce Store

A beginner-friendly full-stack e-commerce project built with HTML, CSS, JavaScript, Node.js, Express and MongoDB.

## Features
- Product listing with category filters and search
- Product details
- Shopping cart (saved in browser localStorage)
- User registration and login (bcrypt password hashing + JWT)
- Checkout and order processing
- MongoDB collections for users, products and orders
- Stock checks and stock reduction when an order is placed
- Responsive layout for desktop and mobile

## Requirements
- Node.js 18 or newer
- MongoDB local server OR a MongoDB Atlas cluster
- Internet connection for the sample product photos and Google Fonts

## Setup on Windows

1. Install Node.js from https://nodejs.org/
2. Install MongoDB Community Server, or create a free cluster at https://www.mongodb.com/atlas
3. Extract this ZIP file.
4. Open the extracted `CodeAlpha_Ecommerce_Store` folder.
5. Open Command Prompt in this folder.
6. Install project packages:

   ```cmd
   npm install
   ```

7. Create your environment file:

   ```cmd
   copy .env.example .env
   ```

8. Open `.env` in Notepad and set your MongoDB connection string and a private JWT secret.

   Local MongoDB example:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/codealpha_ecommerce
   JWT_SECRET=make_this_a_long_random_secret
   ```

   MongoDB Atlas example:

   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/codealpha_ecommerce
   JWT_SECRET=make_this_a_long_random_secret
   ```

   Replace the Atlas placeholders with your own database username, password and cluster address. Do not share your `.env` file or upload it to GitHub.

9. Add sample products to MongoDB:

   ```cmd
   npm run seed
   ```

10. Start the website:

   ```cmd
   npm start
   ```

11. Open this address in Chrome:

   `http://localhost:5000`

## Main folders

```text
CodeAlpha_Ecommerce_Store/
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── src/
│   ├── middleware/auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   └── routes/
│       ├── auth.js
│       ├── products.js
│       └── orders.js
├── .env.example
├── .gitignore
├── package.json
├── seed.js
└── server.js
```

## API endpoints

| Method | Endpoint | Purpose | Login required |
|---|---|---|---|
| GET | `/api/health` | Check server | No |
| POST | `/api/auth/register` | Create account | No |
| POST | `/api/auth/login` | Sign in | No |
| GET | `/api/auth/me` | Current user | Yes |
| GET | `/api/products` | List/search/filter products | No |
| GET | `/api/products/:id` | Product details | No |
| POST | `/api/orders` | Place an order | Yes |
| GET | `/api/orders/my-orders` | View your orders | Yes |

## Test the project
1. Register with your name, email and password.
2. Add products to the cart.
3. Open Cart and continue to checkout.
4. Enter a shipping address and place the order.
5. Scroll to My Orders to see the saved order.
6. Check the `users`, `products` and `orders` collections in MongoDB.

## GitHub submission
Create a repository named `CodeAlpha_Ecommerce_Store`. Upload the project source code, but do not upload `.env` or `node_modules`.

## Notes
- This is a learning/demo store. It does not integrate a real payment gateway.
- The frontend stores the cart in localStorage. Orders, products and user accounts are stored in MongoDB.
- For a real production store, add payment processing, admin product management, stronger validation, rate limiting, secure cookie-based sessions and transactional stock updates.
