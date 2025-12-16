import { PartialType } from '@nestjs/swagger';
import { CreateAnnualContributionDto } from './create-annual-contribution.dto';

export class UpdateAnnualContributionDto extends PartialType(
  CreateAnnualContributionDto,
) {}

