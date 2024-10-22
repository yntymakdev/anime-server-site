import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { AuthDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private userService: UserService
	) {}
	async register(dto: AuthDto) {
		const oldUser = await this.userService.getByEmail(dto.email)
		if (oldUser)
			throw new BadRequestException('Пользователь уже существует')
		const user = this.userService.create(dto)
		return {
			user
		}
	}
}
