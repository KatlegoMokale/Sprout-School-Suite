'use server';

import { cookies } from "next/headers";
import { parseStringify } from "../utils";


export const newStudent = async (studentData: NewStudentParms) =>{
const { firstName, secondName, surname, dateOfBirth, age, gender,
    address1, city, province, homeLanguage, allergies, medicalAidNumber, 
    medicalAidScheme, studentClass, p1_firstName, p1_surname, p1_address1, p1_city,
    p1_province, p1_postalCode, p1_dateOfBirth, p1_gender,p1_idNumber, p1_occupation,
    p1_phoneNumber, p1_email,p1_workNumber, p1_relationship, p2_firstName, p2_surname, p2_address1, 
    p2_city, p2_province, p2_postalCode, p2_dateOfBirth, p2_gender,p2_idNumber, p2_occupation,
    p2_phoneNumber, p2_email,p2_workNumber, p2_relationship} = studentData;

    try {
        const response = await fetch("/api/students", {
            method: 'POST',
            headers: {
                "Content-Type": "application.json",
            },
            body: JSON.stringify(studentData),
        });
        if (response.ok) {
            console.log("Student submitted successfully!");
            throw new Error("Student submission failed.")
        } else {
            console.error("Student submission failed.")
        }
        
    } catch (error) {
        console.log(error);
    }
 }

