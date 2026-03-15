# Contributing Guide

## Before Committing Changes

Run these checks locally before committing to ensure CI passes.

### Frontend

```bash
cd frontend

# 1. Lint check (required - CI will fail on errors)
npm run lint

# 2. Run tests
npm run test:run

# 3. Build check
npm run build
```

### Backend

```bash
cd backend

# 1. Lint check
npm run lint

# 2. Run tests
npm test

# 3. Build check
npm run build
```

## Quick Check Script

Run both in sequence:

```bash
cd frontend && npm run lint && npm run build && cd ../backend && npm run lint && npm run build
```

## Common Lint Issues

| Issue | Fix |
|-------|-----|
| Unused variable | Remove it or prefix with `_` |
| Unused import | Remove the import |
| Missing useEffect dependency | Add dependency or add `// eslint-disable-next-line react-hooks/exhaustive-deps` |
| Unescaped characters in JSX | Use HTML entities: `"` → `&quot;`, `'` → `&apos;` |

## NPM Registry

This project uses the public npm registry. The `.npmrc` files in frontend/backend ensure this.

If you see E401 authentication errors in CI, regenerate `package-lock.json`:

```bash
rm -rf node_modules package-lock.json
npm install --registry https://registry.npmjs.org/
```

## Git Workflow

1. Create feature branch from `main`
2. Make changes
3. Run lint + build checks locally
4. Commit with descriptive message
5. Push and create PR
6. Wait for CI to pass before merging
