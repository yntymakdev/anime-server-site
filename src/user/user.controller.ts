import {
	Body,
	Controller,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { UserService } from './user.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from './decorators/user.decorator'
import { ValidationTypes } from 'class-validator'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}
	@Get('profile')
	@Auth()
	async getProfile(@CurrentUser('id') id: string) {
		return this.userService.getById(id)
	}

	@Post('profile/favorites')
	@HttpCode(200)
	@Auth()
	async toggleFavorite(
		@Body('movieId') movieId: string,
		@CurrentUser('id') userId: string
	) {
		return this.userService.toggleFavorite(movieId, userId)
	}

	//? Запросы для Админа !

	@Get()
	@Auth('admin')
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.userService.getAll(searchTerm)
	}
	@Get('by-id/:id')
	@Auth('admin')
	async getById(@Param('id') id: string) {
		return this.userService.getById(id)
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
		const updatedUser = await this.userService.update(id, dto)
		if (!updatedUser)
			throw new NotFoundException(
				'К сожалению пользователь не найден, быть может вы имели виду другое название ?'
			)
		return updatedUser
	}
}
