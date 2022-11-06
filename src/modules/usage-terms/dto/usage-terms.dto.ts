import { Expose, Type } from 'class-transformer';

export class UsageTermsItensDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  paragraphs: string[];
}

export class UsageTermsDto {
  @Expose()
  id: string;

  @Expose()
  version: number;

  @Expose()
  @Type(() => UsageTermsItensDto)
  itens: UsageTermsItensDto[];

  @Expose()
  createdAt: Date;

  createdBy: Date;
}
