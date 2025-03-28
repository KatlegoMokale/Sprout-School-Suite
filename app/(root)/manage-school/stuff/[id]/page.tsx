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
  newStuffFormSchema,
  parseStringify,
  studentFormSchema,
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

const formSchema = newStuffFormSchema();
const schema = studentFormSchema();
type FormData = z.infer<typeof schema>;

const EditStuff = ({ params }: { params: Promise<{ id: string }> }) => {
  const [stuffData, setStuffData] = useState<IStuff | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [formData, setFormData] = useState<NewStuffParams | null>(null);
  const router = useRouter();

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
    const fetchStuff = async () => {
      setIsLoading(true);
      try {
        const unwrappedParams = await params;
        const response = await fetch(`/api/stuff/${unwrappedParams.id}`);
        if (!response.ok) throw new Error("Failed to fetch staff");
        const staffData = await response.json();
        console.log("Staff Data:", staffData);

        if (!staffData) throw new Error("No staff data received");

        setStuffData(staffData);

        // Set form values
        const formValues = {
          firstName: staffData.firstName || '',
          secondName: staffData.secondName || '',
          surname: staffData.surname || '',
          dateOfBirth: staffData.dateOfBirth || '',
          idNumber: staffData.idNumber || '',
          email: staffData.email || '',
          contact: staffData.contact || '',
          gender: staffData.gender || 'male',
          position: staffData.position || '',
          address: {
            street: staffData.address?.street || '',
            city: staffData.address?.city || '',
            province: staffData.address?.province || '',
            postalCode: staffData.address?.postalCode || '',
            country: staffData.address?.country || ''
          },
          status: staffData.status || 'active'
        };

        // Set each form field
        Object.entries(formValues).forEach(([key, value]) => {
          if (key === 'address') {
            Object.entries(value as Record<string, string>).forEach(([addressKey, addressValue]) => {
              form.setValue(`address.${addressKey}` as any, addressValue);
            });
          } else {
            form.setValue(key as any, value);
          }
        });
      } catch (error) {
        console.error("Error fetching staff:", error);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStuff();
  }, [params, form]);

  const handleConfirmAddStuff = async () => {
    console.log("Update Staff beginning...");
    setIsLoading(true);
    try {
      const unwrappedParams = await params;
      if (!formData) throw new Error("No form data");
      
      const response = await fetch(`/api/stuff/${unwrappedParams.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update staff");

      toast({
        title: "Success",
        description: "Staff information has been updated.",
      });
      router.push("/manage-school");
    } catch (error) {
      console.error("Error updating staff:", error);
      setError("An error occurred while updating staff information.");
      toast({
        title: "Error",
        description: "Failed to update staff member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsConfirmOpen(true);
    const stuffData: NewStuffParams = {
      firstName: data.firstName,
      secondName: data.secondName || '',
      surname: data.surname,
      dateOfBirth: data.dateOfBirth,
      idNumber: data.idNumber,
      email: data.email,
      contact: data.contact,
      gender: data.gender,
      position: data.position,
      address: {
        street: data.address?.street || '',
        city: data.address?.city || '',
        province: data.address?.province || '',
        postalCode: data.address?.postalCode || '',
        country: data.address?.country || ''
      },
      status: data.status
    };
    setFormData(stuffData);
    console.log("Form Data:", stuffData);
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
              <Link href="/manage-school" className="flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                <p>Back</p>
              </Link>
              <h1 className="pt-5">Edit Staff</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomInput
                name="firstName"
                placeholder="Enter name"
                control={form.control}
                label="First Name"
              />

              <CustomInput
                name="secondName"
                placeholder="Enter Second Name"
                control={form.control}
                label="Second Name"
              />

              <CustomInput
                name="surname"
                placeholder="Enter Surname"
                control={form.control}
                label="Surname"
              />

              <CustomInput
                name="dateOfBirth"
                placeholder="Enter Date of Birth"
                control={form.control}
                label="Date of Birth"
                type="date"
              />

              <CustomInput
                name="idNumber"
                placeholder="Enter ID Number"
                control={form.control}
                label="ID Number"
              />

              <CustomInput
                name="gender"
                placeholder="Select gender"
                control={form.control}
                label="Gender"
                select={true}
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                ]}
              />

              <CustomInput
                name="position"
                placeholder="Enter position"
                control={form.control}
                label="Position"
              />

              <CustomInput
                name="contact"
                placeholder="Enter contact number"
                control={form.control}
                label="Contact"
              />

              <CustomInput
                name="email"
                placeholder="Enter email"
                control={form.control}
                label="Email"
              />

              <CustomInput
                name="address.street"
                placeholder="Enter street address"
                control={form.control}
                label="Street Address"
              />

              <CustomInput
                name="address.city"
                placeholder="Enter city"
                control={form.control}
                label="City"
              />

              <CustomInput
                name="address.province"
                placeholder="Enter province"
                control={form.control}
                label="Province"
              />

              <CustomInput
                name="address.postalCode"
                placeholder="Enter postal code"
                control={form.control}
                label="Postal Code"
              />

              <CustomInput
                name="address.country"
                placeholder="Enter country"
                control={form.control}
                label="Country"
              />

              <CustomInput
                name="status"
                placeholder="Select status"
                control={form.control}
                label="Status"
                select={true}
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Staff"}
            </Button>
          </form>
        </div>
      </Form>
    </div>
  );
};

export default EditStuff;
