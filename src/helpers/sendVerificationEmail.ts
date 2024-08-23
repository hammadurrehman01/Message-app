import { resend } from '@/lib/resend'
import VerificationEmail from '../../emails/VerificationEmail'
import { ApiResponse } from '@/types/ApiResponse'
import UserModel from '@/models/user.model'

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Email verification code',
      react: VerificationEmail({ username, otp: verifyCode }),
    })

    return { success: true, message: 'Verification email send successfully' }
  } catch (error) {
    return { success: false, message: 'Failed to send verification email' }
  }
}
// hammadtechlabs
// re_PC9zLfEM_ACt9wrquU1Saz6DXgrav7SxU

export async function checkUsernameUnique(username: string) {
  const existingUser = await UserModel.findOne({ username, isVerified: true })

  if (existingUser) {
    return Response.json(
      {
        success: false,
        message: 'Username is already taken',
      },
      { status: 400 },
    )
  }
}
