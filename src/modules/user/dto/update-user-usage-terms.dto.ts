import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { UsageTermsAccepted } from './create-user.dto';

export class UpdateUserUsageTermsDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UsageTermsAccepted)
  usageTermsAccepted: UsageTermsAccepted;
}
