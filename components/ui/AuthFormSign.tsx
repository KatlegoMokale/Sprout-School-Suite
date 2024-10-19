"use client";
import React, { useState } from 'react'
import AuthFormLogin from '@/components/ui/AuthFormLogin'
import { Form } from '@/components/ui/form'
import { authformSchemaLogin } from '@/lib/utils';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomInput from '@/components/ui/CustomInput';
import { useRouter } from 'next/navigation';
import { getLoggedInUser, signIn } from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// const formSchema = z.object({
//   email: z.string().email(),
// });


const SignInAuth = () => {

  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setisLoading] = useState(false);

  const formSchema = authformSchemaLogin();

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
    console.log("On submit Login");
      const response = await signIn({
          email: data.email,
          password: data.password,
      })
      if(response) {
        router.push('/')
      }

      } catch (error) {
        console.log(error);
      }finally{
        setisLoading(false);
      }
 }

  return (

      <div className='container items-center justify-center flex flex-col gap-5 px-20'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
           <div className=' flex flex-col gap-5'>
           <div>
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
              type='password'
              control={form.control}
              />
           </div>
              <Button type="submit" className="form-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ): 
                    "Sign In"
                  }
        </Button>
           </div>
        </form>
        
      </Form>
    </div>

  )
}

export default SignInAuth