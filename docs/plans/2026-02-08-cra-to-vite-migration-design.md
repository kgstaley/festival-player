# CRA to Vite Migration Design

**Date:** 2026-02-08
**Status:** Approved
**Migration Type:** Modern Best Practices

## Overview

Migrate the React client from Create React App (CRA) to Vite for modern, fast development tooling without deprecation warnings.

## Architecture Changes

### Directory Structure
- Move `client/public/index.html` → `client/index.html` (Vite convention)
- Keep `client/src/` unchanged (all React code stays in place)
- Public assets remain in `client/public/` but referenced differently
- Add `client/vite.config.ts` for build configuration

### Environment Variables
- Replace `%PUBLIC_URL%` template syntax with Vite's base URL handling (automatic `/` resolution)
- Convert any `REACT_APP_*` env vars to `VITE_*` prefix
- Remove `env.js` script approach (Vite has built-in env handling)

### Hot Module Replacement
- Replace webpack's `module.hot` API with Vite's `import.meta.hot`
- Maintain existing cleanup logic adapted to Vite's HMR interface
- Vite's HMR is faster and more reliable than webpack

### Dependencies to Remove
- `react-scripts` - entire CRA toolchain
- `eslint-config-react-app` - CRA-specific linting
- `web-vitals` and `reportWebVitals` - optional, can keep if actively used

### Dependencies to Add
- `vite` (~5.4.0) - the build tool
- `@vitejs/plugin-react` (~4.3.0) - React support for Vite
- `vitest` (~2.0.0) - Vite-native test runner (Jest-compatible API)
- `@vitest/ui` (~2.0.0) - Optional test UI
- `jsdom` (~24.0.0) - DOM testing environment

## Build Configuration

**Vite Configuration (`client/vite.config.ts`):**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: './client',
  publicDir: 'public',
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@mui/material', '@emotion/react', '@emotion/styled'],
        }
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler' // Uses Dart Sass, eliminates deprecation warnings
      }
    }
  }
})
```

**Key Configuration Features:**
- **Proxy setup** - Maintains `/api` proxy to backend at port 5000
- **SCSS support** - Modern Sass compiler (fixes Dart Sass deprecation warning)
- **Code splitting** - Separates React and UI libraries for optimal caching
- **Source maps** - Enabled for debugging
- **Path alias** - `@/` points to `src/` for cleaner imports

**Package.json Script Changes:**
```json
{
  "scripts": {
    "start": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

## HTML & Entry Point

**New `client/index.html`:**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Festival.me - Create Spotify playlists from your favorite artists" />
    <link rel="apple-touch-icon" href="/logo192.png" />
    <link rel="manifest" href="/manifest.json" />
    <title>Festival.me</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>
```

**Changes from CRA version:**
- Removed `%PUBLIC_URL%` - Vite resolves `/` paths to `public/` automatically
- Removed `env.js` script - Vite has built-in env variable support
- Added `type="module"` script tag pointing to entry file
- All public assets remain in `public/` directory

**Updated `client/src/index.tsx`:**

HMR API changes:
- `module.hot` → `import.meta.hot` (Vite's API)
- Remove TypeScript declaration for webpack module
- Maintain same cleanup logic with new API

```typescript
// Old webpack HMR
if (typeof module !== 'undefined' && module.hot) {
  module.hot.dispose(() => { /* ... */ })
}

// New Vite HMR
if (import.meta.hot) {
  import.meta.hot.dispose(() => { /* ... */ })
}
```

## Testing Configuration

**Vitest Configuration (`client/vitest.config.ts`):**

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
})
```

**Testing Changes:**
- Vitest is Jest-compatible (same API: `describe`, `it`, `expect`)
- Existing tests work with minimal changes
- Update imports if using Jest-specific features
- `@testing-library/react` works without changes

## Environment Variables

**Migration steps:**
1. If `.env` exists: Change `REACT_APP_*` → `VITE_*`
2. In code: `process.env.REACT_APP_FOO` → `import.meta.env.VITE_FOO`
3. Remove `client/public/env.js` (not needed with Vite)

**Vite env variables:**
- `import.meta.env.MODE` - 'development' | 'production'
- `import.meta.env.DEV` - boolean
- `import.meta.env.PROD` - boolean
- `import.meta.env.VITE_*` - custom variables

## ESLint Updates

Update ESLint to recognize Vite globals:

```javascript
{
  languageOptions: {
    globals: {
      'import.meta': 'readonly',
    }
  }
}
```

## Cleanup Tasks

Files to remove:
- `client/public/env.js` (if exists)
- `client/src/setupTests.ts` (if CRA-generated, recreate for Vitest)
- `client/src/react-app-env.d.ts` (if exists)

## Benefits

1. **Faster dev server** - Vite starts instantly vs CRA's 30+ seconds
2. **Faster HMR** - Near-instant hot reloads
3. **No deprecation warnings** - Modern tooling, actively maintained
4. **Smaller bundle sizes** - Better tree-shaking and code splitting
5. **Modern defaults** - ESM, native TypeScript support
6. **Better DX** - Clearer error messages, faster builds

## Migration Risks & Mitigations

**Risk:** Breaking changes in build output
- **Mitigation:** Test build output, verify all assets load correctly

**Risk:** Test failures due to API differences
- **Mitigation:** Vitest is Jest-compatible, minimal changes needed

**Risk:** Environment variable references break
- **Mitigation:** Search codebase for `process.env.REACT_APP_` and update

**Risk:** Custom webpack configurations lost
- **Mitigation:** Review any CRA customizations, port to Vite config

## Rollback Plan

If issues arise:
1. Revert commit
2. Run `yarn install` to restore `react-scripts`
3. Original CRA setup remains in git history

## Success Criteria

- ✅ Dev server starts without deprecation warnings
- ✅ Hot reload works correctly
- ✅ All tests pass with Vitest
- ✅ Production build succeeds
- ✅ Built app runs correctly (all routes, API calls work)
- ✅ No console errors in browser
- ✅ Build output size comparable or smaller than CRA
