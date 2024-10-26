import { IsArray, isArray, IsString } from 'class-validator'

export class UpdateMovieDto {
	@IsString()
	title: string
	@IsString()
	poster: string

	@IsString()
	bigPoster: string
	@IsString()
	videoUrl: string
	@IsString()
	country: string
	@IsString()
	year: string
	@IsString()
	duration: string
	@IsArray()
	@IsString({ each: true })
	actors: string[]
}
