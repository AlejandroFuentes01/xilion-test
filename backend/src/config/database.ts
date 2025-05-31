import { PrismaClient as AuthorsClient } from '../../node_modules/.prisma/client-authors';
import { PrismaClient as BooksClient } from '../../node_modules/.prisma/client-books';

// Crear conexiones separadas para cada base de datos
export const booksDB = new BooksClient({
  datasources: {
    db: {
      url: process.env.DATABASE_BOOKS_URL
    }
  },
  log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'info', 'warn', 'error']
});

export const authorsDB = new AuthorsClient({
  datasources: {
    db: {
      url: process.env.DATABASE_AUTHORS_URL
    }
  },
  log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'info', 'warn', 'error']
});

export const connectDatabases = async () => {
  try {
    // Conectar a la base de datos de Books
    await booksDB.$connect();
    console.log('📚 Connected to Books Database');
    
    // Conectar a la base de datos de Authors  
    await authorsDB.$connect();
    console.log('👥 Connected to Authors Database');
    
    console.log('✅ All databases connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

export const disconnectDatabases = async () => {
  await booksDB.$disconnect();
  await authorsDB.$disconnect();
  console.log('🔌 Disconnected from databases');
};