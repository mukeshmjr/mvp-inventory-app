# MVP Inventory App

A full-stack inventory management application built with Angular 20 and Node.js, deployed on [Render](https://render.com).

## 🔗 Live Demo

- **Frontend**: [https://mvp-inventory-app.onrender.com](https://mvp-inventory-app.onrender.com)
- **Backend API**: [https://inventory-backend-jwvu.onrender.com](https://inventory-backend-jwvu.onrender.com)

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
## 🛠️ Project Structure

/frontend → Angular app (SPA)
/backend → Node.js + Express API server
render.yaml → Deployment config (for backend only)

## 🧰 Tech Stack

| Frontend                | Backend     
|-------------------------|-------------------
| Angular 20 (Standalone) | Node.js + Express
| Angular Material        | REST API (login, get-items, save-items)
| ngx-toastr              | JSON-based in-memory store (for now)     |

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

## 🚀 Deployment

### Frontend

- Angular app built with:
```bash
ng build --configuration production
```

Deployed as a static site on Render

Publish directory: dist/frontend/browser

## Backend
Node.js app deployed on Render as a Web Service

Start command:

```bash
node server.js
```

🌐 Environment Config
In frontend/src/environments/environment.prod.ts:

```bash 
export const environment = {
  production: true,
  apiUrl: 'https://inventory-backend-jwvu.onrender.com'
};
```

## 📸 Screenshots

> _Add screenshots in a `/screenshots` folder if you'd like._

---


📄 License
MIT © Mukesh Singh