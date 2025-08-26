import { Client, Account, Databases, ID, Permission, Role, Query } from 'appwrite'

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

export const account = new Account(client)
export const databases = new Databases(client)

export const IDs = {
  DB: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  COLLECTION: import.meta.env.VITE_APPWRITE_COLLECTION_ID,
}

export { ID, Permission, Role, Query }
