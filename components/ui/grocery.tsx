"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import CustomInput from '@/components/ui/CustomInput'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { grocerySchema } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { newGrocery } from '@/lib/actions/user.actions'
import { Button } from "@/components/ui/button"

const Grocery = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string| null>(null);
  const [formData, setFormData] = useState({});
  const router = useRouter();

  const newGroceryForm = grocerySchema();
  const form = useForm<z.infer<typeof newGroceryForm>>({
    resolver: zodResolver(newGroceryForm),
    defaultValues: {
      summery: "",
      totalPaid: 0,
      store: "",
      date: ""
    },
  });

  const onSubmit = async (data: z.infer<typeof newGroceryForm>) => {
    console.log("Form data:", data);
    console.log("Submit");
    setIsLoading(true);
    try {
      const addNewGrocery = await newGrocery(data);
      console.log("Add new Grocery "+ addNewGrocery);
      // router.push('/transactions');
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("An error occurred while submitting the form.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="">
      <div className="w-full max-w-3xl p-8 ">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Grocery Entry</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          



          <div className='md:col-span-2'>
          <CustomInput
          name='summery'
          control={form.control}
          placeholder="Summary"
          label={'Summary'}
          />

          </div>
          
        
          <CustomInput
          name='totalPaid'
          control={form.control}
          placeholder="Total Paid"
          label={'Total Paid'}
          type='number'
          />

          <CustomInput
          name='store'
          control={form.control}
          placeholder="Store"
          label={'Store'}
          />

          <CustomInput
          name='date'
          control={form.control}
          placeholder="Date"
          label={'Date'}
          type='date'
          />

          <div className="md:col-span-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>

      </Form>

      </div>
      
      
    </div>
  )
}

export default Grocery
