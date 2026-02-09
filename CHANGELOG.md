# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Graceful shutdown handling for Express server (#4)
  - Signal handlers for SIGTERM, SIGINT for clean container/process shutdown
  - Proper HTTP server close to release port bindings
  - Handles uncaught exceptions and unhandled promise rejections
  - 10-second timeout for forced shutdown if graceful close hangs
- Client-side cleanup and resource management (#4)
  - beforeunload event handler for cleanup on page close/refresh
  - Performance API cleanup to free memory (clearResourceTimings)
  - Hot module replacement (HMR) disposal in development
  - Visibility change handler to reduce resource usage when tab hidden
- Comprehensive test suite for graceful shutdown (#4)
  - Server tests for signal handling, timeout, and port release
  - Client tests for cleanup functions and event handlers
  - Jest testing infrastructure with TypeScript support

### Changed
- **BREAKING**: Migrated client from Create React App to Vite (#6)
  - Replaced webpack-based CRA with Vite 5.4 for faster builds and dev server
  - Updated test framework from Jest to Vitest 2.0 (Jest-compatible API)
  - Environment variables now use `VITE_*` prefix instead of `REACT_APP_*`
  - Moved `index.html` to client root directory (Vite convention)
  - Updated HMR API from webpack's `module.hot` to Vite's `import.meta.hot`
  - Configured modern SCSS compiler (eliminates Dart Sass deprecation warnings)
  - Dev server startup time improved from ~30s to <1s
  - Production build time reduced to ~2.5s
- Updated `script/test` for Vitest compatibility (#7)
  - Client tests now use `yarn test:run` instead of `yarn test --watchAll=false`
  - Watch mode uses `yarn test` (Vitest watch by default)
- Removed deprecated `suppressImplicitAnyIndexErrors` from client tsconfig.json (#4)

### Fixed
- Port conflicts on server restart - server now properly releases port binding (#4)
- Memory leaks from accumulated performance entries in browser (#4)

## [2026-02-08]

### Added
- Bootstrap script (`script/bootstrap`) for automated project setup (#1)
  - Validates Node.js and Yarn installation
  - Installs root and client dependencies
  - Checks for .env file and provides setup guidance
- Development start script (`script/start`) with dev and production modes (#1)
  - Development mode: runs client and server concurrently
  - Production mode: validates environment, builds, and starts server
- Environment variable template (`script/.env.example`) with Spotify API configuration (#1)
- ESLint flat config for server-side TypeScript linting (#2)

### Changed
- **BREAKING**: Upgraded React from 16.x to 18.3.1 (#2)
  - Migrated from `ReactDOM.render()` to `createRoot()` rendering API
  - Replaced `react-helmet` with `react-helmet-async` for SSR compatibility
  - Updated `web-vitals` to v4 API with new metric reporting
- **BREAKING**: Migrated Material-UI v4 to MUI v6 (#2)
  - All imports changed from `@material-ui/*` to `@mui/*`
  - Added `@emotion/react` and `@emotion/styled` as peer dependencies
  - Updated component props and styling API to MUI v6 patterns
- **BREAKING**: Upgraded React Router from v5 to v6 (#2)
  - Replaced `Switch` component with `Routes`
  - Replaced `Redirect` component with `Navigate`
  - Replaced `withRouter` HOC with hooks (`useLocation`, `useNavigate`, `useParams`)
  - Updated Route components to use `element` prop instead of `component`
  - Removed legacy `history` object usage in favor of hooks
- Updated TypeScript to 5.7 with strict mode enabled (#2)
  - Fixed implicit `any` types across component props and state
  - Added proper type annotations for event handlers and transitions
- Updated build tooling and dependency management (#2)
  - Upgraded Node.js type definitions to v22
  - Updated testing library packages to latest versions
  - Added concurrently for parallel dev server execution

### Fixed
- TypeScript transition state types in FadeIn component (#2)
- Component prop type definitions to satisfy strict mode (#2)
- Router integration with updated v6 API patterns (#2)
