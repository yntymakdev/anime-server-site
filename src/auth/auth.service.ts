import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { AuthDto } from './dto/auth.dto'
import { JwtService } from '@nestjs/jwt'
import { verify } from 'argon2'

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwt: JwtService
	) {}
	async register(dto: AuthDto) {
		const oldUser = await this.userService.getByEmail(dto.email)
		if (oldUser)
			throw new BadRequestException('Пользователь уже существует')
		const user = await this.userService.create(dto)
		const tokens = this.issueTokens(user.id)
		return {
			user,
			...tokens
		}
	}
	async login(dto: AuthDto) {
		const user = await this.validateUser(dto)
		const tokens = this.issueTokens(user.id)
		return {
			user,
			...tokens
		}
	}
	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verify(refreshToken)
		if (!result)
			throw new UnauthorizedException('Не валидный refresh token токен')
		const user = await this.userService.getById(result.id)
		const tokens = this.issueTokens(user.id)
		return {
			user,
			...tokens
		}
	}
	private issueTokens(userId: string) {
		const data = { id: userId }
		const accesToken = this.jwt.sign(data, {
			expiresIn: '1h'
		})
		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d'
		})
		return { accesToken, refreshToken }
	}
	private async validateUser(dto: AuthDto) {
		const user = await this.userService.getByEmail(dto.email)
		if (!user) throw new NotFoundException('Пользователь не найден')
		const isValidPassword = await verify(user.password, dto.password)
		if (!isValidPassword)
			throw new UnauthorizedException('Неверный пароль ')
		return user
	}
}
