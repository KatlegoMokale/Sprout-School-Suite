'use client'

import React, { useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/actions/user.actions'
import { Loader2, Github, Twitter } from 'lucide-react'
import Image from 'next/image'

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import CustomInput from '@/components/ui/CustomInput'

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  rememberMe: z.boolean().default(false),
})

export default function SignInAuth() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const response = await signIn({
        email: data.email,
        password: data.password,
      })
      if (response) {
        router.push('/')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <CustomInput<z.infer<typeof formSchema>>
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                />
                <CustomInput<z.infer<typeof formSchema>>
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={form.watch('rememberMe')}
                    onCheckedChange={(checked) => form.setValue('rememberMe', checked as boolean)}
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
                <Button type="submit" className="w-full shadow-sm"  disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {/* <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" className="w-full">
                <Github className="mr-2 h-4 w-4" /> Github
              </Button>
              <Button variant="outline" className="w-full">
                <Twitter className="mr-2 h-4 w-4" /> Twitter
              </Button>
            </div> */}
          </CardFooter>
        </Card>
      </div>
      <div className="hidden lg:flex flex-1 bg-green-50 items-center justify-center">
        <Image 
          src='/assets/sssLogo.png'
          alt='Auth image'
          width={500}
          height={500}
          className="max-w-md"
        />
      </div>
    </div>
  )
}