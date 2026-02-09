# Festival Player - Client

React 18 frontend for Festival Player.

See the [main README](../README.md) for complete setup and development instructions.

## Client Technology Stack

Built with:
- **React 18.3.1** with createRoot API
- **Vite 5.4** for lightning-fast development and optimized builds
- **Vitest 2.0** for unit testing (Jest-compatible API)
- **Material-UI (MUI) v6** for component library
- **React Router v6** for client-side routing
- **Emotion** for CSS-in-JS styling
- **TypeScript 5.7** with strict mode
- **React Helmet Async** for document head management
- **Axios** with caching for API requests

## Development

### Quick Start

From the project root:
```bash
./script/start  # Starts both client and server
```

Or run client only:
```bash
cd client
yarn start      # Client dev server on http://localhost:3000
```

The client development server includes:
- Hot module replacement (HMR) with Vite for instant updates
- Proxying API requests to `http://localhost:5000`
- Source map support for debugging
- ESLint integration for code quality
- Near-instant server startup (<1 second)

### Build for Production

```bash
cd client
yarn build      # Builds to client/build/
```

The production build:
- Optimizes and minifies JavaScript bundles with Rollup
- Uses modern code splitting for optimal caching
- Generates vendor chunks (React, MUI) for better performance
- Creates source maps for error tracking
- Outputs to `client/build/` directory
- Typical build time: ~2.5 seconds

### Testing

```bash
cd client
yarn test          # Runs tests in interactive watch mode (Vitest)
yarn test:run      # Runs tests once (for CI)
yarn test:ui       # Opens interactive test UI in browser
```

## Project Structure

```
client/
├── index.html        # HTML entry point (Vite convention)
├── public/           # Static assets (favicon, logos, etc.)
├── src/              # React application source
│   ├── components/   # Reusable React components
│   ├── pages/        # Page-level components
│   ├── utils/        # Utility functions and helpers
│   ├── App.tsx       # Main App component with routing
│   └── index.tsx     # Application entry point
├── build/            # Production build output (generated)
├── vite.config.ts    # Vite configuration
├── vitest.config.ts  # Vitest test configuration
└── package.json      # Client dependencies and scripts
```

## Environment Variables

The client uses environment variables for configuration. Create a `.env` file in the `client/` directory.

**Note**: Client-side environment variables in Vite must be prefixed with `VITE_` to be exposed to the application. For example:
- `VITE_API_PREFIX` - API endpoint prefix
- `VITE_SPOTIFY_ID` - Spotify client ID (if needed on client)

Access them in code using `import.meta.env.VITE_*`

## Available Scripts

| Script | Description |
|--------|-------------|
| `yarn start` | Start Vite dev server on port 3000 |
| `yarn build` | Build optimized production bundle with Vite |
| `yarn preview` | Preview production build locally |
| `yarn test` | Run Vitest in interactive watch mode |
| `yarn test:run` | Run Vitest once (for CI/CD) |
| `yarn test:ui` | Open interactive Vitest UI in browser |

## API Integration

The client communicates with the backend server via:
- **Proxy**: Configured in `package.json` to proxy API requests to `http://localhost:5000`
- **Axios**: HTTP client with caching adapter for API calls
- **CORS**: Handled by the backend server

All API endpoints are relative paths (e.g., `/api/playlist`) and are automatically proxied to the backend server.

## Learn More

- [Vite Documentation](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [React Documentation](https://react.dev/)
- [Material-UI (MUI) Documentation](https://mui.com/)
- [React Router Documentation](https://reactrouter.com/)
- [Main Project README](../README.md)
