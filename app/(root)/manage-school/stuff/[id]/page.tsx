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
  IStuff,
  newStudentFormSchema,
  newStuffFormSchema,
  parseStringify,
} from "@/lib/utils";
import { DialogContent, DialogDescription } from "@/components/ui/dialog";
import Link from "next/link";
import { Check, ChevronLeft } from "lucide-react";
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
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation";
import { newStuff, updateStuff } from "@/lib/actions/user.actions";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { fetchStuff } from "@/lib/features/stuff/stuffSlice";

const formSchema = newStuffFormSchema();

const EditStuff = ({ params }: { params: Promise<{ id: string }> }) => {
  const [stuffData, setStuffData] = useState<IStuff | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [formData, setFormData] = useState<NewStuffParams | null>(null);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchStuff = async () => {
      setIsLoading(true);
      try {
        const unwrappedParams = await params;
        const [stuffResponse] = await Promise.all([
          fetch(`/api/stuff/${unwrappedParams.id}`),
        ]);
        if (!stuffResponse.ok) throw new Error("Failed to fetch stuff");
        const stuffData = await stuffResponse.json();

        setStuffData(stuffData.stuff);
        console.log("Stuff Data:", stuffData.stuff);

        Object.entries(stuffData.stuff).forEach(([key, value]) => {
          form.setValue(key as any, value as any);
        });
      } catch (error) {
        console.error("Error fetching stuff:", error);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStuff();
  }, [params, form]);

  const handleConfirmAddStuff = async () => {
    console.log("Add Stuff onSubmit beginning...");
    setIsLoading(true);
    try {
      const unwrappedParams = await params
      await updateStuff(formData as NewStuffParams, unwrappedParams.id);
      toast({
        title: "Success",
        description: "Stuff information has been updated.",
      })
      await dispatch(fetchStuff())
      router.push("/manage-school");
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("An error occurred while submitting the form.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = async () => {
    await dispatch(fetchStuff())
    router.push("/manage-school")
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsConfirmOpen(true);
    const stuffData: NewStuffParams = {
      firstName: data.firstName,
      secondName: data.secondName,
      surname: data.surname,
      dateOfBirth: data.dateOfBirth,
      idNumber: data.idNumber,
      address1: data.address1,
      email: data.email,
      contact: data.contact,
      gender: data.gender,
      position: data.position,
      startDate: data.startDate,
    };
    setFormData(stuffData);
    console.log("Form Data:", formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="flex flex-col gap-4 container mx-auto py-10">
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogTrigger asChild>
        </AlertDialogTrigger>
        <AlertDialogTitle className="hidden">Confirm</AlertDialogTitle>
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
        <div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <Link href="/manage-school" className="flex items-center gap-1" onClick={(e) => {
                e.preventDefault()
                handleGoBack()
              }}>
                <ChevronLeft className="h-4 w-4" />
                <p>Back</p>
              </Link>
              <h1 className="pt-5">Edit Stuff</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomInput
                name="firstName"
                placeholder="Enter name"
                control={form.control}
                label={"First Name"}
              />

              <CustomInput
                name="secondName"
                placeholder="Enter Second Name"
                control={form.control}
                label={"Second Name"}
              />

              <CustomInput
                name="surname"
                placeholder="Enter Surname"
                control={form.control}
                label={"Surname"}
              />

              <CustomInput
                name="dateOfBirth"
                placeholder="Enter Date of Birth"
                control={form.control}
                label={"Date of Birth"}
                type="date"
              />

              <CustomInput
                name="idNumber"
                placeholder="Enter ID Number"
                control={form.control}
                label={"ID Number"}
              />

              <CustomInput
                name="gender"
                control={form.control}
                label="Gender"
                placeholder="Select Gender"
                select={true}
                options={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                ]}
              />

              <CustomInput
                name="contact"
                placeholder="Enter Phone Number"
                control={form.control}
                label={"Phone Number"}
              />

              <CustomInput
                name="email"
                placeholder="Enter Email"
                control={form.control}
                label={"Email"}
              />

              <div className="col-span-2">
                <CustomInput
                  name="address1"
                  placeholder="Enter Address"
                  control={form.control}
                  label={"Address"}
                />
              </div>

              <CustomInput
                name="position"
                placeholder="Enter Position"
                control={form.control}
                label={"Position"}
              />

              <CustomInput
                name="startDate"
                placeholder="Enter start date"
                control={form.control}
                label={"Start Date"}
                type="date"
              />

              <Button type="submit" disabled={isLoading} className="form-btn">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Update Staff Member
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Form>
    </div>
  );
};

export default EditStuff;
