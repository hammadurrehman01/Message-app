'use client'

import React, { useState } from 'react'
import axios, { AxiosError } from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CardHeader, CardContent, Card } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import * as z from 'zod'
import { ApiResponse } from '@/types/ApiResponse'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { messageSchema } from '@/schemas/messageSchema'
import { suggestedMessageChildDiv, suggestedMessageParentDiv } from '@/styles/styles'
import { Skeleton } from '@/components/ui/skeleton'

const specialChar = '||'

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar)
}

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?"

export default function SendMessage() {
  const params = useParams<{ username: string }>()
  const username = params.username
  const [suggestedMessages, setSuggestedMessages] = useState('')
  const [message, setMessage] = useState('')

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  })

  // TODO update and delete
  // const messageContent = form.watch('content')

  const handleMessageClick = (message: string) => {
    form.setValue('content', message)
  }

  const [isLoading, setIsLoading] = useState(false)
  const [isfetching, setIsfetching] = useState(false)

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true)
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      })

      toast({
        title: response.data.message,
        variant: 'default',
      })
      form.reset({ ...form.getValues(), content: '' })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to sent message',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSuggestedMessages = async () => {
    setIsfetching(true)
    try {
      const response = await axios.post<any>('/api/suggest-messages')
      setSuggestedMessages(response.data.message.response.candidates[0].content.parts[0].text || '')
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsfetching(false)
    }
  }

  const suggestMessagesArr = suggestedMessages.split('||')

  const defaultMessagesArr = [
    "What's a major accomplishment you're proud of?",
    'If you could change one thing in the world, what would it be?',
    "What's the toughest challenge you've overcome?",
  ]

  const handleMessageValue = (value: string) => {
    setMessage(value)
  }

  return (
    <div className='container mx-auto my-8 p-6 bg-white rounded max-w-4xl'>
      <h1 className='text-4xl font-bold mb-6 text-center'>Public Profile Link</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Write your anonymous message here'
                    className='resize-none'
                    {...field}
                 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex justify-center'>
            {isLoading ? (
              <Button disabled>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Please wait
              </Button>
            ) : (
              <Button type='submit' disabled={isLoading}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className='space-y-4 my-8'>
        <div className='space-y-2'>
          <Button
            onClick={fetchSuggestedMessages}
            className='my-4'
            // disabled={isSuggestLoading}
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className='text-xl font-semibold'>Messages</h3>
          </CardHeader>
          <CardContent className='flex flex-col space-y-4'>
            {isfetching ? (
              <>
                <Skeleton className='h-6 w-full' />
                <Skeleton className='h-6 w-full' />
                <Skeleton className='h-6 w-full' />
              </>
            ) : (
              <div className={suggestedMessageParentDiv}>
                {suggestMessagesArr[0] === ''
                  ? defaultMessagesArr.map((defaultMsg, index) => (
                      <div
                        key={index}
                        className={suggestedMessageChildDiv}
                        onClick={() => handleMessageClick(defaultMsg)}
                      >
                        {defaultMsg}
                      </div>
                    ))
                  : suggestMessagesArr.map((suggestMsg, index) => (
                      <div
                        key={index}
                        className={suggestedMessageChildDiv}
                        onClick={() => handleMessageClick(suggestMsg)}
                      >
                        {suggestMsg}
                      </div>
                    ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className='my-6' />
      <div className='text-center'>
        <div className='mb-4'>Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  )
}
