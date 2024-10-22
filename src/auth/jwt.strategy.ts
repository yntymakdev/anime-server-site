import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Passport } from 'passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserService } from 'src/user/user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private configService: ConfigService,
		private userService: UserService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: true,
			secretOrkey: configService.get('JWT_SECRET')
		})
	}

	async validate({ id }: { id: string }) {
		return this.userService.getById(id)
	}
}
