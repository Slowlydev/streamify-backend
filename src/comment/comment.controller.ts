import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Authentication } from '../common/decorators/authentication.decorator';
import { CommentService } from './comment.service';

@Authentication()
@ApiTags('comment')
@Controller('/comment')
export class CommentController {
	constructor(private readonly commentService: CommentService) {}
}
