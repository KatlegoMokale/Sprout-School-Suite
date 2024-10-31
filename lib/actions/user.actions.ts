"use server";
import { getBaseUrl } from "../utils";
import { createAdminClient, createSessionClient } from "@/appwrite";
import { cookies } from "next/headers";
import { ID } from "node-appwrite";
import { parseStringify } from "../utils";


export const signIn = async ({email, password}: signInProps) => {
  console.log("//////////////////////");
    try{
        const { account } = await createAdminClient();
        
        const response = await account.createEmailPasswordSession(email, password,);
        // console.log("Creating Email Password Session :"+ response.$createdAt);


    // Set the session cookie after successful sign-in
    const maxAgeSeconds = 3600; //1 hour
        cookies().set("appwrite-session", response.secret, { 
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: true,
          maxAge: maxAgeSeconds,
        });
        // console.log("Session created:", response); 

        return parseStringify(response);

    } catch (error){
      console.error('Error during sign-in:', error);
      return { success: false, message: error }; // Return error details
    }
}

export const signUp = async (userData: SignUpParams) => {
    const {email, password, firstName, surname} = userData;
    try{
        const { account } = await createAdminClient();

        const newUserAccount = await account.create(
            ID.unique(), 
            email, 
            password, 
            `${firstName} ${surname}`
        );
        const session = await account.createEmailPasswordSession(email, password);
      
        cookies().set("appwrite-session", session.secret, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: true,
        });
      
        console.log("Session created:", session);
        return parseStringify(newUserAccount)
    } catch (error){
        console.error('Error', error);
    }
}

export async function getLoggedInUser() {
    try {
      // console.log("Getting logged in user ------------");
      const { account } = await createSessionClient();
      // console.log("Getting logged in user ------------"+ account);
      const user = await account.get();
      // console.log("User Logged In:", user); 

      return parseStringify(user);
    } catch (error) {
      console.log("User not logged in");
      console.error('Error getting logged-in user:', error);
      return null;
    }
  }
  
export const logoutAccount = async () => {
    try {
        const {account} = await createSessionClient();

        cookies().delete('appwrite-session');

        await account.deleteSession('cuurent');
    } catch (error) {
        return null;
    }
}


export const newClass = async (classData: NewClassParms) => {
  console.log("class", classData);
  try {
      const response = await fetch(`${getBaseUrl()}/api/class`, {
          method: "POST",
          headers: {
              "Content-Type": "application.json",
          },
          body: JSON.stringify(classData),
      });
      if (response.ok) {
          console.log("Class added successfully!");
        } else {
          console.error("Class submission failed.");
          throw new Error("Class submission failed.");
        }
  } catch (error) {
     
  }
}

export const newStuff = async (stuffData: NewStuffParams) => {
  console.log("stuff", stuffData);
  try {
      const response = await fetch(`${getBaseUrl()}/api/stuff`, {
          method: "POST",
          headers: {
              "Content-Type": "application.json",
          },
          body: JSON.stringify(stuffData),
      });
      if (response.ok) {
          console.log("Stuff added successfully!");
        } else {
          console.error("Stuff submission failed.");
          throw new Error("Stuff submission failed.");
        }
  } catch (error) {
    console.log(error);
  }
}

export const newPayment = async (paymentData: NewPaymentParms) => {
    try {
        console.log("//////////////////////");
        const response = await fetch(`${getBaseUrl()}/api/transactions`, {
            method: "POST",
            headers: {
                "Content-Type": "application.json",
            },
            body: JSON.stringify(paymentData),
        });
        if (response.ok) {
            console.log("Payment added successfully!");
          } else {
            console.error("Payment submission failed.");
            throw new Error("Payment submission failed.");
          }
    } catch (error) {
      console.log(error);
    }
}


export const newSchoolFees = async (paymentData: SchoolFeesSetup) => {
  try {
      const response = await fetch(`${getBaseUrl()}/api/school-fees-setup`, {
          method: "POST",
          headers: {
              "Content-Type": "application.json",
          },
          body: JSON.stringify(paymentData),
      });
      if (response.ok) {
          console.log("New School Fees added successfully!");
        } else {
          console.error("New School Fees submission failed.");
          throw new Error("New School Fees submission failed.");
        }
  } catch (error) {
    console.log(error);
  }
}

export const newStudent = async (studentData: NewStudentParms) => {
  // console.log("//////////////////////");
  // console.log("studentData", studentData);
  const {
    firstName,
    secondName,
    surname,
    dateOfBirth,
    age,
    gender,
    address1,
    homeLanguage,
    allergies,
    medicalAidNumber,
    medicalAidScheme,
    studentClass,
    p1_firstName,
    p1_surname,
    p1_address1,
    p1_dateOfBirth,
    p1_gender,
    p1_idNumber,
    p1_occupation,
    p1_phoneNumber,
    p1_email,
    p1_workNumber,
    p1_relationship,
    p2_firstName,
    p2_surname,
    p2_address1,
    p2_dateOfBirth,
    p2_gender,
    p2_idNumber,
    p2_occupation,
    p2_phoneNumber,
    p2_email,
    p2_workNumber,
    p2_relationship,
  } = studentData;

  try {
    // console.log("//////////////////////1");

    const response = await fetch(`${getBaseUrl()}/api/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application.json",
      },
      body: JSON.stringify(studentData),
    });
    console.log("//////////////////////2" + response.body);
    if (response.ok) {
      console.log("Student submitted successfully!");
    } else {
      console.error("Student submission failed.");
      throw new Error("Student submission failed.");
    }
  } catch (error) {
    console.log(error);
  }
};

export const newPettyCash = async (data: NewPettyCashParms) => {
  console.log("Petty Cash", data);
  try {
      const response = await fetch(`${getBaseUrl()}/api/pettycash`, {
          method: "POST",
          headers: {
              "Content-Type": "application.json",
          },
          body: JSON.stringify(data),
      });
      if (response.ok) {
          console.log("Petty Cash added successfully!");
        } else {
          console.error("Petty Cash submission failed.");
          throw new Error("Petty Cash submission failed.");
        }
  } catch (error) {
     
  }
}


export const newEvent = async (data: NewEventParms) => {
  console.log("Event data: ", data);
  try {
      const response = await fetch(`${getBaseUrl()}/api/event`, {
          method: "POST",
          headers: {
              "Content-Type": "application.json",
          },
          body: JSON.stringify(data),
      });
      if (response.ok) {
          console.log("Event added successfully!");
        } else {
          console.error("Event submission failed.");
          throw new Error("Event submission failed.");
        }
  } catch (error) {
     console.log("Event error: "+ error);
  }
}

export const newEventTranaction = async (data: NewEventTransactionParms) => {
  console.log("Event Transaction data: ", data);
  try {
      const response = await fetch(`${getBaseUrl()}/api/event-transaction`, {
          method: "POST",
          headers: {
              "Content-Type": "application.json",
          },
          body: JSON.stringify(data),
      });
      if (response.ok) {
          console.log("Event Transaction added successfully!");
        } else {
          console.error("Event Transaction submission failed.");
          throw new Error("Event Transaction submission failed.");
        }
  } catch (error) {
     console.log("Event Transaction error: "+ error);
  }
}

export const newGrocery = async (data: NewGroceryParms) => {
  console.log("Grocery data: ", data);
  try {
      const response = await fetch(`${getBaseUrl()}/api/grocery`, {
          method: "POST",
          headers: {
              "Content-Type": "application.json",
          },
          body: JSON.stringify(data),
      });
      if (response.ok) {
          console.log("Grocery added successfully!");
        } else {
          console.error("Grocery submission failed.");
          throw new Error("Grocery submission failed.");
        }
  } catch (error) {
     console.log("Grocery: "+ error);
  }
}



export const updateStudent = async (
  studentData: NewStudentParms,
  id: string
) => {
  // console.log("//////////////////////");
  // console.log("studentData", studentData);
  const {
    firstName,
    secondName,
    surname,
    dateOfBirth,
    age,
    gender,
    address1,
    city,
    province,
    homeLanguage,
    allergies,
    medicalAidNumber,
    medicalAidScheme,
    studentClass,
    p1_firstName,
    p1_surname,
    p1_address1,
    p1_city,
    p1_province,
    p1_postalCode,
    p1_dateOfBirth,
    p1_gender,
    p1_idNumber,
    p1_occupation,
    p1_phoneNumber,
    p1_email,
    p1_workNumber,
    p1_relationship,
    p2_firstName,
    p2_surname,
    p2_address1,
    p2_city,
    p2_province,
    p2_postalCode,
    p2_dateOfBirth,
    p2_gender,
    p2_idNumber,
    p2_occupation,
    p2_phoneNumber,
    p2_email,
    p2_workNumber,
    p2_relationship,
  } = studentData;

  try {
    // console.log("//////////////////////1");

    const response = await fetch(`${getBaseUrl()}/api/students/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application.json",
      },
      body: JSON.stringify(studentData),
    });
    console.log("//////////////////////2" + response.body);
    if (response.ok) {
      console.log("Student updated successfully!");
    } else {
      throw new Error("Student update failed.");
    }
  } catch (error) {
    console.log(error);
  }
};


export const updateClass = async (
  classData: NewClassParms,
  id: string
) => {
  const {
    name,
    age,
    teacherId,
    teacherName
  } = classData;

  try {
    const response = await fetch(`${getBaseUrl()}/api/class/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application.json",
      },
      body: JSON.stringify(classData),
    });
    console.log("//////////////////////2" + response.body);
    if (response.ok) {
      console.log("Class updated successfully!");
    } else {
      throw new Error("Class update failed.");
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateStuff = async (
  stuffData: NewStuffParams,
  id: string
) => {
  const {
    firstName,
    secondName,
    surname,
    dateOfBirth,
    idNumber,
    address1,
    contact,
    gender,
    position,
    startDate
  } = stuffData;

  try {
    const response = await fetch(`${getBaseUrl()}/api/stuff/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application.json",
      },
      body: JSON.stringify(stuffData),
    });
    console.log("//////////////////////2" + response.body);
    if (response.ok) {
      console.log("Stuff updated successfully!");
    } else {
      throw new Error("Stuff update failed.");
    }
  } catch (error) {
    console.log(error);
  }
};