import dbConnect from '@/lib/dbConnect'
import { getServerSession, User } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/options'
import UserModel from '@/models/user.model'
import mongoose from 'mongoose'
import { NextRequest } from 'next/server'

export async function DELETE(request: NextRequest, { params }: { params: { messageId: string } }) {
  try {
    await dbConnect()

    const messageId = params.messageId
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

    const result = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } },
    )

 
    
    console.log("result.modifiedCount ========>", result.modifiedCount)
 

    if (result.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: 'Message not found or already deleted',
        },
        { status: 404 },
      )
    }


    return Response.json(
      {
        success: true,
        message: 'Message deleted successfully',
      },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 200 },
    )
  }
}
