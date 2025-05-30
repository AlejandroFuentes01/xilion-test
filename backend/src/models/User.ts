import bcrypt from 'bcryptjs';

// Interfaz que define la estructura de un usuario
export interface User {
    id: string;
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

// Almacenamiento simple de usuarios en memoria (para pruebas)
// En producción, esto sería una tabla de base de datos
const users: User[] = [
    {
        id: '1',
        username: 'admin',
        password: '$2a$10$8K1p/a9GlJp7z2r6p1D6LuGT1vKqXNqF3rJQz5sX9qZQWER7B4nQ6', // "password123"
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: '2',
        username: 'testuser',
        password: '$2a$10$8K1p/a9GlJp7z2r6p1D6LuGT1vKqXNqF3rJQz5sX9qZQWER7B4nQ6', // "password123"
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

export class UserService {
    // Busca un usuario por su nombre de usuario
    static async findByUsername(username: string): Promise<User | null> {
        const user = users.find(u => u.username === username);
        return user || null;
    }

    // Busca un usuario por su ID
    static async findById(id: string): Promise<User | null> {
        const user = users.find(u => u.id === id);
        return user || null;
    }

    // Crea un nuevo usuario con contraseña encriptada
    static async createUser(username: string, password: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser: User = {
            id: (users.length + 1).toString(),
            username,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        users.push(newUser);
        return newUser;
    }

    // Valida si una contraseña coincide con su versión encriptada
    static async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    // Obtiene todos los usuarios sin incluir sus contraseñas
    static getAllUsers(): Omit<User, 'password'>[] {
        return users.map(({ password, ...user }) => user);
    }

    // Actualiza un usuario existente
    static async updateUser(id: string, updateData: { username?: string; password?: string }): Promise<User> {
        const userIndex = users.findIndex(u => u.id === id);
        if (userIndex === -1) {
            throw new Error('Usuario no encontrado');
        }

        const user = users[userIndex];
        
        // Actualizar campos si se proporcionan
        if (updateData.username) {
            user.username = updateData.username;
        }
        
        if (updateData.password) {
            user.password = await bcrypt.hash(updateData.password, 10);
        }
        
        user.updatedAt = new Date();
        
        users[userIndex] = user;
        return user;
    }
}