import dbConnect from '@/lib/dbConnect'
import { usernameValidation } from '@/schemas/signupSchema'
import z from 'zod'

const UsernameQuerySchema = z.object({
    username: usernameValidation,
})

export async function GET(request: Request) {
    await dbConnect()

    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username'),
        }
    } catch (err) {
        console.log('Error checking username', err)
        return Response.json(
            {
                success: false,
                message: 'Error checking username',
            },
            { status: 500 },
        )
    }
}
