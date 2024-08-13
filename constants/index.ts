export const sidebarLinks = [
    {
      imgURL: "/icons/home.svg",
      route: "/",
      label: "Home",
    },
    {
      imgURL: "/icons/dollar-circle.svg",
      route: "/school-fees",
      label: "School Fees",
    },
    {
      imgURL: "/icons/transaction.svg",
      route: "/students",
      label: "Students",
    },
    {
      imgURL: "/icons/transaction.svg",
      route: "/finances",
      label: "Finances",
    },
    {
      imgURL: "/icons/transaction.svg",
      route: "/teachers",
      label: "Teachers",
    },
  ];

  declare type Student = {
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

  declare type Teacher = {
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
    SecondName: string;
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
  | "EFT"
  | "Speed point ";

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