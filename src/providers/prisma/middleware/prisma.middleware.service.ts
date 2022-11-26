import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserKeys } from '@keys/prisma/client';
import { decrypt } from '@src/utils/functions/encrypter.fn';
import { keysPrisma } from '../keys/keys.prisma.fn';

@Injectable()
export class PrismaMiddlewareService {
  async UserDecrypt(params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<any>) {
    try {
      if (params.model === 'User') {
        if (params.args.select && params.action !== 'count') params.args.select['secretId'] = true;
      }

      const result = await next(params);

      if (params.model === 'User') {
        try {
          let userKey: UserKeys;

          if (result?.secretId) userKey = await keysPrisma.userKeys.findUnique({ where: { id: result?.secretId } });

          if (result?.cpf) result['cpf'] = decrypt(result?.cpf, userKey?.secret);
          if (result?.name) result['name'] = decrypt(result?.name, userKey?.secret);
          if (result?.email) result['email'] = decrypt(result?.email, userKey?.secret);
        } catch {}
      }

      return result;
    } catch (e) {
      console.log(e);
    }
  }
}
