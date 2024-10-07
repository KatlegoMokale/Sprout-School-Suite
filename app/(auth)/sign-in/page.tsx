"use client"
import React, { useState } from 'react'
import AuthFormLogin from '@/components/ui/AuthFormLogin'
import { Form } from '@/components/ui/form'
import { authformSchemaLogin } from '@/lib/utils';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomInput from '@/components/ui/CustomInput';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/button';

const formSchema = authformSchemaLogin();


const SignIn = () => {

  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setisLoading] = useState(false);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

 const onSubmit = async (data: z.infer<typeof formSchema>) => {
  setisLoading(true);
  try {
      const response = await signIn({
          email: data.email,
          password: data.password,
      })

      if(response) router.push('/')

      } catch (error) {
        console.log(error);
      }finally{
        setisLoading(false);
      }
 }

  return (
    <div className=' container'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <CustomInput<z.infer<typeof formSchema>>
              name="email"
              placeholder="Please enter your email"
              label="Email"
              control={form.control}
            />
            <CustomInput<z.infer<typeof formSchema>>
              name="password"
              placeholder="Please enter your password"
              label="Password"
              control={form.control}
              />
        </form>
        <Button className=' btn-primary' type='submit'>
          Login
        </Button>
      </Form>
    </div>
  )
}

export default SignIn