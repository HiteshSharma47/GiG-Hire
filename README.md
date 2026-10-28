# GiGHire — Gig Marketplace

GiGHire is a MERN-stack web application that connects **clients** who need a service with **workers** who can provide it. The goal is to make it easy to discover services, post gigs, and manage work in one place.

> **Project status:** The frontend and basic authentication are working. Some dashboard features and gig/order backend integration are planned and should be marked complete only after they are implemented and tested.

## 1. Technology Used

- **Frontend:** React, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas with Mongoose
- **Authentication:** Password hashing with bcrypt and token-based authentication with JWT
- **API communication:** HTTP requests from the React frontend to the Express backend

## 2. What Works So Far

- A home page with service categories, featured gigs, and a “How It Works” section.
- Login and registration pages.
- Client and worker roles.
- Backend login/registration flow tested successfully.
- User login state and token are stored in browser `localStorage`.
- Protected frontend routes for the client and worker dashboards.
- The home page changes its navigation based on whether a user is logged in.
- A worker dashboard UI with sample gigs, orders, and summary cards.
- The home page can display sample gigs when the gigs API is unavailable.

**Important:** The dashboard's sample data is currently for display/testing. It is not yet proof that gigs, orders, or earnings are being saved in MongoDB.

## 3. Main User Roles

### Client
A client is someone who needs a service. Planned capabilities include:
- Browse available gigs and service categories.
- View gig details and worker information.
- Place and track orders/bookings.
- Review completed work, when that feature is added.

### Worker
A worker is someone who offers a service. Planned capabilities include:
- Create and publish gigs.
- Manage, update, or delete their own gigs.
- View incoming orders and update their status.
- Track completed work and earnings.

## 4. How the Project Is Structured

The project is kept in two main folders:

```text
Gig_Hire/
├── client/                 # React frontend
│   └── src/
│       ├── components/     # Reusable UI pieces and route protection
│       ├── context/        # Shared login/user state
│       ├── pages/          # Home, Login, Register, dashboards
│       └── App.jsx         # App routes
└── server/                 # Express backend
    ├── models/             # MongoDB/Mongoose models
    ├── routes/             # API endpoints
    ├── middleware/         # Authentication/authorization checks, if present
    └── server entry file   # Starts the API and database connection
```

This is the intended high-level structure; exact filenames may differ as the project grows.

## 5. Authentication Flow

1. A user registers or enters their email, password, and role to log in.
2. The React frontend sends the request to the Express API.
3. The backend checks the user details. Passwords should be stored as bcrypt hashes, not plain text.
4. On successful login, the backend returns a JWT and user details.
5. The frontend stores the user details and token in `localStorage`.
6. `AuthContext` shares the login state across the app.
7. `ProtectedRoute` sends logged-out users to the login page and prevents the wrong role from opening a role-specific dashboard.

Frontend route protection improves navigation, but **the backend must also verify the JWT and role for every protected API**.

## 6. Main Pages and Files

- `Home.jsx` — landing page, categories, featured gigs, and login-aware navigation.
- `Login.jsx` — login form and role-based dashboard redirect.
- `Register.jsx` — account creation form.
- `WorkerDashboard.jsx` — worker dashboard layout; currently includes sample data.
- `ClientDashboard.jsx` — client dashboard route is configured; confirm its implementation and features as development continues.
- `AuthContext.jsx` — keeps user and token state available across pages.
- `ProtectedRoute.jsx` — protects client/worker frontend routes.
- `App.jsx` — defines the main application routes.

## 7. Planned Work

The following features are planned and are **not considered complete until implemented and tested**:

1. **Finish gig APIs:** create, list, view, update, and delete gigs through Express and MongoDB.
2. **Create Gig page:** build the form workers use to publish a service.
3. **Connect worker dashboard:** load the signed-in worker's real gigs and orders from the backend.
4. **Build the client dashboard:** show useful client information and their bookings/orders.
5. **Orders/bookings:** allow clients to order a gig and let workers manage order status.
6. **Earnings and history:** calculate earnings from completed orders rather than sample values.
7. **Security and validation:** verify JWTs and user roles on protected APIs; validate input and return clear errors.
8. **Testing and polish:** test registration, login, roles, invalid inputs, API failures, responsive layout, and the full client-to-worker flow.

## 8. Running the Project Locally

Open two terminals in VS Code.

**Terminal 1 — Backend**
```bash
cd server
npm install
npm run dev
```

**Terminal 2 — Frontend**
```bash
cd client
npm install
npm run dev
```

Use the local URLs printed by the terminal. The frontend currently calls the backend at `http://localhost:5000` by default, unless `VITE_API_URL` is configured.

### Environment variables

Keep secrets in a local `.env` file in the server folder (and never commit it). The backend commonly needs values such as:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret
```

Use the exact variable names expected by your server code. If the frontend API URL is configured through an environment variable, the client may use:

```env
VITE_API_URL=http://localhost:5000
```

Do not put database credentials or JWT secrets in frontend environment variables. Make sure `.env` files are listed in `.gitignore`.

## 9. Notes for Development

- Start the backend and frontend in separate terminals.
- MongoDB Atlas must be reachable, and its network access list must allow your current IP.
- Use a MongoDB **database user** in the connection string, not your Atlas website login.
- Never share your JWT token, database password, or `.env` file publicly.
- Do not describe sample/demo data as real database data.
- Update this README when a planned feature is implemented and tested.

## Project Goal

The final goal is a working marketplace where clients can find and order services, workers can publish and manage gigs, and the app stores real users, gigs, and orders in MongoDB.
