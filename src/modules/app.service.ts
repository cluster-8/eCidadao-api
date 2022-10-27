import { Injectable } from '@nestjs/common';
import { Encrypter } from '@src/utils/services/encrypter.service';
// import * as crypto from 'crypto';

@Injectable()
export class AppService {
  constructor(private readonly encrypter: Encrypter) {
    // setTimeout(() => {
    //   const key = crypto.randomBytes(16).toString('hex');
    //   console.log('key', key);
    //   const encrypted = this.encrypter.encrypt('123', key);
    //   console.log('encrypted', encrypted);
    //   const decrypted = this.encrypter.decrypt(encrypted, key);
    //   console.log('decrypted', decrypted);
    // }, 2000);
  }
}
