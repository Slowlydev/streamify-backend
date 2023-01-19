import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from './base-dto';

export class MetadataDto extends BaseDto {
	@ApiProperty({ type: Date })
	createdAt: Date;

	@ApiProperty({ type: Date })
	updatedAt: Date;

	@ApiProperty({ type: Date, nullable: true })
	deletedAt: Date | null;
}
