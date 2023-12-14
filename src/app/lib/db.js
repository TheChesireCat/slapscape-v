
import postgres from 'postgres'


const connectionString = process.env.SUPA_CONNECTION_STRING
const sql = postgres(connectionString)

export default sql;


