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

interface ClassesProps {
  classes: IClass[] | null;
}

const Classes = () => {
  const [teachers, setTeachers] = useState<IStuff[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({});
  const router = useRouter();

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

  const onSubmit = async (data: z.infer<typeof newClassFormSchema>) => {
    try {
      setIsLoading(true);
      const adNewClass = await newClass(data);
      console.log("Add new Class " + adNewClass);
    } catch (error) {
      console.error("Error adding class:", error);
      setError("Error adding class. Please try again.");
    } finally {
      setIsLoading(false);
    }
    setFormData(data);
    console.log("Form data ready for Appwrite:", data);
  };

  const handleTeacherChange = (selectedTeacherId: string) => {
    const selectedTeacher = teachers?.find(
      (teacher) => teacher.$id === selectedTeacherId
    );
    if (selectedTeacher) {
      form.setValue("teacherId", selectedTeacher.$id);
      form.setValue(
        "teacherName",
        `${selectedTeacher.firstName} ${selectedTeacher.surname}`
      );
    }
  };

  return (
    <div className=" container">
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
                <CustomInput<z.infer<typeof newClassFormSchema>>
                  name="age"
                  placeholder="Enter Class Age"
                  control={form.control}
                  label={"Class Age"}
                />
              </div>

              <div className="">
                <CustomInput<z.infer<typeof newClassFormSchema>>
                  name="teacherName"
                  placeholder="Enter Teacher Name"
                  control={form.control}
                  label={"Teacher Name"}
                  select={true}
                  options={teachers?.map((teacher) => ({
                    label: `${teacher.firstName} ${teacher.surname}`, // Correct label
                    value: teacher.$id,
                  }))}
                />
              </div>

              <div className="">
                <CustomInput<z.infer<typeof newClassFormSchema>>
                  name="teacherId"
                  placeholder="Enter Teacher ID"
                  control={form.control}
                  label={"Teacher ID"}
                />
              </div>
            </div>

            <div className="justify-center items-center flex py-2">
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
