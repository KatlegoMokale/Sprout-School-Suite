"use client";
import { Form } from "@/components/ui/form";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomInput from "@/components/ui/CustomInput";
import {
  newStudentFormSchema,
  newStuffFormSchema,
  parseStringify,
} from "@/lib/utils";
import { DialogContent, DialogDescription } from "@/components/ui/dialog";
import Link from "next/link";
import { Check, ChevronLeft } from "lucide-react";
import { autocomplete } from "@/lib/google";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import {
  Command,
  CommandInput,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import dynamic from "next/dynamic";
import { error } from "console";
import { useRouter } from "next/navigation";
import { newStuff } from "@/lib/actions/user.actions";

const formSchema = newStuffFormSchema();

const AddStuff = () => {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([]);
  const [input, setInput] = useState("");
  const [selectedAddress, setSelectedAddress] =
    useState<PlaceAutocompleteResult | null>(null);
  const [onSelectedAddress, setOnSelectedAddress] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  

  useEffect(() => {
    const fetchPredictions = async () => {
      const predictions = await autocomplete(input);
      setPredictions(predictions ?? []);
      console.log("Predictions:", predictions);
    };
    fetchPredictions();
  }, [input]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handlePredictionSelect = (prediction: PlaceAutocompleteResult) => {
    setSelectedAddress(prediction);
    setInput(prediction.description); // Update input for display

    // Extract address components from prediction
    console.log(prediction.terms);
    console.log(
      "Address:" +
        prediction.terms[0].value +
        " " +
        prediction.terms[1].value +
        " " +
        prediction.terms[2].value +
        " " +
        prediction.terms[3].value
    );
    const addressComponents = prediction.terms;
    const address1 =
      addressComponents[0].value + " " + addressComponents[1].value;
    const city = addressComponents[2].value;

    console.log("Address Components:", address1, city);

    // Update form fields
    form.setValue("address1", address1 + ", " + city);

    form.setValue("p1_address1", address1 + ", " + city);
  };

  {
    predictions.length > 0 && (
      <ul>
        {predictions.map((prediction) => (
          <li
            key={prediction.place_id}
            onClick={() => handlePredictionSelect(prediction)}
          >
            {prediction.description}
          </li>
        ))}
      </ul>
    );
  }

  const stuffFormSchema = newStuffFormSchema();
  const form = useForm<z.infer<typeof stuffFormSchema>>({
    resolver: zodResolver(stuffFormSchema),
    defaultValues: {
      firstName: "",
      secondName: "",
      surname: "",
      dateOfBirth: "",
      idNumber: "",
      address1: "",
      contact: "",
      gender: "",
      position: "",
      startDate: "",
    },
  });

  const handleConfirmAddStuff = async () => {
    console.log("Add Stuff onSubmit beginning...");
    setIsLoading(true);
    try {
      const addNewStuff = await newStuff(formData as NewStuffParams);
      console.log("Add new Stuff " + addNewStuff);
      router.push("/manage-school");
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("An error occurred while submitting the form.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof stuffFormSchema>) => {
    setIsConfirmOpen(true);

    setFormData(data);
  };

 

  return (
    <div className="flex flex-col gap-4 bg-orange-50">
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogTrigger asChild>
          {/* <Button type="submit" disabled={isLoading} className="form-btn">
          {isLoading ? "Updating..." : "Update"}
        </Button> */}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>Confirm Adding New Stuff </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to update this stuff member information?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel
              className=" hover:bg-slate-200"
              onClick={() => setIsConfirmOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-orange-200 hover:bg-orange-300 "
              onClick={handleConfirmAddStuff}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Form {...form}>
        <div className="">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className=" gap-6  rounded-lg p-5">
              <div>
                <Link href="/manage-school" className="flex items-center gap-1">
                  <ChevronLeft className="h-4 w-4" />
                  <p>Back</p>
                </Link>
              </div>
              <div className="p-4 bg-orange-100 rounded-lg container ">
                <h1 className="py-5">Create new stuff member</h1>

                <div className="grid grid-cols-3 gap-4">
                  <div className=" col-span-2 grid grid-cols-2 gap-4">
                    <div className=" col-span-1">
                      <CustomInput<z.infer<typeof formSchema>>
                        name="firstName"
                        placeholder="Enter name"
                        control={form.control}
                        label={"First Name"}
                      />
                    </div>

                    <div className=" col-span-1">
                      <CustomInput<z.infer<typeof formSchema>>
                        name="secondName"
                        placeholder="Enter Second Name"
                        control={form.control}
                        label={"Second Name"}
                      />
                    </div>

                    <div className=" col-span-1">
                      <CustomInput<z.infer<typeof formSchema>>
                        name="surname"
                        placeholder="Enter Surname"
                        control={form.control}
                        label={"Surname"}
                      />
                    </div>

                    <div className=" col-span-1">
                      <CustomInput<z.infer<typeof formSchema>>
                        name="dateOfBirth"
                        placeholder="Enter Date of Birth"
                        control={form.control}
                        label={"Date of Birth"}
                        type="date"
                      />
                    </div>

                    <div className=" col-span-1">
                      <CustomInput<z.infer<typeof formSchema>>
                        name="idNumber"
                        placeholder="Enter ID Number"
                        control={form.control}
                        label={"ID Number"}
                      />
                    </div>

                    <div className=" col-span-1">
                      <CustomInput<z.infer<typeof formSchema>>
                        name="gender"
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

                    <div className=" col-span-1">
                      <CustomInput<z.infer<typeof formSchema>>
                        name="contact"
                        placeholder="Enter Phone Number"
                        control={form.control}
                        label={"Phone Number"}
                      />
                    </div>

                    <div className="col-span-2">
                      <Command className="">
                        <CommandInput
                          placeholder="Search for address..."
                          className=""
                          value={input}
                          onValueChange={(value) => {
                            setInput(value);
                            setOnSelectedAddress(false);
                          }}
                        />
                        <CommandList>
                          {/* <CommandEmpty>No cities found.</CommandEmpty> */}
                          <CommandGroup>
                            {predictions.map((prediction) => (
                              <CommandItem
                                key={prediction.place_id}
                                onSelect={(currentValue) => {
                                  // form.setValue("address1", currentValue);
                                  // console.log(currentValue);
                                  // console.log(prediction);
                                  handlePredictionSelect(prediction);
                                  setOnSelectedAddress(true);
                                }}
                              >
                                {!onSelectedAddress
                                  ? prediction.description
                                  : ""}
                                {/* {prediction.description} */}
                                {/* <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  city.place_id === form.getValues("city")
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              /> */}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </div>
                    <div className="col-span-2">
                      <CustomInput<z.infer<typeof formSchema>>
                        name="address1"
                        placeholder="Enter Address"
                        control={form.control}
                        label={"Address"}
                      />
                    </div>

                    <div className=" col-span-1">
                      <CustomInput<z.infer<typeof formSchema>>
                        name="position"
                        placeholder="Enter Position"
                        control={form.control}
                        label={"Position"}
                      />
                    </div>

                    <div className=" col-span-1">
                      <CustomInput<z.infer<typeof formSchema>>
                        name="startDate"
                        placeholder="Enter start date"
                        control={form.control}
                        label={"Start Date"}
                        type="date"
                      />
                    </div>
                  </div>
                  <div className="profile p-10 bg-gray-300 container items-center justify-center text-gray-600">
                            <p>
                              Image upload comming soon...
                            </p>
                  </div>
                </div>
                <div className="flex justify-center container p-5">
                <Button type="submit" disabled={isLoading} className="form-btn w-60">
                  {isLoading ? "Adding..." : "Add Stuff"}
                </Button>
              </div>
              </div>
            </div>
            {error && <div className="text-red-500">{error}</div>}
          </form>
        </div>
      </Form>
    </div>
  );
};

export default AddStuff;
