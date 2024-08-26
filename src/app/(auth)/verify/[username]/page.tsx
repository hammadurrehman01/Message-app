'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

const VerifyAccount = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(verifySchema),
  })

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post('/api/verify-code', {
        username: params.username,
        code: data.code,
      })
      toast({
        title: 'Success',
        description: response.data.message,
      })
      router.replace('/sign-in')
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      if (axiosError.response?.data.message) {
        toast({
          title: 'Error',
          description: axiosError.response?.data.message,
          variant: 'destructive',
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-800'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
            Welcome Back to True Feedback
          </h1>
          <p className='mb-4'>Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              name='code'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder='code' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit'>
              {isSubmitting ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : 'Submit'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default VerifyAccount