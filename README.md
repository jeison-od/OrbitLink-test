# Fullstack Application Setup

This guide will help you set up and run a fullstack application consisting of an Express API and a Next.js web application. Follow these steps to install, build, and run the applications using Docker and Docker Compose.

## Prerequisites
- Node.js >= 14
- npm >= 6
- Docker >= 20.10
- Docker Compose >= 1.29

## Project Structure
```
/ (root)
  ├── api       # Express API (TypeScript)
  └── webapp    # Next.js web application
```

## Installation
Clone the repository and install the dependencies for both the `api` and `webapp` projects.

### API Setup
```bash
cd api
npm install
```

### Webapp Setup
```bash
cd webapp
npm install
```

## Running the Applications
### API (Express)
To start the API server, run:
```bash
cd api
npm start
```
This will start the API at `http://localhost:3001`.

### Webapp (Next.js)
To start the web application, run:
```bash
cd webapp
npm run dev
```
This will start the webapp at `http://localhost:3000`.

## Example API Request
You can test the API using `curl`:
```bash
curl -X POST http://localhost:3001/bookings \
  -H "Content-Type: application/json" \
  -d '{"meetingName":"Test Meeting","startTime":"2025-02-13","endTime":"2025-02-22"}'
```

### Running the Applications with Docker Compose
To build and start the services, run the following command in the root directory:
```bash
docker-compose up -d
```
This will start both the API and the webapp:
- API: `http://localhost:3001`
- Webapp: `http://localhost:3000`

### Useful Docker Commands
#### Build the Docker images manually:
```bash
docker build -t api ./api
docker build -t webapp ./webapp
```
#### Run the containers without Docker Compose:
```bash
docker run -p 3001:3001 api
docker run -p 3000:3000 webapp
```
#### Stop all running containers:
```bash
docker-compose down
```
#### View logs for both services:
```bash
docker-compose logs -f
```

