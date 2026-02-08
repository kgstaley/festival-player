'use-strict';
import { json, urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { Server } from 'http';
import path from 'path';
import { logger, router } from './server/index';

dotenv.config();
const app = express();
const port = process.env.PORT;

let server: Server | null = null;

const gracefulShutdown = (signal: string) => {
    logger(`${signal} signal received: closing HTTP server gracefully`);

    if (!server) {
        logger('No server instance to close');
        process.exit(0);
        return;
    }

    // Close server to stop accepting new connections
    server.close((err) => {
        if (err) {
            logger('Error during server shutdown:', err);
            process.exit(1);
            return;
        }

        logger('HTTP server closed successfully');
        logger('Cleanup completed, exiting process');
        process.exit(0);
    });

    // Force close after 10 seconds if graceful shutdown fails
    setTimeout(() => {
        logger('Forced shutdown after timeout');
        process.exit(1);
    }, 10000);
};

const start = () => {
    try {
        app.use(cors());
        app.use(json());
        app.use(urlencoded({ extended: true }));
        app.use(cookieParser());

        // set api prefix for node endpoints
        app.use('/api', router);
        // set path for react
        app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

        // serve react from express for auth to avoid error on cors redirect to spotify auth
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
        });

        server = app.listen(port, () => {
            logger(`Express up and listening on port ${port}`);
        });

        // Handle graceful shutdown on various signals
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        // Handle uncaught exceptions
        process.on('uncaughtException', (err) => {
            logger('Uncaught exception:', err);
            gracefulShutdown('UNCAUGHT_EXCEPTION');
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason, promise) => {
            logger('Unhandled rejection at:', promise, 'reason:', reason);
            gracefulShutdown('UNHANDLED_REJECTION');
        });
    } catch (err) {
        logger('Error thrown in start server:', err);
        process.exit(1);
    }
};

start();
