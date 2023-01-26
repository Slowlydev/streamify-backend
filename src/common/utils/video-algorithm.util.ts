import { VideoDto } from '../../video/dto/video.dto';

export const calcVideoAlgorithm = (videos: VideoDto[]): VideoDto[] => {
	return videos.sort((first, last) =>
		(first.likes - first.dislikes) * (first.views * 0.5) > (last.likes - last.dislikes) * (last.views * 0.5) ? -1 : 1,
	);
};
