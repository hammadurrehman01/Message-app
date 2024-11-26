// pages/api/get-products.js
import { createConnection } from '@/lib/dbConnect' // Import your database connection utility
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/options'

export async function GET(request: Request) {
  const connection = await createConnection()

  try {
    const session = await getServerSession(authOptions)
    console.log("session =>", session);
    
    const _user = session?.user

    if (!session || !_user) {
      return new Response(JSON.stringify({ success: false, message: 'Not authenticated' }), {
        status: 401,
      })
    }

    // Query to check if the user is an admin
    const [userResult] = await connection.query(
      `SELECT isAdmin FROM users WHERE id = ?`,
      [_user.id], // Assuming _user.id is the ID in your database
    )

    if (userResult.length === 0) {
      return new Response(JSON.stringify({ success: false, message: 'User not found' }), {
        status: 404,
      })
    }

    const user = userResult[0]
    
    // if (user.isAdmin) {
    //   // Admin can see all products
    //   const [allProducts] = await connection.query(`SELECT * FROM products ORDER BY createdAt DESC`)
    //   products = allProducts
    // } else {
    //   // Regular user can only see their products
    //   const [userProducts] = await connection.query(
    //     `SELECT * FROM products WHERE userId = ? ORDER BY createdAt DESC`,
    //     [_user.id], // Assuming _user.id is the ID in your database
    //   )
    //   products = userProducts
    // }



    let products;
    
    if (user.isAdmin) {
      // Admin can see all products along with their associated user details
      const [allProducts] = await connection.query(`
        SELECT products.*, users.id AS userId, users.username, users.email 
        FROM products 
        JOIN users ON products.userId = users.id 
        ORDER BY products.createdAt DESC
      `);
      products = allProducts;
    } else {
      // Regular user can only see their products along with their details
      const [userProducts] = await connection.query(`
        SELECT products.*, users.id AS userId, users.username, users.email 
        FROM products 
        JOIN users ON products.userId = users.id 
        WHERE products.userId = ? 
        ORDER BY products.createdAt DESC
      `, [_user.id]);
      products = userProducts;
    }



    return new Response(JSON.stringify({ success: true, products: products || [] }), {
      status: 200,
    })
  } catch (error: any) {
    console.error('An unexpected error occurred:', error.message)
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 })
  }
  // } finally {
  //   await connection.end(); // Close the database connection
  // }
}
