/**
 * Script de poblado de base de datos para el sistema de gestión de libros y autores
 * 
 * Este script genera datos de prueba para las bases de datos de autores y libros,
 * incluyendo autores famosos reales y libros generados aleatoriamente.
 * 
 * Características:
 * - Genera 120+ autores (combinando datos reales y generados)
 * - Genera 5200+ libros con títulos únicos
 * - Incluye el libro especial "The Way of Kings"
 * - Maneja inserción en lotes para optimizar rendimiento
 * - Limpia datos existentes antes de poblar
 * - Mejor manejo de errores y validaciones
 * 
 * Uso:
 * - Ejecutar directamente: npm run seed
 * - Importar como función: import { seedDatabase } from './seed'
 */

import dotenv from 'dotenv';
import { authorsDB, booksDB } from '../src/config/database';
import { VALID_GENRES, type ValidGenre } from '../src/types';

// Cargar variables de entorno antes de cualquier operación
dotenv.config();

// Datos de muestra para poblar la base de datos
// Tipos para los datos de autores
interface AuthorData {
    name: string;
    birthYear: number;
    nationality: string;
}

// Datos de autores predefinidos con información realista
const AUTHORS_DATA: AuthorData[] = [
    { name: 'Brandon Sanderson', birthYear: 1975, nationality: 'American' },
    { name: 'J.K. Rowling', birthYear: 1965, nationality: 'British' },
    { name: 'George R.R. Martin', birthYear: 1948, nationality: 'American' },
    { name: 'Stephen King', birthYear: 1947, nationality: 'American' },
    { name: 'Agatha Christie', birthYear: 1890, nationality: 'British' },
    { name: 'Isaac Asimov', birthYear: 1920, nationality: 'American' },
    { name: 'J.R.R. Tolkien', birthYear: 1892, nationality: 'British' },
    { name: 'Arthur Conan Doyle', birthYear: 1859, nationality: 'British' },
    { name: 'Dan Brown', birthYear: 1964, nationality: 'American' },
    { name: 'Gillian Flynn', birthYear: 1971, nationality: 'American' },
    { name: 'Margaret Atwood', birthYear: 1939, nationality: 'Canadian' },
    { name: 'Haruki Murakami', birthYear: 1949, nationality: 'Japanese' },
    { name: 'Paulo Coelho', birthYear: 1947, nationality: 'Brazilian' },
    { name: 'Gabriel García Márquez', birthYear: 1927, nationality: 'Colombian' },
    { name: 'Maya Angelou', birthYear: 1928, nationality: 'American' }
];

// Lista de títulos de libros famosos para usar como semilla
const BOOK_TITLES: string[] = [
    'The Way of Kings', 'The Final Empire', 'Warbreaker', 'Elantris', 'Rhythm of War',
    'Harry Potter and the Sorcerer\'s Stone', 'Harry Potter and the Chamber of Secrets',
    'A Game of Thrones', 'A Clash of Kings', 'A Storm of Swords',
    'The Shining', 'It', 'The Stand', 'Pet Sematary', 'Salem\'s Lot',
    'Murder on the Orient Express', 'And Then There Were None', 'The Murder of Roger Ackroyd',
    'Foundation', 'I, Robot', 'The Caves of Steel', 'Foundation and Empire',
    'The Lord of the Rings', 'The Hobbit', 'The Silmarillion',
    'The Adventures of Sherlock Holmes', 'The Hound of the Baskervilles',
    'The Da Vinci Code', 'Angels and Demons', 'The Lost Symbol',
    'Gone Girl', 'Sharp Objects', 'Dark Places',
    'The Handmaid\'s Tale', 'Oryx and Crake', 'The Testaments',
    'Norwegian Wood', 'Kafka on the Shore', '1Q84',
    'The Alchemist', 'Brida', 'The Pilgrimage',
    'One Hundred Years of Solitude', 'Love in the Time of Cholera',
    'I Know Why the Caged Bird Sings', 'Gather Together in My Name'
];

// Funciones auxiliares para generar datos aleatorios
const getRandomElement = <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
};

const getRandomYear = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Genera una lista de autores combinando datos predefinidos con datos aleatorios
 * @param count - Cantidad total de autores a generar
 * @returns Array de objetos autor
 */
const generateAuthors = (count: number): AuthorData[] => {
    const authors: AuthorData[] = [...AUTHORS_DATA];

    // Generar autores adicionales si es necesario
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Mary'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const nationalities = ['American', 'British', 'Canadian', 'Australian', 'French', 'German', 'Italian', 'Spanish', 'Japanese', 'Brazilian'];

    while (authors.length < count) {
        const firstName = getRandomElement(firstNames);
        const lastName = getRandomElement(lastNames);
        authors.push({
            name: `${firstName} ${lastName}`,
            birthYear: getRandomYear(1920, 1990),
            nationality: getRandomElement(nationalities)
        });
    }

    return authors.slice(0, count);
};

/**
 * Genera una lista de libros con títulos únicos y datos aleatorios
 * @param count - Cantidad total de libros a generar
 * @param authorIds - Array de IDs de autores disponibles
 * @returns Array de objetos libro
 */
const generateBooks = (count: number, authorIds: string[]) => {
    interface BookData {
        title: string;
        authorId: string;
        genre: ValidGenre;
        publishedYear: number;
    }

    const books: BookData[] = [];
    const usedTitles = new Set<string>();

    // Añadir el libro específico mencionado en los requerimientos
    books.push({
        title: 'The Way of Kings',
        authorId: authorIds.find(id => id.includes('brandon')) || authorIds[0], // Intentar encontrar Brandon Sanderson
        genre: 'Fantasy' as ValidGenre,
        publishedYear: 2010
    });
    usedTitles.add('The Way of Kings');

    // Generar libros adicionales
    const adjectives = ['Dark', 'Lost', 'Ancient', 'Secret', 'Hidden', 'Forgotten', 'Sacred', 'Cursed', 'Golden', 'Silver'];
    const nouns = ['Kingdom', 'Empire', 'City', 'Forest', 'Mountain', 'Ocean', 'Tower', 'Castle', 'Temple', 'Palace'];
    const bookTypes = ['Chronicles', 'Tales', 'Legend', 'Story', 'Mystery', 'Adventure', 'Journey', 'Quest', 'Saga', 'Epic'];

    while (books.length < count) {
        let title;

        // Usar títulos predefinidos primero, luego generar aleatorios
        if (books.length < BOOK_TITLES.length) {
            title = BOOK_TITLES[books.length - 1]; // -1 porque ya añadimos un libro
        } else {
            // Generar título aleatorio
            const adj = getRandomElement(adjectives);
            const noun = getRandomElement(nouns);
            const type = getRandomElement(bookTypes);
            title = Math.random() > 0.5 ? `The ${adj} ${noun}` : `${type} of the ${adj} ${noun}`;
        }

        // Asegurar títulos únicos
        if (!usedTitles.has(title)) {
            usedTitles.add(title);
            books.push({
                title,
                authorId: getRandomElement(authorIds),
                genre: getRandomElement([...VALID_GENRES] as ValidGenre[]) as ValidGenre,
                publishedYear: getRandomYear(1950, 2024)
            });
        }
    }

    return books;
};

/**
 * Verifica la conectividad a las bases de datos
 */
const verifyDatabaseConnection = async (): Promise<void> => {
    try {
        console.log('🔗 Verificando conectividad a las bases de datos...');
        
        // Probar conexión a la base de datos de autores
        await authorsDB.$queryRaw`SELECT 1`;
        console.log('✅ Conexión a base de datos de autores: OK');
        
        // Probar conexión a la base de datos de libros
        await booksDB.$queryRaw`SELECT 1`;
        console.log('✅ Conexión a base de datos de libros: OK');
        
    } catch (error) {
        console.error('❌ Error de conectividad a base de datos:', error);
        throw new Error('No se puede conectar a las bases de datos. Verifica la configuración.');
    }
};

/**
 * Función principal para poblar la base de datos con datos de prueba
 * Limpia los datos existentes y crea nuevos autores y libros
 */
const seedDatabase = async (): Promise<void> => {
    try {
        console.log('🌱 Iniciando poblado de base de datos...');
        console.log('📅 Fecha:', new Date().toLocaleDateString('es-ES'));
        
        // Verificar variables de entorno críticas
        if (!process.env.DATABASE_BOOKS_URL || !process.env.DATABASE_AUTHORS_URL) {
            throw new Error('Variables de entorno de base de datos no configuradas');
        }
        
        // Verificar conectividad
        await verifyDatabaseConnection();

        // Limpiar datos existentes
        console.log('🧹 Limpiando datos existentes...');
        const deletedBooks = await booksDB.book.deleteMany();
        const deletedAuthors = await authorsDB.author.deleteMany();
        console.log(`   ├── Libros eliminados: ${deletedBooks.count}`);
        console.log(`   └── Autores eliminados: ${deletedAuthors.count}`);

        // Generar e insertar autores
        console.log('👥 Poblando autores...');
        const authorsData = generateAuthors(120); // Generar 120 autores (más de los 100 requeridos)

        const createdAuthors = await authorsDB.author.createMany({
            data: authorsData
        });

        console.log(`✅ Creados ${createdAuthors.count} autores`);

        // Obtener IDs de autores para los libros
        const authors = await authorsDB.author.findMany({ select: { id: true, name: true } });
        const authorIds = authors.map(author => author.id);

        // Buscar Brandon Sanderson para el libro especial
        const brandonSanderson = authors.find(author => 
            author.name.toLowerCase().includes('brandon sanderson')
        );
        
        if (brandonSanderson) {
            console.log(`🎯 Encontrado Brandon Sanderson: ${brandonSanderson.id}`);
        }

        // Generar e insertar libros
        console.log('📚 Poblando libros...');
        const booksData = generateBooks(5200, authorIds); // Generar 5200 libros (más de los 5000 requeridos)

        // Insertar libros en lotes para evitar problemas de memoria
        const batchSize = 1000;
        let totalBooksCreated = 0;
        const totalBatches = Math.ceil(booksData.length / batchSize);

        for (let i = 0; i < booksData.length; i += batchSize) {
            const batchNumber = Math.floor(i / batchSize) + 1;
            const batch = booksData.slice(i, i + batchSize);
            
            console.log(`📖 Procesando lote ${batchNumber}/${totalBatches} (${batch.length} libros)...`);
            
            const result = await booksDB.book.createMany({
                data: batch,
                skipDuplicates: true // Evitar errores por duplicados
            });
            
            totalBooksCreated += result.count;
            console.log(`   ✅ Lote ${batchNumber} completado: ${result.count} libros creados`);
        }

        console.log(`✅ Creados ${totalBooksCreated} libros en total`);

        // Verificar datos finales
        const authorCount = await authorsDB.author.count();
        const bookCount = await booksDB.book.count();

        console.log('\n📊 Resumen del poblado:');
        console.log(`   ├── Autores totales: ${authorCount}`);
        console.log(`   ├── Libros totales: ${bookCount}`);
        console.log(`   ├── Géneros disponibles: ${VALID_GENRES.length}`);
        console.log(`   └── Promedio libros por autor: ${Math.round(bookCount / authorCount)}`);

        // Verificar el libro especial
        const wayOfKings = await booksDB.book.findFirst({
            where: { title: 'The Way of Kings' }
        });

        if (wayOfKings) {
            console.log('🗡️  Libro especial "The Way of Kings" creado exitosamente!');
            console.log(`   └── ID: ${wayOfKings.id}, Año: ${wayOfKings.publishedYear}, Género: ${wayOfKings.genre}`);
        } else {
            console.log('⚠️  Advertencia: No se pudo verificar el libro "The Way of Kings"');
        }

        // Verificar distribución por géneros
        const genreDistribution = await booksDB.book.groupBy({
            by: ['genre'],
            _count: {
                genre: true
            },
            orderBy: {
                _count: {
                    genre: 'desc'
                }
            }
        });

        console.log('\n📈 Distribución por géneros (top 5):');
        genreDistribution.slice(0, 5).forEach((genre, index) => {
            console.log(`   ${index + 1}. ${genre.genre}: ${genre._count.genre} libros`);
        });

        console.log('\n🎉 ¡Poblado de base de datos completado exitosamente!');
        console.log(`⏱️  Tiempo completado: ${new Date().toLocaleTimeString('es-ES')}`);

    } catch (error) {
        console.error('❌ Fallo en el poblado:', error);
        
        // Proporcionar información adicional sobre el error
        if (error instanceof Error) {
            console.error('📝 Mensaje de error:', error.message);
            if (error.stack) {
                console.error('📚 Stack trace:', error.stack);
            }
        }
        
        throw error;
    } finally {
        // Asegurar desconexión de las bases de datos
        try {
            await booksDB.$disconnect();
            await authorsDB.$disconnect();
            console.log('🔌 Desconectado de todas las bases de datos');
        } catch (disconnectError) {
            console.error('⚠️  Error al desconectar:', disconnectError);
        }
    }
};

// Ejecutar poblado si este archivo se ejecuta directamente
if (require.main === module) {
    seedDatabase()
        .then(() => {
            console.log('✨ Script completado exitosamente');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Fallo crítico en el poblado:', error);
            process.exit(1);
        });
}

export { seedDatabase };
