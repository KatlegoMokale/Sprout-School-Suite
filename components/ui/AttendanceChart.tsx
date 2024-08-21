'use client'
import { TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
  } from "@/components/ui/chart"

  const chartData = [
    { day: "Monday", children: 80 },
    { day: "Tuesday", children: 200 },
    { day: "Wednesday", children: 120 },
    { day: "Thursday",  children: 190 },
    { day: "Friday", children: 130 },
  ]

  const chartConfig = {
    children: {
      label: "Children",
      color: "#2563eb",
    }
  } satisfies ChartConfig

const AttendanceChart = () => {
  return (
    <Card>
         <CardHeader>
            <CardTitle>Student Attendance</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="children" fill="var(--color-children)" radius={4} />
          </BarChart>
        </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this day <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 days
        </div>
      </CardFooter>
    </Card>
  )
}

export default AttendanceChart
