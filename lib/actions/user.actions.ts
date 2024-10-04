"use server";
import { getBaseUrl } from "../utils";

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
    console.log("//////////////////////");
    // const { studentId, firstName, surname, amount, paymentDate, paymentMethod } = paymentData;
    console.log("paymentData", paymentData);
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