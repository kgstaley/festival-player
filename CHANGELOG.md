# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
