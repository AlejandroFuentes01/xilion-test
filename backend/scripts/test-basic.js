console.log('Testing basic imports...');

try {
    const dotenv = require('dotenv');
    console.log('✅ dotenv imported successfully');
    
    dotenv.config();
    console.log('✅ Environment loaded');
    
    console.log('DATABASE_BOOKS_URL:', process.env.DATABASE_BOOKS_URL ? 'Set' : 'Not set');
    console.log('DATABASE_AUTHORS_URL:', process.env.DATABASE_AUTHORS_URL ? 'Set' : 'Not set');
    
} catch (error) {
    console.error('❌ Import error:', error);
}
