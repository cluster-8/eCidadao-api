import { IsNotEmpty, IsString } from 'class-validator';

export class paramId {
  @IsString()
  @IsNotEmpty()
  id: string;
}
