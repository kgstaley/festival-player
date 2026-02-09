import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { AppContextProvider } from './AppContextProvider';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <HelmetProvider>
            <AppContextProvider>
                <Router basename="/">
                    <App />
                </Router>
            </AppContextProvider>
        </HelmetProvider>
    </React.StrictMode>
);

// Graceful cleanup on page unload
const cleanup = () => {
    // Clear performance entries to free memory
    if (window.performance && typeof window.performance.clearResourceTimings === 'function') {
        performance.clearResourceTimings();
    }

    // Clear any local storage if needed for cleanup
    // sessionStorage.clear(); // Uncomment if session cleanup is needed
};

// Handle page unload/refresh
window.addEventListener('beforeunload', cleanup);

// Handle hot module replacement in development
if (import.meta.hot) {
    import.meta.hot.dispose(() => {
        cleanup();
        // Unmount React app on hot reload
        root.unmount();
    });
}

// Cleanup on visibility change (tab hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Optional: Cancel non-critical requests when tab is hidden
        console.debug('Tab hidden, reducing resource usage');
    }
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
