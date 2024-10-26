import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	Query,
	Search
} from '@nestjs/common'
import { MovieService } from './movie.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { generate } from 'rxjs'
import { GenreService } from 'src/genre/genre.service'

@Controller('movies')
export class MovieController {
	constructor(private readonly movieService: MovieService) {}
	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.movieService.getAll(searchTerm)
	}

	@Get('by-slug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return this.movieService.getBySlug(slug)
	}

	@Get('most-popular')
	async getMostPopular() {
		return this.movieService.getMostPopular()
	}

	@Get('by-actor/:id')
	@HttpCode(200)
	async getByActor(
		@Param('id')
		id: string
	) {
		return this.movieService.getByActor(id)
	}

	@Post('update-count-views')
	@HttpCode(200)
	async updateCountOPened(@Body('slug') slug: string[]) {
		return this.movieService.updateCountViews(slug)
	}

	//? Query for admin
}
