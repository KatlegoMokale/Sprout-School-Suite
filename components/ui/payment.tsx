"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { IStudent, paymentFormSchema } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import CustomInput from '@/components/ui/CustomInput'
import CustomInputPayment from './CustomInputPayment'
import { Search } from 'lucide-react'
import { newPayment } from '@/lib/actions/user.actions'
import { useRouter } from 'next/navigation'

interface PaymentProps {
  student: IStudent | null;
}

const Payment: React.FC<PaymentProps> = ({ student }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string| null>(null);
  const [formData, setFormData] = useState({});
  const router = useRouter();


  const newPayemntFormSchema = paymentFormSchema();
  const form = useForm<z.infer<typeof newPayemntFormSchema>>({
    resolver: zodResolver(newPayemntFormSchema),
    defaultValues: {
      firstName:student?.firstName,
      surname: student?.surname,
      amount: 0,
      paymentMethod: "",
      paymentDate: "",
      studentId: student?.$id,
    },
  });

  const onSubmit = async (data: z.infer<typeof newPayemntFormSchema>) => {
    console.log("Form data:", data);
    console.log("Submit");
    setIsLoading(true);
    try {
      const addNewPayment = await newPayment(data);
      console.log("Add new Payment "+ addNewPayment);
      // router.push('/transactions');
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("An error occurred while submitting the form.");
       
    } finally {
      setIsLoading(false);
    }
    setFormData(data);
    console.log("Form data ready for Appwrite:", data);
  };



  return (
        <div className=" ">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 py-4">

            <CustomInputPayment
              name="firstName"
              control={form.control}
              placeholder="Name"
              label={'Name'}
            />
            <CustomInputPayment
              name="surname"
              control={form.control}
              placeholder="Surname"
              label={'Surname'}
            />
            <CustomInputPayment
            name="amount"
            control={form.control}
            placeholder="Amount"
            label={'Amount'}
            type="number"
            />
              <CustomInputPayment
                  name="paymentMethod"
                  placeholder="Select Method"
                  control={form.control}
                  label={'Payment Method'}
                  select={true}
                  options={[
                    { label: "Cash", value: 'cash' },
                    { label: "EFT", value: 'EFT' },
                    { label: "Card", value: 'card' },
                  ]}
               />
            <CustomInputPayment
            name="paymentDate"
            label='Payment Date'
            control={form.control}
            placeholder="Payment Date"
            type='date'
            />
            <Button type="submit" disabled={isLoading} className="form-btn">
              {isLoading ? "Adding..." : "Add Payment"}
            </Button>
            </form>

            
          </Form>
          
        </div>
  )
}

export default Payment