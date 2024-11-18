import { Client } from 'appwrite';

let client: Client;

try {
    client = new Client();
    
    if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || !process.env.NEXT_PUBLIC_APPWRITE_PROJECT) {
        throw new Error('Missing Appwrite configuration');
    }

    client
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);
} catch (error) {
    console.error('Appwrite client initialization error:', error);
    throw error;
}

export default client;