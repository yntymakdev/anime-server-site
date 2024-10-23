import { UserRole } from '@prisma/client'
import {
	IsEmail,
	IsEnum,
	IsOptional,
	IsString,
	MinLength
} from 'class-validator'

export class UpdateUserDto {
	@IsString()
	name: string
	@IsEmail()
	email: string
	@MinLength(6, {
		message: 'Пароль должен содержать не менее 6 символов(правило от YNTY)'
	})
	@IsString()
	password: string

	@IsEnum(UserRole)
	role: UserRole
}
