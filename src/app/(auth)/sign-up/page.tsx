"use client"
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { signupSchema } from '@/schemas/signupSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounceCallback } from "usehooks-ts";
import { z } from 'zod';

const page = () => {
    const { toast } = useToast();
    const router = useRouter();

    const [username, setUsername] = useState<string>("");
    const [usernameMessage, setUsernameMessage] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);

    const debounced = useDebounceCallback(setUsername, 500);

    const form = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        }
    });

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true);
                setUsernameMessage("");
            }
            try {
                const response = await axios.get(`/api/check-unique-username?username=${username}`);
                setUsernameMessage(response.data.message);

            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                setUsernameMessage(axiosError.response?.data.message ?? "Error checking username");
            } finally {
                setIsCheckingUsername(false);
            }
        }
        checkUsernameUnique();
    }, [debounced])

    const onSubmit = async (data: z.infer<typeof signupSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post("/api/sign-up", data);
            if (data) {
                toast({
                    title: "Success",
                    description: response.data.message
                })
            }
            router.replace(`/verify/${username}`)

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message;
            toast({
                title: "Signup failed",
                description: errorMessage,
                variant: 'destructive'
            })
        }
        finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Welcome Back to True Feedback
                    </h1>
                    <p className="mb-4">Sign in to continue your secret conversations</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField control={form.control}
                            name='username'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        {isCheckingUsername && <Loader2 className='animate-spin' />}
                                        <p className={`text-sm ${usernameMessage === 'Username is unique' ? 'text-green-500' : 'text-red-500'}`}>{usernameMessage}</p>
                                        <Input
                                            placeholder='username'
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e.target.value)
                                                setUsername(e.target.value)
                                            }} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                        <FormField control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='email'
                                            {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                        <FormField control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder='password'
                                            {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                        <Button type='submit'>
                            {
                                isSubmitting ? (
                                    <>
                                        <Loader2 className='w-4 h-4 animate-spin' />
                                    </>
                                ) : "Signup"
                            }
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Already a member?{' '}
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default page