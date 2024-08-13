import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  

interface CardProps {
  title: string
  value: string
  subtext: string
  date: string
}

const HomeCard = ({title, value, subtext, date}: CardProps) => {
  return (
    <Card className=''>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{value}</CardDescription>
    </CardHeader>
    <CardContent>
      <p>{subtext}</p>
    </CardContent>
    <CardFooter>
      <p>{date}</p>
    </CardFooter>
  </Card>
  
  )
}

export default HomeCard