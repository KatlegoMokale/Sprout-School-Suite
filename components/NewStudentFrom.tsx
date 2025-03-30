"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/CustomInput";
import { newParentFormSchema, newStudentFormSchema } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { newStudent } from "@/lib/actions/user.actions";

const SearchAddress = dynamic(() => import("@/components/ui/search-address"), {
  ssr: false,
});

const NewStudentForm = () => {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

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
      homeLanguage: "",
      allergies: "",
      medicalAidScheme: "",
      medicalAidNumber: "",
      studentClass: "",
      p1_firstName: "",
      p1_surname: "",
      p1_address1: "",
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

  const onSubmit = async (data: z.infer<typeof studentFormSchema>) => {
    console.log("Form data:", data);
    console.log("Submit");
    setIsLoading(true);
    try {
      const addNewStudent = await newStudent(data);
      console.log("Add new Student "+ addNewStudent);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("An error occurred while submitting the form.");
    } finally {
      setIsLoading(false);
      router.push('/students')
    }
    setFormData(data);
    console.log("Form data ready for Appwrite:", data);
  };

  const calculateAge = (birthDate: string): string => {
    const today = new Date();
    const birth = new Date(birthDate);
    let months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    
    if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else {
      let years = Math.floor(months / 12);
      // Check if birthday is later this year
      if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
        years += 1;
      }
      return `${years} year${years !== 1 ? 's' : ''}`;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Student Information Section */}
          <div className="container bg-orange-50 rounded-lg p-5">
            <h2 className="text-xl font-semibold mb-4">Student Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
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
              <div>
                <CustomInput
                  name="surname"
                  placeholder="Enter Child Surname"
                  control={form.control}
                  label={"Surname"}
                />
              </div>
              <div>
                <CustomInput
                  name="dateOfBirth"
                  placeholder="Enter Child Date of Birth"
                  control={form.control}
                  label={"Date of Birth"}
                  type="date"
                  onChange={(e) => {
                    const age = calculateAge(e.target.value);
                    form.setValue("age", age);
                  }}
                />
              </div>
              <div>
                <CustomInput
                  name="age"
                  placeholder="Age will be calculated"
                  control={form.control}
                  label={"Age"}
                  readonly={true}
                />
              </div>
              <div>
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
              <div>
                <CustomInput
                  name="address1"
                  placeholder="Enter Child Address"
                  control={form.control}
                  label={"Address"}
                />
              </div>
              <div>
                <CustomInput
                  name="homeLanguage"
                  placeholder="Home Language"
                  control={form.control}
                  label={"Home Language"}
                />
              </div>
              <div>
                <CustomInput
                  name="allergies"
                  placeholder="Allergies"
                  control={form.control}
                  label={"Allergies"}
                />
              </div>
              <div>
                <CustomInput
                  name="medicalAidNumber"
                  placeholder="Medical Aid Number"
                  control={form.control}
                  label={"Medical Aid Number"}
                />
              </div>
              <div>
                <CustomInput
                  name="medicalAidScheme"
                  placeholder="Medical Aid Scheme"
                  control={form.control}
                  label={"Medical Aid Scheme"}
                />
              </div>
              <div>
                <CustomInput
                  name="studentClass"
                  placeholder="Class"
                  control={form.control}
                  label={"Class"}
                />
              </div>
            </div>
          </div>

          {/* Guardians Section */}
          <div className="container grid grid-cols-2 gap-6">
            {/* Guardian 1 */}
            <div className="bg-orange-50 rounded-lg p-5">
              <h2 className="text-xl font-semibold mb-4">Guardian 1</h2>
              <div className="grid grid-cols-1 gap-4">
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
                <CustomInput
                  name="p1_firstName"
                  placeholder="Enter First Name"
                  control={form.control}
                  label={"First Name"}
                />
                <CustomInput
                  name="p1_surname"
                  placeholder="Enter Surname"
                  control={form.control}
                  label={"Surname"}
                />
                <CustomInput
                  name="p1_address1"
                  placeholder="Enter Address"
                  control={form.control}
                  label={"Address"}
                />
                <CustomInput
                  name="p1_dateOfBirth"
                  placeholder="Enter Date of Birth"
                  control={form.control}
                  label={"Date of Birth"}
                  type="date"
                />
                <CustomInput
                  name="p1_gender"
                  placeholder="Select Gender"
                  control={form.control}
                  label={"Gender"}
                  select={true}
                  options={[
                    { label: "Male", value: "Male" },
                    { label: "Female", value: "Female" },
                  ]}
                />
                <CustomInput
                  name="p1_idNumber"
                  placeholder="Enter ID Number"
                  control={form.control}
                  label={"ID Number"}
                />
                <CustomInput
                  name="p1_occupation"
                  placeholder="Enter Occupation"
                  control={form.control}
                  label={"Occupation"}
                />
                <CustomInput
                  name="p1_phoneNumber"
                  placeholder="Enter Phone Number"
                  control={form.control}
                  label={"Phone Number"}
                />
                <CustomInput
                  name="p1_email"
                  placeholder="Enter Email"
                  control={form.control}
                  label={"Email"}
                />
                <CustomInput
                  name="p1_workNumber"
                  placeholder="Enter Work Number"
                  control={form.control}
                  label={"Work Number"}
                />
              </div>
            </div>

            {/* Guardian 2 */}
            <div className="bg-orange-50 rounded-lg p-5">
              <h2 className="text-xl font-semibold mb-4">Guardian 2</h2>
              <div className="grid grid-cols-1 gap-4">
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
                <CustomInput
                  name="p2_firstName"
                  placeholder="Enter First Name"
                  control={form.control}
                  label={"First Name"}
                />
                <CustomInput
                  name="p2_surname"
                  placeholder="Enter Surname"
                  control={form.control}
                  label={"Surname"}
                />
                <CustomInput
                  name="p2_address1"
                  placeholder="Enter Address"
                  control={form.control}
                  label={"Address"}
                />
                <CustomInput
                  name="p2_dateOfBirth"
                  placeholder="Enter Date of Birth"
                  control={form.control}
                  label={"Date of Birth"}
                  type="date"
                />
                <CustomInput
                  name="p2_gender"
                  placeholder="Select Gender"
                  control={form.control}
                  label={"Gender"}
                  select={true}
                  options={[
                    { label: "Male", value: "Male" },
                    { label: "Female", value: "Female" },
                  ]}
                />
                <CustomInput
                  name="p2_idNumber"
                  placeholder="Enter ID Number"
                  control={form.control}
                  label={"ID Number"}
                />
                <CustomInput
                  name="p2_occupation"
                  placeholder="Enter Occupation"
                  control={form.control}
                  label={"Occupation"}
                />
                <CustomInput
                  name="p2_phoneNumber"
                  placeholder="Enter Phone Number"
                  control={form.control}
                  label={"Phone Number"}
                />
                <CustomInput
                  name="p2_email"
                  placeholder="Enter Email"
                  control={form.control}
                  label={"Email"}
                />
                <CustomInput
                  name="p2_workNumber"
                  placeholder="Enter Work Number"
                  control={form.control}
                  label={"Work Number"}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
          {error && <div className="text-red-500">{error}</div>}
        </form>
      </Form>
    </div>
  );
};

export default NewStudentForm;
