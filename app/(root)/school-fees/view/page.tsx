'use client';

import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select1, SelectContent, SelectItem, SelectTrigger, SelectValue1 } from "@/components/ui/select";
import { DollarSign, Calendar, Users, CreditCard } from 'lucide-react';
import Link from "next/link";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchSchoolFeesSetup, selectSchoolFeesSetup, selectSchoolFeesSetupStatus } from '@/lib/features/schoolFeesSetup/schoolFeesSetupSlice';
import { ChevronLeft } from "lucide-react";

export default function SchoolFeesView() {
  const dispatch = useDispatch<AppDispatch>();
  const schoolFeesSetup = useSelector(selectSchoolFeesSetup);
  const schoolFeesSetupStatus = useSelector(selectSchoolFeesSetupStatus);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    if (schoolFeesSetupStatus === 'idle') dispatch(fetchSchoolFeesSetup());
  }, [dispatch, schoolFeesSetupStatus]);

  const isLoading = schoolFeesSetupStatus === 'loading';
  const error = schoolFeesSetupStatus === 'failed' ? "Failed to fetch school fees data." : null;

  const filteredFees = useMemo(() => {
    return schoolFeesSetup.filter(fee => 
      fee.year === selectedYear
    );
  }, [schoolFeesSetup, selectedYear]);

  const currentYear = new Date().getFullYear();
  const yearRange = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/school-fees" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to School Fees
          </Link>
          <h1 className="text-3xl font-bold">School Fees Overview</h1>
        </div>
        <div className="flex items-center gap-4">
          <Select1 value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue1 placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {yearRange.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFees.map((fee, index) => (
          <motion.div
            key={fee.$id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">
                  Age Group: {fee.ageStart}-{fee.ageEnd} {fee.ageUnit}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Year: {fee.year}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Monthly Fee</span>
                    <span className="font-semibold">ZAR {fee.monthlyFee.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Registration Fee</span>
                    <span className="font-semibold">ZAR {fee.registrationFee.toFixed(2)}</span>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Yearly Fee</span>
                      <span className="font-semibold">ZAR {fee.yearlyFee.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredFees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No school fees setup found for {selectedYear}</p>
        </div>
      )}
    </div>
  );
} 