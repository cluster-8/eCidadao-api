import { Address } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsInt, IsLatitude, IsLongitude, IsNotEmpty, IsOptional } from 'class-validator';

export class AddressDto implements Address {
  @IsLatitude()
  @IsNotEmpty()
  @Expose()
  lat: string;

  @IsLongitude()
  @IsNotEmpty()
  @Expose()
  long: string;

  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Expose()
  number: number;

  @Expose()
  city: string;

  @Expose()
  state: string;

  @Expose()
  street: string;

  @Expose()
  zipcode: string;

  @Expose()
  neighborhood: string;

  @Expose()
  formattedAddress: string;
}
