import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req) {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
        });

        const data = await req.formData();
        const username = data.get('username');
        const password = data.get('password');
        const password_hash = await bcrypt.hash(password, 10);

        // check if username exists 
        const [rows1] = await connection.execute(
            'SELECT * FROM User WHERE username = ?',
            [username]
        );
        if (rows1.length > 0) {
            // Username already exists
            return new NextResponse(JSON.stringify({ error: 'Username already exists' }), { status: 401 });
        }

        const [rows] = await connection.execute(
            'INSERT INTO User (username, password) VALUES (?, ?)',
            [username, password_hash]
        );
        
        // It's good to await the end of the connection
        await connection.end();

        // Redirect after the connection has ended
        return new NextResponse(null, { status: 302, headers: { Location: '/login' } });
    } catch (error) {
        // Handle the error
        console.error('An error occurred:', error);
        // You should return an appropriate error response here
        return new NextResponse(JSON.stringify({ error: 'An error occurred' }), { status: 500 });
    } finally {
        // Ensure connection is closed even if error occurs
        if (connection) {
            await connection.end();
        }
    }
}
