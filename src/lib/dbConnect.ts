import mysql from 'mysql2/promise'

let connection: any

export const createConnection = async () => {
  try {
    if (!connection) {
      connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
      })
      console.log('Connect hogaya bhai!')
    }
    return connection
  } catch (error: any) {
    console.log(error.message)

  }
}
