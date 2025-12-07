# Hevy to Garmin FIT Converter

A Next.js application that converts Hevy CSV workout files to Garmin FIT format.

## Features

- Drag & drop CSV file upload
- Click-to-upload fallback
- Automatic download of converted FIT files
- Processes the last activity from the CSV file

## Development

### Prerequisites

- Node.js 20 or higher
- npm

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Docker

### Prerequisites for Fast Builds

Enable BuildKit for faster builds with cache mounts:

```bash
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
```

Or add to your `~/.bashrc` or `~/.zshrc`:
```bash
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
```

### Quick Start

**Option 1: Use the build script (recommended)**
```bash
./docker-build.sh
docker-compose up
```

**Option 2: Manual build**
```bash
docker-compose up --build
```

The application will be available at `http://localhost:3000`

### Build Performance

- **First build:** 2-5 minutes (downloads dependencies)
- **Subsequent builds:** 30-90 seconds (with BuildKit cache)
- **If builds take >10 minutes:** See [DOCKER-TROUBLESHOOTING.md](DOCKER-TROUBLESHOOTING.md)

**Important:** Make sure Docker has sufficient resources allocated (at least 4GB RAM, 4 CPU cores). Check Docker Desktop → Settings → Resources.

### Build Docker Image

```bash
docker build -t hevy-garmin-converter .
```

### Run Docker Container

```bash
docker run -p 3000:3000 hevy-garmin-converter
```

## Usage

1. Upload a Hevy CSV export file
2. The application will automatically convert the last activity to FIT format
3. The FIT file will be downloaded automatically

## Project Structure

- `app/` - Next.js app directory with pages and API routes
- `components/` - React components
- `lib/` - Core conversion logic (CSV parsing, FIT conversion)
- `types/` - TypeScript type definitions

## License

ISC

# HevyConnect
