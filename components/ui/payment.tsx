"use client"
import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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

const Payment = () => {

  const newPayemntFormSchema = paymentFormSchema();
  const form = useForm<z.infer<typeof newPayemntFormSchema>>({
    resolver: zodResolver(newPayemntFormSchema),
    defaultValues: {
      firstName:"",
      surname: "",
      amount: "",
      paymentMethod: "",
      paymentDate: "",
      studentId: "",
      datecreated: "",
    },
  });

  const onSubmit = (values: z.infer<typeof newPayemntFormSchema>) => {
    console.log(values);
  }


  return (
     <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Make Payment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[825px] w-[500px] container bg-white">
        <DialogHeader>
          <DialogTitle>Add Payment</DialogTitle>
          <DialogDescription>
            {/* Make changes to your profile here. Click save when you're done. */}
          </DialogDescription>
        </DialogHeader>
        <div className='container'>
        <div className='relative flex-1 md:grow-0'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input type='search' placeholder='Search...' className='w-full rounded-lg pl-8 md:w-[240px] lg:w-[336px]' />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 py-4 ">
          <Form {...form}>
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
          </Form>

          
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default Payment