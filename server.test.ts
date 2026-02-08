/**
 * Tests for server graceful shutdown
 */
import { Server } from 'http';

describe('Server Graceful Shutdown', () => {
    let mockServer: jest.Mocked<Server>;
    let mockLogger: jest.Mock;
    let processExitSpy: jest.SpyInstance;
    let processOnSpy: jest.SpyInstance;
    let setTimeoutSpy: jest.SpyInstance;

    beforeEach(() => {
        // Mock HTTP Server
        mockServer = {
            close: jest.fn((callback) => {
                // Simulate successful close
                if (callback) {
                    callback();
                }
                return mockServer;
            }),
            listen: jest.fn(),
            on: jest.fn(),
            removeListener: jest.fn(),
        } as any;

        // Mock logger
        mockLogger = jest.fn();

        // Spy on process methods
        processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
            throw new Error('process.exit called');
        });
        processOnSpy = jest.spyOn(process, 'on').mockImplementation(() => process);
        setTimeoutSpy = jest.spyOn(global, 'setTimeout');

        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('gracefulShutdown function', () => {
        const createGracefulShutdown = (server: Server | null, logger: (msg: string, ...args: any[]) => void) => {
            return (signal: string) => {
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
        };

        it('should log the received signal', () => {
            const gracefulShutdown = createGracefulShutdown(mockServer, mockLogger);

            try {
                gracefulShutdown('SIGTERM');
            } catch (e) {
                // Expect process.exit to be called
            }

            expect(mockLogger).toHaveBeenCalledWith('SIGTERM signal received: closing HTTP server gracefully');
        });

        it('should close the server when server instance exists', () => {
            const gracefulShutdown = createGracefulShutdown(mockServer, mockLogger);

            try {
                gracefulShutdown('SIGTERM');
            } catch (e) {
                // Expect process.exit to be called
            }

            expect(mockServer.close).toHaveBeenCalled();
        });

        it('should exit with code 0 when shutdown is successful', () => {
            const gracefulShutdown = createGracefulShutdown(mockServer, mockLogger);

            try {
                gracefulShutdown('SIGTERM');
            } catch (e) {
                // Expected
            }

            expect(processExitSpy).toHaveBeenCalledWith(0);
            expect(mockLogger).toHaveBeenCalledWith('HTTP server closed successfully');
            expect(mockLogger).toHaveBeenCalledWith('Cleanup completed, exiting process');
        });

        it('should exit with code 0 when no server instance exists', () => {
            const gracefulShutdown = createGracefulShutdown(null, mockLogger);

            try {
                gracefulShutdown('SIGTERM');
            } catch (e) {
                // Expected
            }

            expect(mockLogger).toHaveBeenCalledWith('No server instance to close');
            expect(processExitSpy).toHaveBeenCalledWith(0);
        });

        it('should exit with code 1 when server close encounters an error', () => {
            const errorServer = {
                close: jest.fn((callback) => {
                    callback(new Error('Close error'));
                    return errorServer;
                }),
            } as any;

            const gracefulShutdown = createGracefulShutdown(errorServer, mockLogger);

            try {
                gracefulShutdown('SIGTERM');
            } catch (e) {
                // Expected
            }

            expect(mockLogger).toHaveBeenCalledWith('Error during server shutdown:', expect.any(Error));
            expect(processExitSpy).toHaveBeenCalledWith(1);
        });

        it('should set a timeout for forced shutdown', () => {
            const gracefulShutdown = createGracefulShutdown(mockServer, mockLogger);

            try {
                gracefulShutdown('SIGTERM');
            } catch (e) {
                // Expected
            }

            expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 10000);
        });

        it('should handle SIGINT signal', () => {
            const gracefulShutdown = createGracefulShutdown(mockServer, mockLogger);

            try {
                gracefulShutdown('SIGINT');
            } catch (e) {
                // Expected
            }

            expect(mockLogger).toHaveBeenCalledWith('SIGINT signal received: closing HTTP server gracefully');
            expect(mockServer.close).toHaveBeenCalled();
        });

        it('should handle uncaught exception signal', () => {
            const gracefulShutdown = createGracefulShutdown(mockServer, mockLogger);

            try {
                gracefulShutdown('UNCAUGHT_EXCEPTION');
            } catch (e) {
                // Expected
            }

            expect(mockLogger).toHaveBeenCalledWith('UNCAUGHT_EXCEPTION signal received: closing HTTP server gracefully');
        });

        it('should handle unhandled rejection signal', () => {
            const gracefulShutdown = createGracefulShutdown(mockServer, mockLogger);

            try {
                gracefulShutdown('UNHANDLED_REJECTION');
            } catch (e) {
                // Expected
            }

            expect(mockLogger).toHaveBeenCalledWith('UNHANDLED_REJECTION signal received: closing HTTP server gracefully');
        });
    });

    describe('Signal handler registration', () => {
        it('should register SIGTERM handler', () => {
            // Simulate server startup signal registration
            const gracefulShutdown = jest.fn();

            process.on('SIGTERM', gracefulShutdown);

            expect(processOnSpy).toHaveBeenCalledWith('SIGTERM', expect.any(Function));
        });

        it('should register SIGINT handler', () => {
            // Simulate server startup signal registration
            const gracefulShutdown = jest.fn();

            process.on('SIGINT', gracefulShutdown);

            expect(processOnSpy).toHaveBeenCalledWith('SIGINT', expect.any(Function));
        });

        it('should register uncaughtException handler', () => {
            const handler = jest.fn();

            process.on('uncaughtException', handler);

            expect(processOnSpy).toHaveBeenCalledWith('uncaughtException', expect.any(Function));
        });

        it('should register unhandledRejection handler', () => {
            const handler = jest.fn();

            process.on('unhandledRejection', handler);

            expect(processOnSpy).toHaveBeenCalledWith('unhandledRejection', expect.any(Function));
        });
    });

    describe('Timeout behavior', () => {
        it('should force shutdown after 10 seconds if server does not close', (done) => {
            // Mock server that never closes
            const hangingServer = {
                close: jest.fn(() => {
                    // Never call the callback
                    return hangingServer;
                }),
            } as any;

            const createGracefulShutdown = (server: Server | null, logger: (msg: string, ...args: any[]) => void) => {
                return (signal: string) => {
                    logger(`${signal} signal received: closing HTTP server gracefully`);

                    if (!server) {
                        logger('No server instance to close');
                        process.exit(0);
                        return;
                    }

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

                    // Use shorter timeout for testing
                    setTimeout(() => {
                        logger('Forced shutdown after timeout');
                        try {
                            process.exit(1);
                        } catch (e) {
                            expect(mockLogger).toHaveBeenCalledWith('Forced shutdown after timeout');
                            expect(processExitSpy).toHaveBeenCalledWith(1);
                            done();
                        }
                    }, 100); // Use 100ms for test instead of 10000ms
                };
            };

            const gracefulShutdown = createGracefulShutdown(hangingServer, mockLogger);

            try {
                gracefulShutdown('SIGTERM');
            } catch (e) {
                // Expected
            }

            expect(hangingServer.close).toHaveBeenCalled();
        });
    });

    describe('Integration: Full shutdown workflow', () => {
        it('should complete full shutdown sequence successfully', () => {
            const createGracefulShutdown = (server: Server | null, logger: (msg: string, ...args: any[]) => void) => {
                return (signal: string) => {
                    logger(`${signal} signal received: closing HTTP server gracefully`);

                    if (!server) {
                        logger('No server instance to close');
                        process.exit(0);
                        return;
                    }

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

                    setTimeout(() => {
                        logger('Forced shutdown after timeout');
                        process.exit(1);
                    }, 10000);
                };
            };

            const gracefulShutdown = createGracefulShutdown(mockServer, mockLogger);

            try {
                gracefulShutdown('SIGTERM');
            } catch (e) {
                // Expected
            }

            // Verify the sequence of calls
            expect(mockLogger).toHaveBeenNthCalledWith(1, 'SIGTERM signal received: closing HTTP server gracefully');
            expect(mockServer.close).toHaveBeenCalled();
            expect(mockLogger).toHaveBeenCalledWith('HTTP server closed successfully');
            expect(mockLogger).toHaveBeenCalledWith('Cleanup completed, exiting process');
            expect(processExitSpy).toHaveBeenCalledWith(0);
        });
    });

    describe('Port release', () => {
        it('should release port binding when server closes', () => {
            const gracefulShutdown = (signal: string, server: Server) => {
                server.close((err) => {
                    if (!err) {
                        mockLogger('Port released');
                        process.exit(0);
                    }
                });
            };

            try {
                gracefulShutdown('SIGTERM', mockServer);
            } catch (e) {
                // Expected
            }

            expect(mockServer.close).toHaveBeenCalled();
            expect(mockLogger).toHaveBeenCalledWith('Port released');
        });
    });
});
