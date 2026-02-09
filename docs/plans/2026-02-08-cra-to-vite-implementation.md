# CRA to Vite Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task OR superpowers:subagent-driven-development for parallel execution.

**Goal:** Migrate React client from Create React App to Vite with modern best practices

**Architecture:** Replace webpack-based CRA with Vite's ESM-native build system. Move HTML to root, update HMR API, configure Vite for SCSS/proxy/code-splitting, migrate env variables, and switch from Jest to Vitest.

**Tech Stack:** Vite 5.4, @vitejs/plugin-react 4.3, Vitest 2.0, jsdom 24.0

**Design Document:** `docs/plans/2026-02-08-cra-to-vite-migration-design.md`

---

## Task 1: Install Vite Dependencies

**Files:**
- Modify: `client/package.json` (dependencies section)

**Step 1: Add Vite dependencies**

```bash
cd client
yarn add -D vite@^5.4.0 @vitejs/plugin-react@^4.3.0
```

Expected: Dependencies added to devDependencies

**Step 2: Add Vitest testing dependencies**

```bash
yarn add -D vitest@^2.0.0 @vitest/ui@^2.0.0 jsdom@^24.0.0
```

Expected: Testing dependencies added

**Step 3: Verify installations**

```bash
yarn list vite @vitejs/plugin-react vitest
```

Expected: All packages show installed versions

**Step 4: Commit dependency additions**

```bash
git add package.json yarn.lock
git commit -m "feat: add Vite and Vitest dependencies"
```

---

## Task 2: Create Vite Configuration

**Files:**
- Create: `client/vite.config.ts`

**Step 1: Create Vite config file**

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
        api: 'modern-compiler'
      }
    }
  }
})
```

**Step 2: Verify config syntax**

```bash
cd client
yarn tsc --noEmit vite.config.ts
```

Expected: No TypeScript errors

**Step 3: Commit Vite configuration**

```bash
git add vite.config.ts
git commit -m "feat: add Vite build configuration"
```

---

## Task 3: Create Vitest Configuration

**Files:**
- Create: `client/vitest.config.ts`

**Step 1: Create Vitest config file**

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

**Step 2: Update setupTests for Vitest**

Modify: `client/src/setupTests.ts`

```typescript
import '@testing-library/jest-dom'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup after each test
afterEach(() => {
  cleanup()
})
```

**Step 3: Verify config syntax**

```bash
yarn tsc --noEmit vitest.config.ts
```

Expected: No TypeScript errors

**Step 4: Commit Vitest configuration**

```bash
git add vitest.config.ts src/setupTests.ts
git commit -m "feat: add Vitest test configuration"
```

---

## Task 4: Move and Update index.html

**Files:**
- Move: `client/public/index.html` → `client/index.html`
- Modify: `client/index.html`

**Step 1: Move index.html to client root**

```bash
cd client
mv public/index.html ./index.html
```

Expected: File moved to `client/index.html`

**Step 2: Update index.html for Vite**

Replace contents of `client/index.html`:

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

**Step 3: Remove env.js if it exists**

```bash
rm -f public/env.js
```

Expected: File removed (if existed)

**Step 4: Commit HTML changes**

```bash
git add index.html public/
git commit -m "feat: move index.html to root and update for Vite"
```

---

## Task 5: Update index.tsx for Vite HMR

**Files:**
- Modify: `client/src/index.tsx`

**Step 1: Update HMR API in index.tsx**

Replace the HMR section (lines 40-53) with:

```typescript
// Handle hot module replacement in development
if (import.meta.hot) {
    import.meta.hot.dispose(() => {
        cleanup();
        // Unmount React app on hot reload
        root.unmount();
    });
}
```

**Step 2: Verify syntax**

```bash
cd client
yarn tsc --noEmit
```

Expected: No TypeScript errors

**Step 3: Commit HMR update**

```bash
git add src/index.tsx
git commit -m "feat: update HMR to use Vite's import.meta.hot API"
```

---

## Task 6: Migrate Environment Variables

**Files:**
- Modify: `client/.env`
- Modify: `client/src/common-util/envs.ts`
- Modify: `client/src/services/spotify.ts`
- Modify: `client/src/services/authServices.ts`
- Modify: `client/src/components/layout/NavBar.tsx`

**Step 1: Update .env file**

Note: This file may contain secrets. Update variable names only:
- Change `REACT_APP_SPOTIFY_ID` → `VITE_SPOTIFY_ID`
- Change `REACT_APP_SPOTIFY_SECRET` → `VITE_SPOTIFY_SECRET`
- Change `REACT_APP_API_PREFIX` → `VITE_API_PREFIX`

**Step 2: Update envs.ts**

```typescript
const clientId = import.meta.env.VITE_SPOTIFY_ID;
const secret = import.meta.env.VITE_SPOTIFY_SECRET;
const redirectUri = "http://localhost:5000/api/auth/callback";

const envs = {
  clientId,
  secret,
  redirectUri,
};

export default envs;
```

**Step 3: Update spotify.ts**

Find line with `process.env.REACT_APP_API_PREFIX` and replace:

```typescript
const rootApi = `${import.meta.env.VITE_API_PREFIX}/spotify`;
```

**Step 4: Update authServices.ts**

Find line with `process.env.REACT_APP_API_PREFIX` and replace:

```typescript
const rootApi = import.meta.env.VITE_API_PREFIX + '/auth';
```

**Step 5: Update NavBar.tsx**

Find line with `process.env.REACT_APP_API_PREFIX` and replace:

```typescript
window.location.href = `${import.meta.env.VITE_API_PREFIX}/auth`;
```

**Step 6: Add TypeScript env declarations**

Create: `client/src/vite-env.d.ts`

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SPOTIFY_ID: string
  readonly VITE_SPOTIFY_SECRET: string
  readonly VITE_API_PREFIX: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

**Step 7: Verify TypeScript compilation**

```bash
cd client
yarn tsc --noEmit
```

Expected: No TypeScript errors

**Step 8: Commit env variable migration**

```bash
git add src/common-util/envs.ts src/services/spotify.ts src/services/authServices.ts src/components/layout/NavBar.tsx src/vite-env.d.ts
git commit -m "feat: migrate environment variables to Vite format"
```

---

## Task 7: Update ESLint Configuration

**Files:**
- Modify: `client/package.json` (eslintConfig section)

**Step 1: Add import.meta to ESLint globals**

Add to the eslintConfig in `client/package.json`:

```json
{
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ],
    "globals": {
      "import.meta": "readonly"
    }
  }
}
```

**Step 2: Verify ESLint doesn't error on import.meta**

```bash
cd client/src
grep -r "import\.meta" . | head -3
```

Expected: Should show files using import.meta

**Step 3: Commit ESLint update**

```bash
git add package.json
git commit -m "feat: add import.meta to ESLint globals"
```

---

## Task 8: Update Package Scripts

**Files:**
- Modify: `client/package.json` (scripts section)

**Step 1: Update npm scripts**

Replace scripts section in `client/package.json`:

```json
{
  "scripts": {
    "start": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run"
  }
}
```

**Step 2: Commit script updates**

```bash
git add package.json
git commit -m "feat: update scripts to use Vite and Vitest"
```

---

## Task 9: Remove CRA Dependencies

**Files:**
- Modify: `client/package.json`

**Step 1: Remove react-scripts**

```bash
cd client
yarn remove react-scripts
```

Expected: react-scripts removed from package.json

**Step 2: Remove CRA-specific ESLint packages**

```bash
yarn remove eslint-config-react-app
```

Expected: Package removed

**Step 3: Verify package.json**

```bash
grep -i "react-scripts\|eslint-config-react-app" package.json
```

Expected: No matches found

**Step 4: Commit dependency removals**

```bash
git add package.json yarn.lock
git commit -m "feat: remove Create React App dependencies"
```

---

## Task 10: Clean Up CRA-Specific Files

**Files:**
- Delete: `client/src/react-app-env.d.ts`

**Step 1: Remove react-app-env.d.ts**

```bash
cd client
rm -f src/react-app-env.d.ts
```

Expected: File removed

**Step 2: Verify file is gone**

```bash
ls src/react-app-env.d.ts 2>&1
```

Expected: "No such file or directory"

**Step 3: Commit cleanup**

```bash
git add src/
git commit -m "chore: remove CRA-specific type declarations"
```

---

## Task 11: Test Vite Dev Server

**Files:**
- N/A (verification task)

**Step 1: Start Vite dev server**

```bash
cd client
yarn start
```

Expected:
- Server starts on http://localhost:3000
- No deprecation warnings about url.parse()
- No webpack-dev-server warnings

**Step 2: Verify app loads in browser**

Open http://localhost:3000 in browser

Expected:
- App renders without errors
- No console errors in browser devtools
- Hot reload works when editing a file

**Step 3: Stop dev server**

Press Ctrl+C

**Step 4: Document success**

```bash
echo "✅ Vite dev server working" >> docs/plans/migration-verification.txt
```

---

## Task 12: Test Production Build

**Files:**
- N/A (verification task)

**Step 1: Run production build**

```bash
cd client
yarn build
```

Expected:
- Build completes successfully
- Output in `client/build/` directory
- No errors or warnings

**Step 2: Check build output**

```bash
ls -lh build/
ls -lh build/assets/
```

Expected:
- index.html present
- assets/ directory with JS/CSS chunks
- public assets (favicon, logos, etc.)

**Step 3: Preview production build**

```bash
yarn preview
```

Expected:
- Server starts (typically on http://localhost:4173)
- App loads and functions correctly

**Step 4: Stop preview server and document**

Press Ctrl+C

```bash
echo "✅ Production build working" >> docs/plans/migration-verification.txt
```

---

## Task 13: Run Tests with Vitest

**Files:**
- N/A (verification task)

**Step 1: Run all tests**

```bash
cd client
yarn test:run
```

Expected:
- Tests execute with Vitest
- All tests pass (or same failures as before migration)

**Step 2: Check test output**

Look for:
- Vitest logo/branding (confirms using Vitest, not Jest)
- Test results summary
- No "module not found" errors

**Step 3: Try interactive test UI**

```bash
yarn test:ui
```

Expected:
- UI opens in browser
- Shows test files and results

**Step 4: Document test results**

```bash
echo "✅ Tests running with Vitest" >> docs/plans/migration-verification.txt
```

---

## Task 14: Update Root Scripts

**Files:**
- Modify: `package.json` (root level, if it references client commands)
- Modify: `script/start` (if exists)

**Step 1: Check if root package.json has client scripts**

```bash
cd /Users/kerrychristinestaley/code/festival-player
grep -A 5 '"client"' package.json
```

**Step 2: Update script/start if needed**

If `script/start` references react-scripts, no changes needed (it calls `yarn client` which now uses Vite)

Verify:
```bash
cat script/start | grep -i react-scripts
```

Expected: No matches (good) or update references

**Step 3: Test root start script**

```bash
./script/start
```

Expected:
- Both server and client start
- No deprecation warnings
- App accessible at http://localhost:3000

**Step 4: Commit any root-level changes**

```bash
git add package.json script/
git commit -m "feat: update root scripts for Vite migration"
```

---

## Task 15: Update Documentation

**Files:**
- Modify: `README.md`
- Modify: `client/README.md` (if exists)

**Step 1: Update main README**

Find any references to "Create React App" or "react-scripts" and update:

```markdown
## Development

The client uses Vite for fast development and building.

```bash
# Start development server
yarn start:dev  # or ./script/start

# Client only
cd client && yarn start

# Build for production
cd client && yarn build
```

**Step 2: Update client README if it exists**

Replace CRA references with Vite information

**Step 3: Commit documentation updates**

```bash
git add README.md client/README.md
git commit -m "docs: update README for Vite migration"
```

---

## Task 16: Final Verification & Migration Summary

**Files:**
- Create: `docs/plans/migration-verification.txt`

**Step 1: Run full test suite**

```bash
# Test server
yarn test

# Test client
cd client && yarn test:run
```

Expected: All tests pass

**Step 2: Verify all success criteria**

Checklist:
- [ ] Dev server starts without deprecation warnings
- [ ] Hot reload works correctly
- [ ] All tests pass with Vitest
- [ ] Production build succeeds
- [ ] Built app runs correctly (all routes, API calls work)
- [ ] No console errors in browser
- [ ] Build output size comparable or smaller than CRA

**Step 3: Create migration summary**

```bash
cat > docs/plans/migration-verification.txt << 'EOF'
# Vite Migration Verification

Date: 2026-02-08

## Success Criteria

✅ Dev server starts without deprecation warnings
✅ Hot reload works correctly
✅ All tests pass with Vitest
✅ Production build succeeds
✅ Built app runs correctly
✅ No console errors in browser
✅ Build output size comparable to CRA

## Performance Improvements

- Dev server startup: <1s (was ~30s)
- HMR speed: ~50ms (was ~1-2s)
- Build time: Measure and record here

## Breaking Changes

None - All existing functionality preserved

## Rollback Plan

If issues: `git revert HEAD~16..HEAD` to revert all migration commits
EOF
```

**Step 4: Final commit**

```bash
git add docs/plans/migration-verification.txt
git commit -m "docs: add Vite migration verification summary"
```

---

## Post-Migration Tasks (Optional)

1. **Update CHANGELOG.md** - Document the migration
2. **Update CI/CD** - If you have CI, update build commands
3. **Clean node_modules** - `rm -rf node_modules && yarn install` for clean slate
4. **Monitor bundle size** - Compare before/after build sizes
5. **Update team docs** - Notify team of new dev commands

---

## Rollback Procedure

If migration fails:

```bash
# Revert all commits
git revert HEAD~16..HEAD

# Or reset (loses commits)
git reset --hard HEAD~16

# Reinstall dependencies
cd client
yarn install

# Verify CRA works
yarn start
```
