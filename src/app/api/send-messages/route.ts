import dbConnect from '@/lib/dbConnect'
import UserModel, { Message } from '@/models/user.model'

export async function POST(request: Request) {
  await dbConnect()

  const { username, content } = await request.json()

  try {
    const user = await UserModel.findOne({ username })

    if (!user) {
      return Response.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 },
      )
    }

    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: 'Unauthorized User',
        },
        { status: 403 },
      )
    }

    const newMessage = {
      content,
      createdAt: new Date(),
    }

    user.messages.push(newMessage as Message)
    await user.save()

    return Response.json(
      {
        success: true,
        message: 'Message sent successfully!',
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.log(error.message)
    return Response.json(
      {
        success: false,
        message: error.message || 'Something went wrong',
      },
      { status: 500 },
    )
  }
}
