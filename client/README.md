# Festival Player - Client

React 18 frontend for Festival Player.

See the [main README](../README.md) for complete setup and development instructions.

## Client Technology Stack

Built with:
- **React 18.3.1** with createRoot API
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
- Hot module reloading for instant updates
- Proxying API requests to `http://localhost:5000`
- Source map support for debugging
- ESLint integration for code quality

### Build for Production

```bash
cd client
yarn build      # Builds to client/build/
```

The production build:
- Optimizes and minifies JavaScript bundles
- Generates static HTML with pre-rendered React
- Creates source maps for error tracking
- Outputs to `client/build/` directory

### Testing

```bash
cd client
yarn test       # Runs tests in interactive watch mode
```

## Project Structure

```
client/
├── public/           # Static assets (index.html, favicon, etc.)
├── src/              # React application source
│   ├── components/   # Reusable React components
│   ├── pages/        # Page-level components
│   ├── utils/        # Utility functions and helpers
│   ├── App.tsx       # Main App component with routing
│   └── index.tsx     # Application entry point
├── build/            # Production build output (generated)
└── package.json      # Client dependencies and scripts
```

## Environment Variables

The client uses environment variables for configuration. Create a `.env` file in the project root (not in the client directory).

**Note**: Client-side environment variables in Create React App must be prefixed with `REACT_APP_`. However, this application primarily uses server-side configuration, and the client proxies API requests to the backend.

## Available Scripts

| Script | Description |
|--------|-------------|
| `yarn start` | Start development server on port 3000 |
| `yarn build` | Build optimized production bundle |
| `yarn test` | Run tests in interactive watch mode |
| `yarn eject` | Eject from Create React App (⚠️ one-way operation) |

## API Integration

The client communicates with the backend server via:
- **Proxy**: Configured in `package.json` to proxy API requests to `http://localhost:5000`
- **Axios**: HTTP client with caching adapter for API calls
- **CORS**: Handled by the backend server

All API endpoints are relative paths (e.g., `/api/playlist`) and are automatically proxied to the backend server.

## Learn More

- [Create React App Documentation](https://create-react-app.dev/)
- [React Documentation](https://react.dev/)
- [Material-UI (MUI) Documentation](https://mui.com/)
- [React Router Documentation](https://reactrouter.com/)
- [Main Project README](../README.md)
