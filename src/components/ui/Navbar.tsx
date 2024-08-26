'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'
import { navButton } from '@/styles/styles'
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

const Navbar = () => {
  const { data: session } = useSession()

  const user: User = session?.user as User

  return (
    <nav className='p-4 md:p-6 shadow-md bg-gray-900 text-white'>
      <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
        <a href='#' className='text-xl font-bold mb-4 md:mb-0'>
          Message App
        </a>
        {session ? (
          <>
            <span className='mr-4'>Welcome, {user.username || user.email}</span>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className={navButton} variant='destructive'>
                  Logout
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className='p-10'>
                <AlertDialogHeader>
                  <AlertDialogTitle className='text-center'>
                    Are you sure you want to logout?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter className='!justify-center gap-4'>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => signOut()}>Yes, Logout</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : (
          <Link href='/sign-in'>
            <Button className={navButton} variant={'outline'}>
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
