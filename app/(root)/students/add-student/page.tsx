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
import { IClass, newStudentFormSchema, parseStringify } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";
import { Check, ChevronLeft, Loader2 } from "lucide-react";
// import { autocomplete } from "@/lib/google";
// import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
// import { Command, CommandInput, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";

import { useToast } from "@/hooks/use-toast";
import dynamic from "next/dynamic";
import { error } from "console";
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

// const SearchAddress = dynamic(() => import("@/components/ui/search-address"), {
//   ssr: false,
// });

const formSchema = newStudentFormSchema();

const NewStudentForm = () => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("guardian1");
  const [classData, setClassData] = useState<IClass[] | null>(null);
  const [formData, setFormData] = useState<z.infer<typeof studentFormSchema>>({} as z.infer<typeof studentFormSchema>);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();
  // const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([]);
  // const [input, setInput] = useState("");
  // const [selectedAddress, setSelectedAddress] = useState<PlaceAutocompleteResult | null>(null);
  // const [onSelectedAddress, setOnSelectedAddress] = useState(false);

  // useEffect(() => {
  //   const fetchPredictions = async () => {
  //     const predictions = await autocomplete(input);
  //     setPredictions(predictions ?? []);
  //     console.log("Predictions:", predictions);
  //   }
  //   fetchPredictions();
  // }, [input]);

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

  // Handle prediction selection
  // const handlePredictionSelect = (prediction: PlaceAutocompleteResult) => {
  //   setSelectedAddress(prediction);
  //   setInput(prediction.description); // Update input for display

  //   // Extract address components from prediction
  //   console.log(prediction.terms);
  //   console.log("Address:" + prediction.terms[0].value + " " + prediction.terms[1].value + " " + prediction.terms[2].value + " " + prediction.terms[3].value);
  //   const addressComponents = prediction.terms;
  //   const address1 = addressComponents[0].value+ " " + addressComponents[1].value;
  //   const city = addressComponents[2].value;

  //   console.log("Address Components:", address1, city);

  //   // Update form fields
  //   form.setValue("address1", address1 + ", " + city);

  //   form.setValue("p1_address1", address1 + ", " + city);

  // };

  // {predictions.length > 0 && (
  //   <ul>
  //     {predictions.map((prediction) => (
  //       <li key={prediction.place_id} onClick={() => handlePredictionSelect(prediction)}>
  //         {prediction.description}

  //       </li>
  //     ))}
  //   </ul>
  // )}
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

      balance: 0,
      lastPaid: "",
      studentStatus: "active",
    },
  });

  const onSubmit = async (data: z.infer<typeof studentFormSchema>) => {
    console.log("Form data:", data);
    console.log("Submit");
    setIsLoading(true);
    try {
      const addNewStudent = await newStudent(data);
      console.log("Add new Student " + addNewStudent);

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
      setShowConfirmation(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("An error occurred while submitting the form.");
    } finally {
      setIsLoading(false);
    }
    setFormData(data);
    console.log("Form data ready for Appwrite:", data);
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    console.log("Current form values:", form.getValues());
    onGuardianChange(form.getValues());
  };

  const onGuardianChange = (values: z.infer<typeof studentFormSchema>) => {
    if (currentTab === "guardian1") {
      // console.log("Guardian 1 values:", values);
      // console.log("Guardian 1");
      // Store guardian1 values
      form.setValue("p1_relationship", values.p1_relationship);
      form.setValue("p1_firstName", values.p1_firstName);
      form.setValue("p1_surname", values.p1_surname);
      form.setValue("p1_address1", values.p1_address1);
      form.setValue("p1_dateOfBirth", values.p1_dateOfBirth);
      form.setValue("p1_gender", values.p1_gender);
      form.setValue("p1_idNumber", values.p1_idNumber);
      form.setValue("p1_occupation", values.p1_occupation);
      form.setValue("p1_phoneNumber", values.p1_phoneNumber);
      form.setValue("p1_email", values.p1_email);
      // ... (other p1 fields)
    } else if (currentTab === "guardian2") {
      // Store guardian2 values
      // console.log("Guardian 2 values:", values);
      // console.log("Guardian 2");
      form.setValue("p2_relationship", values.p2_relationship);
      form.setValue("p2_firstName", values.p2_firstName);
      form.setValue("p2_surname", values.p2_surname);
      form.setValue("p2_address1", values.p2_address1);
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

  const handleCopyAddress2 = (checked: boolean) => {
    if (checked) {
      const studentAddress = form.getValues("address1");
      form.setValue("p2_address1", studentAddress);
    } else {
      form.setValue("p2_address1", "");
    }
  };

  const handleCopyAddress1 = (checked: boolean) => {
    if (checked) {
      const studentAddress = form.getValues("address1");
      form.setValue("p1_address1", studentAddress);
    } else {
      form.setValue("p1_address1", "");
    }
  };

  const handleClassChange = (value: string) => {
    form.setValue("studentClass", value);
  };

  // const form = useForm()
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
              {/* Student Information Section */}
              <div className="bg-orange-50 rounded-lg p-5">
                <h2 className="text-xl font-semibold mb-4">Student Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="cols-span-1">
                    <CustomInput<z.infer<typeof formSchema>>
                      name="firstName"
                      placeholder="Enter Child Name"
                      control={form.control}
                      label={"Name"}
                    />
                  </div>
                  <div className="cols-span-1">
                    <CustomInput<z.infer<typeof formSchema>>
                      name="secondName"
                      placeholder="Enter Child Second Name"
                      control={form.control}
                      label={"Second Name"}
                    />
                  </div>

                  <div className="col-span-1">
                    <CustomInput<z.infer<typeof formSchema>>
                      name="surname"
                      placeholder="Enter Child Surname"
                      control={form.control}
                      label={"Surname"}
                    />
                  </div>

                  <div className="cols-span-1">
                    <CustomInput<z.infer<typeof formSchema>>
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
                    <CustomInput<z.infer<typeof formSchema>>
                      name="age"
                      placeholder="Age will be calculated"
                      control={form.control}
                      label={"Age"}
                      readonly={true}
                    />
                  </div>

                  <div className="col-span-1">
                    <CustomInput<z.infer<typeof formSchema>>
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
                    <CustomInput<z.infer<typeof formSchema>>
                      name="address1"
                      placeholder="Enter Child Address"
                      control={form.control}
                      label={"Address"}
                    />
                  </div>

                  <div className="col-span-1">
                    <CustomInput<z.infer<typeof formSchema>>
                      name="homeLanguage"
                      placeholder="Home Language"
                      control={form.control}
                      label={"Home Language"}
                    />
                  </div>
                  <div className="col-span-1">
                    <CustomInput<z.infer<typeof formSchema>>
                      name="allergies"
                      placeholder="Allergies"
                      control={form.control}
                      label={"Allergies"}
                    />
                  </div>

                  <div className="col-span-1">
                    <CustomInput<z.infer<typeof formSchema>>
                      name="medicalAidNumber"
                      placeholder="Medical Aid Number"
                      control={form.control}
                      label={"Medical Aid Number"}
                    />
                  </div>

                  <div className="col-span-1">
                    <CustomInput<z.infer<typeof formSchema>>
                      name="medicalAidScheme"
                      placeholder="Medical Aid Scheme"
                      control={form.control}
                      label={"Medical Aid Scheme"}
                    />
                  </div>

                  <div className="col-span-1">
                    <div className="form-item">
                      <div className="text-md font-semibold text-gray-600">Class</div>
                      <Select1 onValueChange={handleClassChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue1 placeholder="Select Class" />
                        </SelectTrigger>
                        <SelectContent className="bg-white gap-2 rounded-lg">
                          {classData?.map((classItem) => (
                            <SelectItem
                              className="hover:bg-green-200 text-14 font-semibold rounded-lg hover:animate-in p-2 cursor-pointer"
                              key={classItem.$id}
                              value={classItem.$id}
                            >
                              {classItem.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select1>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guardians Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Guardian 1 */}
                <div className="bg-orange-50 rounded-lg p-5">
                  <h2 className="text-xl font-semibold mb-4">Guardian 1</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <CustomInput<z.infer<typeof formSchema>>
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
                    <CustomInput<z.infer<typeof formSchema>>
                      name="p1_firstName"
                      placeholder="Enter Name"
                      control={form.control}
                      label={"Name"}
                    />
                    <CustomInput<z.infer<typeof formSchema>>
                      name="p1_surname"
                      placeholder="Enter Surname"
                      control={form.control}
                      label={"Surname"}
                    />
                    <CustomInput<z.infer<typeof formSchema>>
                      name="p1_email"
                      placeholder="Enter Email"
                      control={form.control}
                      label={"Email"}
                      type="email"
                    />
                    <CustomInput<z.infer<typeof formSchema>>
                      name="p1_phoneNumber"
                      placeholder="Enter Phone Number"
                      control={form.control}
                      label={"Phone Number"}
                    />
                    <CustomInput<z.infer<typeof formSchema>>
                      name="p1_idNumber"
                      placeholder="Enter ID Number"
                      control={form.control}
                      label={"ID Number"}
                    />
                    <CustomInput<z.infer<typeof formSchema>>
                      name="p1_gender"
                      placeholder="Enter gender"
                      control={form.control}
                      label={"Gender"}
                      select={true}
                      options={[
                        { label: "Male", value: "Male" },
                        { label: "Female", value: "Female" },
                      ]}
                    />
                    <CustomInput<z.infer<typeof formSchema>>
                      name="p1_dateOfBirth"
                      placeholder="Enter Date of Birth"
                      control={form.control}
                      label={"Date Of Birth"}
                      type="date"
                    />
                    <div className="w-full">
                      <div className="flex items-center space-x-2 mb-2">
                        <Checkbox
                          id="copyAddress"
                          onCheckedChange={handleCopyAddress1}
                        />
                        <label
                          htmlFor="copyAddress"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Copy from student address
                        </label>
                      </div>
                      <CustomInput<z.infer<typeof formSchema>>
                        name="p1_address1"
                        placeholder="Enter Address"
                        control={form.control}
                        label={"Address"}
                      />
                    </div>
                    <CustomInput<z.infer<typeof formSchema>>
                      name="p1_occupation"
                      placeholder="Enter Employer Name"
                      control={form.control}
                      label={"Employer"}
                    />
                    <CustomInput<z.infer<typeof formSchema>>
                      name="p1_workNumber"
                      placeholder="Enter Employer Phone Number"
                      control={form.control}
                      label={"Employer Phone Number"}
                    />
                  </div>
                </div>

                {/* Guardian 2 */}
                <div className="bg-orange-50 rounded-lg p-5">
                  <h2 className="text-xl font-semibold mb-4">Guardian 2</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <CustomInput<z.infer<typeof formSchema>>
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
                    <CustomInput<z.infer<typeof formSchema>>
                      name="p2_firstName"
                      placeholder="Enter Name"
                      control={form.control}
                      label={"Name"}
                    />
                    <CustomInput<z.infer<typeof formSchema>>
                      name="p2_surname"
                      placeholder="Enter Surname"
                      control={form.control}
                      label={"Surname"}
                    />
                    <CustomInput<z.infer<typeof formSchema>>
                      name="p2_email"
                      placeholder="Enter Email"
                      control={form.control}
                      label={"Email"}
                      type="email"
                    />
                    <CustomInput<z.infer<typeof formSchema>>
                      name="p2_phoneNumber"
                      placeholder="Enter Phone Number"
                      control={form.control}
                      label={"Phone Number"}
                    />
                    <CustomInput<z.infer<typeof formSchema>>
                      name="p2_idNumber"
                      placeholder="Enter ID Number"
                      control={form.control}
                      label={"ID Number"}
                    />
                    <CustomInput<z.infer<typeof formSchema>>
                      name="p2_gender"
                      placeholder="Enter gender"
                      control={form.control}
                      label={"Gender"}
                      select={true}
                      options={[
                        { label: "Male", value: "Male" },
                        { label: "Female", value: "Female" },
                      ]}
                    />
                    <CustomInput<z.infer<typeof formSchema>>
                      name="p2_dateOfBirth"
                      placeholder="Enter Date of Birth"
                      control={form.control}
                      label={"Date Of Birth"}
                      type="date"
                    />
                    <div className="w-full">
                      <div className="flex items-center space-x-2 mb-2">
                        <Checkbox
                          id="copyAddress"
                          onCheckedChange={handleCopyAddress2}
                        />
                        <label
                          htmlFor="copyAddress"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Copy from student address
                        </label>
                      </div>
                      <CustomInput<z.infer<typeof formSchema>>
                        name="p2_address1"
                        placeholder="Enter Address"
                        control={form.control}
                        label={"Address"}
                      />
                    </div>
                    <CustomInput<z.infer<typeof formSchema>>
                      name="p2_occupation"
                      placeholder="Enter Employer Name"
                      control={form.control}
                      label={"Employer"}
                    />
                    <CustomInput<z.infer<typeof formSchema>>
                      name="p2_workNumber"
                      placeholder="Enter Employer Phone Number"
                      control={form.control}
                      label={"Employer Phone Number"}
                    />
                  </div>
                </div>
              </div>

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

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Student Added Successfully</DialogTitle>
            <DialogDescription>
              {formData.firstName} {formData.surname} has been added to the system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowConfirmation(false);
                router.push('/students');
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              View All Students
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewStudentForm;

// ... in your component
<DialogContent>
  <DialogDescription>
    This is a description of the dialog content. It provides context for screen
    readers.
  </DialogDescription>
  {/* Your existing dialog content */}
</DialogContent>;

import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectValue } from "@radix-ui/react-select";
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
