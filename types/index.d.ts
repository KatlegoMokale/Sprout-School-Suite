declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare type SignUpParams = {
  firstName?: string;
  secondName?: string;
  surname?: string;
  dateOfBirth?: string;
  idNumber?: string;
  address1?: string;
  contact?: string;
  email: string;
  password: string;
};

declare type LoginUser = {
  email: string;
  password: string;
};

declare interface SiderbarProps {
  user: User;
}

declare type User = {
  $id: string;
  firstName: string;
  secondName?: string;
  surname: string;
  dateOfBirth: string;
  idNumber: string;
  address1: string;
  contact: string; 
  email: string;
};

declare interface FooterProps {
  user: User;
  type?: 'mobile' | 'desktop'
}


declare type NewStudentParms = {
  firstName: string;
  secondName?: string;
  surname: string;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  dateOfBirth: string;
  gender: string;
  age: string;
  homeLanguage: string;
  allergies?: string;
  medicalAidNumber?: string;
  medicalAidScheme?: string;
  studentClass: string;
  studentStatus: 'active' | 'inactive' | 'graduated';
  balance: number;
  lastPaid?: string;
  parent1: {
    relationship: string;
    firstName: string;
    surname: string;
    email: string;
    phoneNumber: string;
    idNumber: string;
    gender: string;
    dateOfBirth: string;
    address: {
      street: string;
      city: string;
      province: string;
      postalCode: string;
      country: string;
    };
    occupation?: string;
    workNumber?: string;
  };
  parent2?: {
    relationship?: string;
    firstName?: string;
    surname?: string;
    email?: string;
    phoneNumber?: string;
    idNumber?: string;
    gender?: string;
    dateOfBirth?: string;
    address?: {
      street?: string;
      city?: string;
      province?: string;
      postalCode?: string;
      country?: string;
    };
    occupation?: string;
    workNumber?: string;
  };
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

declare type NewClassParms = {
  name: string;
  age: string;
  teacherId: string;
  teacherName: string;
  capacity: number;
  currentEnrollment: number;
  status: 'active' | 'inactive';
}

declare type NewPettyCashParms = {
  itemName: string;
  quantity: number;
  price: number;
  store: string;
  category: string;
  date: string;
}

declare type NewEventParms = {
  eventName: string;
  date: string;
  amount: number;
  description: string;
}

declare type NewEventTransactionParms = {
  eventId: string;
  childId: string;
  amount: number;
  quantity: number;
  datePaid: string;
}

declare type NewGroceryParms = {
  summery: string;
  totalPaid: number;
  store: string;
  date: string;
}


declare type NewStuffParams = {
  firstName: string;
  secondName?: string;
  surname: string;
  dateOfBirth: string;
  idNumber: string;
  contact: string;
  email: string;
  gender: 'male' | 'female';
  position: string;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  status: 'active' | 'inactive';
}

declare type NewPaymentParms = {
  studentId: string;
  firstName: string;
  surname: string;
  paymentMethod: string;
  amount: number;
  paymentDate: string;
  transactionType: string;
}

declare type NewStudentPayment = {
  studentId: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  feeType: string;
};

declare type SchoolFeesSetup = {
  year: number;
  registrationFee: number;
  ageStart: number;
  ageEnd: number;
  ageUnit: string;
  monthlyFee: number;
  yearlyFee: number,
  siblingDiscountPrice: number,
}

declare type StudentReg = {
  studentId: string;
  schoolFeesRegId: string;
  startDate: string;
  endDate: string;
  fees: number;
  totalFees: number;
  paidAmount?: number;
  balance: number;
  paymentFrequency: string;
  paymentDate: number;
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
  firstName: string;
  secondName: string;
  surname: string;
  idNumber: string;
  dateOfBirth: string;
  gender: string;
  contact: string;
  email?: string;
  address1: string;
  position: string;
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

declare type CreateSchoolFeesParms = {
  $id: string;
  studentId: string;
  schoolFeesRegId: string;
  startDate: string;
  endDate: string;
  fees: number;
  totalFees?: number;
  paidAmount?: number;
  balance: number;
  paymentFrequency: string;
  nextPaymentDate: number;
}

declare type NewUserParams = {
  userId: string;
  firstName: string;
  secondName?: string;
  surname: string;
  dateOfBirth: string;
  email: string;
  contact: string;
};

declare type LoginUser = {
  email: string;
  password: string;
};

declare interface signInProps {
  email: string;
  password: string;
}

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};