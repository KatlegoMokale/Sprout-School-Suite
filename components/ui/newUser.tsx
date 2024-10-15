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

const AddNewUser = () => {
 const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setisLoading] = useState(false);
 

  const formSchema = authFormSchema("sign-up");

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
 
         const newUser = await signUp(data);
         console.log(newUser);
         setUser(newUser);

    } catch (error) {
      console.log(error);
    }finally{
      setisLoading(false);
    }
  }

  return (
    <section className=" container items-center justify-center flex flex-col gap-5 px-20">
      <header>
        <div className=" flex flex-col gap-1 md:gap-3">
         <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            Add New User
        </h1>
        </div>
      </header>
    
          <Form {...form}>

            <form onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-8 flex">
            <div className="flex flex-col gap-4">
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
              
              </div>
              <div className="flex flex-col gap-4">
                <Button type="submit" className="form-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ): 
                    "Add User"
                  }
                </Button>
              </div>
              </div>
            </form>
          </Form>
      {/* )} */}
    </section>
  );
};

export default AddNewUser;
