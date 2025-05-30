import dotenv from 'dotenv';
import express from 'express';
import { connectDatabases, disconnectDatabases } from './config/database';
import { configureMiddleware } from './middleware';
import { configureRoutes } from './routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure middleware
configureMiddleware(app);

// Configure routes
configureRoutes(app);

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Global error handler:', error);

    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
    console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);

    try {
        await disconnectDatabases();
        console.log('✅ Graceful shutdown completed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
    }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
const startServer = async () => {
    try {
        // Connect to databases
        await connectDatabases();

        // Start HTTP server
        app.listen(PORT, () => {
            console.log('🚀 Server Configuration:');
            console.log(`   ├── Port: ${PORT}`);
            console.log(`   ├── Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`   ├── Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3001'}`);
            console.log('📚 Available Endpoints:');
            console.log('   ├── Health: GET /health');
            console.log('   ├── Auth: POST /api/auth/login, /api/auth/register');
            console.log('   ├── Books: GET /api/books, POST /api/books');
            console.log('   ├── Authors: GET /api/authors');
            console.log('   └── Details: GET /api/books/:id/details');
            console.log(`\n✅ Server running at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();