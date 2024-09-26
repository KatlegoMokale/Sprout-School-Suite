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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomInput from "@/components/ui/CustomInput";
import {
  newParentFormSchema,
  newStudentFormSchema,
  parseStringify,
} from "@/lib/utils";

import dynamic from "next/dynamic";
import { error } from "console";
import { useRouter } from "next/navigation";
import { newStudent, updateStudent } from "@/lib/actions/user.actions";

const SearchAddress = dynamic(() => import("@/components/ui/search-address"), {
  ssr: false,
});

const NewStudentForm = ({ params }: { params: { id: string } }) => {
  const [currentTab, setCurrentTab] = useState("guardian1");
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    surname: "",
    dateOfBirth: "",
    age: "",
    gender: "",
    address1: "",
    city: "",
    postalCode: "",
    province: "",
    homeLanguage: "",
    allergies: "",
    medicalAidScheme: "",
    medicalAidNumber: "",
    studentClass: "",
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
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(`/api/students/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch student data");
        }
        const studentData = await response.json();
        console.log("Student Data:", studentData);
        setFormData({
          firstName: studentData.student.firstName,
          secondName: studentData.student.secondName,
          surname: studentData.student.surname,
          dateOfBirth: studentData.student.dateOfBirth,
          age: studentData.student.age,
          gender: studentData.student.gender,
          address1: studentData.student.address1,
          city: studentData.student.city,
          postalCode: studentData.student.postalCode,
          province: studentData.student.province,
          homeLanguage: studentData.student.homeLanguage,
          allergies: studentData.student.allergies,
          medicalAidScheme: studentData.student.medicalAidScheme,
          medicalAidNumber: studentData.student.medicalAidNumber,
          studentClass: studentData.student.studentClass,
          p1_firstName: studentData.student.p1_firstName,
          p1_surname: studentData.student.p1_surname,
          p1_address1: studentData.student.p1_address1,
          p1_city: studentData.student.p1_city,
          p1_province: studentData.student.p1_province,
          p1_postalCode: studentData.student.p1_postalCode,
          p1_dateOfBirth: studentData.student.p1_dateOfBirth,
          p1_gender: studentData.student.p1_gender,
          p1_idNumber: studentData.student.p1_idNumber,
          p1_occupation: studentData.student.p1_occupation,
          p1_phoneNumber: studentData.student.p1_phoneNumber,
          p1_email: studentData.student.p1_email,
          p1_workNumber: studentData.student.p1_workNumber,
          p1_relationship: studentData.student.p1_relationship,
          p2_firstName: studentData.student.p2_firstName,
          p2_surname: studentData.student.p2_surname,
          p2_address1: studentData.student.p2_address1,
          p2_city: studentData.student.p2_city,
          p2_province: studentData.student.p2_province,
          p2_postalCode: studentData.student.p2_postalCode,
          p2_dateOfBirth: studentData.student.p2_dateOfBirth,
          p2_gender: studentData.student.p2_gender,
          p2_idNumber: studentData.student.p2_idNumber,
          p2_occupation: studentData.student.p2_occupation,
          p2_phoneNumber: studentData.student.p2_phoneNumber,
          p2_email: studentData.student.p2_email,
          p2_workNumber: studentData.student.p2_workNumber,
          p2_relationship: studentData.student.p2_relationship,
        });
        console.log("Student Data //////" + formData);
        console.log("Student Data //////" + formData.firstName);
        // form.reset(studentData);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    fetchStudentData();
  }, []);

  const router = useRouter();

  // useEffect(() => {
  //   console.log("Current formData:", formData);
  // }, [formData]);

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
      studentClass: "",
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

  const onSubmit = async (data: z.infer<typeof studentFormSchema>) => {
    console.log("Form data:", data);
    console.log("Submit");
    setIsLoading(true);
    try {
      const addNewStudent = await updateStudent(data, params.id);
      console.log("Update Student " + addNewStudent);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("An error occurred while submitting the form.");
    } finally {
      setIsLoading(false);
    }
    // setFormData(data);
    console.log("Form data ready for Appwrite:", data);
  };

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

  const calculateAge = (birthDate: string): string => {
    const today = new Date();
    const birth = new Date(birthDate);
    let months =
      (today.getFullYear() - birth.getFullYear()) * 12 +
      (today.getMonth() - birth.getMonth());

    if (months < 12) {
      return `${months} month${months !== 1 ? "s" : ""}`;
    } else {
      let years = Math.floor(months / 12);
      // Check if birthday is later this year
      if (
        today.getMonth() < birth.getMonth() ||
        (today.getMonth() === birth.getMonth() &&
          today.getDate() < birth.getDate())
      ) {
        years += 1;
      }
      return parseStringify(`${years} year${years !== 1 ? "s" : ""}`);
    }
  };

  // const form = useForm()
  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-2 gap-6 bg-orange-50 rounded-lg p-5">
            {/* ChildInformation//////////////////////////////////////////////////// */}

            <div className="flex flex-col col-span-1 p-6 pl-6 pr-6 pb-4">
              <Link href="/students" className=" w-min">
                <span className=" -mt-6 -ml-4 flex items-center gap-2 hover:text-orange-300">
                  <ChevronLeft className="h-5 w-5  hover:text-orange-300" />
                  Back
                </span>
              </Link>
              <h1 className="pt-5">Edit Child Information</h1>

              <div className="p-4 bg-orange-100 rounded-lg">
                <div className=" col-span-1">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="cols-span-1">
                      <CustomInput
                        name="firstName"
                        placeholder="Enter Child Name"
                        control={form.control}
                        label={"Name"}
                        value={formData.firstName}
                      />
                    </div>

                    <div>
                      <CustomInput
                        name="secondName"
                        placeholder="Enter Child Second Name"
                        control={form.control}
                        label={"Second Name"}
                        value={formData.secondName}
                      />
                    </div>

                    <div className="col-span-1">
                      <CustomInput
                        name="surname"
                        placeholder="Enter Child Surname"
                        control={form.control}
                        label={"Surname"}
                        value={formData.surname}
                      />
                    </div>

                    <div className="cols-span-1">
                      <CustomInput
                        name="dateOfBirth"
                        placeholder="Enter Child Date of Birth"
                        control={form.control}
                        label={"Date of Birth"}
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          const age = calculateAge(e.target.value);
                          form.setValue("age", age);
                        }}
                      />
                    </div>

                    <div className="col-span-1">
                      <CustomInput
                        name="age"
                        placeholder="Age will be calculated"
                        control={form.control}
                        label={"Age"}
                        readonly={true}
                      />
                    </div>

                    <div className="col-span-1">
                      <CustomInput
                        name="gender"
                        placeholder="Select Gender"
                        control={form.control}
                        label={"Gender"}
                        value={formData.gender}
                        select={true}
                        options={[
                          { label: "Male", value: "Male" },
                          { label: "Female", value: "Female" },
                        ]}
                      />
                    </div>
                    {/* 
                  <div className="cols-span-1">
                    <CustomInput
                      name="address1"
                      placeholder="Enter Child Address"
                      control={form.control}
                      label={"Address"}
                      type="search"
                    />
                  </div> */}

                    <div className="cols-span-1">
                      <CustomInput
                        name="address1"
                        placeholder="Enter Child Address"
                        control={form.control}
                        label={"Address"}
                        value={formData.address1}
                      />
                    </div>

                    <div className="col-span-1">
                      <CustomInput
                        name="city"
                        placeholder="Enter City"
                        control={form.control}
                        label={"City"}
                        value={formData.city}
                      />
                    </div>

                    <div className="cols-span-1">
                      <CustomInput
                        name="postalCode"
                        placeholder="Enter Postal Code"
                        control={form.control}
                        label={"Postal Code"}
                        value={formData.postalCode}
                      />
                    </div>

                    <div className="cols-span-1">
                      <CustomInput
                        name="province"
                        placeholder="Enter Province"
                        control={form.control}
                        label={"Province"}
                        value={formData.province}
                      />
                    </div>

                    <div className="col-span-1">
                      <CustomInput
                        name="homeLanguage"
                        placeholder="Home Language"
                        control={form.control}
                        label={"Home Language"}
                        value={formData.homeLanguage}
                      />
                    </div>
                    <div className="col-span-1">
                      <CustomInput
                        name="allergies"
                        placeholder="Allergies"
                        control={form.control}
                        label={"Allergies"}
                        value={formData.allergies}
                      />
                    </div>

                    <div className="col-span-1">
                      <CustomInput
                        name="medicalAidNumber"
                        placeholder="Medical Aid Number"
                        control={form.control}
                        label={"Medical Aid Number"}
                        value={formData.medicalAidNumber}
                      />
                    </div>

                    <div className="col-span-1">
                      <CustomInput
                        name="medicalAidScheme"
                        placeholder="Medical Aid Scheme"
                        control={form.control}
                        label={"Medical Aid Scheme"}
                        value={formData.medicalAidScheme}
                      />
                    </div>

                    <div className="col-span-1">
                      <CustomInput
                        name="studentClass"
                        placeholder="Class"
                        control={form.control}
                        label={"Class"}
                        value={formData.studentClass}
                      />
                    </div>
                  </div>
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
                  <div className="grid grid-cols-2 gap-2">
                    <div className=" col-span-2 pt-1 w-full">
                      <CustomInput
                        name="p1_relationship"
                        placeholder="Select Relationship"
                        control={form.control}
                        label={"Relationship"}
                        value={formData.p1_relationship}
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
                        value={formData.p1_firstName}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput
                        name="p1_surname"
                        placeholder="Enter Surname"
                        control={form.control}
                        label={"Surname"}
                        value={formData.p1_surname}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput
                        name="p1_email"
                        placeholder="Enter Email"
                        control={form.control}
                        label={"Email"}
                        type="email"
                        value={formData.p1_email}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput
                        name="p1_phoneNumber"
                        placeholder="Enter Phone Number"
                        control={form.control}
                        label={"Phone Number"}
                        value={formData.p1_phoneNumber}
                      />
                    </div>
                    {/* <div className="cols-span-1">
                      <CustomInput
                        name="p1_occupation"
                        placeholder="Enter Employer"
                        control={form.control}
                        label={"Employer"}
                      />
                    </div> */}
                    <div className="cols-span-1">
                      <CustomInput
                        name="p1_idNumber"
                        placeholder="Enter ID Number"
                        control={form.control}
                        label={"ID Number"}
                        value={formData.p1_idNumber}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput
                        name="p1_gender"
                        placeholder="Enter gender"
                        control={form.control}
                        label={"Gender"}
                        value={formData.p1_gender}
                        select={true}
                        options={[
                          { label: "Male", value: "Male" },
                          { label: "Female", value: "Female" },
                        ]}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput
                        name="p1_dateOfBirth"
                        placeholder="Enter Date of Birth"
                        control={form.control}
                        label={"Date Of Birth"}
                        type="date"
                        value={formData.p1_dateOfBirth}
                      />
                    </div>
                    <div></div>
                    {/* <div className="w-full col-span-2"> */}
                    {/* <SearchAddress onSelectLocation={(location) => console.log(location)} /> */}
                    {/* <CustomInput
                        name="p1_address1"
                        placeholder="Enter Address"
                        control={form.control}
                        label={"Address"}
                        type="search"
                      />
                    </div> */}
                    <div className="w-full col-span-2">
                      {/* <SearchAddress onSelectLocation={(location) => console.log(location)} /> */}
                      <CustomInput
                        name="p1_address1"
                        placeholder="Enter Address"
                        control={form.control}
                        label={"Address"}
                        value={formData.p1_address1}
                      />
                    </div>

                    <div className="cols-span-1">
                      <CustomInput
                        name="p1_city"
                        placeholder="Enter City"
                        control={form.control}
                        label={"City"}
                        value={formData.p1_city}
                      />
                    </div>

                    <div className="cols-span-1">
                      <CustomInput
                        name="p1_postalCode"
                        placeholder="Enter Postal Code"
                        control={form.control}
                        label={"Postal Code"}
                        value={formData.p1_postalCode}
                      />
                    </div>

                    <div className="cols-span-1">
                      <CustomInput
                        name="p1_province"
                        placeholder="Enter Province"
                        control={form.control}
                        label={"Province"}
                        value={formData.p1_province}
                      />
                    </div>

                    <div className="cols-span-1">
                      <CustomInput
                        name="p1_occupation"
                        placeholder="Enter Employer Name"
                        control={form.control}
                        label={"Employer"}
                        value={formData.p1_occupation}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput
                        name="p1_workNumber"
                        placeholder="Enter Employer Phone Number"
                        control={form.control}
                        label={"Employer Phone Number"}
                        value={formData.p1_workNumber}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="guardian2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2 pt-1 w-full">
                      <CustomInput
                        name="p2_relationship"
                        placeholder="Select Relationship"
                        control={form.control}
                        label={"Relationship"}
                        value={formData.p2_relationship}
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
                        value={formData.p2_firstName}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput
                        name="p2_surname"
                        placeholder="Enter Surname"
                        control={form.control}
                        label={"Surname"}
                        value={formData.p2_surname}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput
                        name="p2_email"
                        placeholder="Enter Email"
                        control={form.control}
                        label={"Email"}
                        type="email"
                        value={formData.p2_email}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput
                        name="p2_phoneNumber"
                        placeholder="Enter Phone Number"
                        control={form.control}
                        label={"Phone Number"}
                        value={formData.p2_phoneNumber}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput
                        name="p2_occupation"
                        placeholder="Enter Employer"
                        control={form.control}
                        label={"Employer"}
                        value={formData.p2_occupation}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput
                        name="p2_idNumber"
                        placeholder="Enter ID Number"
                        control={form.control}
                        label={"ID Number"}
                        value={formData.p2_idNumber}
                      />
                    </div>
                    <div></div>
                    <div className="w-full col-span-2">
                      <CustomInput
                        name="p2_address1"
                        placeholder="Enter Address"
                        control={form.control}
                        label={"Address"}
                        value={formData.p2_address1}
                      />
                    </div>

                    <div className="cols-span-1">
                      <CustomInput
                        name="p2_city"
                        placeholder="Enter City"
                        control={form.control}
                        label={"City"}
                        value={formData.p2_city}
                      />
                    </div>

                    <div className="cols-span-1">
                      <CustomInput
                        name="p2_postalCode"
                        placeholder="Enter Postal Code"
                        control={form.control}
                        label={"Postal Code"}
                        value={formData.p2_postalCode}
                      />
                    </div>

                    <div className="cols-span-1">
                      <CustomInput
                        name="p2_province"
                        placeholder="Enter Province"
                        control={form.control}
                        label={"Province"}
                        value={formData.p2_province}
                      />
                    </div>
                    {/* <div className="w-full col-span-2">
                      <CustomInput
                        name="p2_address1"
                        placeholder="Enter Address"
                        control={form.control}
                        label={"Address"}
                        type="search"
                      />
                    </div> */}
                    <div className="cols-span-1">
                      <CustomInput
                        name="p2_occupation"
                        placeholder="Enter Employer Name"
                        control={form.control}
                        label={"Employer"}
                        value={formData.p2_occupation}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput
                        name="p2_workNumber"
                        placeholder="Enter Employer Phone Number"
                        control={form.control}
                        label={"Employer Phone Number"}
                        value={formData.p2_workNumber}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <Button type="submit" disabled={isLoading} className="form-btn">
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </div>
          {error && <div className="text-red-500">{error}</div>}
        </form>
      </Form>
    </div>
  );
};

export default NewStudentForm;

import { DialogContent, DialogDescription } from "@/components/ui/dialog";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

// ... in your component
<DialogContent>
  <DialogDescription>
    This is a description of the dialog content. It provides context for screen
    readers.
  </DialogDescription>
  {/* Your existing dialog content */}
</DialogContent>;
