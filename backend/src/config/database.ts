import { PrismaClient as AuthorsClient, PrismaClient as BooksClient } from '../../node_modules/.prisma/client';

// Books Database Client
export const booksDB = new BooksClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Authors Database Client
    export const authorsDB = new AuthorsClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Connect to both databases
export const connectDatabases = async () => {
    try {
        await booksDB.$connect();
        console.log('📚 Connected to Books Database');

        await authorsDB.$connect();
        console.log('👥 Connected to Authors Database');

        console.log('✅ All databases connected successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};

// Disconnect from both databases
export const disconnectDatabases = async () => {
    await booksDB.$disconnect();
    await authorsDB.$disconnect();
    console.log('🔌 Disconnected from all databases');
};