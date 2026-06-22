# Job Tracker Fullstack

A fullstack job application tracker built with React, FastAPI, PostgreSQL, SQLAlchemy and Docker.

The application allows users to create, manage, filter and organize job applications through a modern frontend connected to a REST API backend.

## Live Demo

Frontend:
```text
https://job-tracker-fullstack-three.vercel.app
```

Backend API:
```text
https://job-tracker-fullstack-z6cy.onrender.com
```

Swagger Documentation:
```text
https://job-tracker-fullstack-z6cy.onrender.com/docs
```

## What I Learned

Through this project I practiced:

- Building a fullstack application with React and FastAPI
- Connecting a React frontend to a REST API
- Using fetch and asynchronous API calls
- Structuring a React application using reusable components
- Managing state with React hooks
- Creating CRUD operations between frontend and backend
- Migrating a backend from SQLite to PostgreSQL
- Using SQLAlchemy ORM for database operations
- Creating relational database models
- Building and consuming REST API endpoints
- Using Pydantic models for request validation
- Working with CORS middleware
- Organizing frontend services for API communication
- Managing environment variables
- Creating responsive user interfaces with CSS
- Implementing filtering, sorting and search functionality
- Using localStorage to persist frontend preferences
- Improving frontend UX with conditional rendering and validations
- Structuring a fullstack project architecture
- Deploying a PostgreSQL-based fullstack application
- Containerizing applications with Docker
- Using Docker Compose to orchestrate multiple services
- Running React, FastAPI and PostgreSQL in containers
- Managing persistent database volumes with Docker

## Features

- Create, edit and delete job applications
- PostgreSQL database persistence
- SQLAlchemy ORM integration
- React frontend connected to FastAPI backend
- Filter applications by status
- Search applications by company or position
- Sort applications by date, status or company
- Dashboard statistics
- Responsive UI
- Status badges with different colors
- Form validation
- Local storage preferences
- Automatic FastAPI Swagger documentation

## Technologies Used

### Frontend

- React
- JavaScript
- CSS
- Vite

### Backend

- Python
- FastAPI
- PostgreSQL
- SQLAlchemy
- Pydantic
- Uvicorn

### DevOps

- Docker
- Docker Compose

## Project Evolution

### Initial Version
- FastAPI backend with SQLite
- Basic CRUD operations
- React frontend connected to a REST API

### Current Version
- Migrated database from SQLite to PostgreSQL
- Replaced raw SQL queries with SQLAlchemy ORM
- Improved backend architecture and scalability
- Deployed PostgreSQL-based backend on Render
- Dockerized frontend, backend and PostgreSQL
- Added Docker Compose for local development

## How to Run

### Backend

Create and activate a virtual environment:

```bash
python -m venv .venv
source .venv/Scripts/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the backend folder:

```env
DATABASE_URL=your_postgresql_database_url
```

Run the backend server:

```bash
uvicorn main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

### Frontend

Install dependencies:

```bash
npm install
```

Run the frontend server:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```
## Run with Docker

### Configure environment variables

Create a `.env` file inside the `backend` folder from the example file.

**Windows PowerShell:**

```powershell
Copy-Item backend/.env.example backend/.env
```

**Linux/macOS:**

```bash
cp backend/.env.example backend/.env
```


Build and start all services:

```bash
docker compose up --build
```

Stop services:

```bash
docker compose down
```

Services:

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs

The application runs with:

- React frontend
- FastAPI backend
- PostgreSQL database

All services are orchestrated with Docker Compose.

## API Endpoints

### Get all applications

```text
GET /applications
```

### Create application

```text
POST /applications
```

Example body:

```json
{
  "company": "Google",
  "position": "Backend Developer",
  "status": "Applied",
  "date_applied": "2026-05-21"
}
```

### Update application

```text
PUT /applications/{id}
```

### Delete application

```text
DELETE /applications/{id}
```

## Screenshots

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Filters and Search

![Filters](screenshots/filters.png)

### Edit Application

![Edit Application](screenshots/edit.png)