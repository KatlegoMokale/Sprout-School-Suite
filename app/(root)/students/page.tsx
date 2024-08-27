"use client"
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CustomInput from '@/components/ui/CustomInput'
import { newParentFormSchema, newStudentFormSchema } from '@/lib/utils'

import dynamic from "next/dynamic";

const SearchAddress = dynamic(() => import("@/components/ui/search-address"), {
  ssr: false,
});

const Students = () => {

  const studentFormSchema = newStudentFormSchema();
  const form = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      firstName:"",
      secondName: "",
      surname: "",
      dateOfBirth: "",
      age: "",
      gender: "",
      address1: "",
      city: "",
      province: "",
      homeLanguage:"",
      allergies: "",
      medicalAidScheme: "",
      medicalAidNumber: "",
      class: "",
      p1_firstName: "",
      p1_surname: "",
      p1_address1: "",
      p1_city: "",
      p1_province: "",
      p1_postalCode: "",
      p1_dateOfBirth: "",
      p1_gender: "",
      p1_idNumber : "",
      p1_occupation: "",
      p1_phoneNumber: "",
      p1_email: "",
      p1_workNumber: "",
    
      p2_relationship: "",
      p2_firstName: "",
      p2_surname: "",
      p2_address1: "",
      p2_city: "",
      p2_province: "",
      p2_postalCode: "",
      p2_dateOfBirth: "",
      p2_gender: "",
      p2_idNumber : "",
      p2_occupation: "",
      p2_phoneNumber: "",
      p2_email: "",
      p2_workNumber: "",
    },
  });

  const onSubmit = (values: z.infer<typeof studentFormSchema>) => {
    console.log(values);
  }


  // const form = useForm()
  return (
    <div className='flex flex-col gap-4'>
        <div className='grid grid-cols-2 gap-6 container bg-orange-50 rounded-lg p-5'>
            {/* ChildInformation//////////////////////////////////////////////////// */}
            <div className='flex flex-col col-span-1 p-6'>
               <h1 className=''>Child Information</h1>

               <div className='p-4 bg-orange-100 rounded-lg'>
               <div className=' col-span-1'>
               <Form {...form}>
                <div className='grid grid-cols-2 gap-5'>
                <div className='cols-span-1'>
                <CustomInput 
                name="firstName"
                placeholder="Enter Child Name"
                control={form.control} 
                label={'Name'}/>
                </div>

                <div>
                  <CustomInput
                  name="secondName"
                  placeholder="Enter Child Second Name"
                  control={form.control}
                  label={'Second Name'}
                  />
                </div>

                <div className='col-span-1'>
                <CustomInput
                name="surname"
                placeholder="Enter Child Surname"
                control={form.control}
                label={'Surname'}
                />
                </div>

                <div className='cols-span-1'>
                <CustomInput
                name="dateOfBirth"
                placeholder="Enter Child Date of Birth"
                control={form.control}
                label={'Date of Birth'}
                type='date'
                />
                </div>

                <div className='col-span-1'>
                <CustomInput
                name="age"
                placeholder="Enter Child Age"
                control={form.control}
                label={'Age'}
                />    
                </div>

                <div className='col-span-1'>
                <CustomInput
                            name="gender"
                            placeholder="Select Gender"
                            control={form.control}
                            label={'Gender'}
                            select={true}
                            options={[
                              { label: "Male", value: 'Male' },
                              { label: "Female", value: 'Female' }
                            ]}
                            />
                </div>

                <div className='cols-span-1'>
                <CustomInput
                name="address1"
                placeholder="Enter Child Address"
                control={form.control}
                label={'Address'}
                type='search'
                />
                </div>

                <div className='col-span-1'>
                <CustomInput
                name="city"
                placeholder="Enter City"
                control={form.control}
                label={'City'}
                />
                </div>
                <div className='col-span-1'>
                <CustomInput
                name="homeLanguage"
                placeholder="Home Language"
                control={form.control}
                label={'Home Language'}
                />
                </div>
                <div className='col-span-1'>
                <CustomInput
                name="allergies"
                placeholder="Allergies"
                control={form.control}
                label={'Allergies'}
                />
                </div>

                <div className='col-span-1'>
                <CustomInput
                name="medicalAidNumber"
                placeholder="Medical Aid Number"
                control={form.control}
                label={'Medical Aid Number'}
                />
                </div>

                <div className='col-span-1'>
                <CustomInput
                name="medicalAidScheme"
                placeholder="Medical Aid Scheme"
                control={form.control}
                label={'Medical Aid Scheme'}
                />
                
                </div>

                </div>
                  <Button type="submit">Submit</Button>
               </Form>
               </div>
               </div>
            </div>
            {/* ParentInformation//////////////////////////////////////////////////// */}
            <div className='flex flex-col col-span-1 p-6 rounded-lg bg-white shadow-lg'>
               <h1>Parent Information</h1>
               <Tabs defaultValue="guardian1" className='w-full'>
                <TabsList className='grid w-full grid-cols-2 bg-orange-100' >
                  <TabsTrigger value="guardian1">Guardian 1</TabsTrigger>
                  <TabsTrigger value="guardian2">Guardian 2</TabsTrigger>
                </TabsList>
                <TabsContent value="guardian1">
                  <Form {...form}>
                    <div className='grid grid-cols-2 gap-3'>
                    <div className=' col-span-2 pt-2 w-full'>
                            <CustomInput
                            name="p1_relationship"
                            placeholder="Select Relationship"
                            control={form.control}
                            label={'Relationship'}
                            select={true}
                            options={[
                              { label: "Mother", value: 'Mother' },
                              { label: "Father", value: 'Father' },
                              { label: "Grand Mother", value: 'Grand Mother' },
                              { label: "Grand Father", value: 'Grand Father' },
                            ]}
                            />
                      </div>
                      <div className='cols-span-1'>
                        <CustomInput
                        name="p1_firstName"
                        placeholder="Enter Name"
                        control={form.control}
                        label={'Name'}
                        />
                      </div>
                      <div className='cols-span-1'>
                        <CustomInput
                        name="p1_surname"
                        placeholder="Enter Surname"
                        control={form.control}
                        label={'Surname'}
                        />
                      </div>
                      <div className='cols-span-1'>
                        <CustomInput
                        name="p1_email"
                        placeholder="Enter Email"
                        control={form.control}
                        label={'Email'}
                        type='email'
                        />
                      </div>
                      <div className='cols-span-1'>
                        <CustomInput
                        name="p1_phoneNumber"
                        placeholder="Enter Phone Number"
                        control={form.control}
                        label={'Phone Number'}
                        />
                      </div>
                      <div className='cols-span-1'>
                        <CustomInput
                        name="p1_occupation"
                        placeholder="Enter Employer"
                        control={form.control}
                        label={'Employer'}
                        />
                      </div>
                      <div className='cols-span-1'>
                        <CustomInput
                        name="p1_idNumber"
                        placeholder="Enter ID Number"
                        control={form.control}
                        label={'ID Number'}
                        />
                      </div>
                      <div></div>
                        <div className='w-full col-span-2'>
                        {/* <SearchAddress onSelectLocation={(location) => console.log(location)} /> */}
                        <CustomInput
                        name="p1_address1"
                        placeholder="Enter Address"
                        control={form.control}
                        label={'Address'}
                        type='search'
                        />
                      </div>
                      <div className='cols-span-1'>
                        <CustomInput
                        name="p1_occupation"
                        placeholder="Enter Employer Name"
                        control={form.control}
                        label={'Employer'}
                        />
                      </div>
                      <div className='cols-span-1'>
                        <CustomInput
                        name="p1_workNumber"
                        placeholder="Enter Employer Phone Number"
                        control={form.control}
                        label={'Employer Phone Number'}
                        />
                      </div>

                    </div>
                  </Form>

                </TabsContent>
                <TabsContent value="guardian2">
                <Form {...form}>
                    <div className='grid grid-cols-2 gap-3'>
                      <div className=' col-span-2 pt-2 w-full'>
                            <CustomInput
                            name="p2_relationship"
                            placeholder="Select Relationship"
                            control={form.control}
                            label={'Relationship'}
                            select={true}
                            options={[
                              { label: "Mother", value: 'Mother' },
                              { label: "Father", value: 'Father' },
                              { label: "Grand Mother", value: 'Grand Mother' },
                              { label: "Grand Father", value: 'Grand Father' },
                            ]}
                            />
                      </div>
                      <div className='cols-span-1'>
                        <CustomInput
                        name="p2_firstName"
                        placeholder="Enter Name"
                        control={form.control}
                        label={'Name'}
                        />
                      </div>
                      <div className='cols-span-1'>
                        <CustomInput
                        name="p2_surname"
                        placeholder="Enter Surname"
                        control={form.control}
                        label={'Surname'}
                        />
                      </div>
                      <div className='cols-span-1'>
                        <CustomInput
                        name="p2_email"
                        placeholder="Enter Email"
                        control={form.control}
                        label={'Email'}
                        type='email'
                        />
                      </div>
                      <div className='cols-span-1'>
                        <CustomInput
                        name="p2_phoneNumber"
                        placeholder="Enter Phone Number"
                        control={form.control}
                        label={'Phone Number'}
                        />
                      </div>
                      <div className='cols-span-1'>
                        <CustomInput
                        name="p2_occupation"
                        placeholder="Enter Employer"
                        control={form.control}
                        label={'Employer'}
                        />
                      </div>
                      <div className='cols-span-1'>
                        <CustomInput
                        name="p2_idNumber"
                        placeholder="Enter ID Number"
                        control={form.control}
                        label={'ID Number'}
                        />
                      </div>
                      <div></div>
                        <div className='w-full col-span-2'>
                        <CustomInput
                        name="p2_address1"
                        placeholder="Enter Address"
                        control={form.control}
                        label={'Address'}
                        type='search'
                        />
                      </div>
                      <div className='cols-span-1'>
                        <CustomInput
                        name="p2_occupation"
                        placeholder="Enter Employer Name"
                        control={form.control}
                        label={'Employer'}
                        />
                      </div>
                      <div className='cols-span-1'>
                        <CustomInput
                        name="p2_workNumber"
                        placeholder="Enter Employer Phone Number"
                        control={form.control}
                        label={'Employer Phone Number'}
                        />
                      </div>

                    </div>
                  </Form>
                </TabsContent>
                </Tabs>
            </div>
        </div>
    </div>
  )
}

export default Students