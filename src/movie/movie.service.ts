import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { returnMovieObject } from './return-movie.obj'
import { UpdateMovieDto } from './dto/update-movie.dto'
import { generateSlug } from 'src/utils/generate-slug'
import { stringify } from 'querystring'
import { connect } from 'http2'

@Injectable()
export class MovieService {
	constructor(private prisma: PrismaService) {}
	async getAll(searchTerm?: string) {
		if (searchTerm) this.search(searchTerm)
		return this.prisma.movie.findMany({
			select: returnMovieObject,
			orderBy: { createdAt: 'desc' }
		})
	}

	private async search(searchTerm: string) {
		return this.prisma.movie.findMany({
			where: {
				OR: [
					{
						title: { contains: searchTerm, mode: 'insensitive' }
					}
				]
			}
		})
	}
	async getBySlug(slug: string) {
		const movie = await this.prisma.movie.findUnique({
			where: {
				slug
			},
			select: returnMovieObject
		})

		if (!movie) throw new NotFoundException('Фильм не найден')

		return movie
	}

	async getMostPopular() {
		return this.prisma.movie.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				actors: true,
				genres: true
			},
			take: 8
		})
	}
	async getByActor(actorId: string) {
		return this.prisma.movie.findMany({
			where: {
				actors: {
					some: {
						id: actorId
					}
				}
			}
		})
	}
	async getByGenres(genresId: string) {
		return this.prisma.movie.findMany({
			where: {
				actors: {
					some: {
						id: genresId
					}
				}
			}
		})
	}

	async updateCountViews(slug: string) {
		return this.prisma.movie.update({
			where: {
				slug
			},
			data: {
				views: {
					increment: 1
				}
			}
		})
	}
	//? Запросы для Админа
	async getById(id: string) {
		const movie = await this.prisma.movie.findUnique({
			where: {
				id
			},
			select: returnMovieObject
		})

		if (!movie) throw new NotFoundException('Фильм не найден')

		return movie
	}

	async create() {
		const movie = await this.prisma.movie.create({
			data: {
				title: '',
				slug: '',
				bigPoster: '',
				poster: '',
				videoUrl: '',
				actors: {
					connect: []
				},
				genres: {
					connect: []
				}
			}
		})
		return movie.id
	}

	async update(id: string, dto: UpdateMovieDto) {
		return this.prisma.movie.update({
			where: {
				id
			},
			data: {
				title: dto.title,
				slug: generateSlug(dto.title)
			}
		})
	}
	async delete(id: string) {
		return this.prisma.movie.delete({
			where: {
				id
			}
		})
	}
}
