# Docker Build Troubleshooting

If your Docker build is taking too long (>5 minutes) or getting stuck, try these solutions:

## 1. Enable BuildKit

Make sure BuildKit is enabled:

```bash
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
```

Or add to your `~/.bashrc` or `~/.zshrc`:
```bash
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
```

## 2. Increase Docker Resources

**Docker Desktop (Mac/Windows):**
- Open Docker Desktop → Settings → Resources
- Increase CPU cores (at least 4 recommended)
- Increase Memory (at least 4GB recommended)
- Increase Swap (at least 2GB recommended)
- Click "Apply & Restart"

## 3. Use the Build Script

Use the provided build script which enables BuildKit automatically:

```bash
./docker-build.sh
```

## 4. Build with Progress Output

To see what's happening during the build:

```bash
DOCKER_BUILDKIT=1 docker build --progress=plain -t hevyconnect .
```

Or with docker-compose:
```bash
DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 docker-compose build --progress=plain
```

## 5. Clear Docker Cache

If builds are consistently slow, try clearing the cache:

```bash
docker builder prune -a
docker system prune -a
```

Then rebuild:
```bash
docker-compose build --no-cache
```

## 6. Check Build Logs

If the build fails or hangs, check the logs:

```bash
docker-compose build 2>&1 | tee build.log
```

## 7. Alternative: Build Locally Then Copy

If Docker builds are consistently problematic, you can build locally and copy:

1. Build locally: `npm run build`
2. Modify Dockerfile to skip the build step and copy `.next` directory
3. Or use a multi-stage build that copies pre-built files

## 8. Verify BuildKit is Working

Check if BuildKit cache mounts are working:

```bash
DOCKER_BUILDKIT=1 docker build --progress=plain . 2>&1 | grep -i cache
```

You should see cache mount messages.

## Expected Build Times

- **First build (no cache):** 2-5 minutes
- **Subsequent builds (with cache):** 30-90 seconds
- **If taking >10 minutes:** Something is wrong, check resources/logs

## Common Issues

### Build hangs on "Creating an optimized production build"
- **Cause:** Insufficient Docker resources or BuildKit not enabled
- **Solution:** Increase Docker resources, enable BuildKit, check logs

### Build fails with "out of memory"
- **Cause:** Not enough memory allocated to Docker
- **Solution:** Increase Docker memory allocation (Settings → Resources)

### Cache not working
- **Cause:** BuildKit not enabled or cache mounts not supported
- **Solution:** Enable BuildKit, update Docker to latest version

