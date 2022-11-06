import { IsCPF } from '@src/utils/decorators/cpf.decorator';
import { Match } from '@src/utils/decorators/match.decorator';
import { Expose, Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDate, IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class UsageTermsAccepted {
  @IsDate()
  @IsNotEmpty()
  @Expose()
  usageTermsAcceptedAt: Date;

  @IsString()
  @IsNotEmpty()
  @Expose()
  usageTermsId: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty()
  @Expose()
  usageTermsAcceptedItens: string[];
}

export class CreateUserDto {
  @IsCPF()
  @IsNotEmpty()
  cpf: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @Match('password')
  passwordConfirmation: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UsageTermsAccepted)
  usageTermsAccepted: UsageTermsAccepted;

  hashCpf: string;
  hashEmail: string;

  secretId: string;
}
