import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, PlusCircle } from "lucide-react";
import React from "react";

const Teachers = () => {
  return (
    <div className="container">
      <div>
        <div className=" grid grid-cols-3 gap-5">
          <div className=" col-span-2 grid grid-cols-4 gap-3 p-3">
            <div className="flex justify-between  col-span-4 ">
              <div>Stuff</div>
              <Button size="sm" className="h-8 gap-1 hover:bg-orange-200">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Stuff
                </span>
              </Button>
            </div>
            <Card>
              <CardHeader>
               <div className=" flex justify-between items-center">
               <div> Name Surname</div>
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
                              {/* <Link
                                href={`/students/edit-student/${student.$id}`}
                              > */}
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                              {/* </Link> */}
                              <DropdownMenuItem
                                // onClick={() => handleDeleteStudent(student.$id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
               </div>
              </CardHeader>
              <CardContent>
                <div>Postion</div>
                <div>Appointed Class</div>
                <div>Contact</div>
              </CardContent>
            </Card>

            <Card>
            <CardHeader>
               <div className=" flex justify-between">
               <div> Name Surname</div>
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
                              {/* <Link
                                href={`/students/edit-student/${student.$id}`}
                              > */}
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                              {/* </Link> */}
                              <DropdownMenuItem
                                // onClick={() => handleDeleteStudent(student.$id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
               </div>
              </CardHeader>
              <CardContent>
                <div>Postion</div>
                <div>Appointed Class</div>
                <div>Contact</div>
              </CardContent>
            </Card>

            <Card>
            <CardHeader>
               <div className=" flex justify-between">
               <div> Name Surname</div>
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
                              {/* <Link
                                href={`/students/edit-student/${student.$id}`}
                              > */}
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                              {/* </Link> */}
                              <DropdownMenuItem
                                // onClick={() => handleDeleteStudent(student.$id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
               </div>
              </CardHeader>
              <CardContent>
                <div>Postion</div>
                <div>Appointed Class</div>
                <div>Contact</div>
              </CardContent>
            </Card>

            <Card>
            <CardHeader>
               <div className=" flex justify-between">
               <div> Name Surname</div>
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
                              {/* <Link
                                href={`/students/edit-student/${student.$id}`}
                              > */}
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                              {/* </Link> */}
                              <DropdownMenuItem
                                // onClick={() => handleDeleteStudent(student.$id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
               </div>
              </CardHeader>
              <CardContent>
                <div>Postion</div>
                <div>Appointed Class</div>
                <div>Contact</div>
              </CardContent>
            </Card>

            <Card>
            <CardHeader>
               <div className=" flex justify-between">
               <div> Name Surname</div>
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
                              {/* <Link
                                href={`/students/edit-student/${student.$id}`}
                              > */}
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                              {/* </Link> */}
                              <DropdownMenuItem
                                // onClick={() => handleDeleteStudent(student.$id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
               </div>
              </CardHeader>
              <CardContent>
                <div>Postion</div>
                <div>Appointed Class</div>
                <div>Contact</div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div className=" font-semibold ">Classes</div>
                  <Button size="sm" className="h-8 gap-1 hover:bg-orange-200">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Add Class
                    </span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  <Card>
                    <CardContent>
                      <div>Class 1</div>
                      <div>Teacher</div>
                      <div>Total Number</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent>
                      <div>Class 1</div>
                      <div>Teacher</div>
                      <div>Total Number</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent>
                      <div>Class 1</div>
                      <div>Teacher</div>
                      <div>Total Number</div>
                    </CardContent>
                  </Card>
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
