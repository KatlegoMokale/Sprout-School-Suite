"use server";
import { Client } from "@googlemaps/google-maps-services-js";
import { count } from "console";

const client = new Client();
export const autocomplete = async (qurey: string) => {
    try {
        const response = await client.placeAutocomplete({
            params: {
                key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
                input: qurey,
                components: ['country:za']
            },
            timeout: 1000,
        });
        return response.data.predictions; 
    } catch (error) {
         console.log(error); 
    }
};