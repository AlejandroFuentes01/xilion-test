// Simple test script to verify environment and database connection
console.log('🧪 Testing environment and database connections...');

import dotenv from 'dotenv';
dotenv.config();

console.log('📋 Environment variables:');
console.log('DATABASE_BOOKS_URL:', process.env.DATABASE_BOOKS_URL ? 'Set' : 'Missing');
console.log('DATABASE_AUTHORS_URL:', process.env.DATABASE_AUTHORS_URL ? 'Set' : 'Missing');

import { authorsDB, booksDB } from '../src/config/database';

async function test() {
    try {
        console.log('🔗 Testing database connections...');
        
        await authorsDB.$queryRaw`SELECT 1 as test`;
        console.log('✅ Authors DB: Connected');
        
        await booksDB.$queryRaw`SELECT 1 as test`;
        console.log('✅ Books DB: Connected');
        
        console.log('🎉 All tests passed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await authorsDB.$disconnect();
        await booksDB.$disconnect();
        console.log('🔌 Disconnected');
    }
}

test();
