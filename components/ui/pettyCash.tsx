"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { pettyCashSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select1,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue1,
} from "@/components/ui/select";
import { newPettyCash } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import CustomInput from "./CustomInput";

const PettyCash = ({ onSuccess }: { onSuccess: () => void }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
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
    setIsLoading(true);
    try {
      await newPettyCash(data);
      toast({
        title: "Success!",
        description: "Item added successfully",
      });
      setShowDialog(true);
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

  const handleAddAnother = () => {
    form.reset();
    setShowDialog(false);
  };

  const handleDone = () => {
    setShowDialog(false);
    onSuccess();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-3xl font-bold mb-6 text-green-800">
        Petty Cash Entry
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            />{" "}
            <CustomInput
              name="store"
              control={form.control}
              placeholder="eg. Shoprite"
              label={"Store"}
            />{" "}
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
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </motion.div>
        </form>
      </Form>

      <AnimatePresence>
        {showDialog && (
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent className='bg-white'>
              <DialogHeader>
                <DialogTitle>Item Added Successfully</DialogTitle>
                <DialogDescription>
                  Would you like to add another item or are you done?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-start">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddAnother}
                >
                  Add Another
                </Button>
                <Button type="button" variant="default" onClick={handleDone}>
                  Done
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PettyCash;
