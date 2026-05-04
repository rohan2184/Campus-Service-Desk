# Campus Service Desk

A full-stack campus helpdesk application for students, staff, and administrators. The system lets students raise service tickets, staff manage assigned work, and admins oversee approvals, users, analytics, FAQs, and ticket operations.

## Features

- Role-based authentication for students, staff, and admins
- Ticket creation, approval, assignment, status tracking, comments, and feedback
- Kanban-style ticket workflow for operational tracking
- Admin dashboard with analytics, ticket stats, category breakdowns, and staff performance
- User management for role changes and account activation
- Real-time notifications with Socket.IO
- FAQ management for admins
- Optional email notifications through SMTP
- Large local seed dataset for development and demo testing

## Tech Stack

**Frontend**

- React 19
- Vite
- React Router
- Tailwind CSS
- Axios
- Socket.IO Client
- Recharts
- dnd-kit
- lucide-react

**Backend**

- Node.js
- Express
- MongoDB
- Mongoose
- JWT authentication
- bcrypt password hashing
- Socket.IO
- Nodemailer
- Multer

## Project Structure

```text
.
|-- client/              # React + Vite frontend
|   |-- src/
|   |   |-- components/  # Shared UI components
|   |   |-- context/     # Auth, ticket, notification, theme, and toast state
|   |   |-- layouts/     # Dashboard layout
|   |   `-- pages/       # Auth, dashboards, tickets, admin, FAQ, profile
|   `-- package.json
|-- server/              # Express + MongoDB backend
|   |-- config/          # Database connection
|   |-- controllers/     # Route controllers
|   |-- middleware/      # Auth, admin, upload middleware
|   |-- models/          # Mongoose schemas
|   |-- routes/          # API routes
|   |-- utils/           # Email utilities
|   |-- seed.js          # Development/demo database seed script
|   `-- package.json
|-- package.json         # Root scripts for running both apps
`-- README.md
```

## Database

The backend uses MongoDB through Mongoose.

Default local connection:

```text
mongodb://127.0.0.1:27017/campus-service-desk
```

Main collections:

- `users`
- `tickets`
- `notifications`
- `faqs`

Core ticket statuses:

- `Approval`
- `Open`
- `In Progress`
- `Completed`
- `Review`
- `Closed`

## Prerequisites

- Node.js
- npm
- MongoDB running locally, or a MongoDB connection URI

## Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/campus-service-desk
JWT_SECRET=replace_with_a_secure_secret

# Optional email notifications
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
FROM_EMAIL=noreply@campusdesk.com
```

Create `client/.env` or use the provided `client/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Installation

Install all dependencies from the project root:

```bash
npm run install:all
```

Or install each area manually:

```bash
npm install
npm install --prefix server
npm install --prefix client
```

## Running the App

Start both frontend and backend in development mode:

```bash
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`
- Socket server: `http://localhost:5000`

Run only the backend:

```bash
npm run server:dev
```

Run only the frontend:

```bash
npm run client:dev
```

## Seed Data

The project includes a large development dataset with varied users, ticket histories, comments, notifications, FAQs, and role-specific demo accounts.

Run the seed script:

```bash
npm run seed --prefix server
```

Important: this clears and repopulates these collections:

- `users`
- `tickets`
- `notifications`
- `faqs`

Seeded demo login accounts:

| Role | Email | Password |
| --- | --- | --- |
| Student | `students@csd.edu` | `password123` |
| Staff | `staff@csd.edu` | `password123` |
| Admin | `admin@csd.edu` | `password123` |

Current seed size:

- 200 users
- 650 tickets
- 643 notifications
- 18 FAQs

## API Overview

Base URL:

```text
http://localhost:5000/api
```

Auth routes:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/contact`
- `GET /auth/me`

Ticket routes:

- `GET /tickets`
- `POST /tickets`
- `GET /tickets/my-tickets`
- `GET /tickets/:id`
- `PUT /tickets/:id`
- `DELETE /tickets/:id`
- `POST /tickets/:id/comments`
- `POST /tickets/:id/feedback`

User routes:

- `GET /users`
- `GET /users/staff`
- `PUT /users/profile`
- `PUT /users/change-password`
- `PUT /users/:id/role`
- `PUT /users/:id/status`

Other routes:

- `GET /notifications`
- `PUT /notifications/read-all`
- `PUT /notifications/:id/read`
- `GET /analytics`
- `GET /faqs`
- `POST /faqs`
- `PUT /faqs/:id`
- `DELETE /faqs/:id`

Most routes require a JWT bearer token returned from login.

## Build

Build the frontend:

```bash
npm run build:client
```

Preview the built frontend:

```bash
npm run client
```

Start the backend in production mode:

```bash
npm run server
```

## Development Notes

- New student-created tickets begin in `Approval`.
- Admins can approve, assign, and manage users.
- Staff can update assigned ticket progress and comment on tickets.
- Requesters can submit feedback when tickets reach `Review`.
- Socket.IO is used for real-time notification updates.
- Email notification settings are optional; leaving SMTP credentials blank disables practical email delivery.
