"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IClass, studentFormSchema, parseStringify, NewStudentParms } from "@/lib/utils";
import CustomInput from "@/components/ui/CustomInput";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";

const NewStudentForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("student");

  const schema = studentFormSchema();
  type FormData = z.infer<typeof schema>;
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      secondName: "",
      surname: "",
      dateOfBirth: "",
      age: "",
      gender: "",
      address: {
        street: "",
        city: "",
        province: "",
        postalCode: "",
        country: "South Africa"
      },
      homeLanguage: "",
      allergies: "",
      medicalAidNumber: "",
      medicalAidScheme: "",
      studentClass: "",
      studentStatus: "active",
      balance: 0,
      lastPaid: "",
      parent1: {
        relationship: "",
        firstName: "",
        surname: "",
        email: "",
        phoneNumber: "",
        idNumber: "",
        gender: "",
        dateOfBirth: "",
        address: {
          street: "",
          city: "",
          province: "",
          postalCode: "",
          country: "South Africa"
        },
        occupation: "",
        workNumber: ""
      },
      parent2: {
        relationship: "",
        firstName: "",
        surname: "",
        email: "",
        phoneNumber: "",
        idNumber: "",
        gender: "",
        dateOfBirth: "",
        address: {
          street: "",
          city: "",
          province: "",
          postalCode: "",
          country: "South Africa"
        },
        occupation: "",
        workNumber: ""
      }
    }
  });

  useEffect(() => {
    const dateOfBirth = form.watch("dateOfBirth");
    if (dateOfBirth) {
      const age = calculateAge(dateOfBirth);
      form.setValue("age", age);
    }
  }, [form.watch("dateOfBirth")]);

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

  const onSubmit = async (data: FormData) => {
    console.log("Form data:", data);
    setIsLoading(true);
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create student");
      }

      const result = await response.json();
      console.log("Success:", result);
      router.push("/students");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onGuardianChange = (values: FormData) => {
    if (currentTab === "guardian1") {
      form.setValue("parent1.relationship", values.parent1.relationship);
      form.setValue("parent1.firstName", values.parent1.firstName);
      form.setValue("parent1.surname", values.parent1.surname);
      form.setValue("parent1.email", values.parent1.email);
      form.setValue("parent1.phoneNumber", values.parent1.phoneNumber);
      form.setValue("parent1.idNumber", values.parent1.idNumber);
      form.setValue("parent1.gender", values.parent1.gender);
      form.setValue("parent1.dateOfBirth", values.parent1.dateOfBirth);
      form.setValue("parent1.address.street", values.parent1.address.street);
      form.setValue("parent1.address.city", values.parent1.address.city);
      form.setValue("parent1.address.province", values.parent1.address.province);
      form.setValue("parent1.address.postalCode", values.parent1.address.postalCode);
      form.setValue("parent1.occupation", values.parent1.occupation);
      form.setValue("parent1.workNumber", values.parent1.workNumber);
    } else if (values.parent2) {
      const parent2 = values.parent2;
      form.setValue("parent2.relationship", parent2.relationship || "");
      form.setValue("parent2.firstName", parent2.firstName || "");
      form.setValue("parent2.surname", parent2.surname || "");
      form.setValue("parent2.email", parent2.email || "");
      form.setValue("parent2.phoneNumber", parent2.phoneNumber || "");
      form.setValue("parent2.idNumber", parent2.idNumber || "");
      form.setValue("parent2.gender", parent2.gender || "");
      form.setValue("parent2.dateOfBirth", parent2.dateOfBirth || "");
      if (parent2.address) {
        form.setValue("parent2.address.street", parent2.address.street || "");
        form.setValue("parent2.address.city", parent2.address.city || "");
        form.setValue("parent2.address.province", parent2.address.province || "");
        form.setValue("parent2.address.postalCode", parent2.address.postalCode || "");
      }
      form.setValue("parent2.occupation", parent2.occupation || "");
      form.setValue("parent2.workNumber", parent2.workNumber || "");
    }
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    console.log("Current form values:", form.getValues());
    onGuardianChange(form.getValues());
  };

  const handleClassChange = (value: string) => {
    form.setValue("studentClass", value);
  };

  const handleStatusChange = (value: string) => {
    form.setValue("studentStatus", value as "active" | "inactive" | "graduated");
  };

  const handleGenderChange = (value: string) => {
    form.setValue("gender", value);
  };

  const handleParent1GenderChange = (value: string) => {
    form.setValue("parent1.gender", value);
  };

  const handleParent2GenderChange = (value: string) => {
    form.setValue("parent2.gender", value);
  };

  const handleParent1RelationshipChange = (value: string) => {
    form.setValue("parent1.relationship", value);
  };

  const handleParent2RelationshipChange = (value: string) => {
    form.setValue("parent2.relationship", value);
  };

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-2 gap-6 container bg-orange-50 rounded-lg p-5">
            {/* Child Information */}
            <div className="flex flex-col col-span-1 p-6">
              <h1>Child Information</h1>
              <div className="p-4 bg-orange-100 rounded-lg">
                <div className="col-span-1">
                  <div className="grid grid-cols-2 gap-2">
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
                      />
                    </div>

                    <div className="col-span-1">
                      <CustomInput
                        name="age"
                        placeholder="Age will be calculated"
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
                      />
                    </div>

                    <div className="col-span-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CustomInput
                          name="address.street"
                          placeholder="Enter Street Address"
                          control={form.control}
                          label={"Street Address"}
                        />
                        <CustomInput
                          name="address.city"
                          placeholder="Enter City"
                          control={form.control}
                          label={"City"}
                        />
                        <CustomInput
                          name="address.province"
                          placeholder="Enter Province"
                          control={form.control}
                          label={"Province"}
                        />
                        <CustomInput
                          name="address.postalCode"
                          placeholder="Enter Postal Code"
                          control={form.control}
                          label={"Postal Code"}
                        />
                      </div>
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
                </div>
              </div>
            </div>

            {/* Guardian Information */}
            <div className="flex flex-col col-span-1 p-6">
              <h1>Guardian Information</h1>
              <div className="p-4 bg-orange-100 rounded-lg">
                <Tabs defaultValue="guardian1" className="w-full" onValueChange={handleTabChange}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="guardian1">Guardian 1</TabsTrigger>
                    <TabsTrigger value="guardian2">Guardian 2</TabsTrigger>
                  </TabsList>

                  <TabsContent value="guardian1">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="col-span-2 pt-1 w-full">
                        <CustomInput
                          name="parent1.relationship"
                          placeholder="Select Relationship"
                          control={form.control}
                          label={"Relationship"}
                        />
                      </div>

                      <div className="cols-span-1">
                        <CustomInput
                          name="parent1.firstName"
                          placeholder="Enter Name"
                          control={form.control}
                          label={"Name"}
                        />
                      </div>

                      <div className="cols-span-1">
                        <CustomInput
                          name="parent1.surname"
                          placeholder="Enter Surname"
                          control={form.control}
                          label={"Surname"}
                        />
                      </div>

                      <div className="cols-span-1">
                        <CustomInput
                          name="parent1.email"
                          placeholder="Enter Email"
                          control={form.control}
                          label={"Email"}
                        />
                      </div>

                      <div className="cols-span-1">
                        <CustomInput
                          name="parent1.phoneNumber"
                          placeholder="Enter Phone Number"
                          control={form.control}
                          label={"Phone Number"}
                        />
                      </div>

                      <div className="cols-span-1">
                        <CustomInput
                          name="parent1.idNumber"
                          placeholder="Enter ID Number"
                          control={form.control}
                          label={"ID Number"}
                        />
                      </div>

                      <div className="cols-span-1">
                        <CustomInput
                          name="parent1.gender"
                          placeholder="Enter gender"
                          control={form.control}
                          label={"Gender"}
                        />
                      </div>

                      <div className="cols-span-1">
                        <CustomInput
                          name="parent1.dateOfBirth"
                          placeholder="Enter Date of Birth"
                          control={form.control}
                          label={"Date of Birth"}
                        />
                      </div>

                      <div className="col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <CustomInput
                            name="parent1.address.street"
                            placeholder="Enter Street Address"
                            control={form.control}
                            label={"Street Address"}
                          />
                          <CustomInput
                            name="parent1.address.city"
                            placeholder="Enter City"
                            control={form.control}
                            label={"City"}
                          />
                          <CustomInput
                            name="parent1.address.province"
                            placeholder="Enter Province"
                            control={form.control}
                            label={"Province"}
                          />
                          <CustomInput
                            name="parent1.address.postalCode"
                            placeholder="Enter Postal Code"
                            control={form.control}
                            label={"Postal Code"}
                          />
                        </div>
                      </div>

                      <div className="cols-span-1">
                        <CustomInput
                          name="parent1.occupation"
                          placeholder="Enter Employer Name"
                          control={form.control}
                          label={"Employer Name"}
                        />
                      </div>

                      <div className="cols-span-1">
                        <CustomInput
                          name="parent1.workNumber"
                          placeholder="Enter Employer Phone Number"
                          control={form.control}
                          label={"Employer Phone Number"}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="guardian2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="col-span-2 pt-1 w-full">
                        <CustomInput
                          name="parent2.relationship"
                          placeholder="Select Relationship"
                          control={form.control}
                          label={"Relationship"}
                        />
                      </div>

                      <div className="cols-span-1">
                        <CustomInput
                          name="parent2.firstName"
                          placeholder="Enter Name"
                          control={form.control}
                          label={"Name"}
                        />
                      </div>

                      <div className="cols-span-1">
                        <CustomInput
                          name="parent2.surname"
                          placeholder="Enter Surname"
                          control={form.control}
                          label={"Surname"}
                        />
                      </div>

                      <div className="cols-span-1">
                        <CustomInput
                          name="parent2.email"
                          placeholder="Enter Email"
                          control={form.control}
                          label={"Email"}
                        />
                      </div>

                      <div className="cols-span-1">
                        <CustomInput
                          name="parent2.phoneNumber"
                          placeholder="Enter Phone Number"
                          control={form.control}
                          label={"Phone Number"}
                        />
                      </div>

                      <div className="cols-span-1">
                        <CustomInput
                          name="parent2.idNumber"
                          placeholder="Enter ID Number"
                          control={form.control}
                          label={"ID Number"}
                        />
                      </div>

                      <div className="cols-span-1">
                        <CustomInput
                          name="parent2.gender"
                          placeholder="Enter gender"
                          control={form.control}
                          label={"Gender"}
                        />
                      </div>

                      <div className="cols-span-1">
                        <CustomInput
                          name="parent2.dateOfBirth"
                          placeholder="Enter Date of Birth"
                          control={form.control}
                          label={"Date of Birth"}
                        />
                      </div>

                      <div className="col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <CustomInput
                            name="parent2.address.street"
                            placeholder="Enter Street Address"
                            control={form.control}
                            label={"Street Address"}
                          />
                          <CustomInput
                            name="parent2.address.city"
                            placeholder="Enter City"
                            control={form.control}
                            label={"City"}
                          />
                          <CustomInput
                            name="parent2.address.province"
                            placeholder="Enter Province"
                            control={form.control}
                            label={"Province"}
                          />
                          <CustomInput
                            name="parent2.address.postalCode"
                            placeholder="Enter Postal Code"
                            control={form.control}
                            label={"Postal Code"}
                          />
                        </div>
                      </div>

                      <div className="cols-span-1">
                        <CustomInput
                          name="parent2.occupation"
                          placeholder="Enter Employer Name"
                          control={form.control}
                          label={"Employer Name"}
                        />
                      </div>

                      <div className="cols-span-1">
                        <CustomInput
                          name="parent2.workNumber"
                          placeholder="Enter Employer Phone Number"
                          control={form.control}
                          label={"Employer Phone Number"}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewStudentForm;
