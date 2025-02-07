// src/app/lib/db/user.ts
import { sql } from '@vercel/postgres';

interface User {
  user_id: string;
  email: string;
  name: string | null;
}

export async function createOrUpdateUser(email: string, name: string | null): Promise<User> {
  try {
    const result = await sql<User>`
      INSERT INTO users (email, name)
      VALUES (${email}, ${name})
      ON CONFLICT (email) 
      DO UPDATE SET name = EXCLUDED.name
      RETURNING user_id, email, name;
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw error;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await sql<User>`
      SELECT user_id, email, name
      FROM users
      WHERE email = ${email}
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

export async function deleteUser(email: string): Promise<User | null> {
  try {
    const result = await sql<User>`
      DELETE FROM users
      WHERE email = ${email}
      RETURNING user_id, email, name;
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}