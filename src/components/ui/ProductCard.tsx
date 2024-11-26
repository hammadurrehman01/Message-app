'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ApiResponse } from '@/types/ApiResponse'
import axios from 'axios'
import dayjs from 'dayjs'
import { Pencil, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from './button'
import { useToast } from './use-toast'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

interface Props {
  product: any
  onProductDelete: (value: string) => void
}

const ProductCard = ({ product, onProductDelete }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)
  const { toast } = useToast()
  const { data: session } = useSession()
  const username = session?.user.username

  const handleDeleteConfirm = async () => {

    const response = await axios.delete<ApiResponse>(`/api/delete-product/${product.id}`)
    toast({
      title: response.data.message,
    })
    onProductDelete(product.id as string)
  }

  return (
    <Card className='card-bordered'>
      <CardHeader>
        <div className=''>
          <CardTitle className='text-center'>{product.title}</CardTitle>
          <CardTitle className='mt-4 font-extralight text-xl text-center tracking-wide'>
            {product.description}
          </CardTitle>
            <img
              src={product.image}
              alt='product-image'
              width={400}
              height={200}
              className='m-auto mt-4 rounded-lg'
            />
          <Image
            src={product.image}
            alt='product-image'
            width={400}
            height={200}
            className='m-auto mt-4 rounded-lg'
            priority={true}
          />
          <AlertDialog>
            <div className='flex items-center justify-center gap-2 mt-2'>
              <h3>Product owner:</h3>
              <p>{product.username}</p>
            </div>
            <div className='flex items-center justify-center gap-12 mt-5'>
              <AlertDialogTrigger asChild>
                <Button className='hover:bg-red-600 transition ease-in duration-200' variant='destructive'>
                  <X className='w-5 h-5' />
                </Button>
              </AlertDialogTrigger>
              <Button className='bg-blue-400 hover:bg-blue-600 transition ease-in duration-200' variant='destructive'>
                <Link href={`/edit-product/${product.id}`}>
                  <Pencil />
                </Link>
              </Button>
            </div>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  )
}

export default ProductCard
