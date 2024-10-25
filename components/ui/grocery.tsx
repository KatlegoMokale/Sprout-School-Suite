"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import CustomInput from '@/components/ui/CustomInput'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { grocerySchema } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { newGrocery } from '@/lib/actions/user.actions'
import { Button } from "@/components/ui/button"
import { useToast } from '@/hooks/use-toast'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Grocery = ({ onSuccess }: { onSuccess: () => void }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [error, setError] = useState<string| null>(null);
  const router = useRouter();

  const newGroceryForm = grocerySchema();
  const form = useForm<z.infer<typeof newGroceryForm>>({
    resolver: zodResolver(newGroceryForm),
    defaultValues: {
      summery: "",
      totalPaid: 0,
      store: "",
      date: ""
    },
  });

  const onSubmit = async (data: z.infer<typeof newGroceryForm>) => {
    setIsLoading(true);
    try {
      await newGrocery(data);
      toast({
        title: "Grocery Added",
        description: "Grocery has been added successfully!",
      });
      setShowDialog(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "An error occurred while submitting the form.",
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Grocery Entry</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className='md:col-span-2'>
          <CustomInput
          name='summery'
          control={form.control}
          placeholder="Summary"
          label={'Summary'}
          />

          </div>
          <CustomInput
          name='totalPaid'
          control={form.control}
          placeholder="Total Paid"
          label={'Total Paid'}
          type='number'
          />

          <CustomInput
          name='store'
          control={form.control}
          placeholder="Store"
          label={'Store'}
          />

          <CustomInput
          name='date'
          control={form.control}
          placeholder="Date"
          label={'Date'}
          type='date'
          />

<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
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
  )
}

export default Grocery
