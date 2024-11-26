'use client'

import ProductCard from '@/components/ui/ProductCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw, SquarePlus } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import Link from 'next/link'

function UserDashboard() {
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const { toast } = useToast()

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((product) => product.id !== productId))
  }

  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  })

  const fetchProducts = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true)
      setIsSwitchLoading(false)
      try {
        const response = await axios.get<ApiResponse>('/api/get-products')

        console.log('response ==> ', response)

        setProducts(response.data.products || [])
        if (refresh) {
          toast({
            title: 'Refreshed Products',
            description: 'Showing latest products',
          })
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
        setIsSwitchLoading(false)
      }
    },
    [toast],
  )

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts()
  }, [])

  if (!session || !session.user) {
    return <div></div>
  }

  const { username } = session.user as User

  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`


  return (
    <div className='mt-4 mx-4 md:mx-8 lg:mx-auto p-6 scale-90 rounded w-full max-w-6xl'>
      <div className='flex items-center justify-between'>
        <h1 className='text-4xl font-bold mb-4 '>
          {session.user.isAdmin === 0 ? "User's" : "Admin's "} Dashboard
        </h1>
        <Link
          href={`/u/${username}`}
          className='flex items-center justify-centent bg-[#111827] px-4 py-2 gap-2 rounded-lg hover:scale-105 transition ease-in-out duration-150'
        >
          <span className='text-xl font-medium text-white cursor-pointer'>Add Product</span>
          <SquarePlus className='text-white' />
        </Link>
      </div>

      <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id as number}
              product={product}
              onProductDelete={handleDeleteProduct}
            />
          ))
        ) : (
          <p>No products to display.</p>
        )}
      </div>
    </div>
  )
}

export default UserDashboard
