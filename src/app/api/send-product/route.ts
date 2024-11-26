// // pages/api/send-product.js
// import { createConnection } from '@/lib/dbConnect' // Import your database connection utility
// import { uploadOnCloudinary } from '@/utils/cloudinary'

// export async function POST(request: Request) {
//   const connection = await createConnection()

//   const { userId, title, description } = await request.json()

//   try {
//     // Check if the user exists
//     console.log('userId', userId)

//     const [userResult] = await connection.query(`SELECT * FROM users WHERE id = ?`, [userId])

//     if (userResult.length === 0) {
//       return new Response(
//         JSON.stringify({
//           success: false,
//           message: 'User not found',
//         }),
//         { status: 404 },
//       )
//     }

//     const user = userResult[0]

//     let imageLocalPath;

//     if (request.files?.image) {
//       imageLocalPath = request.files?.image[0]?.path;
//   }

//   let imageUploaded;

//   if (imageLocalPath) {
//     imageUploaded = await uploadOnCloudinary(imageLocalPath);
// }

//     // Prepare the new product data
//     const newProduct = {
//       userId: user.id, // Assuming there's a userId reference in your products table
//       title,
//       description,
//       image: image || '',
//       createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '), // MySQL DATETIME format
//     }

//     await connection.query(
//       `INSERT INTO products (userId, title, description, image, createdAt) VALUES (?, ?, ?, ?, ?)`,
//       [
//         newProduct.userId,
//         newProduct.title,
//         newProduct.description,
//         newProduct.image,
//         newProduct.createdAt,
//       ],
//     )

//     return new Response(
//       JSON.stringify({
//         success: true,
//         message: 'Product sent successfully!',
//       }),
//       { status: 200 },
//     )
//   } catch (error: any) {
//     console.error('An error occurred while sending the product:', error.message)
//     return new Response(
//       JSON.stringify({
//         success: false,
//         message: error.message || 'Something went wrong',
//       }),
//       { status: 500 },
//     )
//   }
//   // } finally {
//   //   await connection.end() // Ensure the connection is closed
//   // }
// }

// pages/api/send-product.js
import { createConnection } from '@/lib/dbConnect' // Import your database connection utility
import { uploadOnCloudinary } from '@/utils/cloudinary'

export async function POST(request: Request) {
  const connection = await createConnection()

  const formData = await request.formData()

  const userId = formData.get('userId') // Access userId
  const title = formData.get('title') // Access title
  const description = formData.get('description') // Access description
  const image = formData.get('image') // Access image file

  try {
    console.log('title', title)
    console.log('description', description)

    const [userResult] = await connection.query(`SELECT * FROM users WHERE id = ?`, [userId])

    if (userResult.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'User not found',
        }),
        { status: 404 },
      )
    }

    const user = userResult[0]

    let imageUploaded

    if (image) {
      // Convert the File object to a Buffer
      const arrayBuffer = await image.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Upload the buffer to Cloudinary
      imageUploaded = await uploadOnCloudinary(buffer, image.name) // Pass the buffer and file name
    }

    // Prepare the new product data
    const newProduct = {
      userId: user.id, // Assuming there's a userId reference in your products table
      title,
      description,
      image: imageUploaded || '', // Assign the image URL if uploaded
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '), // MySQL DATETIME format
    }

    await connection.query(
      `INSERT INTO products (userId, title, description, image, createdAt) VALUES (?, ?, ?, ?, ?)`,
      [
        newProduct.userId,
        newProduct.title,
        newProduct.description,
        newProduct.image,
        newProduct.createdAt,
      ],
    )

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Product sent successfully!',
      }),
      { status: 200 },
    )
  } catch (error: any) {
    console.error('An error occurred while sending the product:', error.message)
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || 'Something went wrong',
      }),
      { status: 500 },
    )
  }
  // } finally {
  //   await connection.end(); // Ensure the connection is closed
  // }
}
