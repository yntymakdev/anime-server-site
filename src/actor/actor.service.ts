import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { generateSlug } from 'src/utils/generate-slug'
import { returnActorObject } from './return-actor.obj'
import { UpdateActorDto } from './dto/dto-actor.dto'
@Injectable()
export class ActorService {
	constructor(private prisma: PrismaService) {}
	async getAll(searchTerm?: string) {
		if (searchTerm) this.search(searchTerm)
		return this.prisma.actor.findMany({
			select: returnActorObject,
			orderBy: { createdAt: 'desc' }
		})
	}

	private async search(searchTerm: string) {
		return this.prisma.actor.findMany({
			where: {
				OR: [
					{
						name: { contains: searchTerm, mode: 'insensitive' }
					}
				]
			}
		})
	}
	async getBySlug(slug: string) {
		const actor = await this.prisma.actor.findUnique({
			where: {
				slug
			},
			select: returnActorObject
		})

		if (!actor) throw new NotFoundException('Актер не найден')

		return actor
	}

	//? Запросы для Админа
	async getById(id: string) {
		const Actor = await this.prisma.actor.findUnique({
			where: {
				id
			},
			select: returnActorObject
		})

		if (!Actor) throw new NotFoundException('Актер не найден')

		return Actor
	}

	async create() {
		const Actor = await this.prisma.actor.create({
			data: {
				name: '',
				slug: '',
				photoUrl: ''
			}
		})
		return Actor.id
	}

	async update(id: string, dto: UpdateActorDto) {
		return this.prisma.actor.update({
			where: {
				id
			},
			data: {
				name: dto.name,
				slug: generateSlug(dto.name),
				photoUrl: dto.photoUrl
			}
		})
	}
	async delete(id: string) {
		return this.prisma.actor.delete({
			where: {
				id
			}
		})
	}
}
