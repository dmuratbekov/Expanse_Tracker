# Finance Tracker

> A full-stack personal finance management web application built with React, Node.js, Express, and PostgreSQL.

**Author:** Daniel Muratbekov  

---

## Project Description

Finance Tracker is a web application that helps users take control of their personal finances. Users can register, log in securely, manage multiple accounts, track income and expenses with categories, and visualize their financial data through an interactive analytics dashboard.

The project was built to solve a real everyday problem — most people don't track where their money goes. This app provides a clean, intuitive interface to record every transaction and understand spending patterns at a glance.

--- 

## Features & Functionality

### Authentication
- User registration with full name, email, and password
- Secure login with JWT (JSON Web Token)
- Protected routes — unauthenticated users are redirected to login
- Persistent sessions via localStorage

### Transactions
- Add income and expense transactions
- Link each transaction to category
- Filter by type (income/expense), category, and date range
- Search by description or category name
- Edit and delete transactions
- Atomic balance updates using PostgreSQL transactions (BEGIN/COMMIT)

### Categories
- Default categories created automatically on registration (12 categories)
- Create, edit, and delete custom categories
- Choose icon and color for each category
- Separate income and expense categories

### Analytics Dashboard
- Monthly summary: total income, expenses, net balance
- Pie chart — expenses broken down by category with percentages
- Bar chart — income vs expenses by month
- Line chart — savings dynamics over the year

---

## Database Design

### ER Diagram

Lokated in docs/erd.png

### Tables Description

| Table | Description | Key Constraints |
|---|---|---|
| `users` | Registered users | UNIQUE email, NOT NULL |
| `accounts` | Financial accounts per user | CHECK type IN (cash, card, savings) |
| `categories` | Income/expense categories | UNIQUE (user_id, name, type) |
| `transactions` | All financial transactions | CHECK amount > 0, ON DELETE CASCADE |

### Relationships
- `users` → `accounts`: One-to-Many (one user has many accounts)
- `users` → `categories`: One-to-Many (one user has many categories)
- `accounts` → `transactions`: One-to-Many (one account has many transactions)
- `categories` → `transactions`: One-to-Many, nullable (transaction can have no category)

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool and dev server |
| React Router v7 | Client-side routing |
| Axios | HTTP client with interceptors |
| Recharts | Charts and data visualization |
| Lucide React | Icon library |
| CSS Modules | Component styling |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| pg (node-postgres) | PostgreSQL driver |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| cors | Cross-origin resource sharing |
| dotenv | Environment variables |
| nodemon | Development auto-restart |

### Database
| Technology | Purpose |
|---|---|
| PostgreSQL 18 | Primary relational database |
| uuid-ossp | UUID generation extension |
| pl/pgSQL | Stored function for default categories |

---

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login, returns JWT | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Categories
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/categories` | Get all categories (filterable by type) | Yes |
| POST | `/api/categories` | Create category | Yes |
| PUT | `/api/categories/:id` | Update category | Yes |
| DELETE | `/api/categories/:id` | Delete category | Yes |

### Transactions
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/transactions` | Get transactions (filterable, paginated) | Yes |
| POST | `/api/transactions` | Create transaction + update balance | Yes |
| PUT | `/api/transactions/:id` | Update transaction + recalculate balance | Yes |
| DELETE | `/api/transactions/:id` | Delete transaction + revert balance | Yes |

### Analytics
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/analytics/summary` | Income, expense, balance summary | Yes |
| GET | `/api/analytics/by-category` | Expenses grouped by category with % | Yes |
| GET | `/api/analytics/by-month` | Monthly income/expense for a year | Yes |

---

## Setup & Run Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL 18
- Git

### 1. Clone the repository
```bash
git clone https://github.com/DanielMuratbekov/Expense-Tracker.git
cd Expense-Tracker
```

### 2. Set up the database
```bash
# Open psql
psql -U postgres

# Run these commands:
CREATE DATABASE finance_tracker;
CREATE USER finance_user WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE finance_tracker TO finance_user;
GRANT ALL ON SCHEMA public TO finance_user;
\q
```

### 3. Configure backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finance_tracker
DB_USER=finance_user
DB_PASSWORD=yourpassword
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
```

### 4. Run database migrations
```bash
npm run migrate
```

This creates all tables, indexes, constraints, and the default categories function.

### 5. Start the backend
```bash
npm run dev
# Server runs on http://localhost:5000
```

### 6. Configure and start the frontend
```bash
cd ../frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

---

## Screenshots

| Page | Screenshot |
|---|---|
| Login | `screenshots/Login.png` |
| Dashboard | `screenshots/Dashboard.png` |
| Transactions | `screenshots/Transactions.png` |
| Categories | `screenshots/Categories.png` |
| Analytics | `screenshots/Analytics.png` |

---

## Demo Video

> [Watch Demo Video](https://drive.google.com/file/d/1O37rvY8KSdMUAAs-0vqtYkUDRy5VGCV9/view?usp=sharing)

---

## Feedback

> [Feedback Video](https://drive.google.com/file/d/1NDOuOk4vG-9FSXSTyPksUGRSI3O8PJGI/view?usp=sharing)
