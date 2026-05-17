import "server-only";
import { randomBytes } from "crypto";

const ALPHABET =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";

export function generatePassword(length = 16) {
  const bytes = randomBytes(length);
  let pw = "";
  for (let i = 0; i < length; i++) {
    pw += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return pw;
}
