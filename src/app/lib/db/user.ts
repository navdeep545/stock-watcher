import bcrypt from 'bcrypt';
import { User } from '../types';
import { getDbClient,closeDbClient } from './db';

/**
 * Create or update a user.
 * If the email exists, update the name.
 * If a password is provided, update it as well.
 */
export async function createOrUpdateUser(
  email: string,
  name: string | null,
  password?: string
): Promise<User> {

  const client = await getDbClient();

  try {
    // Ensure a password is always set
    const safePassword = password || 'DefaultSecurePassword123!';
    const hashedPassword = await bcrypt.hash(safePassword, 10);

    const result = await client.sql<User>`
      INSERT INTO users (email, name, password)
      VALUES (${email}, ${name}, ${hashedPassword})
      ON CONFLICT (email) 
      DO UPDATE SET 
        name = EXCLUDED.name,
        password = COALESCE(EXCLUDED.password, users.password)
      RETURNING user_id, email, name;
    `;

    return result.rows[0];
  } catch (error) {
    console.error(`❌ Error creating/updating user (${email}):`, error);
    throw new Error('Database error: Unable to create or update user');
  }
  finally {
    closeDbClient(client);
  }
}


/**
 * Get a user by email, including hashed password (for authentication).
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const client = await getDbClient();
  try {
    const result = await client.sql<User>`
      SELECT user_id, email, name, password
      FROM users
      WHERE email = ${email};
    `;

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error(`❌ Error fetching user (${email}):`, error);
    throw new Error('Database error: Unable to fetch user');
  }
  finally {
    closeDbClient(client);
  }
}

/**
 * Delete a user by email and return deleted user details.
 */
export async function deleteUser(email: string): Promise<User | null> {
  const client = await getDbClient();
  try {
    const result = await client.sql<User>`
      DELETE FROM users
      WHERE email = ${email}
      RETURNING user_id, email, name;
    `;

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error(`❌ Error deleting user (${email}):`, error);
    throw new Error('Database error: Unable to delete user');
  }finally {
    closeDbClient(client);
  }
}

/**
 * Verify a user's password.
 */
export async function verifyUserPassword(email: string, password: string): Promise<boolean> {
  const client = await getDbClient();
  try {
    const user = await getUserByEmail(email);
    if (!user || !user.password) return false;

    const passwordMatch = await bcrypt.compare(password, user.password);
    return passwordMatch;
  } catch (error) {
    console.error(`❌ Error verifying password for (${email}):`, error);
    throw new Error('Authentication error: Unable to verify password');
  }
  finally {
    closeDbClient(client);
  }
}
