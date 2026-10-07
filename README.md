# 🛒 E-Commerce Management Platform

A comprehensive full-stack e-commerce web application, featuring product browsing, shopping cart, checkout with delivery details, order tracking with PDF invoices, user management, and administrative controls.

## 📋 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## ✨ Features

### 🏠 User Features
- **Product Browsing**: View products with images, descriptions, ratings, and pricing
- **Advanced Search & Filter**: Browse products by category
- **Shopping Cart**: Add, update quantity, and remove items with live totals
- **Checkout**: Delivery and billing address forms with same-as-shipping option
- **Payment Methods**: Cash on Delivery (COD) and UPI support
- **Order Tracking**: View order history with delivery status and scheduled delivery dates
- **PDF Invoice**: Download order invoices (jsPDF)
- **User Profiles**: Registration and login with persistent accounts

### 👨‍💼 Admin Features
- **Dashboard**: Admin panel with quick stats and navigation
- **Product Management**: Add, edit, delete product listings
- **User Management**: View registered users
- **Order Management**: Track and update all orders

### 🔐 Security Features
- **Password Encryption**: BCrypt password hashing support (bcryptjs)
- **CORS Configuration**: Cross-origin resource sharing setup
- **Input Validation**: Mongoose schema validation on all models
- **Environment Configuration**: Sensitive settings loaded from `.env`

## 🛠️ Technologies Used

### Backend
- **Node.js 22**: Runtime
- **Express 5.2**: REST API framework
- **Mongoose 9**: MongoDB ODM
- **dotenv**: Environment configuration
- **cors**: CORS middleware
- **bcryptjs / jsonwebtoken / nodemailer**: Auth & utility support
- **nodemon**: Development auto-restart

### Frontend
- **React 19**: UI library
- **Vite 8**: Build tool with HMR
- **React Router 7**: Client-side routing
- **react-icons**: Icon library
- **jsPDF**: Client-side PDF invoice generation

### Database
- **MongoDB**: NoSQL database
- **MongoDB Compass**: Database management GUI (optional)

### Development Tools
- **npm**: Package management
- **ESLint**: Frontend linting
- **Visual Studio Code**: Recommended IDE

## 📋 Prerequisites

### System Requirements
- **Operating System**: Windows 10/11, macOS, or Linux
- **Node.js 18+** and npm
- **MongoDB Community Server** running on port 27017

### Software Dependencies

#### Required Software
1. **Node.js 18** or higher
   - Download from: https://nodejs.org/
   - Verify: `node -v` and `npm -v`

2. **MongoDB Community Server**
   - Download from: https://www.mongodb.com/try/download/community
   - Install and start MongoDB service
   - Default port: 27017

#### Optional Software
- **MongoDB Compass**: GUI for MongoDB management
- **Visual Studio Code**: Recommended IDE
- **Git**: Version control

### Verify Installations
```bash
node -v
npm -v
mongosh --eval "db.runCommand('ping')"
```

## 🚀 Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/Nandish-C/e-commerce-management.git
cd e-commerce-management
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Step 4: Install Root Dependencies (for root scripts)
```bash
cd ..
npm install
```

## 🗄️ Database Setup

### Option 1: Using Sample Data (Recommended)
```bash
# Load sample products into MongoDB
npm run seed
```
This inserts 8 sample products (Electronics, Clothing, Books, Home & Kitchen) into the database. The script skips seeding if products already exist.

### Option 2: Manual Setup
1. Start MongoDB service
2. Create a database named `ecommerce_db`
3. Collections (`products`, `users`, `orders`) are created automatically on first use

### Database Structure
- **products**: Product listings with name, description, price, category, image, rating, stock
- **users**: User accounts (name, email, phone)
- **orders**: Orders with user reference, products, totals, delivery/shipping addresses, and status

## ⚙️ Configuration

### Backend Configuration (`backend/.env`)
```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/ecommerce_db

# Server Configuration
PORT=5000
```

### Frontend Configuration
The frontend automatically connects to `http://localhost:5000` for API calls (see API calls in `frontend/src/App.jsx`).

## ▶️ Running the Application

### Method 1: Using npm Scripts (Recommended)
```bash
# Terminal 1: Start backend (from repo root)
npm start

# Terminal 2: Start frontend (from repo root)
cd frontend
npm run dev
```

### Method 2: Manual Startup

#### Terminal 1: Start Backend
```bash
cd backend
node index.js
```
Backend will start on: http://localhost:5000

#### Terminal 2: Start Frontend
```bash
cd frontend
npm run dev
```
Frontend will start on: http://localhost:5173

### Method 3: Development Mode (auto-restart on backend changes)
```bash
# From repo root or backend folder
npm run dev
```

### Demo Admin Login
- **Email**: `admin@nandicart.com`
- **Password**: `admin123`

## 📡 API Endpoints

### Base URL
`http://localhost:5000`

### Users
- `POST /api/users/create` - Create user (find-or-create by email)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products/create` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/{id}` - Get order by ID
- `GET /api/orders/user/{userId}` - Get orders by user ID
- `POST /api/orders/create` - Create order (accepts `deliveryDetails.shipping/billing` or `deliveryAddress`/`shippingAddress`)
- `PUT /api/orders/{id}` - Update order
- `DELETE /api/orders/{id}` - Delete order

### Health Check
- `GET /` - Returns "Backend Running..."

## 📁 Project Structure

```
e-commerce-management/
├── backend/                      # Node.js + Express backend
│   ├── index.js                  # Server entry point (port 5000)
│   ├── seed.js                   # Sample product seeding script
│   ├── .env                      # Environment variables (MONGO_URI, PORT)
│   ├── package.json              # Backend dependencies & scripts
│   ├── controllers/
│   │   ├── productController.js  # Product CRUD logic
│   │   ├── orderController.js    # Order creation & queries
│   │   └── userController.js     # User find-or-create
│   ├── models/
│   │   ├── Product.js            # Product schema
│   │   ├── Order.js              # Order schema
│   │   └── User.js               # User schema
│   └── routes/
│       ├── productRoutes.js      # /api/products
│       ├── orderRoutes.js        # /api/orders
│       └── userRoutes.js         # /api/users
├── frontend/                     # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   └── ChatBot.jsx       # Chatbot component
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # Home with featured products
│   │   │   ├── ProductsPage.jsx  # Product listing
│   │   │   ├── CartPage.jsx      # Cart & checkout
│   │   │   ├── OrderTrackingPage.jsx  # Orders + PDF invoice
│   │   │   ├── AuthPage.jsx      # Login / Register
│   │   │   ├── ProfilePage.jsx   # User profile
│   │   │   ├── AboutPage.jsx     # About
│   │   │   ├── ContactPage.jsx   # Contact
│   │   │   └── Admin*.jsx        # Admin pages (Dashboard, Products, Users, Orders, Profile)
│   │   ├── App.jsx               # Routes + global state (products, cart, user, orders)
│   │   └── App.css               # Global styles
│   ├── vite.config.js
│   └── package.json
├── package.json                  # Root scripts (start, seed, dev)
├── .gitignore                    # Ignored files (node_modules, .env, dist)
└── README.md                     # This file
```

## ☁️ Deployment (Vercel)

The project is configured for a single Vercel deployment: the React build is served as static files and the Express API runs as a serverless function under `/api/*`.

### Deployment Files
- `vercel.json` — build command, output directory, and rewrites (`/api/*` → serverless function, SPA fallback)
- `api/index.js` — Vercel serverless entry that exports the Express app
- `backend/index.js` — skips `app.listen` when `VERCEL` is set (Vercel provides its own server)

### Prerequisites
1. A [Vercel](https://vercel.com) account
2. A **cloud MongoDB URI** (e.g. [MongoDB Atlas](https://www.mongodb.com/atlas)) — the default `mongodb://localhost:27017/ecommerce_db` only works on your machine and will not be reachable from Vercel

### Deploy Steps
```bash
# 1. Install the Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Link and deploy (from the repo root)
vercel
```

### Environment Variables (Vercel Dashboard)
In your Vercel project, go to **Settings → Environment Variables** and add:

| Key | Value |
| --- | --- |
| `MONGO_URI` | `mongodb+srv://<user>:<password>@cluster.mongodb.net/ecommerce_db` (your Atlas URI) |

> `PORT` is not needed — Vercel assigns the port automatically.

### Seed the Cloud Database
```bash
# Point MONGO_URI at your Atlas cluster, then seed
$env:MONGO_URI="mongodb+srv://<user>:<password>@cluster.mongodb.net/ecommerce_db"
npm run seed
```

### Local Development (unchanged)
```bash
# Terminal 1: backend on http://localhost:5000
npm start

# Terminal 2: frontend on http://localhost:5173 (proxies /api to the backend)
cd frontend
npm run dev
```

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. **Port 5000 Already in Use**
```powershell
# Find the process using port 5000
Get-NetTCPConnection -LocalPort 5000

# Or change the port in backend/.env
PORT=5001
```

#### 2. **MongoDB Connection Failed**
```bash
# Windows: start the MongoDB service
net start MongoDB

# Or on Linux/Mac
sudo systemctl start mongod

# Verify connection
mongosh --eval "db.runCommand('ping')"
```
Verify the `MONGO_URI` in `backend/.env` points to your instance.

#### 3. **Port 5173 Already in Use (Frontend)**
```bash
npm run dev -- --port 5174
```

#### 4. **Node.js Version Issues**
```bash
# Check Node version (18+ required)
node -v
```
Download the latest LTS version from https://nodejs.org/ if needed.

#### 5. **npm Install Fails**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rmdir /s /q node_modules
del package-lock.json
npm install
```

#### 6. **Environment Variables Not Loading**
The backend loads `backend/.env` by absolute path, so it works from any directory. If you see `MONGO_URI ... got "undefined"`, ensure `backend/.env` exists with a valid `MONGO_URI`.

#### 7. **Empty Product List**
Run the seed script:
```bash
npm run seed
```

#### 8. **Order Creation Fails**
The API accepts both the frontend's `deliveryDetails` shape (`shipping`/`billing` with `address`, `city`, `pincode`) and the model's `deliveryAddress`/`shippingAddress` shape (`addressLine1`, `city`, `state`, `pincode`). A guest user is created automatically when no user `_id` is provided.

#### 9. **CORS Errors**
- Ensure the backend is running on port 5000
- CORS is enabled by default in `backend/index.js`
- Verify the frontend is calling `http://localhost:5000/api/...`

#### 10. **Frontend Build Issues**
```bash
cd frontend
rmdir /s /q node_modules
npm install
npm run build
```

### Debug Mode

#### Enable Backend Debug Logging
```bash
# Run with verbose output
node backend/index.js
```
Check the terminal for MongoDB connection and server startup logs.

#### Frontend Debug Mode
```bash
# Run Vite in development mode with HMR
cd frontend
npm run dev
```
Open the browser console (F12) to inspect API calls and errors.

### Performance Issues

#### Database Optimization
- Ensure MongoDB indexes are created for frequently queried fields
- Check MongoDB connection pooling
- Monitor query performance with MongoDB Compass

#### Frontend Optimization
```bash
# Build for production
cd frontend
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the package.json files for details.

## 📞 Support

For support and questions:
- Create an issue at https://github.com/Nandish-C/e-commerce-management/issues
- Check the troubleshooting section above
- Review the API endpoints section

---
github id : Nandish-C


**Happy Coding! 🎉**


Built with ❤️ for shoppers everywhere
