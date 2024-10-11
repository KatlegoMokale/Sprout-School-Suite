"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomInput from "./CustomInput";
import { Loader2 } from "lucide-react";
import { getLoggedInUser, signIn, signUp } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import { authFormSchema } from "@/lib/utils";

const formSchema = z.object({
  email: z.string().email(),
});

const AuthForm = ( {type }: {type: string}) => {
 const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setisLoading] = useState(false);
 

  const formSchema = authFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setisLoading(true);
    try {
      // Sign Up with appwrite & create plain link token
      
      if(type === 'sign-up'){
         const newUser = await signUp(data);
         console.log(newUser);
         setUser(newUser);
        
      }

      if(type === 'sign-in'){
          const response = await signIn({
              email: data.email,
              password: data.password,
          })

          if(response) router.push('/')
      }
    } catch (error) {
      console.log(error);
    }finally{
      setisLoading(false);
    }
  }

  return (
    <section className="auth-form">
      <header>
        <Link href="/" className="cursor-pointer flex items-center gap-1">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Horizon logo"
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            School Management
          </h1>
        </Link>
        <div className=" flex flex-col gap-1 md:gap-3">
          <h1 className=" text-24 lg:text-36 font-semibold text-gray-900">
          {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
            <p className="text-16 font-normal text-gray-600">
              {user
                ? "Link your account to get started"
                : "Please enter your details"}
            </p>
          </h1>
        </div>
      </header>
    
          <Form {...form}>

            <form onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-8">
              {type ==='sign-up' && (
              <>

              <div className=" flex gap-4">

               <CustomInput
                name="firstName"
                placeholder="First Name"
                label="First Name"
                control={form.control}
              />

              <CustomInput
                name="secondName"
                placeholder="Second Name"
                label="Second Name"
                control={form.control}
              />

              <CustomInput
                name="surname"
                placeholder="Surname"
                label="Surname"
                control={form.control}
              />

              </div>




              <CustomInput
                name="dateOfBirth"
                placeholder="Enter your date of birth"
                label="Date of Birth"
                type="date"
                control={form.control}
              />

              <div className="flex gap-4">

              <CustomInput
                name="idNumber"
                placeholder="Please enter your ID number"
                label="Id Number"
                control={form.control}
              />

              <CustomInput
                name="address1"
                placeholder="Enter your specific address"
                label="Address"
                control={form.control}
              />

              </div>

              <div className="flex gap-4">
              <CustomInput
                name="contact"
                placeholder="Please enter your contact number"
                label="Contact"
                control={form.control}
              />

              </div>

              </>
            )}
      
              <div className=" flex gap-4">
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
              
      
              <div className="flex flex-col gap-4">
                <Button type="submit" className="form-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : type === "sign-in" ? 
                    "Sign In"
                   : 
                    "Sign Up"
                  }
                </Button>
              </div>
              </div>
            </form>
          </Form>

          <footer className=" flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              className="form-link"
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
            >
              {type === "sign-in" ? "Sign up" : "Sign in"}
            </Link>
          </footer>
      {/* )} */}
    </section>
  );
};

export default AuthForm;
