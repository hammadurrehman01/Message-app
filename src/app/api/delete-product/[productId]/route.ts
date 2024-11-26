// pages/api/delete-message/[messageId].js
import { createConnection } from '@/lib/dbConnect' // Import your database connection utility
import { getServerSession, User } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/options'

export async function DELETE(request: Request, { params }: { params: { productId: string } }) {
  const connection = await createConnection()
  const productId = params.productId
  console.log('params ====>', params)

  try {
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Unauthorized User',
        }),
        { status: 401 },
      )
    }

    // Delete the message from the database
    const [result] = await connection.query(
      `DELETE FROM products WHERE id = ? AND userId = ?`,
      [productId, user.id], // Assuming user.id is the ID of the logged-in user
    )

    console.log('result', result)

    // Check if a message was deleted
    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Message not found or already deleted',
        }),
        { status: 404 },
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Message deleted successfully',
      }),
      { status: 200 },
    )
  } catch (error: any) {
    console.error('Error deleting message:', error.message)
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
      }),
      { status: 500 },
    )
  } finally {
    await connection.end() // Ensure the connection is closed
  }
}
