import { applyDecorators, UseGuards } from '@nestjs/common'
import { TypeRole } from '../auth.interface'
import { JwtAuthGuard } from '../guards/jwt.guart'
import { OnlyAdminAuthGuard } from '../guards/admin.guard'

export function Auth(role: TypeRole = 'user') {
	return applyDecorators(
		role === 'admin'
			? UseGuards(JwtAuthGuard, OnlyAdminAuthGuard)
			: UseGuards(JwtAuthGuard)
	)
}
