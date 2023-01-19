import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class BaseDto {
	@ApiProperty({ type: String })
	@IsString()
	@IsUUID()
	id: string;
}
