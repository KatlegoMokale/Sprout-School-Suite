"use client";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomInput from "@/components/ui/CustomInput";
import { IClass, studentFormSchema, parseStringify, NewStudentParms } from "@/lib/utils";
import { DialogContent, DialogDescription } from "@/components/ui/dialog";
import Link from "next/link";
import { Check, ChevronLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { newStudent } from "@/lib/actions/user.actions";
import {
  Select1,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue1,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const schema = studentFormSchema();
type FormData = z.infer<typeof schema>;

const NewStudentForm = () => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("guardian1");
  const [classData, setClassData] = useState<IClass[] | null>(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchClasses = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/class");
        if (!response.ok) {
          throw new Error("Failed to fetch classes");
        }
        const data = await response.json();
        
        setClassData(data);
      } catch (error) {
        console.log("Error fetching classes:", error);
        setError("Failed to fetch classes, Please try reloading the page.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchClasses();
  }, []);

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

  const onSubmit = async (data: z.infer<typeof schema>) => {
    console.log("Form data:", data);
    setIsLoading(true);
    try {
      // Transform the form data to match MongoDB schema
      const transformedData: NewStudentParms = {
        firstName: data.firstName,
        secondName: data.secondName || undefined,
        surname: data.surname,
        address: {
          street: data.address.street,
          city: data.address.city,
          province: data.address.province,
          postalCode: data.address.postalCode,
          country: data.address.country
        },
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        age: data.age,
        homeLanguage: data.homeLanguage,
        allergies: data.allergies || undefined,
        medicalAidNumber: data.medicalAidNumber || undefined,
        medicalAidScheme: data.medicalAidScheme || undefined,
        studentClass: data.studentClass,
        studentStatus: data.studentStatus as 'active' | 'inactive' | 'graduated',
        balance: data.balance,
        lastPaid: data.lastPaid || undefined,
        parent1: {
          relationship: data.parent1.relationship,
          firstName: data.parent1.firstName,
          surname: data.parent1.surname,
          email: data.parent1.email,
          phoneNumber: data.parent1.phoneNumber,
          idNumber: data.parent1.idNumber,
          gender: data.parent1.gender,
          dateOfBirth: data.parent1.dateOfBirth,
          address: {
            street: data.parent1.address.street,
            city: data.parent1.address.city,
            province: data.parent1.address.province,
            postalCode: data.parent1.address.postalCode,
            country: data.parent1.address.country
          },
          occupation: data.parent1.occupation || undefined,
          workNumber: data.parent1.workNumber || undefined
        },
        parent2: data.parent2 ? {
          relationship: data.parent2.relationship || undefined,
          firstName: data.parent2.firstName || undefined,
          surname: data.parent2.surname || undefined,
          email: data.parent2.email || undefined,
          phoneNumber: data.parent2.phoneNumber || undefined,
          idNumber: data.parent2.idNumber || undefined,
          gender: data.parent2.gender || undefined,
          dateOfBirth: data.parent2.dateOfBirth || undefined,
          address: data.parent2.address ? {
            street: data.parent2.address.street || undefined,
            city: data.parent2.address.city || undefined,
            province: data.parent2.address.province || undefined,
            postalCode: data.parent2.address.postalCode || undefined,
            country: data.parent2.address.country || undefined
          } : undefined,
          occupation: data.parent2.occupation || undefined,
          workNumber: data.parent2.workNumber || undefined
        } : undefined
      };

      const result = await newStudent(transformedData);
      console.log("Add new Student " + result);

      toast({
        title: "Success!",
        description:
          "You have successfully added " +
          data.firstName +
          " " +
          data.surname +
          " to the system.",
      });
      form.reset();
      router.push('/students');
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("An error occurred while submitting the form.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    console.log("Current form values:", form.getValues());
    onGuardianChange(form.getValues());
  };

  const onGuardianChange = (values: z.infer<typeof schema>) => {
    if (currentTab === "guardian1") {
      form.setValue("parent1.relationship", values.parent1.relationship);
      form.setValue("parent1.firstName", values.parent1.firstName);
      form.setValue("parent1.surname", values.parent1.surname);
      form.setValue("parent1.address", values.parent1.address);
      form.setValue("parent1.dateOfBirth", values.parent1.dateOfBirth);
      form.setValue("parent1.gender", values.parent1.gender);
      form.setValue("parent1.idNumber", values.parent1.idNumber);
      form.setValue("parent1.occupation", values.parent1.occupation);
      form.setValue("parent1.phoneNumber", values.parent1.phoneNumber);
      form.setValue("parent1.email", values.parent1.email);
      form.setValue("parent1.workNumber", values.parent1.workNumber);
    } else if (currentTab === "guardian2") {
      form.setValue("parent2.relationship", values.parent2?.relationship);
      form.setValue("parent2.firstName", values.parent2?.firstName);
      form.setValue("parent2.surname", values.parent2?.surname);
      form.setValue("parent2.address", values.parent2?.address);
      form.setValue("parent2.dateOfBirth", values.parent2?.dateOfBirth);
      form.setValue("parent2.gender", values.parent2?.gender);
      form.setValue("parent2.idNumber", values.parent2?.idNumber);
      form.setValue("parent2.occupation", values.parent2?.occupation);
      form.setValue("parent2.phoneNumber", values.parent2?.phoneNumber);
      form.setValue("parent2.email", values.parent2?.email);
      form.setValue("parent2.workNumber", values.parent2?.workNumber);
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

  const handleCopyAddress1 = (checked: boolean) => {
    if (checked) {
      const studentAddress = form.getValues("address");
      form.setValue("parent1.address", studentAddress);
    } else {
      form.setValue("parent1.address", {
        street: "",
        city: "",
        province: "",
        postalCode: "",
        country: "South Africa"
      });
    }
  };

  const handleCopyAddress2 = (checked: boolean) => {
    if (checked) {
      const studentAddress = form.getValues("address");
      form.setValue("parent2.address", studentAddress);
    } else {
      form.setValue("parent2.address", {
        street: "",
        city: "",
        province: "",
        postalCode: "",
        country: "South Africa"
      });
    }
  };

  const handleClassChange = (value: string) => {
    form.setValue("studentClass", value);
  };

  return (
    <div className="flex flex-col px-4">
      <Link
        href="/students"
        className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Students
      </Link>
      <Card className=" border-none ">
        <CardHeader>
          <CardTitle className="text-2xl font-bold mt-1">
            New Student Registration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Student Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-5">
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof schema>>
                        name="firstName"
                        placeholder="Enter Child Name"
                        control={form.control}
                        label={"Name"}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof schema>>
                        name="secondName"
                        placeholder="Enter Child Second Name"
                        control={form.control}
                        label={"Second Name"}
                      />
                    </div>

                    <div className="col-span-1">
                      <CustomInput<z.infer<typeof schema>>
                        name="surname"
                        placeholder="Enter Child Surname"
                        control={form.control}
                        label={"Surname"}
                      />
                    </div>

                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof schema>>
                        name="dateOfBirth"
                        placeholder="Enter Child Date of Birth"
                        control={form.control}
                        label={"Date of Birth"}
                        type="date"
                        onChange={(e) => {
                          const newValue = e.target.value;
                          const age = calculateAge(e.target.value);
                          form.setValue("age", age);
                        }}
                      />
                    </div>

                    <div className="col-span-1">
                      <CustomInput<z.infer<typeof schema>>
                        name="age"
                        placeholder="Age will be calculated"
                        control={form.control}
                        label={"Age"}
                        readonly={true}
                      />
                    </div>

                    <div className="col-span-1">
                      <CustomInput<z.infer<typeof schema>>
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

                    <div className="col-span-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CustomInput<z.infer<typeof schema>>
                          name="address.street"
                          placeholder="Enter Street Address"
                          control={form.control}
                          label={"Street Address"}
                        />
                        <CustomInput<z.infer<typeof schema>>
                          name="address.city"
                          placeholder="Enter City"
                          control={form.control}
                          label={"City"}
                        />
                        <CustomInput<z.infer<typeof schema>>
                          name="address.province"
                          placeholder="Enter Province"
                          control={form.control}
                          label={"Province"}
                        />
                        <CustomInput<z.infer<typeof schema>>
                          name="address.postalCode"
                          placeholder="Enter Postal Code"
                          control={form.control}
                          label={"Postal Code"}
                        />
                      </div>
                    </div>

                    <div className="col-span-1">
                      <CustomInput<z.infer<typeof schema>>
                        name="homeLanguage"
                        placeholder="Home Language"
                        control={form.control}
                        label={"Home Language"}
                      />
                    </div>
                    <div className="col-span-1">
                      <CustomInput<z.infer<typeof schema>>
                        name="allergies"
                        placeholder="Allergies"
                        control={form.control}
                        label={"Allergies"}
                      />
                    </div>

                    <div className="col-span-1">
                      <CustomInput<z.infer<typeof schema>>
                        name="medicalAidNumber"
                        placeholder="Medical Aid Number"
                        control={form.control}
                        label={"Medical Aid Number"}
                      />
                    </div>

                    <div className="col-span-1">
                      <CustomInput<z.infer<typeof schema>>
                        name="medicalAidScheme"
                        placeholder="Medical Aid Scheme"
                        control={form.control}
                        label={"Medical Aid Scheme"}
                      />
                    </div>

                    <div className="col-span-1">
                      <div className="form-item">
                        <div className="text-sm font-medium">Class</div>
                        <Select1
                          onValueChange={handleClassChange}
                          defaultValue={form.getValues("studentClass")}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue1 placeholder="Select a class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Classes</SelectLabel>
                              {classData?.map((cls) => (
                                <SelectItem key={cls._id} value={cls._id}>
                                  {cls.name} ({cls.age})
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select1>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="guardian1">
                <TabsList>
                  <TabsTrigger value="guardian1">Guardian 1</TabsTrigger>
                  <TabsTrigger value="guardian2">Guardian 2</TabsTrigger>
                </TabsList>
                <TabsContent value="guardian1">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2 pt-1 w-full">
                      <CustomInput<z.infer<typeof schema>>
                        name="parent1.relationship"
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
                      <CustomInput<z.infer<typeof schema>>
                        name="parent1.firstName"
                        placeholder="Enter Name"
                        control={form.control}
                        label={"Name"}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof schema>>
                        name="parent1.surname"
                        placeholder="Enter Surname"
                        control={form.control}
                        label={"Surname"}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof schema>>
                        name="parent1.email"
                        placeholder="Enter Email"
                        control={form.control}
                        label={"Email"}
                        type="email"
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof schema>>
                        name="parent1.phoneNumber"
                        placeholder="Enter Phone Number"
                        control={form.control}
                        label={"Phone Number"}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof schema>>
                        name="parent1.idNumber"
                        placeholder="Enter ID Number"
                        control={form.control}
                        label={"ID Number"}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof schema>>
                        name="parent1.gender"
                        placeholder="Enter gender"
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
                      <CustomInput<z.infer<typeof schema>>
                        name="parent1.dateOfBirth"
                        placeholder="Enter Date of Birth"
                        control={form.control}
                        label={"Date Of Birth"}
                        type="date"
                      />
                    </div>
                    <div className="w-full col-span-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <Checkbox
                          id="copyAddress1"
                          onCheckedChange={handleCopyAddress1}
                        />
                        <label
                          htmlFor="copyAddress1"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Copy from student address
                        </label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CustomInput<z.infer<typeof schema>>
                          name="parent1.address.street"
                          placeholder="Enter Street Address"
                          control={form.control}
                          label={"Street Address"}
                        />
                        <CustomInput<z.infer<typeof schema>>
                          name="parent1.address.city"
                          placeholder="Enter City"
                          control={form.control}
                          label={"City"}
                        />
                        <CustomInput<z.infer<typeof schema>>
                          name="parent1.address.province"
                          placeholder="Enter Province"
                          control={form.control}
                          label={"Province"}
                        />
                        <CustomInput<z.infer<typeof schema>>
                          name="parent1.address.postalCode"
                          placeholder="Enter Postal Code"
                          control={form.control}
                          label={"Postal Code"}
                        />
                      </div>
                    </div>
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof schema>>
                        name="parent1.occupation"
                        placeholder="Enter Employer Name"
                        control={form.control}
                        label={"Employer"}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof schema>>
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
                      <CustomInput<z.infer<typeof schema>>
                        name="parent2.relationship"
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
                      <CustomInput<z.infer<typeof schema>>
                        name="parent2.firstName"
                        placeholder="Enter Name"
                        control={form.control}
                        label={"Name"}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof schema>>
                        name="parent2.surname"
                        placeholder="Enter Surname"
                        control={form.control}
                        label={"Surname"}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof schema>>
                        name="parent2.email"
                        placeholder="Enter Email"
                        control={form.control}
                        label={"Email"}
                        type="email"
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof schema>>
                        name="parent2.phoneNumber"
                        placeholder="Enter Phone Number"
                        control={form.control}
                        label={"Phone Number"}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof schema>>
                        name="parent2.idNumber"
                        placeholder="Enter ID Number"
                        control={form.control}
                        label={"ID Number"}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof schema>>
                        name="parent2.gender"
                        placeholder="Enter gender"
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
                      <CustomInput<z.infer<typeof schema>>
                        name="parent2.dateOfBirth"
                        placeholder="Enter Date of Birth"
                        control={form.control}
                        label={"Date Of Birth"}
                        type="date"
                      />
                    </div>
                    <div className="w-full col-span-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <Checkbox
                          id="copyAddress2"
                          onCheckedChange={handleCopyAddress2}
                        />
                        <label
                          htmlFor="copyAddress2"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Copy from student address
                        </label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CustomInput<z.infer<typeof schema>>
                          name="parent2.address.street"
                          placeholder="Enter Street Address"
                          control={form.control}
                          label={"Street Address"}
                        />
                        <CustomInput<z.infer<typeof schema>>
                          name="parent2.address.city"
                          placeholder="Enter City"
                          control={form.control}
                          label={"City"}
                        />
                        <CustomInput<z.infer<typeof schema>>
                          name="parent2.address.province"
                          placeholder="Enter Province"
                          control={form.control}
                          label={"Province"}
                        />
                        <CustomInput<z.infer<typeof schema>>
                          name="parent2.address.postalCode"
                          placeholder="Enter Postal Code"
                          control={form.control}
                          label={"Postal Code"}
                        />
                      </div>
                    </div>
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof schema>>
                        name="parent2.occupation"
                        placeholder="Enter Employer Name"
                        control={form.control}
                        label={"Employer"}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof schema>>
                        name="parent2.workNumber"
                        placeholder="Enter Employer Phone Number"
                        control={form.control}
                        label={"Employer Phone Number"}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Button
                type="submit"
                className="w-full transition-colors hover:bg-primary/90 bg-green-200 hover:bg-green-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Student...
                  </>
                ) : (
                  "Add Student"
                )}
              </Button>
            </form>
          </Form>
          <Toaster />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewStudentForm;
