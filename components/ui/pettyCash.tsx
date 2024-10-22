"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {  pettyCashSchema } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import CustomInput from '@/components/ui/CustomInput'
import { newPayment, newPettyCash } from '@/lib/actions/user.actions'
import { useRouter } from 'next/navigation'


const PettyCash = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string| null>(null);
  const [formData, setFormData] = useState({});
  const router = useRouter();


  const newPettyCashSchema = pettyCashSchema();
  const form = useForm<z.infer<typeof newPettyCashSchema>>({
    resolver: zodResolver(newPettyCashSchema),
    defaultValues: {
      itemName:"",
      quantity: 0,
      price: 0,
      store: "",
      category: "",
      date: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof newPettyCashSchema>) => {
    console.log("Form data:", data);
    console.log("Submit");
    setIsLoading(true);
    try {
      const addNewPettyCash = await newPettyCash(data);
      console.log("Add new Petty Cash "+ addNewPettyCash);
      // router.push('/transactions');
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("An error occurred while submitting the form.");
    } finally {
      setIsLoading(false);
    }
  };



  return (
        <div className=" ">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 py-4">

            <CustomInput
              name="itemName"
              control={form.control}
              placeholder="e.g. Milk"
              label={'Item Name'}
            />
            <CustomInput
              name="quantity"
              control={form.control}
              placeholder="Enter Quantity"
              label={'Quantity'}
            />
            <CustomInput
            name="price"
            control={form.control}
            placeholder="Price"
            label={'Price'}
            type="number"
            />
            <CustomInput
            name="store"
            control={form.control}
            placeholder="eg. Shoprite"
            label={'Store'}
            />
            <CustomInput
            name="category"
            control={form.control}
            placeholder="Category"
            label={'Category'}
            select={true}
                        options={[
                          { label: "Food", value: "Food" },
                          { label: "Cleaning", value: "Cleaning" },
                          { label: "Other", value: "Other" },
                        ]}
            />
            
            <Button type="submit" disabled={isLoading} className="form-btn">
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
            </form>

            
          </Form>
          
        </div>
  )
}

export default PettyCash