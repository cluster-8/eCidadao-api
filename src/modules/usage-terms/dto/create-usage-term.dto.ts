import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class CreateUsageTermDto {
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => CreateUsageTermItensDto)
  @ValidateNested({ each: true })
  itens: CreateUsageTermItensDto[];

  version: number;
  createdBy: string;
}

export class CreateUsageTermItensDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  paragraphs: string[];
}
