import * as crypto from 'crypto';

const algorithm = 'aes-256-cbc';

export function encrypt(clearText: string, userSecret: string) {
  const iv = Buffer.from(process.env.IV, 'hex');

  const cipher = crypto.createCipheriv(algorithm, userSecret, iv);

  const encrypted = cipher.update(clearText, 'utf8', 'hex');

  return encrypted + cipher.final('hex');
}

export function decrypt(encryptedText: string, userSecret: string) {
  if (!userSecret) return encryptedText;

  try {
    const decipher = crypto.createDecipheriv(algorithm, userSecret, Buffer.from(process.env.IV, 'hex'));

    return decipher.update(encryptedText, 'hex', 'utf8') + decipher.final('utf8');
  } catch (e) {
    console.log('decrypt failed', e);

    return encryptedText;
  }
}
