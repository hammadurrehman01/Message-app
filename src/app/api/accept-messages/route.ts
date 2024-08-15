import dbConnect from '@/lib/dbConnect'
import { getServerSession, User } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/options'
import UserModel from '@/models/user.model'

export async function POST(request: Request) {
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

  const userId = user._id

  const { acceptMessages } = await request.json()

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true },
    )

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 },
      )
    }

    return Response.json(
      {
        success: true,
        message: 'Message acceptance status updated successfully',
        updatedUser,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.log(error.message)

    return Response.json(
      {
        success: false,
        message: 'Failed to update user status to accept messages',
      },
      { status: 401 },
    )
  }
}

export async function GET(request: Request) {
  await dbConnect();

  try {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  // Check if the user is authenticated
  if (!session || !user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

    // Retrieve the user from the database using the ID
    const foundUser = await UserModel.findById(user._id);

    if (!foundUser) {
      // User not found
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Return the user's message acceptance status
    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving message acceptance status:', error);
    return Response.json(
      { success: false, message: 'Error retrieving message acceptance status' },
      { status: 500 }
    );
  }
}