// pages/api/edit-product.js
import { createConnection } from '@/lib/dbConnect'
import { uploadOnCloudinary } from '@/utils/cloudinary'

export async function PUT(request: Request, { params }: { params: { productId: string } }) {
  const connection = await createConnection()
  const formData = await request.formData()

  const productId = params.productId;
  const userId = formData.get('userId')
  const title = formData.get('title')
  const description = formData.get('description')
  const image = formData.get('image') // Access image file if uploaded

  try {
    // Fetch the existing product to ensure it exists
    const [productResult] = await connection.query(`SELECT * FROM products WHERE id = ?`, [productId])

    if (productResult.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'Product not found' }),
        { status: 404 },
      )
    }

    let imageUploadedUrl

    // Check if a new image is uploaded and handle upload
    if (image && image instanceof File) {
      const arrayBuffer = await image.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Upload the image buffer to Cloudinary
      imageUploadedUrl = await uploadOnCloudinary(buffer, image.name)
    }

    // Update the product in the database
    await connection.query(
      `UPDATE products SET title = ?, description = ?, image = ?, updatedAt = ? WHERE id = ?`,
      [
        title,
        description,
        imageUploadedUrl || productResult[0].image, // Use new image URL or keep the old one if no new image
        new Date().toISOString().slice(0, 19).replace('T', ' '), // MySQL DATETIME format
        productId,
      ]
    )

    return new Response(
      JSON.stringify({ success: true, message: 'Product updated successfully!' }),
      { status: 200 },
    )
  } catch (error: any) {
    console.error('An error occurred while updating the product:', error.message)
    return new Response(
      JSON.stringify({ success: false, message: error.message || 'Something went wrong' }),
      { status: 500 },
    )
  }
}
