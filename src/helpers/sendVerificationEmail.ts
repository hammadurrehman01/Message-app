import { resend } from '@/lib/resend'
import VerificationEmail from '../../emails/VerificationEmail'
import { ApiResponse } from '@/types/ApiResponse'

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
    console.log('email sent')
    console.log('email ===>', email)

    return { success: true, message: 'Verification email send successfully' }
  } catch (error) {
    return { success: false, message: 'Failed to send verification email' }
  }
}
