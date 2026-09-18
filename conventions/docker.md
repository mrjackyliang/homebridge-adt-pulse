# Docker Conventions

Base images: pinned tags. Instructions: one logical step per `RUN`. File naming: kebab-case (e.g., `api-gateway.Dockerfile`).

## Documentation Style

Box-style `####` banners with padded titles:

```dockerfile
############################
#### Step 1: Base Image ####
############################
```

## Code Style

### Pin Base Image Tags

Always use specific version tags. Never use `latest` or bare image names.

```dockerfile
# BAD — unpinned
FROM node
FROM node:latest

# GOOD — pinned to specific version
FROM node:22.14.0-alpine
FROM postgres:17.4-alpine
```

### Multi-Stage Builds

Use named stages. Keep the final image minimal — copy only what's needed from build stages.

```dockerfile
# GOOD — named stages, minimal final image
FROM node:22.14.0-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22.14.0-alpine AS runtime
WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./
RUN npm ci --omit=dev
USER node
EXPOSE 3000
CMD ["node", "build/index.js"]
```

### Layer Caching Order

Order instructions from least-changing to most-changing. Copy dependency manifests before source files so dependency layers cache independently.

```dockerfile
# BAD — source copy before dependency install
COPY . .
RUN npm ci

# GOOD — dependency files first, then source
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
```

### HEALTHCHECK Directive

Always include a `HEALTHCHECK` instruction for services that accept connections.

```dockerfile
# GOOD — explicit health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["wget", "--spider", "--quiet", "http://localhost:3000/health"]
```

### Non-Root User

Always switch to a non-root user before `CMD`/`ENTRYPOINT`. Create the user if the base image doesn't provide one.

```dockerfile
# GOOD — official Node image includes "node" user
USER node

# GOOD — create user when base image has none
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser
```

### .dockerignore

Always maintain a `.dockerignore` alongside the Dockerfile. At minimum, exclude version control, dependencies, build output, and environment files.

```
.git
node_modules
build
dist
.env
.env.*
*.log
```

### RUN Instruction Style

Combine related commands in a single `RUN` with `&&`. Each logical step (install, configure, build) gets its own `RUN`. Clean up caches in the same layer they're created.

```dockerfile
# BAD — separate layers for related commands
RUN apt-get update
RUN apt-get install -y curl
RUN rm -rf /var/lib/apt/lists/*

# GOOD — combined, cleanup in same layer
RUN apt-get update \
  && apt-get install -y --no-install-recommends curl \
  && rm -rf /var/lib/apt/lists/*
```

### Comment Placement

Comments describe the process/intent. Placement rules:
- Comment sits above the instruction it describes.
- Blank line before the comment (except at the start of a stage).
- No trailing comments (same-line comments after instructions).

### No Stacked Comments

One descriptive comment per instruction block. No consecutive comments without instructions between them.
