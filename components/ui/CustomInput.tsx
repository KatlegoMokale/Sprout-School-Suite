"use client";
import React from "react";
import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Control, FieldPath } from "react-hook-form";
import { z } from "zod";
import { newStudentFormSchema } from "@/lib/utils";
import {
  Select1,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue1,
} from "@/components/ui/select";

import dynamic from "next/dynamic";

const SearchAddress = dynamic(() => import("@/components/ui/search-address"), {
  ssr: false,
});

const formSchema = newStudentFormSchema();

interface CustomInput<T extends Record<string, any>> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder: string;
  type?: string;
  select?: boolean;
  value?: string;
  readonly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options?: {
    value: string;
    label: string;
  }[];
}

const CustomInput = <T extends Record<string, any>>({
  control,
  placeholder,
  name,
  label,
  type,
  options,
  select,
  value,
  onChange,
  readonly,
}: CustomInput<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="form-item ">
          <FormLabel className=" text-md  font-semibold text-gray-600 ">
            {label}
          </FormLabel>
          <div className="flex w-full flex-col">
            {select === true && options ? (
              <Select1 onValueChange={field.onChange} value={field.value}>
              <FormControl className="p-2 bg-white text-gray-600">
                <SelectTrigger className="bg-white w-full">
                  <SelectValue1 placeholder={placeholder}>
                    {field.value || placeholder}
                  </SelectValue1>
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white gap-2 rounded-lg">
                {options.map((option) => (
                  <SelectItem
                    className="hover:bg-orange-200 text-14 font-semibold rounded-lg hover:animate-in p-2 cursor-pointer"
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select1>
            ) : type === "search" ? (
              <div>
                <SearchAddress
                  onSelectLocation={(location) => console.log(location)}
                />
              </div>
            ) : (
              <FormControl>
                <Input
                  className="input-class"
                  placeholder={placeholder}
                  type={type !== undefined ? type : "text"}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (type === "number") {
                      const numericValue = newValue.replace(/[^0-9]/g, '');
                      field.onChange(Number(numericValue));
                    } else {
                      field.onChange(newValue);
                    }
                    if (onChange) {
                      onChange(e);
                    }
                  }}
                  onKeyPress={(e) => {
                    if (type === "number") {
                      const isNumber = /[0-9]/.test(e.key);
                      if (!isNumber) {
                        e.preventDefault();
                      }
                    }
                  }}
                  value={field.value || value || ""}
                  readOnly={readonly !== undefined ? readonly : false}
                />
              </FormControl>
            )}

            <FormMessage className="form-message mt-2" />
          </div>
        </div>
      )}
    />
  );
};

export default CustomInput;
