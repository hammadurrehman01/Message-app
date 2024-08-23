import dbConnect from '@/lib/dbConnect'
import { getServerSession, User } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/options'
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

  const userId = user._id
}
