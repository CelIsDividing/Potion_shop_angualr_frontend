# Potion Shop - Frontend

A modern, responsive e-commerce web application for browsing, customizing, and ordering magical potions. Built with **Angular** and designed to communicate with a Spring Boot microservices backend.

---

## Important Backend Requirement

> **Backend Logic & Microservices Dependency:**  
> This frontend application relies on backend services to handle authentication, catalog data, cart checkout, orders, and payment processing.
> 
> The backend logic is provided in a separate repository:  
> [Potion Shop Backend Repository](https://github.com/CelIsDividing/Potion_Shop_Project) (`https://github.com/CelIsDividing/Potion_Shop_Project`)
> 
> **For this frontend to function properly, the backend microservices (and API Gateway on port `8765`) MUST be running simultaneously.**

---

## Features

- **Authentication & Authorization:**
  - Secure login with JWT authentication.
  - Route guards (`authGuard`) protecting catalog and cart routes.
  - Automatic JWT token injection via HTTP Interceptor (`authInterceptor`).
  - User profile and loyalty tier tracking in header navigation.

- **Product Catalog & Customization:**
  - View all available magical potions with prices, descriptions, calories, and allergen information.
  - Add customizable potion extras/ingredients to items.

- **Shopping Cart & Discounts:**
  - Manage cart items and extra ingredients.
  - Dynamic loyalty tier discount calculation based on user tier status (Bronze, Silver, Gold, etc.).
  - Real-time subtotal, discount, and total price breakdown.

- **Checkout & Payment System:**
  - Manage saved credit/debit payment cards or register new cards.
  - Card validation (Luhn check, expiry dates, CVV).
  - Multi-step checkout creating draft orders, items registration, payment confirmation, and automatic loyalty points accumulation.

---

## Architecture & Proxy Configuration

The Angular application uses a proxy configuration (`proxy.conf.json`) during development to route API requests to the API Gateway running at `http://127.0.0.1:8765`:

| Path Prefix | Target Gateway | Service Responsibility |
| :--- | :--- | :--- |
| `/user-service` | `http://127.0.0.1:8765` | User authentication, profile, loyalty points |
| `/catalog-service` | `http://127.0.0.1:8765` | Products, potion extras, allergen info |
| `/order-service` | `http://127.0.0.1:8765` | Draft orders, items, order completion |
| `/payment-service` | `http://127.0.0.1:8765` | Card management, payment processing |

---

## Getting Started

### Prerequisites

- **Node.js**: v18+ (v20+ recommended)
- **npm**: v9+
- **Angular CLI**: v22+ (`npm install -g @angular/cli`)
- **Backend Services**: Cloned and running from [Potion_Shop_Project](https://github.com/CelIsDividing/Potion_Shop_Project)

### Installation & Run

1. **Start the Backend Services:**
   Ensure the backend microservices and API Gateway from [Potion_Shop_Project](https://github.com/CelIsDividing/Potion_Shop_Project) are up and running on `http://127.0.0.1:8765`.

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm start
   # or
   ng serve
   ```

4. **Open in Browser:**
   Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

---

## Available Scripts

In the project directory, you can run:

- **`npm start` / `ng serve`**: Starts the dev server with proxying enabled to port `8765`.
- **`npm run build` / `ng build`**: Compiles the application into production-ready static assets in `dist/`.
- **`npm test` / `ng test`**: Runs unit tests using the [Vitest](https://vitest.dev/) test runner.
- **`npm run watch`**: Builds the application and watches for changes.

---

## Project Structure

```text
src/
├── app/
│   ├── cart/                # Cart management & payment modal checkout component
│   ├── guards/              # Authentication route guards (auth.guard.ts)
│   ├── login/               # User login view & credentials management
│   ├── models/              # TypeScript interfaces and models (potion.model.ts)
│   ├── product-item/        # Individual product card & extras selection
│   ├── product-list/        # Catalog grid view & search/filtering
│   ├── services/            # API integration services (Auth, Catalog, Cart, Order, Payment)
│   ├── app.config.ts        # App configuration & HTTP interceptors
│   ├── app.html / app.css   # Main layout navbar & navigation header
│   ├── app.routes.ts        # Angular application routes definition
│   └── app.ts               # Root component
├── proxy.conf.json          # Dev proxy mapping to backend gateway
└── styles.css               # Global theme & typography styles
```

---

## Tech Stack

- **Framework:** Angular (Standalone Components)
- **Language:** TypeScript
- **Styling:** CSS3 (Custom design system & responsive layout)
- **State Management & Async:** RxJS
- **Testing:** Vitest
- **Backend:** Spring Boot Microservices ([Potion_Shop_Project](https://github.com/CelIsDividing/Potion_Shop_Project))

