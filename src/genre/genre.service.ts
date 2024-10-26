import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { returnGenreObject } from './return-genre.obj'
import { UpdateGenreDto } from './dto/update-genre.dto'
import { generateSlug } from 'src/utils/generate-slug'
import { stringify } from 'querystring'

@Injectable()
export class GenreService {
	constructor(private prisma: PrismaService) {}
	async getAll(searchTerm?: string) {
		if (searchTerm) this.search(searchTerm)
		return this.prisma.genre.findMany({
			select: returnGenreObject,
			orderBy: { createdAt: 'desc' }
		})
	}

	private async search(searchTerm: string) {
		return this.prisma.genre.findMany({
			where: {
				OR: [
					{
						name: { contains: searchTerm, mode: 'insensitive' },
						description: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
				]
			}
		})
	}
	async getBySlug(slug: string) {
		const genre = await this.prisma.genre.findUnique({
			where: {
				slug
			},
			select: returnGenreObject
		})

		if (!genre) throw new NotFoundException('Жанр не найден')

		return genre
	}

	//? Запросы для Админа
	async getById(id: string) {
		const genre = await this.prisma.genre.findUnique({
			where: {
				id
			},
			select: returnGenreObject
		})

		if (!genre) throw new NotFoundException('Жанр не найден')

		return genre
	}

	async create() {
		const genre = await this.prisma.genre.create({
			data: {
				name: '',
				slug: '',
				description: '',
				icon: ''
			}
		})
		return genre.id
	}

	async update(id: string, dto: UpdateGenreDto) {
		return this.prisma.genre.update({
			where: {
				id
			},
			data: {
				name: dto.name,
				slug: generateSlug(dto.name),
				description: dto.description,
				icon: dto.icon
			}
		})
	}
	async delete(id: string) {
		return this.prisma.genre.delete({
			where: {
				id
			}
		})
	}
}
