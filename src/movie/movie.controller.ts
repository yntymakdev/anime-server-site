import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Post,
	Put,
	Query,
	Search,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { MovieService } from './movie.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { generate, NotFoundError } from 'rxjs'
import { GenreService } from 'src/genre/genre.service'
import { ValidationTypes } from 'class-validator'
import { UpdateMovieDto } from './dto/update-movie.dto'

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

	@Get('by-actors/:id')
	@HttpCode(200)
	async getByActor(@Param('id') id: string) {
		return this.movieService.getByActor(id)
	}
	@Post('by-genres')
	@HttpCode(200)
	async getByGenres(@Body('genreIds') genreIds: string[]) {
		return this.movieService.getByGenres(genreIds)
	}

	@Put('update-count-views')
	@HttpCode(200)
	async updateCountOPened(@Body('slug') slug: string) {
		return this.movieService.updateCountViews(slug)
	}

	//? Query for admin

	@Get('by-id/:id')
	@Auth('admin')
	async getById(@Param('id') id: string) {
		return this.movieService.getById(id)
	}

	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.movieService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(@Param('id') id: string, @Body() data: UpdateMovieDto) {
		const updateMovie = this.movieService.update(id, data)
		if (!updateMovie) throw new NotFoundException('Фильм не найден')
		return updateMovie
	}
	@Delete(':id')
	@Auth('admin')
	async delete(@Param('id') id: string) {
		const deletedMovie = await this.movieService.delete(id)
		if (!deletedMovie) throw new NotFoundException('Фильм не найден')
		return deletedMovie
	}
}
