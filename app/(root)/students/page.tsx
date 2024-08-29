"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomInput from "@/components/ui/CustomInput";
import { newParentFormSchema, newStudentFormSchema } from "@/lib/utils";

import dynamic from "next/dynamic";

const SearchAddress = dynamic(() => import("@/components/ui/search-address"), {
  ssr: false,
});

const Students = () => {
  const [currentTab, setCurrentTab] = useState("guardian1");

  const studentFormSchema = newStudentFormSchema();
  const form = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      firstName: "",
      secondName: "",
      surname: "",
      dateOfBirth: "",
      age: "",
      gender: "",
      address1: "",
      city: "",
      province: "",
      homeLanguage: "",
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
      p1_idNumber: "",
      p1_occupation: "",
      p1_phoneNumber: "",
      p1_email: "",
      p1_workNumber: "",
      p1_relationship: "",
      p2_firstName: "",
      p2_surname: "",
      p2_address1: "",
      p2_city: "",
      p2_province: "",
      p2_postalCode: "",
      p2_dateOfBirth: "",
      p2_gender: "",
      p2_idNumber: "",
      p2_occupation: "",
      p2_phoneNumber: "",
      p2_email: "",
      p2_workNumber: "",
      p2_relationship: "",
    },
  });
  

  const onSubmit = (values: z.infer<typeof studentFormSchema>) => {
    console.log(values);
  };

  // const handleTabChange = (tab: string) => {
  //   setCurrentTab(tab);
  //   if (tab === "guardian1") {
  //     onGuardianChange(form.getValues());
  //     console.log(form.getValues());
  //   } else if (tab === "guardian2") {
  //     onGuardianChange(form.getValues());
  //     console.log(form.getValues());
  //   }
  // };
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    console.log("Current form values:", form.getValues());
    onGuardianChange(form.getValues());
  };

  const onGuardianChange = (values: z.infer<typeof studentFormSchema>) => {
    if (currentTab === "guardian1") {
      console.log("Guardian 1 values:", values);
      console.log("Guardian 1");
      // Store guardian1 values
      form.setValue("p1_relationship", values.p1_relationship);
      form.setValue("p1_firstName", values.p1_firstName);
      form.setValue("p1_surname", values.p1_surname);
      form.setValue("p1_address1", values.p1_address1);
      form.setValue("p1_city", values.p1_city);
      form.setValue("p1_province", values.p1_province);
      form.setValue("p1_postalCode", values.p1_postalCode);
      form.setValue("p1_dateOfBirth", values.p1_dateOfBirth);
      form.setValue("p1_gender", values.p1_gender);
      form.setValue("p1_idNumber", values.p1_idNumber);
      form.setValue("p1_occupation", values.p1_occupation);
      form.setValue("p1_phoneNumber", values.p1_phoneNumber);
      form.setValue("p1_email", values.p1_email);
      // ... (other p1 fields)
    } else if (currentTab === "guardian2") {
      // Store guardian2 values
      console.log("Guardian 2 values:", values);
      console.log("Guardian 2");
      form.setValue("p2_relationship", values.p2_relationship);
      form.setValue("p2_firstName", values.p2_firstName);
      form.setValue("p2_surname", values.p2_surname);
      form.setValue("p2_address1", values.p2_address1);
      form.setValue("p2_city", values.p2_city);
      form.setValue("p2_province", values.p2_province);
      form.setValue("p2_postalCode", values.p2_postalCode);
      form.setValue("p2_dateOfBirth", values.p2_dateOfBirth);
      form.setValue("p2_gender", values.p2_gender);
      form.setValue("p2_idNumber", values.p2_idNumber);
      // ... (other p2 fields)
    }
  };

  // const form = useForm()
  return (
    <div className="flex flex-col gap-4">
      
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-6 container bg-orange-50 rounded-lg p-5">
        {/* ChildInformation//////////////////////////////////////////////////// */}
        <div className="flex flex-col col-span-1 p-6">
          <h1 className="">Child Information</h1>

          <div className="p-4 bg-orange-100 rounded-lg">
            <div className=" col-span-1">
              
                <div className="grid grid-cols-2 gap-5">
                  <div className="cols-span-1">
                    <CustomInput
                      name="firstName"
                      placeholder="Enter Child Name"
                      control={form.control}
                      label={"Name"}
                    />
                  </div>

                  <div>
                    <CustomInput
                      name="secondName"
                      placeholder="Enter Child Second Name"
                      control={form.control}
                      label={"Second Name"}
                    />
                  </div>

                  <div className="col-span-1">
                    <CustomInput
                      name="surname"
                      placeholder="Enter Child Surname"
                      control={form.control}
                      label={"Surname"}
                    />
                  </div>

                  <div className="cols-span-1">
                    <CustomInput
                      name="dateOfBirth"
                      placeholder="Enter Child Date of Birth"
                      control={form.control}
                      label={"Date of Birth"}
                      type="date"
                    />
                  </div>

                  <div className="col-span-1">
                    <CustomInput
                      name="age"
                      placeholder="Enter Child Age"
                      control={form.control}
                      label={"Age"}
                    />
                  </div>

                  <div className="col-span-1">
                    <CustomInput
                      name="gender"
                      placeholder="Select Gender"
                      control={form.control}
                      label={"Gender"}
                      select={true}
                      options={[
                        { label: "Male", value: "Male" },
                        { label: "Female", value: "Female" },
                      ]}
                    />
                  </div>

                  <div className="cols-span-1">
                    <CustomInput
                      name="address1"
                      placeholder="Enter Child Address"
                      control={form.control}
                      label={"Address"}
                      type="search"
                    />
                  </div>

                  <div className="col-span-1">
                    <CustomInput
                      name="city"
                      placeholder="Enter City"
                      control={form.control}
                      label={"City"}
                    />
                  </div>
                  <div className="col-span-1">
                    <CustomInput
                      name="homeLanguage"
                      placeholder="Home Language"
                      control={form.control}
                      label={"Home Language"}
                    />
                  </div>
                  <div className="col-span-1">
                    <CustomInput
                      name="allergies"
                      placeholder="Allergies"
                      control={form.control}
                      label={"Allergies"}
                    />
                  </div>

                  <div className="col-span-1">
                    <CustomInput
                      name="medicalAidNumber"
                      placeholder="Medical Aid Number"
                      control={form.control}
                      label={"Medical Aid Number"}
                    />
                  </div>

                  <div className="col-span-1">
                    <CustomInput
                      name="medicalAidScheme"
                      placeholder="Medical Aid Scheme"
                      control={form.control}
                      label={"Medical Aid Scheme"}
                    />
                  </div>
                </div>
                <Button type="submit">Submit</Button>
             
            </div>
          </div>
        </div>
        {/* ParentInformation//////////////////////////////////////////////////// */}
        <div className="flex flex-col col-span-1 p-6 rounded-lg bg-white shadow-lg">
          <h1>Parent Information</h1>
          <Tabs defaultValue="guardian1" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-orange-100">
              <TabsTrigger
                value="guardian1"
                onClick={() => handleTabChange("guardian1")}
              >
                Guardian 1
              </TabsTrigger>
              <TabsTrigger
                value="guardian2"
                onClick={() => handleTabChange("guardian2")}
              >
                Guardian 2
              </TabsTrigger>
            </TabsList>
            <TabsContent value="guardian1">
                  <div className="grid grid-cols-2 gap-3">
                    <div className=" col-span-2 pt-2 w-full">
                      <CustomInput
                        name="p1_relationship"
                        placeholder="Select Relationship"
                        control={form.control}
                        label={"Relationship"}
                        select={true}
                        options={[
                          { label: "Mother", value: "Mother" },
                          { label: "Father", value: "Father" },
                          { label: "Grand Mother", value: "Grand Mother" },
                          { label: "Grand Father", value: "Grand Father" },
                        ]}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput
                        name="p1_firstName"
                        placeholder="Enter Name"
                        control={form.control}
                        label={"Name"}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput
                        name="p1_surname"
                        placeholder="Enter Surname"
                        control={form.control}
                        label={"Surname"}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput
                        name="p1_email"
                        placeholder="Enter Email"
                        control={form.control}
                        label={"Email"}
                        type="email"
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput
                        name="p1_phoneNumber"
                        placeholder="Enter Phone Number"
                        control={form.control}
                        label={"Phone Number"}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput
                        name="p1_occupation"
                        placeholder="Enter Employer"
                        control={form.control}
                        label={"Employer"}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput
                        name="p1_idNumber"
                        placeholder="Enter ID Number"
                        control={form.control}
                        label={"ID Number"}
                      />
                    </div>
                    <div></div>
                    <div className="w-full col-span-2">
                      {/* <SearchAddress onSelectLocation={(location) => console.log(location)} /> */}
                      <CustomInput
                        name="p1_address1"
                        placeholder="Enter Address"
                        control={form.control}
                        label={"Address"}
                        type="search"
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput
                        name="p1_occupation"
                        placeholder="Enter Employer Name"
                        control={form.control}
                        label={"Employer"}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput
                        name="p1_workNumber"
                        placeholder="Enter Employer Phone Number"
                        control={form.control}
                        label={"Employer Phone Number"}
                      />
                    </div>
                  </div>
            </TabsContent>
            <TabsContent value="guardian2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className=" col-span-2 pt-2 w-full">
                      <CustomInput
                        name="p2_relationship"
                        placeholder="Select Relationship"
                        control={form.control}
                        label={"Relationship"}
                        select={true}
                        options={[
                          { label: "Mother", value: "Mother" },
                          { label: "Father", value: "Father" },
                          { label: "Grand Mother", value: "Grand Mother" },
                          { label: "Grand Father", value: "Grand Father" },
                        ]}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput
                        name="p2_firstName"
                        placeholder="Enter Name"
                        control={form.control}
                        label={"Name"}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput
                        name="p2_surname"
                        placeholder="Enter Surname"
                        control={form.control}
                        label={"Surname"}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput
                        name="p2_email"
                        placeholder="Enter Email"
                        control={form.control}
                        label={"Email"}
                        type="email"
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput
                        name="p2_phoneNumber"
                        placeholder="Enter Phone Number"
                        control={form.control}
                        label={"Phone Number"}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput
                        name="p2_occupation"
                        placeholder="Enter Employer"
                        control={form.control}
                        label={"Employer"}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput
                        name="p2_idNumber"
                        placeholder="Enter ID Number"
                        control={form.control}
                        label={"ID Number"}
                      />
                    </div>
                    <div></div>
                    <div className="w-full col-span-2">
                      <CustomInput
                        name="p2_address1"
                        placeholder="Enter Address"
                        control={form.control}
                        label={"Address"}
                        type="search"
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput
                        name="p2_occupation"
                        placeholder="Enter Employer Name"
                        control={form.control}
                        label={"Employer"}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput
                        name="p2_workNumber"
                        placeholder="Enter Employer Phone Number"
                        control={form.control}
                        label={"Employer Phone Number"}
                      />
                    </div>
                  </div>
                  <Button type="submit">Submit</Button>
            </TabsContent>
          </Tabs>
        </div>
        <Button type="submit">Submit</Button>
        </div>
        </form>
      </Form>
      
    </div>
  );
};

export default Students;
