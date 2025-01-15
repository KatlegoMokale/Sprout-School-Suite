"use client";
import {
  Form
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomInput from "@/components/ui/CustomInput";
import { IClass, newStudentFormSchema, parseStringify } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";
import { Check, ChevronLeft, Loader2 } from "lucide-react";
import { autocomplete } from "@/lib/google";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import { Command, CommandInput, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";import { Select, SelectValue } from "@radix-ui/react-select";
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useToast } from '@/hooks/use-toast'
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
import AddressSearch from "@/components/ui/AddressSearch";

const SearchAddress = dynamic(() => import("@/components/ui/search-address"), {
  ssr: false,
});

const formSchema = newStudentFormSchema();

const NewStudentForm = () => {
  const { toast } = useToast()
  const [currentTab, setCurrentTab] = useState("guardian1");
  const [classData, setClassData] = useState<IClass[] | null>(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([]);
  const [input, setInput] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<PlaceAutocompleteResult | null>(null);
  const [onSelectedAddress, setOnSelectedAddress] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  

  useEffect(() => {
    const fetchPredictions = async () => {
      const predictions = await autocomplete(input);
      setPredictions(predictions ?? []);
      console.log("Predictions:", predictions);
    }
    fetchPredictions();
  }, [input]);

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
 // Handle prediction selection
 const handlePredictionSelect = (prediction: any) => {
  const address = prediction.Place.Label;
  setInput(address);
  form.setValue("address1", address);
  form.setValue("p1_address1", address);
};

{predictions.length > 0 && (
  <ul>
    {predictions.map((prediction) => (
      <li key={prediction.place_id} onClick={() => handlePredictionSelect(prediction)}>
        {prediction.description}

      </li>
    ))}
  </ul>
)}
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
  

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const addNewStudent = await newStudent(data);
      console.log("Add new Student " + addNewStudent);

      toast({
        title: "Success!",
        description: "You have successfully added " + data.firstName + " " + data.surname + " to the system.",
      });
      setIsDialogOpen(true);
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
    let months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    
    if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else {
      let years = Math.floor(months / 12);
      // Check if birthday is later this year
      if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
        years += 1;
      }
      return parseStringify(`${years} year${years !== 1 ? 's' : ''}`);
    }
  };

  const handleCopyAddress = (checked: boolean) => {
    if (checked) {
      const studentAddress = form.getValues("address1");
      form.setValue("p2_address1", studentAddress);
    }
  };

  const handleClassChange = (value: string) => {
    form.setValue("studentClass", value);
  };

  const handleAddAnother = () => {
    form.reset();
    setIsDialogOpen(false);
  };

  const handleNavigateBack = () => {
    router.push('/students');
  };
  

  // const form = useForm()
  return (
    <div className="flex flex-col px-4">
      <Link href="/students" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Students
        </Link>
      <Card className=" border-none ">
        <CardHeader>
        
        <CardTitle className="text-2xl font-bold mt-1">New Student Registration</CardTitle>
        </CardHeader>
        <CardContent>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs defaultValue="student">
              <TabsList className=" grid w-full grid-cols-3">
                <TabsTrigger value="student">Student Information</TabsTrigger>
                <TabsTrigger value="guardian1">Guardian 1</TabsTrigger>
                <TabsTrigger value="guardian2">Guardian 2</TabsTrigger>
              </TabsList>
              <TabsContent value="student" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-5">
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

                    {/* <div className="cols-span-1">
                    <CustomInput
                      name="address1"
                      placeholder="Enter Child Address"
                      control={form.control}
                      label={"Address"}
                      type="search"
                    />
                  </div> */}
                    <div className="col-span-2">
                      <Command className="">
                        <CommandInput
                          placeholder="Search for address..."
                          className=""
                          value={input}
                          onValueChange={(value) => {
                            setInput(value);
                            fetchPredictions(value);
                            setOnSelectedAddress(false);
                          }}
                        />
                        <CommandList>
                          {/* <CommandEmpty>No cities found.</CommandEmpty> */}
                          <CommandGroup>
                            {predictions.map((prediction: any) => (
                              <CommandItem
                                key={prediction.Place.Label}
                                onSelect={() => {
                                  handlePredictionSelect(prediction);
                                  setOnSelectedAddress(true);
                                }}
                              >
                                {!onSelectedAddress ? prediction.Place.Label : ""}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
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

                    <div className="col-span-1 hidden">
                      <CustomInput<z.infer<typeof formSchema>>
                        name="studentClass"
                        placeholder="Class"
                        control={form.control}
                        label={"Class"}
                        
                      />
                      </div>
                      <div className="col-span-1">
                        <div className="form-item">
                          <div className=" text-md  font-semibold text-gray-600 ">
                            Class
                          </div>
                          <Select1 onValueChange={handleClassChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue1 placeholder="Select Class 1" />
                          </SelectTrigger>
                          <SelectContent className="bg-white gap-2 rounded-lg">
                            {
                              classData?.map((classItem) => (
                                <SelectItem
                                className="hover:bg-green-200 text-14 font-semibold rounded-lg hover:animate-in p-2 cursor-pointer"
                                  key={classItem.$id}
                                  value={classItem.$id}
                                >
                                  {classItem.name}
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select1>
                        </div>
                      </div>
              </div>
              </TabsContent>
              <TabsContent value="guardian1">
                  <div className="grid grid-cols-2 gap-2">
                    <div className=" col-span-2 pt-1 w-full">
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
                    </div>
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof formSchema>>
                        name="p1_firstName"
                        placeholder="Enter Name"
                        control={form.control}
                        label={"Name"}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof formSchema>>
                        name="p1_surname"
                        placeholder="Enter Surname"
                        control={form.control}
                        label={"Surname"}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof formSchema>>
                        name="p1_email"
                        placeholder="Enter Email"
                        control={form.control}
                        label={"Email"}
                        type="email"
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof formSchema>>
                        name="p1_phoneNumber"
                        placeholder="Enter Phone Number"
                        control={form.control}
                        label={"Phone Number"}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof formSchema>>
                        name="p1_idNumber"
                        placeholder="Enter ID Number"
                        control={form.control}
                        label={"ID Number"}
                      />
                    </div>
                    <div className="cols-span-1">
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
                    </div>
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof formSchema>>
                        name="p1_dateOfBirth"
                        placeholder="Enter Date of Birth"
                        control={form.control}
                        label={"Date Of Birth"}
                        type="date"
                      />
                    </div>
                    <div></div>
                    <div className="w-full col-span-2">
                      <CustomInput<z.infer<typeof formSchema>>
                        name="p1_address1"
                        placeholder="Enter Address"
                        control={form.control}
                        label={"Address"}
                      />
                    </div>

                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof formSchema>>
                        name="p1_occupation"
                        placeholder="Enter Employer Name"
                        control={form.control}
                        label={"Employer"}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof formSchema>>
                        name="p1_workNumber"
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
                    </div>
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof formSchema>>
                        name="p2_firstName"
                        placeholder="Enter Name"
                        control={form.control}
                        label={"Name"}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof formSchema>>
                        name="p2_surname"
                        placeholder="Enter Surname"
                        control={form.control}
                        label={"Surname"}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof formSchema>>
                        name="p2_email"
                        placeholder="Enter Email"
                        control={form.control}
                        label={"Email"}
                        type="email"
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof formSchema>>
                        name="p2_phoneNumber"
                        placeholder="Enter Phone Number"
                        control={form.control}
                        label={"Phone Number"}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof formSchema>>
                        name="p2_idNumber"
                        placeholder="Enter ID Number"
                        control={form.control}
                        label={"ID Number"}
                      />
                    </div>
                    <div className="cols-span-1">
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
                    </div>
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof formSchema>>
                        name="p2_dateOfBirth"
                        placeholder="Enter Date of Birth"
                        control={form.control}
                        label={"Date Of Birth"}
                        type="date"
                      />
                    </div>
                    <div className="w-full col-span-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <Checkbox
                          id="copyAddress"
                          onCheckedChange={handleCopyAddress}
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
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof formSchema>>
                        name="p2_occupation"
                        placeholder="Enter Employer Name"
                        control={form.control}
                        label={"Employer"}
                      />
                    </div>
                    <div className="cols-span-1">
                      <CustomInput<z.infer<typeof formSchema>>
                        name="p2_workNumber"
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
      </CardContent>
      {/* <Toaster /> */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Student Added Successfully</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            What would you like to do next?
          </DialogDescription>
          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={handleAddAnother}>Add Another Student</Button>
            <Button onClick={handleNavigateBack}>Back to Students List</Button>
          </div>
        </DialogContent>
      </Dialog>
     
      </Card>
     
    </div>
  );};

export default NewStudentForm;




