import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { PaymentService } from './payment.service'
import { CurrentUser } from 'src/user/decorators/user.decorator'
import { PaymentDto } from './dto/payment.dto'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { PaymentStatus } from '@prisma/client'
import { PaymentStatusDto } from './dto/payment-status.dto'

@Controller('payment')
export class PaymentController {
	constructor(private readonly paymentService: PaymentService) {}
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	checkout(@Body() dto: PaymentDto, @CurrentUser('id') userId: string) {
		return this.paymentService.checkout(dto, userId)
	}

	@HttpCode(200)
	@Post('status')
	async updateStatus(@Body() dto: PaymentStatusDto) {
		return this.paymentService.updateStatus(dto)
	}
	//? Query for Admin

	@Get()
	@Auth('admin')
	async getAll() {
		return this.paymentService.getAll()
	}

	@Delete(':id')
	@Auth('admin')
	async delete(@Param('id') id: string) {
		const deletedPayment = await this.paymentService.delete(id)
		if (!deletedPayment) throw new NotFoundException('Платеж не найден')
		return deletedPayment
	}
}
