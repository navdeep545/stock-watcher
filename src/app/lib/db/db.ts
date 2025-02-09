import { db } from '@vercel/postgres';

export async function getDbClient() {
  try {
    const client = await db.connect();
    return client;
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    throw new Error("Database connection error");
  }
}

export async function closeDbClient(client: any) {
  try {
    await client.release();
  } catch (error) {
    console.error("❌ Failed to release database connection:", error);
    throw new Error("Database connection release error");
  }
}