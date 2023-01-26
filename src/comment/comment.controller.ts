import { Body, Controller, Delete, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { authorization } from '../auth/auth.table';
import { Authentication } from '../common/decorators/authentication.decorator';
import { Authorization } from '../common/decorators/authorization.decorator';
import { BaseDto } from '../common/entities/base-dto';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Authentication()
@ApiTags('comment')
@Controller('/comment')
export class CommentController {
	constructor(private readonly commentService: CommentService) {}

	@Authorization(authorization.comment.update)
	@Patch(':id')
	patchComment(@Param() param: BaseDto, @Body() body: UpdateCommentDto): Promise<Comment> {
		return this.commentService.updateComment(param.id, body);
	}

	@Authorization(authorization.comment.delete)
	@Delete(':id')
	deleteComment(@Param() param: BaseDto): Promise<void> {
		return this.commentService.deleteComment(param.id);
	}
}
