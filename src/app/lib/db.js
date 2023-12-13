import mysql from 'mysql2/promise';

import postgres from 'postgres'

// const sql = postgres({ 
//   host: process.env.POSTGRES_HOST,
//   port: process.env.POSTGRES_PORT,
//   database: process.env.POSTGRES_DB,
//   user: process.env.POSTGRES_USER,
//   onnotice: notice => {return notice;}
//  }) 

const connectionString = process.env.SUPA_CONNECTION_STRING
const sql = postgres(connectionString,{ssl:true})

export default sql;


export async function executeQuery({ query, values }) {
  try {
    const db = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    });
    const results = await db.query(query, values);
    await db.end();
    return results;
  } catch (error) {
    throw error;
  }
}
