/**
 * Script de generación rápida de datos para el sistema de gestión de libros y autores
 * 
 * Este script optimizado genera datos de prueba de manera eficiente:
 * - 120+ autores (combinando datos reales con generados automáticamente)
 * - 5200+ libros con títulos únicos usando patrones creativos
 * - Incluye el libro especial "The Way of Kings" como primer elemento
 * - Guarda todo en un archivo JSON para uso posterior
 * 
 * Ventajas de este enfoque:
 * - Generación muy rápida sin validaciones complejas
 * - Patrones determinísticos para títulos únicos
 * - Progreso visible durante la generación
 * - Archivo JSON listo para importar o usar en pruebas
 * 
 * Uso: npx tsx scripts/generate-data.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { VALID_GENRES, type ValidGenre } from '../src/types';

// Interfaces TypeScript para tipado fuerte
interface AuthorData {
    name: string;
    birthYear: number;
    nationality: string;
}

interface BookData {
    title: string;
    authorIndex: number;
    genre: ValidGenre;
    publishedYear: number;
}

interface GeneratedData {
    authors: AuthorData[];
    books: BookData[];
    metadata: {
        generatedAt: string;
        authorCount: number;
        bookCount: number;
        specialBook: string;
        note: string;
    };
}

// Datos base de autores famosos reales para mayor realismo
const AUTHORS: AuthorData[] = [
    { name: 'Brandon Sanderson', birthYear: 1975, nationality: 'American' },
    { name: 'J.K. Rowling', birthYear: 1965, nationality: 'British' },
    { name: 'George R.R. Martin', birthYear: 1948, nationality: 'American' },
    { name: 'Stephen King', birthYear: 1947, nationality: 'American' },
    { name: 'Agatha Christie', birthYear: 1890, nationality: 'British' },
    { name: 'Isaac Asimov', birthYear: 1920, nationality: 'American' },
    { name: 'J.R.R. Tolkien', birthYear: 1892, nationality: 'British' },
    { name: 'Arthur Conan Doyle', birthYear: 1859, nationality: 'British' },
    { name: 'Dan Brown', birthYear: 1964, nationality: 'American' },
    { name: 'Margaret Atwood', birthYear: 1939, nationality: 'Canadian' }
];

// Nombres y apellidos simples para generar autores adicionales de forma rápida
const SIMPLE_NAMES = ['Alexander', 'Emma', 'Michael', 'Sophia', 'William', 'Isabella', 'James', 'Charlotte', 'Benjamin', 'Amelia'];
const SIMPLE_SURNAMES = ['Johnson', 'Smith', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Moore'];

// Países disponibles para asignar nacionalidades a los autores generados
const COUNTRIES = ['American', 'British', 'Canadian', 'Australian', 'French', 'German', 'Spanish', 'Italian'];

/**
 * Función principal que genera datos de prueba de manera optimizada
 * 
 * Proceso de generación:
 * 1. Genera 120 autores (10 reales + 110 generados)
 * 2. Genera 5200 libros usando patrones creativos
 * 3. Incluye "The Way of Kings" como libro especial
 * 4. Guarda todo en archivo JSON con metadatos
 */
const generateSimpleData = (): void => {
    console.log('📊 Generando datos para archivo JSON...');
    console.log('⏱️  Iniciado:', new Date().toLocaleString('es-ES'));

    console.log('👥 Generando autores...');
    const authors: AuthorData[] = [...AUTHORS];

    // Generar autores adicionales de forma rápida y eficiente
    for (let i = AUTHORS.length; i < 120; i++) {
        const name = `${SIMPLE_NAMES[i % SIMPLE_NAMES.length]} ${SIMPLE_SURNAMES[i % SIMPLE_SURNAMES.length]}`;
        authors.push({
            name: `${name} ${i}`, // Agregar número para garantizar unicidad
            birthYear: 1920 + (i % 70), // Años entre 1920-1990
            nationality: COUNTRIES[i % COUNTRIES.length]
        });
    }
    console.log(`✅ ${authors.length} autores generados`);

    console.log('📚 Generando libros...');
    const books: BookData[] = [];

    // Añadir el libro especial "The Way of Kings" como primer elemento
    books.push({
        title: 'The Way of Kings',
        authorIndex: 0, // Brandon Sanderson será el autor índice 0
        genre: 'Fantasy' as ValidGenre,
        publishedYear: 2010
    });

    // Títulos base de libros famosos para usar como semilla
    const baseTitles = [
        'Harry Potter and the Chamber of Secrets', 'A Game of Thrones', 'The Shining', 'Murder on the Orient Express',
        'Foundation', 'The Lord of the Rings', 'The Adventures of Sherlock Holmes', 'The Da Vinci Code',
        'Gone Girl', 'The Handmaid\'s Tale', 'Norwegian Wood', 'The Alchemist', 'One Hundred Years of Solitude',
        'I Know Why the Caged Bird Sings', 'The Final Empire', 'Warbreaker', 'Elantris', 'A Clash of Kings',
        'It', 'The Stand', 'And Then There Were None', 'I, Robot', 'The Hobbit', 'Angels and Demons'
    ];

    // Palabras para generar títulos creativos y únicos
    const adjectives = ['Dark', 'Lost', 'Ancient', 'Secret', 'Hidden', 'Forgotten', 'Golden', 'Silver', 'Crimson', 'Azure', 'Mystic', 'Eternal', 'Broken', 'Rising', 'Falling'];
    const nouns = ['Kingdom', 'Empire', 'City', 'Forest', 'Mountain', 'Ocean', 'Tower', 'Castle', 'Temple', 'Palace', 'Crown', 'Sword', 'Shield', 'Heart', 'Soul'];
    const concepts = ['Chronicles', 'Tales', 'Legend', 'Story', 'Mystery', 'Adventure', 'Journey', 'Quest', 'Saga', 'Epic', 'Dreams', 'Shadows', 'Light', 'Dawn', 'Dusk'];

    // Convertir géneros válidos a array mutable para uso en el script
    const genres = [...VALID_GENRES] as ValidGenre[];

    // Generar 5199 libros adicionales (más el especial = 5200 total)
    for (let i = 1; i < 5200; i++) {
        let title: string;

        // Usar títulos base para los primeros libros (más realistas)
        if (i <= baseTitles.length) {
            title = baseTitles[i - 1];
        } else {
            // Generar títulos creativos usando 6 patrones diferentes
            const pattern = i % 6;
            switch (pattern) {
                case 0:
                    title = `The ${adjectives[i % adjectives.length]} ${nouns[i % nouns.length]}`;
                    break;
                case 1:
                    title = `${concepts[i % concepts.length]} of the ${adjectives[i % adjectives.length]} ${nouns[i % nouns.length]}`;
                    break;
                case 2:
                    title = `The ${adjectives[i % adjectives.length]} ${concepts[i % concepts.length]}`;
                    break;
                case 3:
                    title = `${nouns[i % nouns.length]} of ${adjectives[i % adjectives.length]} ${concepts[i % concepts.length]}`;
                    break;
                case 4:
                    title = `The Last ${nouns[i % nouns.length]}`;
                    break;
                default:
                    title = `${adjectives[i % adjectives.length]} ${nouns[i % nouns.length]}: ${concepts[i % concepts.length]}`;
            }
        }

        // Añadir libro a la lista con datos distribuidos uniformemente
        books.push({
            title,
            authorIndex: i % authors.length, // Distribuir libros entre todos los autores
            genre: genres[i % genres.length], // Distribuir géneros uniformemente
            publishedYear: 1950 + (i % 75) // Años entre 1950-2024
        });

        // Mostrar progreso cada 1000 libros para seguimiento
        if (i % 1000 === 0) {
            console.log(`   📖 ${i} libros generados...`);
        }
    }

    console.log(`✅ ${books.length} libros generados`);

    // Crear estructura de datos completa con metadatos
    const data: GeneratedData = {
        authors,
        books,
        metadata: {
            generatedAt: new Date().toISOString(),
            authorCount: authors.length,
            bookCount: books.length,
            specialBook: 'The Way of Kings incluido como primer libro',
            note: 'Datos generados para testing rápido y eficiente'
        }
    };

    console.log('💾 Guardando archivo JSON...');
    const jsonPath = path.join(__dirname, 'library-data.json');
    
    try {
        fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
        
        // Calcular estadísticas del archivo generado
        const fileSize = (fs.statSync(jsonPath).size / 1024 / 1024).toFixed(2);

        console.log('\n🎉 ¡Generación completada exitosamente!');
        console.log('📊 Estadísticas finales:');
        console.log(`   ├── Archivo guardado en: ${jsonPath}`);
        console.log(`   ├── Autores generados: ${authors.length}`);
        console.log(`   ├── Libros generados: ${books.length}`);
        console.log(`   ├── Tamaño del archivo: ${fileSize} MB`);
        console.log(`   └── Libro especial: "The Way of Kings" incluido`);
        console.log(`⏱️  Finalizado: ${new Date().toLocaleString('es-ES')}`);
        
    } catch (error) {
        console.error('❌ Error al guardar el archivo:', error);
        throw error;
    }
};

// Ejecutar la generación de datos
// Este bloque se ejecuta cuando el archivo se ejecuta directamente
if (require.main === module) {
    try {
        generateSimpleData();
        console.log('\n✨ Script de generación completado exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('\n💥 Error crítico durante la generación:', error);
        process.exit(1);
    }
}

// Exportar la función para uso en otros módulos
export { generateSimpleData };
