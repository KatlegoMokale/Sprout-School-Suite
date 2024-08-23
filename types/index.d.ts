
declare type NewStudentParms = {
    $id: string;
    names: string;
    surname: string;
    dateOfBirth: string;
    age: string;
    address: string;
    phoneNumber: string;
    homeLanguage: string;
    allergies: string;
    medicalAidNumber: string;
    medicalAidScheme: string;
    gender:string;
    class?:string;
  };

  declare type Parent = {
    $id: string;
    studentId?: string;
    relationship: string;
    names: string;
    surname: string;
    idNumber: string;
    cellNo: string;
    email?: string;
    address: string;
    employer?: string;
    occupation?: string;
    workNo?:string;
  };

  declare type Transaction = {
    $id: string;
    studentId: string;
    studentName: string;
    transactionType: "Cash" | "EFT" | "Speed Point";
    amount: number;
    date: string;
  }

  declare type SchoolFees = {
    $id: string;
    class: string;
    amount: number;
  }

  declare type AccountFees = {
    $id: string;
    studentId: string;
    studentName: string;
    balance: number;
    lastPaymentDate: string;
    paymentDate: string;
    currentDate: string;
  }

  declare type Stuff = {
    $id: string;
    names: string;
    surname: string;
    idNumber: string;
    cellNo: string;
    email?: string;
    address: string;
    position: string;
    class?: string;
  }

  declare type SignUpUserParms = {
    $id: string;
    names: string;
    surname: string;
    idNumber: string;
    cellNo: string;
    email?: string;
    address: string;
    position: string;
  }

  declare type NewUserParams = {
    userId: string;
    email: string;
    name: string;
    password: string;
  };

  declare type LoginUser = {
    email: string;
    password: string;
  };

  declare type SearchParamProps = {
    params: { [key: string]: string };
    searchParams: { [key: string]: string | string[] | undefined };
  };