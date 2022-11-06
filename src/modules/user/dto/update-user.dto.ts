import { Match } from '@src/utils/decorators/match.decorator';
import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
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
  @ValidateIf((v) => v.newPassword)
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((v) => v.oldPassword)
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @Match('newPassword')
  @ValidateIf((v) => v.oldPassword)
  newPasswordConfirmation: string;

  password: string;
}
