# 📦 Angular Minimal Dashboard App

A minimalist full-stack dashboard app built using **Angular 20** and **Node.js**, featuring:
- 🔐 Login screen with authentication
- 📋 Dashboard listing with pagination
- ➕ Add item form with image upload, validation, and preview
- 🔍 Filter support for title and created date

This project is designed as an MVP-ready base for admin dashboards, inventory systems, or product management tools.

---

## 🚀 Features

- ✅ **Angular 20** standalone components
- ✅ **Angular Material** UI with responsive layout
- ✅ **Login Screen** – secure user login
- ✅ **Dashboard** – paginated list view with filters
- ✅ **Add Item Form** – upload image, title, description, price, quantity, date
- ✅ **Image Upload + Preview** (file input)
- ✅ **Form Validation** (required, number limits, etc.)
- ✅ **Toaster Notifications** for actions
- ✅ **Search & Date Filter** on listing

---

## 🧰 Tech Stack

| Frontend                | Backend     
|-------------------------|-------------------
| Angular 20 (Standalone) | Node.js + Express
| Angular Material        | REST API (login, get-items, save-items)
| ngx-toastr              | JSON-based in-memory store (for now)     |

---

## 📸 Screenshots

> _Add screenshots in a `/screenshots` folder if you'd like._

---

## 🛠️ Setup Instructions

### 📦 Frontend (Angular)

```bash
# Clone the repo
git clone https://github.com/mukeshmjr/mvp-inventory-app.git
cd mvp-inventory-app

# Install dependencies
npm install

# Run the frontend
ng serve
```