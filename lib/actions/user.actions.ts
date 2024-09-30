'use server';

import { cookies } from "next/headers";
import { parseStringify, getBaseUrl } from "../utils";



export const newStudent = async (studentData: NewStudentParms) =>{
    // console.log("//////////////////////");
    // console.log("studentData", studentData);
const { firstName, secondName, surname, dateOfBirth, age, gender,
    address1, homeLanguage, allergies, medicalAidNumber, 
    medicalAidScheme, studentClass, p1_firstName, p1_surname, p1_address1,
    p1_dateOfBirth, p1_gender,p1_idNumber, p1_occupation,
    p1_phoneNumber, p1_email,p1_workNumber, p1_relationship, p2_firstName, p2_surname, p2_address1, 
    p2_dateOfBirth, p2_gender,p2_idNumber, p2_occupation,
    p2_phoneNumber, p2_email,p2_workNumber, p2_relationship} = studentData;

    try {
        // console.log("//////////////////////1");
            
        const response = await fetch(`${getBaseUrl()}/api/students`, {
            method: 'POST',
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
            throw new Error("Student submission failed.")
        }
        
    } catch (error) {
        console.log(error);
    }
 }



