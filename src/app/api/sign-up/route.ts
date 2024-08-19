import dbConnect from '@/lib/dbConnect'
import bcrypt from 'bcrypt'
import { checkUsernameUnique, sendVerificationEmail } from '@/helpers/sendVerificationEmail'
import UserModel from '@/models/user.model'

export async function POST(request: Request) {
  await dbConnect()
  try {
    const { username, email, password } = await request.json()

    // TODO update and delete
    // const existingUserVerifiedByUsername = await UserModel.findOne({
    //   username,
    //   isVerified: true,
    // })

    // if (existingUserVerifiedByUsername) {
    //   return Response.json(
    //     {
    //       success: false,
    //       message: 'Username is already taken',
    //     },
    //     { status: 400 },
    //   )
    // }

   await checkUsernameUnique(username);

    const existingUserByEmail = await UserModel.findOne({ email })

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: 'User with this email is already exists',
          },
          { status: 400 },
        )
      } else {
        const hashedPassword = await bcrypt.hash(password, 10)
        existingUserByEmail.password = hashedPassword
        existingUserByEmail.verifyCode = verifyCode
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600)
        await existingUserByEmail.save()
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10)
      const expiryDate = new Date()
      expiryDate.setHours(expiryDate.getHours() + 1)

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      })
      await newUser.save()
    }

    const emailResponse = await sendVerificationEmail(email, username, verifyCode)
    
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 },
      )
    }
    return Response.json(
      {
        success: true,
        message: emailResponse.message,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error registering user', error)
    return Response.json(
      {
        success: false,
        message: 'Error registering user',
      },
      {
        status: 500,
      },
    )
  }
}
