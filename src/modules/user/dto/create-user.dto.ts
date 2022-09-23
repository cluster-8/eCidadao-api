import { IsCPF } from '@src/utils/decorators/cpf.decorator';
import { Match } from '@src/utils/decorators/match.decorator';
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  @IsOptional()
  phone: string;

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
}
