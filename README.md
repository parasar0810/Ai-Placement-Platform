# AI-Powered Placement Preparation Platform

A comprehensive platform for students to prepare for campus placements, featuring AI-driven resume analysis and DSA tracking.

## Technology Stack
- **Backend**: Spring Boot 3.2, Java 17, Spring Security, JPA, PostgreSQL
- **Frontend**: React 18, TypeScript, TailwindCSS, Vite
- **Database**: PostgreSQL 15
- **Infrastructure**: Docker, Docker Compose

## Project Structure
- `backend/`: Spring Boot Application (API)
- `frontend/`: React Application (UI)
- `db/`: Database migrations (planned)
- `docker/`: Docker Compose configuration

## Setup & Running

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local frontend dev)
- Java 17+ (optional, can run via Docker)

### 1. Start Services (Database & Backend)
We provided a Docker Compose setup that runs PostgreSQL and the Backend (using a Maven container).

```bash
cd docker
docker compose up -d
```
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
- **Frontend**: http://localhost:5173

## API Endpoints (Auth)
- `POST /api/v1/auth/register` - { email, password, fullName }
- `POST /api/v1/auth/login` - { email, password }
