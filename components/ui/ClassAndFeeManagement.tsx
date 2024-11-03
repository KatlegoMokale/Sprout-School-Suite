"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import CustomInput from "@/components/ui/CustomInput"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Plus, Loader2 } from "lucide-react"
import { classAndFeesFormSchema } from "@/lib/utils"



const ClassAndFeeTableSchema =  z.array(classAndFeesFormSchema);
type ClassAndFee = z.infer<typeof classAndFeesFormSchema>;


export default function ClassAndFeeManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const [classes, setClasses] = useState<ClassAndFee[]>([]);



  const form = useForm<{ classesAndFees: ClassAndFee[] }>({
    resolver: zodResolver(z.object({ classesAndFees: ClassAndFeeTableSchema })),
    defaultValues: {
      classesAndFees: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "classesAndFees",
  });

  useEffect(() => {
    const fetchClasses = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/class");
        if (!response.ok) {
          throw new Error("Failed to fetch classes");
        }
        const data = await response.json();
        setClasses(data);
        form.reset({ classesAndFees: data });
      } catch (error) {
        console.error("Error fetching classes:", error);
        toast({
          title: "Error",
          description: "Failed to fetch classes. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, [form]);

  const onSubmit = async (data: { classesAndFees: ClassAndFee[] }) => {
    setIsLoading(true);
    try {
      // Here you would typically send the data to your API
      // For example: await fetch('/api/class', { method: 'POST', body: JSON.stringify(data.classesAndFees) })
      console.log("Classes and fees data:", data.classesAndFees);
      toast({
        title: "Success",
        description: "Classes and fees have been updated.",
      });
    } catch (error) {
      console.error("Error updating classes and fees:", error);
      toast({
        title: "Error",
        description: "Failed to update classes and fees. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Class and Fee Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Age Range</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Monthly Fee</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <CustomInput
                        name={`classesAndFees.${index}.name`}
                        control={form.control}
                        placeholder="Class Name"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <CustomInput
                          name={`classesAndFees.${index}.ageStart`}
                          control={form.control}
                          type="number"
                          placeholder="Start"
                        />
                        <span>-</span>
                        <CustomInput
                          name={`classesAndFees.${index}.ageEnd`}
                          control={form.control}
                          type="number"
                          placeholder="End"
                        />
                        <CustomInput
                          name={`classesAndFees.${index}.ageUnit`}
                          control={form.control}
                          select={true}
                          options={[
                            { value: "months", label: "Months" },
                            { value: "years", label: "Years" },
                          ]}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <CustomInput
                          name={`classesAndFees.${index}.teacherId`}
                          control={form.control}
                          placeholder="Teacher ID"
                        />
                        <CustomInput
                          name={`classesAndFees.${index}.teacherName`}
                          control={form.control}
                          placeholder="Teacher Name"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <CustomInput
                        name={`classesAndFees.${index}.monthlyFee`}
                        control={form.control}
                        type="number"
                        placeholder="Monthly Fee"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({
                name: "",
                ageStart: 0,
                ageEnd: 0,
                ageUnit: "years",
                teacherId: "",
                teacherName: "",
                monthlyFee: 0
              })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Class
            </Button>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Classes and Fees"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}