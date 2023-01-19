import { ApiProperty } from '@nestjs/swagger';
import { MetadataDto } from '../../common/entities/metadata-dto';
import { Language } from '../../common/enums/language.enum';
import { Theme } from '../../common/enums/theme.enum';
import { User } from '../../user/user.entity';

export class UserDto extends MetadataDto {
	@ApiProperty({ type: String })
	username: User['username'];

	@ApiProperty({ type: String })
	password: User['username'];

	@ApiProperty({ enum: Language })
	language: User['language'];

	@ApiProperty({ enum: Theme })
	theme: User['theme'];
}
