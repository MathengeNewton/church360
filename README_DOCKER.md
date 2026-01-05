# Docker Setup Guide

This guide explains how to run the entire Church360 application using Docker Compose.

## Prerequisites

- Docker and Docker Compose installed
- Ports available: 5400, 3001, 3002, 5455, 80, 443

## Quick Start

From the root of the project, run:

```bash
docker compose up -d
```

This will start all services:
- **Database** (PostgreSQL) on port `5455`
- **Backend API** on port `5400`
- **Welfare Frontend** on port `3001`
- **Church Frontend** on port `3002`
- **Nginx Proxy** on ports `80` and `443`

## Services

### Backend API
- **URL**: http://localhost:5400
- **API Docs**: http://localhost:5400/api/docs
- **Container**: `church360-backend`

### Welfare Frontend
- **URL**: http://localhost:3001
- **Container**: `welfare-frontend-app`

### Church Frontend
- **URL**: http://localhost:3002
- **Container**: `church-frontend-app`

### Database
- **Host**: localhost
- **Port**: 5455
- **User**: church
- **Password**: church_pass
- **Database**: church360

## Environment Variables

The backend uses environment variables from `.env.docker` file. Make sure this file exists in the `backend/` directory with the following:

```env
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_USER=church
DATABASE_PASSWORD=church_pass
DATABASE_NAME=church360
PORT=3000
```

## Building and Starting

### Build all services:
```bash
docker compose build
```

### Start all services:
```bash
docker compose up -d
```

### View logs:
```bash
docker compose logs -f
```

### View logs for specific service:
```bash
docker compose logs -f backend
docker compose logs -f welfare-frontend
docker compose logs -f church-frontend
```

### Stop all services:
```bash
docker compose down
```

### Stop and remove volumes (clears database):
```bash
docker compose down -v
```

## Troubleshooting

### Backend not connecting to database
- Wait a few seconds for the database to initialize
- Check logs: `docker compose logs backend`
- Verify database is running: `docker compose ps`

### Frontend not loading
- Check if the build completed successfully
- View logs: `docker compose logs welfare-frontend` or `docker compose logs church-frontend`
- Rebuild: `docker compose build --no-cache welfare-frontend`

### Port already in use
- Stop any services using the ports (5400, 3001, 3002, 5455)
- Or modify port mappings in `docker-compose.yml`

## Development

For development, you may want to run services individually:

```bash
# Start only database
docker compose up -d db

# Start only backend
docker compose up -d backend

# Run frontends locally (outside Docker)
cd welfare-frontend && npm run dev
cd church-frontend && npm run dev
```

## Production Notes

- Update environment variables in `docker-compose.yml` for production
- Use proper secrets management
- Configure SSL certificates for nginx proxy
- Set up proper domain names in nginx.conf
- Enable HTTPS on ports 443


