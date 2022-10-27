import { BadRequestException, Global, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Global()
@Injectable()
export class Encrypter {
  algorithm = 'aes-256-cbc';

  encrypt(clearText: string, userSecret: string) {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(this.algorithm, userSecret, iv);

    const encrypted = cipher.update(clearText, 'utf8', 'hex');

    return [encrypted + cipher.final('hex'), iv.toString('hex')].join('|');
  }

  decrypt(encryptedText: string, userSecret: string) {
    const [encrypted, iv] = encryptedText.split('|');

    if (!iv) throw new BadRequestException('invalid IV');

    if (iv.length < 16) throw new BadRequestException('Invalid IV length');

    try {
      const decipher = crypto.createDecipheriv(this.algorithm, userSecret, Buffer.from(iv, 'hex'));

      return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
    } catch (e) {
      throw new BadRequestException('Decrypt failed');
    }
  }
}
