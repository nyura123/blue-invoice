// AES-GCM encryption with PBKDF2 key derivation using the browser's built-in Web Crypto API.
// No external dependencies.

const PBKDF2_ITERATIONS = 100_000;

async function deriveKey(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as unknown as ArrayBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

// Encrypts a plaintext string with the given password.
// Returns a base64-encoded string containing the salt, IV, and ciphertext.
export async function encryptData(
  plaintext: string,
  password: string
): Promise<string> {
  const passwordError = checkPasswordStrength(password);
  if (passwordError) {
    throw new Error(passwordError);
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plaintext)
  );
  // Pack: [16 bytes salt][12 bytes IV][ciphertext]
  const combined = new Uint8Array(16 + 12 + ciphertext.byteLength);
  combined.set(salt, 0);
  combined.set(iv, 16);
  combined.set(new Uint8Array(ciphertext), 28);
  return btoa(String.fromCharCode(...combined));
}

// Decrypts a base64-encoded string produced by encryptData.
// Throws a DOMException if the password is wrong (AES-GCM authentication failure).
export async function decryptData(
  encoded: string,
  password: string
): Promise<string> {
  const combined = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const ciphertext = combined.slice(28);
  const key = await deriveKey(password, salt);
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );
  return new TextDecoder().decode(plaintext);
}

/**
 * Password strength requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 * returns null if password is strong, otherwise returns a string describing the issue.
 */
const checkPasswordStrength = (password: string): string | null => {
  if (!password) {
    return "Password cannot be empty.";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password should include at least one uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password should include at least one lowercase letter.";
  }
  if (!/[0-9]/.test(password)) {
    return "Password should include at least one number.";
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password should include at least one special character.";
  }
  return null;
};
