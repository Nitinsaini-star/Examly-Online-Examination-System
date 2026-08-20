# Examly Online Examination System

Examly is a full-stack online examination platform for creating, taking, and tracking timed assessments. Students can browse exams, sign up or sign in, complete timed quizzes, and receive immediate scores. Administrators can sign in to view exam, student, and submission statistics.

## Features

- Responsive examination interface with light and dark themes
- Curated exams with filtering by popularity and newness
- Timed multiple-choice assessments with question navigation
- Instant scoring and result breakdowns
- Student registration and JWT-based authentication
- Separate student and administrator workspaces
- MongoDB persistence for users, exams, and submissions
- Admin statistics for exams, students, and submissions
- Local demo exams remain available when the API is unavailable

## Technology

- Frontend: HTML, CSS, and vanilla JavaScript
- Backend: Node.js and Express
- Database: MongoDB with Mongoose
- Authentication: bcryptjs and JSON Web Tokens

## Requirements

- Node.js 18 or newer
- MongoDB running locally or a MongoDB connection string

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file from the example:

   ```bash
   copy .env.example .env
   ```

   On macOS or Linux, use `cp .env.example .env` instead.

3. Update `MONGODB_URI` and `JWT_SECRET` in `.env`. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` for the administrator account.

4. Seed the database with sample exams and the admin account:

   ```bash
   npm run seed
   ```

5. Start the application:

   ```bash
   npm start
   ```

6. Open [http://localhost:3000](http://localhost:3000) in a browser.

For development with automatic server restarts, use `npm run dev`.

## Environment Variables

| Variable | Description |
| --- | --- |
| `PORT` | Port used by the Express server, default `3000` |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign authentication tokens |
| `ADMIN_EMAIL` | Email for the seeded admin account |
| `ADMIN_PASSWORD` | Password for the seeded admin account |

## API Overview

- `GET /api/health` - Check API and database status
- `GET /api/exams` - List available exams
- `POST /api/auth/register` - Register a student account
- `POST /api/auth/login` - Sign in as a student or admin
- `POST /api/submissions` - Submit a student exam attempt
- `GET /api/admin/stats` - View admin statistics

## Project Structure

```text
backend/server.js       Express API and static file server
database/models.js      Mongoose models
database/seed.js        Sample data and admin seeding
frontend/index.html     Application markup
frontend/app.js         Exam, authentication, and dashboard logic
frontend/styles.css     Responsive application styles
```
