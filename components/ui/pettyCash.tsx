"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { pettyCashSchema } from "@/lib/utils";
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
import { newPayment, newPettyCash } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import { Toaster } from "./toaster";
import { useToast } from "@/hooks/use-toast";

const PettyCash = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({});
  const router = useRouter();

  const newPettyCashSchema = pettyCashSchema();
  const form = useForm<z.infer<typeof newPettyCashSchema>>({
    resolver: zodResolver(newPettyCashSchema),
    defaultValues: {
      itemName: "",
      quantity: 0,
      price: 0,
      store: "",
      category: "",
      date: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof newPettyCashSchema>) => {
    console.log("Form data:", data);
    console.log("Submit");
    setIsLoading(true);
    try {
      const addNewPettyCash = await newPettyCash(data);
      console.log("Add new Petty Cash " + addNewPettyCash);
      toast({
        title: "Success!",
        description: "Item added successfully",
      });
      form.reset();
      form.reset();
      // router.push('/transactions');
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <div className="w-full max-w-3xl p-8 ">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Item Entry Form
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <CustomInput
              name="itemName"
              control={form.control}
              placeholder="e.g. Milk"
              label={"Item Name"}
            />
            <CustomInput
              name="quantity"
              control={form.control}
              placeholder="Enter Quantity"
              label={"Quantity"}
              type="number"
            />
            <CustomInput
              name="price"
              control={form.control}
              placeholder="Price"
              label={"Price"}
              type="number"
            />
            <CustomInput
              name="store"
              control={form.control}
              placeholder="eg. Shoprite"
              label={"Store"}
            />
            <CustomInput
              name="category"
              control={form.control}
              placeholder="Category"
              label={"Category"}
              select={true}
              options={[
                { label: "Food", value: "Food" },
                { label: "Cleaning", value: "Cleaning" },
                { label: "Other", value: "Other" },
              ]}
            />

            <CustomInput
              name="date"
              control={form.control}
              placeholder="Select date"
              label={"Date"}
              type="date"
            />

            <div className="md:col-span-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <Toaster />
    </div>
  );
};

export default PettyCash;
