// pages/api/get-product/[productId].js
import { createConnection } from '@/lib/dbConnect' // Import your database connection utility

export async function GET(request: Request, { params }: { params: { productId: string } }) {
  const connection = await createConnection()
  const productId = params.productId
  try {
    // Query for the product by ID
    const [products] = await connection.query(`SELECT * FROM products WHERE id = ?`, [productId])

    // Check if the product exists
    if (products.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Product not found',
        }),
        { status: 404 },
      )
    }

    // Return the product details
    return new Response(
      JSON.stringify({
        success: true,
        product: products[0], // Get the first product from the result
      }),
      { status: 200 },
    )
  } catch (error: any) {
    console.error('Error fetching product:', error.message)
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
      }),
      { status: 500 },
    )
  }
  // } finally {
  //   await connection.end() // Ensure the connection is closed
  // }
}
