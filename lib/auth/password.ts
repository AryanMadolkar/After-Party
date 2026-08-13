import "server-only";

import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

const SALT_BYTES = 16;
const KEY_LENGTH = 64;

/**
 * Password hashing via Node's built-in scrypt (no external dependency —
 * scrypt is a memory-hard KDF, an accepted alternative to bcrypt/argon2).
 * Stored as `saltHex:hashHex` so verification doesn't need a separate
 * column.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return `${salt.toString("hex")}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [saltHex, hashHex] = storedHash.split(":");
  if (!saltHex || !hashHex) return false;

  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const actual = (await scryptAsync(password, salt, expected.length)) as Buffer;

  // Buffers must be equal length for timingSafeEqual — a mismatched
  // stored hash (corrupt data) should fail closed, not throw.
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}
