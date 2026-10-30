# GiGHire – Freelance & Local Services Marketplace

GiGHire is a MERN stack-based gig marketplace that connects clients with skilled workers and freelancers. Clients can explore services, book gigs, and manage their bookings, while workers can publish services, manage their profiles, and handle booking requests.

## Features

### Authentication

- User registration and login.
- Separate Client and Worker roles.
- JWT-based authentication and protected routes.
- Secure password hashing using bcrypt.
- Forgot password functionality with email OTP verification.

### Client Features

- Browse and search available gigs.
- View detailed gig information.
- Book services with a custom message.
- Track booking status.
- View worker contact details after booking acceptance or completion.

### Worker Features

- Create and manage gigs.
- Delete existing gigs.
- Manage worker profile information.
- View incoming booking requests.
- Accept or reject booking requests.
- Mark accepted bookings as completed.

### Booking Management

- Booking status management:
  - Pending
  - Accepted
  - Rejected
  - Completed
  - Cancelled
- Client and worker booking dashboards.
- Booking information stored in MongoDB.

## Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- JavaScript

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Nodemailer

## Project Structure

```text
Gig_Hire/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── ...
│   └── package.json
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/HiteshSharma47/GiG-Hire.git
cd Gig_Hire
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file inside the server folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password

CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

### 3. Setup Frontend

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the client folder:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The application will be available at:

http://localhost:5173

## Environment Variables

Never commit `.env` files, database credentials, email app passwords, or JWT secrets to GitHub.

Make sure both frontend and backend `.env` files are included in `.gitignore`.

## Future Improvements

- Online payment integration.
- Reviews and ratings.
- Real-time chat between clients and workers.
- Advanced filtering and location-based search.
- Admin dashboard.
- Notifications and booking reminders.

## Project Status

Core application functionality has been implemented and tested locally.

Production deployment and final live testing are pending.

## Author

Developed as a MERN Stack Web Development Project.