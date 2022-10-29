import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { decrypt } from '@src/utils/functions/encrypter.fn';
import { SqlitePrismaService } from '../sqlite/sqlite.prisma.service';

@Injectable()
export class PrismaMiddlewareService {
  constructor(private readonly sqlite: SqlitePrismaService) {}

  async UserDecrypt(params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<any>) {
    try {
      if (params.model === 'User') {
        if (params.args.select && params.action !== 'count') params.args.select['secretId'] = true;
      }

      const result = await next(params);

      if (params.model === 'User') {
        const userKey = await this.sqlite.userKeys.findUnique({ where: { id: result.secretId } });

        console.log('userKey', userKey);

        if (result['cpf']) result['cpf'] = decrypt(result?.cpf, 'userKey.secret');
        if (result['email']) result['email'] = decrypt(result?.email, 'userKey.secret');

        console.log('result: ', result);
      }

      return result;
    } catch (e) {
      console.log(e);
    }
  }
}
