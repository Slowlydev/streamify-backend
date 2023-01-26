import { Body, Controller, Get, Header, Headers, Param, Patch, Post, Query, Res, Sse } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { Comment } from '../comment/comment.entity';
import { Authentication } from '../common/decorators/authentication.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { BaseDto } from '../common/entities/base-dto';
import { User } from '../user/user.entity';
import { CreateCommentDto } from '../comment/dto/create-comment.dto';
import { VideoQueryFiltersDto } from './dto/video-query-filters.dto';
import { VideoDto } from './dto/video.dto';
import { VideoService } from './video.service';

@ApiTags('video')
@Controller('/video')
export class VideoController {
	constructor(private readonly videoService: VideoService) {}

	@Authentication()
	@Get()
	getVideos(@CurrentUser() user: User, @Query() query: VideoQueryFiltersDto): Promise<VideoDto[]> {
		return this.videoService.findVideos(user.username, query);
	}

	@Authentication()
	@Get(':id')
	getVideo(@CurrentUser() user: User, @Param() param: BaseDto): Promise<VideoDto> {
		return this.videoService.findVideo(param.id, user.username);
	}

	@Authentication()
	@Sse(':id/sse')
	sseVideo(@Param() param: BaseDto): Observable<unknown> {
		return this.videoService.sseVideo(param.id);
	}

	@Authentication()
	@Get(':id/comment')
	getComments(@CurrentUser() user: User, @Param() param: BaseDto): Promise<Comment[]> {
		return this.videoService.findComments(user.username, param.id);
	}

	@Authentication()
	@Sse(':id/comment/sse')
	sseVideoComments(@Param() param: BaseDto): Observable<unknown> {
		return this.videoService.sseVideoComments(param.id);
	}

	@Authentication()
	@Get(':id/thumbnail')
	@Header('Accept-Ranges', 'bytes')
	@Header('Content-Type', 'image/png')
	getThumbnail(@Param() param: BaseDto, @Res() response: Response): void {
		return this.videoService.sendThumbnail(param.id, response);
	}

	@Get(':id/stream')
	@Header('Accept-Ranges', 'bytes')
	@Header('Content-Type', 'video/mp4')
	streamVideo(
		@Param() param: BaseDto,
		@Headers() headers: Record<string, string | undefined>,
		@Res() response: Response,
	): Promise<void> {
		return this.videoService.streamVideo(param.id, headers, response);
	}

	@Authentication()
	@Post(':id/comment')
	postComment(@CurrentUser() user: User, @Param() param: BaseDto, @Body() body: CreateCommentDto): Promise<Comment> {
		return this.videoService.createComment(user.username, param.id, body);
	}

	@Authentication()
	@Patch(':id/like')
	postLike(@CurrentUser() user: User, @Param() param: BaseDto): Promise<void> {
		return this.videoService.likeVideo(user.username, param.id);
	}

	@Authentication()
	@Patch(':id/dislike')
	postDislike(@CurrentUser() user: User, @Param() param: BaseDto): Promise<void> {
		return this.videoService.dislikeVideo(user.username, param.id);
	}
}
