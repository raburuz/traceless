// Passphrase-based encryption using the browser's WebCrypto API.
// PBKDF2 (SHA-256) derives an AES-GCM key from the passphrase. The passphrase
// and the derived key are never persisted, only { salt, iv, data }.

const PBKDF2_ITERATIONS = 600_000
const SALT_BYTES = 16
const IV_BYTES = 12

export type Vault = {
  salt: string
  iv: string
  data: string
}

const encoder = new TextEncoder()
const decoder = new TextDecoder()

const toBase64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes))

const fromBase64 = (value: string) =>
  Uint8Array.from(atob(value), (char) => char.charCodeAt(0))

const deriveKey = async (passphrase: string, salt: Uint8Array<ArrayBuffer>) => {
  const material = await crypto.subtle.importKey(
    "raw",
    encoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  )
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  )
}

// Encrypts `value` with an already derived key, using a fresh IV every time.
export const seal = async (
  key: CryptoKey,
  salt: string,
  value: unknown
): Promise<Vault> => {
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES))
  const data = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(JSON.stringify(value))
  )
  return { salt, iv: toBase64(iv), data: toBase64(new Uint8Array(data)) }
}

// Creates a new vault (new random salt) protected by `passphrase`.
export const createVault = async (passphrase: string, value: unknown) => {
  const saltBytes = crypto.getRandomValues(new Uint8Array(SALT_BYTES))
  const key = await deriveKey(passphrase, saltBytes)
  const vault = await seal(key, toBase64(saltBytes), value)
  return { vault, key }
}

// Decrypts a vault. Throws if the passphrase is wrong or the data was tampered
// with (AES-GCM authenticates the ciphertext).
export const openVault = async <T>(vault: Vault, passphrase: string) => {
  const key = await deriveKey(passphrase, fromBase64(vault.salt))
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromBase64(vault.iv) },
    key,
    fromBase64(vault.data)
  )
  return { value: JSON.parse(decoder.decode(plain)) as T, key }
}
