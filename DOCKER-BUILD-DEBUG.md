# Docker Build Debugging Guide

If your Docker build seems stuck, follow these steps:

## Quick Diagnosis

1. **Check where it's stuck:**
   ```bash
   DOCKER_BUILDKIT=1 docker build --progress=plain -t hevyconnect-test -f Dockerfile.fast . 2>&1 | tee build.log
   ```
   Then check `build.log` to see the last step.

2. **Common hang points:**
   - **During `npm ci`**: Usually means network issues or npm cache problems
   - **During `npm run build`**: Usually means insufficient memory or Next.js build hanging

## Solutions

### If stuck on `npm ci`:
```bash
# Clear npm cache in Docker
docker builder prune -a
# Rebuild
DOCKER_BUILDKIT=1 docker-compose build --no-cache
```

### If stuck on `npm run build`:

**Option 1: Increase Docker resources**
- Docker Desktop → Settings → Resources
- Increase Memory to at least 4GB
- Increase CPU cores to at least 4
- Restart Docker

**Option 2: Build locally first, then copy**
```bash
# Build locally
npm run build

# Then modify Dockerfile to skip build step (copy .next instead)
```

**Option 3: Use the standard Dockerfile**
```bash
# Edit docker-compose.yml to use Dockerfile instead of Dockerfile.fast
docker-compose build
```

**Option 4: Check for infinite loops**
- Look for any `tee` or `head` commands in Dockerfile that might cause hangs
- Simplify RUN commands to just `npm run build`

### If build completes but container won't start:

Check if `server.js` exists:
```bash
docker run --rm hevyconnect-test ls -la /app/server.js
```

If missing, check if `.next/standalone` was created:
```bash
docker run --rm hevyconnect-test ls -la /app/.next/standalone
```

## Expected Build Times

- **npm ci**: 10-30 seconds (with cache)
- **npm run build**: 1-3 minutes (with cache)
- **Total**: 2-5 minutes first time, 30-90 seconds subsequent builds

## If Still Stuck

1. Check Docker logs: `docker-compose logs`
2. Check system resources: `docker stats`
3. Try building without cache: `docker-compose build --no-cache`
4. Check Next.js config for any issues: `next.config.js`

