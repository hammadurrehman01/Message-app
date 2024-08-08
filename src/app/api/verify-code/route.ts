import dbConnect from '@/lib/dbConnect'
import UserModel from '@/models/user.model'

export async function POST(request: Request) {
  await dbConnect()

  try {
    const { username, code } = await request.json()
    const decodedUsername = decodeURIComponent(username)

    const user = await UserModel.findOne({ username: decodedUsername })

    if (!user) {
      return Response.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 500 },
      )
    }

    const isCodeValid = user.verifyCode === code
    const isCodeExpired = new Date(user.verifyCodeExpiry) < new Date()

    if (isCodeValid && !isCodeExpired) {
      user.isVerified = true
      await user.save()

      return Response.json(
        {
          success: true,
          message: 'User is verified successfully',
        },
        { status: 200 },
      )
    } else if (isCodeValid && isCodeExpired) {
      return Response.json(
        {
          success: false,
          message: 'The code is expired! Please signup again for the new verification code',
        },
        { status: 404 },
      )
    } else {
      return Response.json(
        {
          success: false,
          message: 'The verification code is incorrect',
        },
        { status: 404 },
      )
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'Error while verifying user',
      },
      { status: 500 },
    )
  }
}
