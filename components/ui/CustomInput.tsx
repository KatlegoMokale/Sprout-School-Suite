"use client"
import React from 'react'
import { FormControl, FormField, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { Control, FieldPath } from 'react-hook-form'
import {z} from 'zod'
import { newStudentFormSchema } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
const formSchema = newStudentFormSchema();

interface CustomInput{
    control: Control<z.infer<typeof formSchema>>,
    name: FieldPath<z.infer<typeof formSchema>>,
    label: string,
    placeholder: string
    type?: string
    select?: boolean
    options?: {
        value: string
        label: string
    }[]

}

const CustomInput = ({control, placeholder, name, label, type, options, select }: CustomInput) => {
  return (
    <FormField
                control={control}
                name={name}
                render={({ field }) => (
                 <div className='form-item'>
                    <FormLabel className='form-label'>
                      {label}
                    </FormLabel>
                    <div className='flex w-full flex-col'>
                     
                        {
                          select === true ?
                          <Select onValueChange={field.onChange} defaultValue={label}>
                            <FormControl className=' p-2'>
                              <SelectTrigger className='w-[180px]'>
                                 <SelectValue className='bg-slate-200' placeholder={placeholder} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className=' bg-slate-200 gap-2 rounded-lg'>
                            {
                              options?.map((option) => (
                                <SelectItem className=' hover:bg-slate-400 rounded-lg hover:animate-in p-2 cursor-pointer' key={option.value} value={option.value}>{option.label}</SelectItem>
                              ))
                            }
                            </SelectContent>
                          </Select>
                          :
                          <FormControl>
                          <Input 
                        className='input-class' 
                        placeholder={placeholder}
                        type={type!==null ? type : "text"}
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

export default CustomInput
