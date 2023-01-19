import { Body, Controller, Get, Header, Headers, Param, Post, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Comment } from '../comment/comment.entity';
import { Authentication } from '../common/decorators/authentication.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { BaseDto } from '../common/entities/base-dto';
import { User } from '../user/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { VideoQueryFiltersDto } from './dto/video-query-filters.dto';
import { Video } from './video.entity';
import { VideoService } from './video.service';

@ApiTags('video')
@Controller('/video')
export class VideoController {
	constructor(private readonly videoService: VideoService) {}

	@Authentication()
	@Get()
	getVideos(@Query() query: VideoQueryFiltersDto): Promise<Video[]> {
		return this.videoService.findVideos(query);
	}

	@Authentication()
	@Get('/:id')
	getVideo(@Param() param: BaseDto): Promise<Video> {
		return this.videoService.findVideo(param.id);
	}

	@Authentication()
	@Get('/:id/comment')
	getComments(@Param() param: BaseDto): Promise<Comment[]> {
		return this.videoService.findComments(param.id);
	}

	@Authentication()
	@Get('/:id/thumbnail')
	@Header('Accept-Ranges', 'bytes')
	@Header('Content-Type', 'image/png')
	getThumbnail(@Param() param: BaseDto, @Res() response: Response): void {
		return this.videoService.sendThumbnail(param.id, response);
	}

	@Get('/:id/stream')
	@Header('Accept-Ranges', 'bytes')
	@Header('Content-Type', 'video/mp4')
	streamVideo(
		@Param() param: BaseDto,
		@Headers() headers: Record<string, string | undefined>,
		@Res() response: Response,
	): void {
		return this.videoService.streamVideo(param.id, headers, response);
	}

	@Authentication()
	@Post('/:id/comment')
	postComment(@CurrentUser() user: User, @Param() param: BaseDto, @Body() body: CreateCommentDto): Promise<Comment> {
		return this.videoService.createComment(user.username, param.id, body);
	}
}
