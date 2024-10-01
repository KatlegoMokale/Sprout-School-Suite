"use client"
import React from 'react'
import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { paymentFormSchema } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import CustomInput from '@/components/ui/CustomInput'
import CustomInputPayment from './CustomInputPayment'
import { Search } from 'lucide-react'

interface PaymentProps {
  student: IStudent | null;
}

const Payment: React.FC<PaymentProps> = ({ student }) => {

  const newPayemntFormSchema = paymentFormSchema();
  const form = useForm<z.infer<typeof newPayemntFormSchema>>({
    resolver: zodResolver(newPayemntFormSchema),
    defaultValues: {
      firstName:student?.firstName,
      surname: student?.surname,
      amount: 0,
      paymentMethod: "",
      paymentDate: "",
      studentId: student?.studentId,
      datecreated: "",
    },
  });

  const onSubmit = (values: z.infer<typeof newPayemntFormSchema>) => {
    console.log(values);
  }


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
            </form>
          </Form>

          
        </div>
  )
}

export default Payment