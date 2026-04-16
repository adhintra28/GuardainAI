import { createCipheriv, createHash, randomBytes } from 'node:crypto';

function resolveEncryptionKey(): Buffer {
  const raw = process.env.PII_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error('PII_ENCRYPTION_KEY is required to encrypt extracted data');
  }

  return createHash('sha256').update(raw).digest();
}

export function encryptJsonPayload(payload: unknown): string {
  const key = resolveEncryptionKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);

  const encoded = JSON.stringify(payload);
  const encrypted = Buffer.concat([cipher.update(encoded, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return JSON.stringify({
    alg: 'aes-256-gcm',
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    ciphertext: encrypted.toString('base64'),
  });
}
