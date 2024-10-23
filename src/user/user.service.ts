import { Injectable, Search } from '@nestjs/common'
import { hash } from 'argon2'
import { AuthDto } from 'src/auth/dto/auth.dto'
import { PrismaService } from 'src/prisma.service'
import { returnUserObject } from './decorators/return-user.object'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}
	async getById(id: string) {
		return this.prisma.user.findUnique({
			where: {
				id
			},
			include: {
				favorites: true
			}
		})
	}
	async getByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: {
				email
			},
			include: {
				favorites: true
			}
		})
	}
	async create(dto: AuthDto) {
		const user = {
			name: dto.name,
			email: dto.email,
			password: await hash(dto.password)
		}
		return this.prisma.user.create({
			data: user
		})
	}
	async toggleFavorite(movieId: string, userId: string) {
		const user = await this.getById(userId)
		const isExists = user.favorites.some(movie => movie.id === movieId)
		await this.prisma.user.update({
			where: { id: userId },
			data: {
				favorites: {
					set: isExists
						? user.favorites.filter(movie => movie.id === movieId)
						: [...user.favorites, { id: movieId }]
				}
			}
		})
	}
	//? Запросы для Админа !
	async getAll(searchTerm?: string) {
		if (searchTerm) this.search(searchTerm)
		return this.prisma.user.findMany({
			select: returnUserObject,
			orderBy: { createdAt: 'desc' }
		})
	}

	private async search(searchTerm: string) {
		return this.prisma.user.findMany({
			where: {
				OR: [
					{
						name: { contains: searchTerm, mode: 'insensitive' },
						email: { contains: searchTerm, mode: 'insensitive' }
					}
				]
			}
		})
	}
	async update(id: string, dto: UpdateUserDto) {
		return this.prisma.user.update({
			where: {
				id
			},
			data: dto
		})
	}

	async delete(id: string) {
		return this.prisma.user.delete({
			where: {
				id
			}
		})
	}
}
