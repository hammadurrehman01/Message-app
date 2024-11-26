import bcrypt from 'bcrypt'
import { createConnection } from '@/lib/dbConnect'

export async function POST(request: Request) {
  const connection = await createConnection();
  console.log("connection ========>", connection);
  

  try {
    const { username, email, password } = await request.json()

    const [existingUserByEmail] = await connection.query(`SELECT * FROM users WHERE email = ?`, [
      email,
    ])

    if (existingUserByEmail.length !== 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Email is already taken',
        }),
        { status: 400 },
      )
    }

    // Insert a new user if no existing user is found
    const hashedPassword = await bcrypt.hash(password, 10)
    await connection.query(
      `INSERT INTO users (username, email, password, isAdmin) VALUES (?, ?, ?, ?)`,
      [username, email, hashedPassword, false],
    )

    return new Response(
      JSON.stringify({
        success: true,
        message: 'User registered successfully',
      }),
      { status: 200 },
    )
  } catch (error: any) {
    console.error('Error registering user:', error.message)
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
      }),
      { status: 500 },
    )
  }
  // } finally {
  //   // Close the database connection
  //   await connection.end();
  // }
}
