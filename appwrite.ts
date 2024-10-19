// src/lib/server/appwrite.js
"use server";
import { Client, Account, Databases, Users } from "node-appwrite";
import { cookies } from "next/headers";
import { error } from "console";

export async function createSessionClient() {
  console.log("Creating session client");
try {
  const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

const session = cookies().get("appwrite-session");
// console.log("Session:", session);
// console.log("Session Name:", session?.name);
// console.log("Session Value:", session?.value);

if (!session || !session.name) {
  console.log("No session", error);
  throw new Error("No session");
}

client.setSession(session.value);

return {
  get account() {
    return new Account(client);
  },
};
} catch (error) {
  console.error("Error creating session client:", error);
}
}

export async function createAdminClient() {
  console.log("Creating admin client");
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() {
      console.log("Creating account client account"+ client);
      return new Account(client);
    },
    get database(){
        return new Databases(client);
    },
    get user() {
      console.log("Creating user client user"+ client);
        return new Users(client);
    }
  };
}
