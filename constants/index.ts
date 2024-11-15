import { Archive, LucideIcon, Home, Users, Landmark, User, Clipboard } from 'lucide-react';

export const sidebarLinks = [
    {
      imgURL: "/icons/home.svg",
      route: "/",
      label: "Home",
      icon: Home
    },
    {
      imgURL: "/icons/dollar-circle.svg",
      route: "/school-fees",
      label: "School Fees",
      icon: Archive
    },
    {
      imgURL: "/icons/transaction.svg",
      route: "/students",
      label: "Students",
      icon: Users
    },
    {
      imgURL: "/icons/transaction.svg",
      route: "/finances",
      label: "Finances",
      icon: Landmark
    },
    {
      imgURL: "/icons/transaction.svg",
      route: "/manage-school",
      label: "Manage School",
      icon: Clipboard
    },
    // {
    //   imgURL: "/icons/transaction.svg",
    //   route: "/users",
    //   label: "Users",
    //   icon: User
    // },
  ];

  declare type Student = {
    $id: string;
    firstName: string;
    SecondName: string;
    Surname: string;
    address1: string;
    city: string;
    Province: string;
    postalCode: string;
    dateOfBirth: string;
    gender: string;
    class: string;
    medicalAidNumber: string;
    medicalAidScheme: string;
    homeLanguage: string;
    allergies: string;
  };

  declare type Stuff = {
    $id: string;
    userId: string;
    firstName: string;
    SecondName: string;
    Surname: string;
    address1: string;
    city: string;
    Province: string;
    postalCode: string;
    dateOfBirth: string;
    gender: string;
    class: string;
  };

  declare type Payment = {
    $id: string;
    userId: string;
    PaymentDate: string;
    Amount: string;
    PaymentMethod: string;
    PaymentRef: string;
  };

 declare type Parent = {
    $id: string;
    userId: string;
    firstName: string;
    Surname: string;
    address1: string;
    city: string;
    Province: string;
    postalCode: string;
    dateOfBirth: string;
    gender: string;
    IdNumber: string;
    Occupation: string;
    ContactNumber: string;
    Email: string;
  };

  declare type User = {
    $id: string;
    userId: string;
    firstName: string;
    SecondName: string;
    Email: string;
    password: string;
    PhoneNumber: string;
  };

  declare type NewUserParams = {
    userId: string;
    email: string;
    name: string;
    password: string;
  };

  declare type Paymentypes =
  | "Cash"
  | "EFT";

  declare interface SiderbarProps {
    user: User;
  }

  declare interface getStudentInfoProps {
    userId: string;
  };

  declare interface CardProps {
    title: string;
    value: string;
    subtext: string;
    date: string;
  };

  