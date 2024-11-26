// pages/api/login.js
import bcrypt from 'bcrypt'
import { createConnection } from '@/lib/dbConnect' // Import your database connection utility

export async function POST(request: Request) {
  const connection = await createConnection()

  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Email and password are required',
        }),
        { status: 400 },
      )
    }

    // Query for the user by email
    const [users] = await connection.query(`SELECT * FROM users WHERE email = ?`, [email])

    // Check if user exists
    if (users.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'User with this email does not exist!',
        }),
        { status: 404 },
      )
    }

    const user = users[0] // Get the first user from the results

    // Check if the password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Password is not correct',
        }),
        { status: 401 },
      )
    }

    // User authenticated successfully
    return new Response(
      JSON.stringify({
        success: true,
        message: 'User logged in successfully',
        user: { id: user.id, username: user.username, email: user.email }, // Exclude password
      }),
      { status: 200 },
    )
  } catch (error: any) {
    console.error('Error logging in user:', error.message)
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
      }),
      { status: 500 },
    )
  }
  //   } finally {
  //     // Close the database connection
  //     await connection.end();
  //   }
}
