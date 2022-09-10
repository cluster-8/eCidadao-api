import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Querybuilder } from 'nestjs-prisma-querybuilder';
import { Request } from 'express';
import { PrismaService } from '../prisma.service';

@Injectable()
export class QuerybuilderService {
  constructor(@Inject(REQUEST) private readonly request: Request, private readonly querybuilder: Querybuilder, private readonly prisma: PrismaService) {}

  /**
   *
   * @param model model name on schema.prisma;
   * @param primaryKey primaryKey name for this model on prisma.schema;
   * @param where object to 'where' using the prisma rules;
   * @param mergeWhere define if the previous where will be merged with the query where or replace that;
   * @param onlyPaginate remove any 'select' and 'populate' of the query
   */
  async query(model: string, primaryKey?: string, where?: any, mergeWhere = false, onlyPaginate = false) {
    return this.querybuilder
      .query(primaryKey)
      .then(async (query) => {
        if (where) query.where = mergeWhere ? { ...query.where, ...where } : where;

        const count = await this.prisma[model].count({ where: query.where });

        this.request.res.setHeader('count', count);

        if (onlyPaginate) {
          delete query.include;
          delete query.select;
        }

        return query;
      })
      .catch((err) => {
        if (err.response?.message) throw new BadRequestException(err.response?.message);

        throw new BadRequestException('Internal error processing your query string, check your parameters');
      });
  }
}
