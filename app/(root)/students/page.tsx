"use client"
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

 
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  surname: z.string().min(2, {
    message: "Surname must be at least 2 characters.",
  }),
  dateOfBirth: z.string().min(2, {
    message: "Please select a date.",
  }),
  age: z.string().min(2, {
    message: "Please enter an age.",
  }),
  gender: z.string().min(2, {
    message: "Please select a gender.",
  }),
  address: z.string().min(2, {
    message: "Please enter an address.",
  }),
  phoneNumber: z.string().min(2, {
    message: "Please enter a phone number.",
  }),
  homeLanguage: z.string().min(2, {
    message: "Please enter a home language.",
  }),
  allergies: z.string().min(2, {
    message: "Please enter allergies.",
  }),
  medicalAidNumber: z.string().min(2, {
    message: "Please enter a medical aid number.",
  }),
  medicalAidScheme: z.string().min(2, {
    message: "Please enter a medical aid scheme.",
  })
})
 
export function ProfileForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      surname: "",

    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
}

const Students = () => {
  const form = useForm()
  return (
    <div className='flex flex-col gap-4'>
        <div className='flex grid-cols-2 gap-4 container bg-slate-50 rounded-lg p-5'>
            {/* ChildInformation//////////////////////////////////////////////////// */}
            <div className='flex flex-col col-span-1 p-4'>
               <h1>Child Information</h1>
               <div className=' col-span-1'>
               <Form {...form}>
                <FormField 
                control={form.control}
                name="Childnfo"
                render={({field}) => (
                    <FormItem className='grid grid-cols-2 gap-4'>
                        <div className='cols-span-1 pt-2'>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder='Enter Child Name' {...field} />
                        </FormControl>
                       </div>
                       <div className='col-span-1'>
                        <FormLabel>Surname</FormLabel>
                        <FormControl>
                            <Input placeholder='Enter Child Surname' {...field} />
                        </FormControl>
                        </div>
                        <div className='cols-span-1'>
                        <FormLabel>Date Of Birth</FormLabel>
                        <FormControl>
                            <Input type='date' placeholder='Enter Date of Birth' {...field} />
                        </FormControl>
                       </div>
                       <div className='col-span-1'>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                            <Input placeholder='Enter Age' {...field} />
                        </FormControl>
                        </div>
                        <div className='cols-span-1'>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                            <Input placeholder='Enter the address' {...field} />
                        </FormControl>
                       </div>
                       <div className='col-span-1'>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                            <Input placeholder='Enter the Phone Number' {...field} />
                        </FormControl>
                        </div>
                        <div className='cols-span-1'>
                        <FormLabel>Home Language</FormLabel>
                        <FormControl>
                            <Input placeholder='Enter Home Language' {...field} />
                        </FormControl>
                       </div>
                       <div className='col-span-1'>
                        <FormLabel>Allergies</FormLabel>
                        <FormControl>
                            <Input placeholder='Enter Allergies' {...field} />
                        </FormControl>
                        </div>
                        <div className='cols-span-1'>
                        <FormLabel>Nationality</FormLabel>
                        <FormControl>
                            <Input placeholder='Enter Nationality' {...field} />
                        </FormControl>
                       </div>
                       <div></div>
                       <div className='col-span-1'>
                       <FormLabel>Medical Aid/MemberNo</FormLabel>
                        <FormControl>
                            <Input placeholder='Enter Nationality' {...field} />
                        </FormControl>

                        </div>
                        <div>
                        <FormLabel>Medical Aid Scheme</FormLabel>
                        <FormControl>
                            <Input placeholder='Enter Nationality' {...field} />
                        </FormControl>
                        </div>
                        <div className='pb-5 col-span-2'></div>
                       
                       <Button className=' bg-slate-200 w-min'>Close</Button>
                       

                    </FormItem>
                    
                )}
                />
               </Form>
               </div>
            </div>
            {/* ParentInformation//////////////////////////////////////////////////// */}
            <div className='flex flex-col col-span-1 p-4 rounded-lg bg-white shadow-lg'>
               <h1>Parent Information</h1>
               <Tabs defaultValue="parent" className='w-full'>
                <TabsList>
                  <TabsTrigger value="guardian1">Guardian 1</TabsTrigger>
                  <TabsTrigger value="guardian2">Guardian 2</TabsTrigger>
                </TabsList>
                <TabsContent value="guardian1">
                  <Form {...form}>
                    <FormField
                    control={form.control}
                    name="Childnfo"
                    render={({field}) => (
                        <FormItem className='grid grid-cols-2 gap-3'>
                          <div className=' col-span-2 pt-2 w-full'>
                            <FormLabel>Relationship</FormLabel>
                            <FormControl>
                                <Input placeholder='Select Relationship' {...field} />
                            </FormControl>
                           </div>
                            <div className='cols-span-1'>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder='Enter Name' {...field} />
                            </FormControl>
                           </div>
                           <div className='cols-span-1'>
                            <FormLabel>Surname</FormLabel>
                            <FormControl>
                                <Input placeholder='Enter Surname' {...field} />
                            </FormControl>
                           </div>
                           <div className='cols-span-1'>
                            <FormLabel>Id Number</FormLabel>
                            <FormControl>
                                <Input placeholder='Enter ID Number' {...field} />
                            </FormControl>
                           </div>
                           <div className='cols-span-1'>
                            <FormLabel>Cell Number</FormLabel>
                            <FormControl>
                                <Input placeholder='Enter Cell number' {...field} />
                            </FormControl>
                           </div>
                           <div className='cols-span-1'>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder='Enter Email' {...field} />
                            </FormControl>
                           </div>
                           <div></div>
                           <div className='w-full col-span-2'>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input placeholder='Enter Address' {...field} />
                            </FormControl>
                           </div>
                           <div className='cols-span-1'>
                            <FormLabel>Employer</FormLabel>
                            <FormControl>
                                <Input placeholder='Enter Employer' {...field} />
                            </FormControl>
                           </div>
                           <div className='cols-span-1'>
                            <FormLabel>Occupation</FormLabel>
                            <FormControl>
                                <Input placeholder='Enter Occupation' {...field} />
                            </FormControl>
                           </div>
                           <div className='cols-span-1'>
                            <FormLabel>Work No</FormLabel>
                            <FormControl>
                                <Input placeholder='Enter Work No' {...field} />
                            </FormControl>
                           </div>
                           
                           
                           </FormItem>
                    )}
                    />
                  </Form>

                </TabsContent>
                <TabsContent value="guardian2">
                <Form {...form}>
                    <FormField
                    control={form.control}
                    name="Childnfo"
                    render={({field}) => (
                        <FormItem className='grid grid-cols-2 gap-3'>
                          <div className=' col-span-2 pt-2 w-full'>
                            <FormLabel>Relationship</FormLabel>
                            <FormControl>
                                <Input placeholder='Select Relationship' {...field} />
                            </FormControl>
                           </div>
                            <div className='cols-span-1'>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder='Enter Name' {...field} />
                            </FormControl>
                           </div>
                           <div className='cols-span-1'>
                            <FormLabel>Surname</FormLabel>
                            <FormControl>
                                <Input placeholder='Enter Surname' {...field} />
                            </FormControl>
                           </div>
                           <div className='cols-span-1'>
                            <FormLabel>Id Number</FormLabel>
                            <FormControl>
                                <Input placeholder='Enter ID Number' {...field} />
                            </FormControl>
                           </div>
                           <div className='cols-span-1'>
                            <FormLabel>Cell Number</FormLabel>
                            <FormControl>
                                <Input placeholder='Enter Cell number' {...field} />
                            </FormControl>
                           </div>
                           <div className='cols-span-1'>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder='Enter Email' {...field} />
                            </FormControl>
                           </div>
                           <div></div>
                           <div className='w-full col-span-2'>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input placeholder='Enter Address' {...field} />
                            </FormControl>
                           </div>
                           <div className='cols-span-1'>
                            <FormLabel>Employer</FormLabel>
                            <FormControl>
                                <Input placeholder='Enter Employer' {...field} />
                            </FormControl>
                           </div>
                           <div className='cols-span-1'>
                            <FormLabel>Occupation</FormLabel>
                            <FormControl>
                                <Input placeholder='Enter Occupation' {...field} />
                            </FormControl>
                           </div>
                           <div className='cols-span-1'>
                            <FormLabel>Work No</FormLabel>
                            <FormControl>
                                <Input placeholder='Enter Work No' {...field} />
                            </FormControl>
                           </div>
                           
                           
                           </FormItem>
                    )}
                    />
                  </Form>
                </TabsContent>
                </Tabs>
            </div>
        </div>
    </div>
  )
}

export default Students