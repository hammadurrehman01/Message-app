import dbConnect from '@/lib/dbConnect'
import { getServerSession, User } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/options'
import UserModel from '@/models/user.model'

export async function GET() {
  await dbConnect()

  const session = await getServerSession(authOptions)
  const user: User = session?.user as User

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: 'Unauthorized User',
      },
      { status: 401 },
    )
  }

  const userId = user._id;

  try {
    const user = await UserModel.aggregate([
      { $match: { id: userId } },
      { $unwind: '$messages' },
      { $sort: { 'messages.createdAt': -1 } },
      { $group: { _id: '$_id', messages: { $push: '$messages' } } },
    ])

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 401 },
      )
    }

    return Response.json(
      {
        success: true,
        message: user[0].messages,
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
