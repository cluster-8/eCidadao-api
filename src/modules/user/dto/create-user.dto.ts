import { IsCPF } from '@src/utils/decorators/cpf.decorator';
import { Match } from '@src/utils/decorators/match.decorator';
import { IsDate, IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

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

  @IsDate()
  @IsNotEmpty()
  usageTermsAcceptedAt: Date;

  @IsInt()
  @IsNotEmpty()
  usageTermsVersion: number;

  hashCpf: string;
  hashEmail: string;

  secretId: string;
}
