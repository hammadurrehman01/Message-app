// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from '@radix-ui/react-alert-dialog'
// import { Button } from '@/components/ui/button'
// import { X } from 'lucide-react'
// import React from 'react'
// import { AlertDialogFooter, AlertDialogHeader } from '../ui/alert-dialog'
// interface Props {
//   title: string
//   description: string
//   onClick: () => void
//   onClose: () => void
//   setIsModalOpen: boolean
//   isModalOpen: boolean
// }

// const Modal = ({ title, description, onClick, onClose, isModalOpen, setIsModalOpen }: Props) => {
//   return (
//     <AlertDialog open={isModalOpen} onOpenChange={true}>
//       <AlertDialogTrigger popover='auto'>
//         {/* Trigger button can be removed if handled elsewhere */}
//       </AlertDialogTrigger>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>{title}</AlertDialogTitle>
//           <AlertDialogDescription>{description}</AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
//           <AlertDialogAction onClick={onClick}>Continue</AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   )
// }

// export default Modal
