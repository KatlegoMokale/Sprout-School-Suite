"use client"
import React from 'react'
import { FormControl, FormField, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { Control, FieldPath } from 'react-hook-form'
import {z} from 'zod'
import { paymentFormSchema } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import dynamic from "next/dynamic";

const SearchAddress = dynamic(() => import("@/components/ui/search-address"), {
  ssr: false,
});


const formSchema = paymentFormSchema();

interface CustomInput{
    control: Control<z.infer<typeof formSchema>>,
    name: FieldPath<z.infer<typeof formSchema>>,
    label: string,
    placeholder: string
    type?: string
    select?: boolean
    value?: string
    options?: {
        value: string
        label: string
    }[]

}


const CustomInputPayment = ({control, placeholder, name, label, type, options, select, value }: CustomInput) => {
  return (
    <FormField
                control={control}
                name={name}
                render={({ field }) => (
                 <div className='form-item'>
                    <FormLabel className=' text-md w-full max-w-[280px] font-semibold text-gray-600 '>
                      {label}
                    </FormLabel>
                    <div className='flex w-full flex-col'>
                     
                        {
                          select === true && options ?
                          <Select onValueChange={field.onChange}>
                            <FormControl className=' p-2 bg-white'>
                              <SelectTrigger className=' bg-white w-[180px] '>
                                 <SelectValue className='bg-white' placeholder={placeholder} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className=' bg-white gap-2 rounded-lg'>
                            {
                              options.map((option) => (
                                <SelectItem className=' hover:bg-orange-200 text-14 font-semibold rounded-lg hover:animate-in p-2 cursor-pointer' key={option.value} value={option.value}>{option.label}</SelectItem>
                              ))
                            }
                            </SelectContent>
                          </Select>
                          : type === 'search' ?
                         <div >
                           <SearchAddress onSelectLocation={(location) => console.log(location)} />
                         </div>
                          :
                          <FormControl>
                          <Input 
                        className='input-class' 
                        placeholder={placeholder}
                        type={type !== undefined ? type : "text"}
                        value={value!== undefined ? value : field.value}
                        // disabled={value !== undefined ? true : false}
                        />
                         </FormControl>
                      
                        }
                        
                        <FormMessage
                      className='form-message mt-2'/>
                    </div>
                 </div>
                )}
              />
  )
}

export default CustomInputPayment
