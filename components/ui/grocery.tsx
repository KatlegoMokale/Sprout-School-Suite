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
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <CustomInput
          name='summery'
          control={form.control}
          placeholder="Summery"
          label={'Summery'}
          />

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

          <button type="submit" className='form-btn'>Submit</button>
        </form>

      </Form>
      
    </div>
  )
}

export default Grocery
