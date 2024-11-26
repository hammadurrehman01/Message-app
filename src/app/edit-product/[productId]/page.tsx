'use client'

import React, { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toast } from '@/components/ui/use-toast'
import { ApiResponse } from '@/types/ApiResponse'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Input } from '@/components/ui/input'

export default function EditProduct() {
  const params = useParams<{ productId: string }>()
  const productId = params.productId
  const [product, setProduct] = useState<any>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { data: session } = useSession();
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      userId: session?.user.id,
      title: '',
      description: '',
      image: '',
    },
  })

  // Load existing product data on component mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/get-product/${productId}`)
        const { title, description, image } = response.data.product
        setProduct(response.data)
        form.reset({
          userId: session?.user.id,
          title,
          description,
        })
        setImagePreview(image) // Set the initial image preview
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    }
    if (productId) fetchProduct()
  }, [productId, session?.user.id, form])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        form.setValue('image', file) // Store the file in form state
      }
      reader.readAsDataURL(file)
    }
  }

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data: any) => {
    const formData = new FormData()
    formData.append('userId', data.userId)
    formData.append('title', data.title)
    formData.append('description', data.description)
    if (data.image instanceof File) {
      formData.append('image', data.image) // Only append if a new file is selected
    }

    setIsLoading(true)
    try {
      const response = await axios.put<ApiResponse>(`/api/edit-product/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      toast({
        title: response.data.message,
        variant: 'default',
      })
      if(response.data.message === "Product updated successfully!") {
        router.replace("/dashboard")
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Error',
        description: axiosError.response?.data.message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='container mx-auto my-8 p-6 bg-white rounded max-w-4xl'>
      <h1 className='text-4xl font-bold mb-6 text-center'>Edit Product</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Edit Title</FormLabel>
                <FormControl>
                  <Input
                    className='bg-transparent border border-[#c5c5c517] active:!border-none'
                    placeholder='Enter title'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Edit Description</FormLabel>
                <FormControl>
                  <Input
                    className='bg-transparent border border-[#c5c5c517] active:!border-none'
                    placeholder='Enter description'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='image'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Edit Image</FormLabel>
                <FormControl>
                  <Input
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    className='bg-transparent border border-[#c5c5c517] active:!border-none'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {imagePreview && (
            <div className='flex'>
              <img
                width={200}
                src={imagePreview}
                alt='Image Preview'
                className='mt-4 max-w-full h-auto rounded'
              />
            </div>
          )}
          <div className='flex justify-center'>
            {isLoading ? (
              <Button disabled>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Please wait
              </Button>
            ) : (
              <Button type='submit' disabled={isLoading}>
                Update Product
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
