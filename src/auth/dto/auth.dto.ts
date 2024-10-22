import { IsOptional, IsString, MinLength } from 'class-validator'

export class AuthDto {
	@IsOptional()
	@IsString()
	name: string
	@IsString()
	email: string
	@MinLength(6, {
		message: 'Пароль должен содержать не менее 6 символов(правило от YNTY)'
	})
	@IsString()
	password: string
}
