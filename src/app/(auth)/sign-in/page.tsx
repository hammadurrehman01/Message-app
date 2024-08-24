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
import { signinSchema } from '@/schemas/signinSchema'
import { signupSchema } from '@/schemas/signupSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { z } from 'zod'

const page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    console.log("triggered");
    
   
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    })

    const error = result?.error

    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      })
    }

    if (result?.url) {
      router.replace('/dashboard')
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
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='identifier'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email/Username</FormLabel>
                    <FormControl>
                      <div>
                        <Input
                          placeholder='Enter email/username'
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin'>Logging in</Loader2>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default page
