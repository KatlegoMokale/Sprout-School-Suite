"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { IClass, IStuff } from "@/lib/utils";
import {
  MapPin,
  Phone,
  Mail,
  MoreHorizontal,
  Edit,
  Share2,
  Trash2,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Classes from "@/components/ui/classes";

interface TeachersProps {
  stuff: IStuff[] | null;
}

const Teachers = () => {
  const [stuff, setStuff] = useState<IStuff[]>();
  const [classes, setClasses] = useState<IClass[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;
  const [selectedStuff, setSelectedStuff] = useState<IStuff | null>(null);

  useEffect(() => {
    const fetchStuff = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/stuff");
        if (!response.ok) {
          throw new Error("Failed to fetch stuff");
        }
        const data = await response.json();
        setStuff(data);
      } catch (error) {
        console.log("Error fetching stuff:", error);
        setError("Failed to fetch stuff, Please try reloading the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStuff();
  }, []);

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
      } catch (error) {
        console.log("Error fetching classes:", error);
        setError("Failed to fetch classes, Please try reloading the page.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchClasses();
}, []);

  return (
    <div className="">
      <div>
        <div className=" grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
          <div className=" col-span-2 lg:col-span-3 xl:col-span-3 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-3 p-3">
            <div className="flex justify-between col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-4 2xl:col-span-5">
              <div>Stuff</div>
              <Link href="/manage-school/add-stuff">
                <Button size="sm" className="h-8 gap-1 hover:bg-orange-200">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Stuff
                  </span>
                </Button>
              </Link>
            </div>
            {stuff?.map((stuff) => (
              <Card key={stuff.$id} className="w-full max-w-md mx-auto bg-gradient-to-br border transition duration-500 scale-95 hover:scale-100 border-green-50 from-white via-white to-green-50">
                <CardHeader className="flex flex-row items-center justify-between p-6">
                  <div className="flex items-center gap-4 2xl:gap-2">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src="/assets/placeholderprofile.svg"
                        alt="Profile picture"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h2 className="text-md font-bold text-gray-500">
                        {stuff.firstName} {stuff.surname}
                      </h2>
                      <p className={`font-semibold ${stuff.position.toLowerCase() === 'teacher'
                         ? 'text-green-500' : stuff.position.toLowerCase() === 'cleaner' ?
                          'text-orange-400' : 'text-cyan-500' }`}>{stuff.position}</p>
                      </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <Link href={`/manage-school/stuff/${stuff.$id}`}>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                        // onClick={() => handleDeleteStudent(student.$id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-500" />
                    <p className="text-sm">{stuff.address1}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <p className="text-sm">{stuff.contact}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="p-5">
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div className=" font-semibold ">Classes</div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="h-8 gap-1 hover:bg-orange-200"
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          Add Class
                        </span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader className=" p-2">
                      <DialogTitle>Add New Class</DialogTitle>
                      <DialogDescription>
                        Add a new class to the system.
                        </DialogDescription>
                        </DialogHeader>
                      <Classes />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">

                  {classes?.map((classData)=>(
                    <Card key={classData.$id}>
                      <CardContent>
                        <div>Class {classData.name}</div>
                        <div>Teacher {classData.teacherName}</div>
                        <div>Total Number</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teachers;
