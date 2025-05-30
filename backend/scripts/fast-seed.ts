import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { authorsDB, booksDB } from '../src/config/database';

// Cargar variables de entorno
dotenv.config();

const fastSeed = async () => {
    try {
        console.log('🚀 Iniciando seeding rápido desde JSON...');
        const startTime = Date.now();

        // Verificar que el archivo JSON existe
        const jsonPath = path.join(__dirname, 'library-data.json');
        if (!fs.existsSync(jsonPath)) {
            console.error('❌ Archivo library-data.json no encontrado');
            console.log('💡 Ejecuta primero: npm run generate-data');
            process.exit(1);
        }

        console.log('📄 Leyendo datos del archivo JSON...');
        const rawData = fs.readFileSync(jsonPath, 'utf8');
        const data = JSON.parse(rawData);

        console.log(`📊 Datos cargados: ${data.authors.length} autores, ${data.books.length} libros`);
        console.log(`📅 Generados el: ${new Date(data.metadata.generatedAt).toLocaleString()}`);

        // Verificar conectividad a las bases de datos
        console.log('🔗 Verificando conectividad...');
        await authorsDB.$queryRaw`SELECT 1`;
        await booksDB.$queryRaw`SELECT 1`;
        console.log('✅ Conexión a bases de datos: OK');

        // Limpiar datos existentes
        console.log('🧹 Limpiando datos existentes...');
        const deletedBooks = await booksDB.book.deleteMany();
        const deletedAuthors = await authorsDB.author.deleteMany();
        console.log(`   ├── Libros eliminados: ${deletedBooks.count}`);
        console.log(`   └── Autores eliminados: ${deletedAuthors.count}`);

        // Insertar autores
        console.log('👥 Insertando autores...');
        await authorsDB.author.createMany({
            data: data.authors,
            skipDuplicates: true
        });

        // Obtener autores insertados para mapear IDs
        const insertedAuthors = await authorsDB.author.findMany({
            orderBy: { createdAt: 'asc' }
        });

        console.log(`✅ ${insertedAuthors.length} autores insertados`);

        // Preparar datos de libros con IDs reales de autores
        console.log('📚 Preparando libros con IDs de autores...');
        const booksData = data.books.map((book: any) => ({
            title: book.title,
            authorId: insertedAuthors[book.authorIndex].id,
            genre: book.genre,
            publishedYear: book.publishedYear
        }));

        // Insertar libros en lotes para optimizar rendimiento
        console.log('📖 Insertando libros en lotes...');
        const batchSize = 2000; // Lotes más grandes para mayor velocidad
        let totalBooksCreated = 0;
        const totalBatches = Math.ceil(booksData.length / batchSize);

        for (let i = 0; i < booksData.length; i += batchSize) {
            const batchNumber = Math.floor(i / batchSize) + 1;
            const batch = booksData.slice(i, i + batchSize);

            console.log(`   📦 Lote ${batchNumber}/${totalBatches} (${batch.length} libros)...`);

            const result = await booksDB.book.createMany({
                data: batch,
                skipDuplicates: true
            });

            totalBooksCreated += result.count;
            console.log(`   ✅ Lote ${batchNumber} completado: ${result.count} libros`);
        }

        // Verificar resultados finales
        console.log('🔍 Verificando resultados...');
        const finalAuthorCount = await authorsDB.author.count();
        const finalBookCount = await booksDB.book.count();

        // Verificar el libro especial
        const wayOfKings = await booksDB.book.findFirst({
            where: { title: 'The Way of Kings' }
        });

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        console.log('\n🎉 ¡Seeding rápido completado exitosamente!');
        console.log('📊 Resumen final:');
        console.log(`   ├── Autores: ${finalAuthorCount}`);
        console.log(`   ├── Libros: ${finalBookCount}`);
        console.log(`   ├── Tiempo total: ${duration} segundos`);
        console.log(`   └── Velocidad: ${Math.round(finalBookCount / parseFloat(duration))} libros/segundo`);

        if (wayOfKings) {
            console.log(`🗡️  "The Way of Kings" confirmado: ID ${wayOfKings.id}`);
        }

        // Estadística rápida de géneros
        const genreStats = await booksDB.book.groupBy({
            by: ['genre'],
            _count: { genre: true },
            orderBy: { _count: { genre: 'desc' } },
            take: 3
        });

        console.log('\n📈 Top 3 géneros:');
        genreStats.forEach((stat, index) => {
            console.log(`   ${index + 1}. ${stat.genre}: ${stat._count.genre} libros`);
        });

    } catch (error) {
        console.error('❌ Error en seeding rápido:', error);
        if (error instanceof Error) {
            console.error('📝 Mensaje:', error.message);
        }
        throw error;
    } finally {
        await booksDB.$disconnect();
        await authorsDB.$disconnect();
        console.log('🔌 Desconectado de bases de datos');
    }
};

// Ejecutar si se llama directamente
if (require.main === module) {
    fastSeed()
        .then(() => {
            console.log('✨ Fast seed completado exitosamente');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Fast seed falló:', error);
            process.exit(1);
        });
}

export { fastSeed };
