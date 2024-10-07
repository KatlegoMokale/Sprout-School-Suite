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
import { authformSchemaLogin } from "@/lib/utils";

const formSchema = authformSchemaLogin();

const AuthForm = () => {
 const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setisLoading] = useState(false);
 

  const formSchema = authformSchemaLogin();

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
      // Sign In
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
            Horizon
          </h1>
        </Link>
        <div className=" flex flex-col gap-1 md:gap-3">
          <h1 className=" text-24 lg:text-36 font-semibold text-gray-900">
            sign-in
            <p className="text-16 font-normal text-gray-600">
              {/* {user
                ? "Link your account to get started"
                : "Please enter your details"} */}
            </p>
          </h1>
        </div>
      </header>
    
          <Form {...form}>

            <form onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-8">
      
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
            {/* <p className="text-14 font-normal text-gray-600">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              className="form-link"
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
            >
              {type === "sign-in" ? "Sign up" : "Sign in"}
            </Link> */}
          </footer>
      {/* )} */}
    </section>
  );
};

export default AuthForm;
