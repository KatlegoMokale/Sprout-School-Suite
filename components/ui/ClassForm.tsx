"use client";
import React, { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  classFormSchema,
  IClass,
  IStuff,
  paymentFormSchema,
} from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import CustomInput from "@/components/ui/CustomInput";
import CustomInputPayment from "./CustomInputPayment";
import { Search } from "lucide-react";
import { newClass, newPayment } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import { Select1, SelectContent, SelectItem, SelectTrigger, SelectValue1 } from "./select";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { fetchClasses } from "@/lib/features/classes/classesSlice";

interface ClassesProps {
  classes: IClass[] | null;
}

const Classes = () => {
  const [teachers, setTeachers] = useState<IStuff[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isContinueOpen, setIsContinueOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const newClassFormSchema = classFormSchema();
  const form = useForm<z.infer<typeof newClassFormSchema>>({
    resolver: zodResolver(newClassFormSchema),
    defaultValues: {
      name: "",
      age: "",
      teacherId: "",
      teacherName: "",
    },
  });

  useEffect(() => {
    const fetchTeachers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/stuff");
        if (!response.ok) {
          throw new Error("Failed to fetch stuff");
        }
        const data = await response.json();
        setTeachers(data);
      } catch (error) {
        console.log("Error fetching stuff:", error);
        setError("Failed to fetch stuff, Please try reloading the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "teacherName") {
        const selectedTeacher = teachers?.find(
          (teacher) => teacher.$id === value.teacherName
        );
        if (selectedTeacher) {
          form.setValue("teacherId", selectedTeacher.$id);
          form.setValue(
            "teacherName",
            `${selectedTeacher.firstName} ${selectedTeacher.surname}`
          );
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, teachers]);

  const handleTeacherChange = (value: string) => {
    form.setValue('teacherName', value)
  };

  const handleConfirmAddClass = async () => {
    try {
      setIsLoading(true);
      const data = form.getValues();
      await newClass(data);
      toast({
        title: "Success",
        description: "Class has been added successfully.",
      });
      await dispatch(fetchClasses());
      setIsConfirmOpen(false);
      setIsContinueOpen(true);
    } catch (error) {
      console.error("Error adding class:", error);
      setError("Error adding class. Please try again.");
      toast({
        title: "Error",
        description: "Failed to add class. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    form.reset();
    setIsContinueOpen(false);
  };

  const handleFinish = () => {
    setIsContinueOpen(false);
    router.push("/manage-school");
  };

  const onSubmit = async (data: z.infer<typeof newClassFormSchema>) => {
    setFormData(data);
    setIsConfirmOpen(true);
  };

  return (
    <div className="container">
      {/* First Dialog - Confirm Adding Class */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Class</AlertDialogTitle>
            <AlertDialogDescription>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to add this class? This action cannot be undone.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAddClass} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Class"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Second Dialog - Ask to Continue or Finish */}
      <AlertDialog open={isContinueOpen} onOpenChange={setIsContinueOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Class Added Successfully</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to add another class or are you done?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleContinue}>
              Add Another Class
            </AlertDialogAction>
            <AlertDialogAction onClick={handleFinish}>
              I&apos;m Done
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <div className="grid grid-rows-4 gap-4 py-2">
            <div className="row-span-3 grid grid-cols-2 gap-4">
              <div className="">
                <CustomInput<z.infer<typeof newClassFormSchema>>
                  name="name"
                  placeholder="Enter Class Name"
                  control={form.control}
                  label={"Class Name"}
                />
              </div>
              <div>
                <div className="text-md font-semibold text-gray-600 mb-2">
                  Class Age
                </div>
                <Select1 onValueChange={(value) => form.setValue('age', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue1 placeholder="Select Age Group" />
                  </SelectTrigger>
                  <SelectContent className="bg-white gap-2 rounded-lg">
                    <SelectItem
                      className="hover:bg-green-200 text-14 font-semibold rounded-lg hover:animate-in p-2 cursor-pointer"
                      value="3-12 months"
                    >
                      3-12 months
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-green-200 text-14 font-semibold rounded-lg hover:animate-in p-2 cursor-pointer"
                      value="1 Year"
                    >
                      1 Year
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-green-200 text-14 font-semibold rounded-lg hover:animate-in p-2 cursor-pointer"
                      value="2 Years"
                    >
                      2 Years
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-green-200 text-14 font-semibold rounded-lg hover:animate-in p-2 cursor-pointer"
                      value="3 Years"
                    >
                      3 Years
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-green-200 text-14 font-semibold rounded-lg hover:animate-in p-2 cursor-pointer"
                      value="4 Years"
                    >
                      4 Years
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-green-200 text-14 font-semibold rounded-lg hover:animate-in p-2 cursor-pointer"
                      value="5 Years"
                    >
                      5 Years
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-green-200 text-14 font-semibold rounded-lg hover:animate-in p-2 cursor-pointer"
                      value="6 Years"
                    >
                      6 Years
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-green-200 text-14 font-semibold rounded-lg hover:animate-in p-2 cursor-pointer"
                      value="7 Years+"
                    >
                      7 Years+
                    </SelectItem>
                  </SelectContent>
                </Select1>
              </div>
              
              <div className="text-md font-semibold text-gray-600">
                Select Teacher
              </div>
              <Select1 onValueChange={handleTeacherChange}>
                <SelectTrigger className="w-full">
                  <SelectValue1 placeholder="Select Teacher" />
                </SelectTrigger>
                <SelectContent className="bg-white gap-2 rounded-lg">
                  {teachers?.map((teacher) => (
                    <SelectItem
                      className="hover:bg-green-200 text-14 font-semibold rounded-lg hover:animate-in p-2 cursor-pointer"
                      key={teacher.$id}
                      value={teacher.$id}
                    >
                      {teacher.firstName} {teacher.secondName} {teacher.surname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select1>

              <div className="hidden">
                <CustomInput<z.infer<typeof newClassFormSchema>>
                  name="teacherName"
                  placeholder="Enter Teacher Name"
                  control={form.control}
                  label={"Teacher Name"}
                />
              </div>

              <div className="hidden">
                <CustomInput<z.infer<typeof newClassFormSchema>>
                  name="teacherId"
                  placeholder="Enter Teacher ID"
                  control={form.control}
                  label={"Teacher ID"}
                />
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isLoading}
                className="form-btn w-64"
              >
                {isLoading ? "Adding..." : "Add Class"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Classes;
