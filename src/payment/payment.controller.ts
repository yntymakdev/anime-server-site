import {
	Body,
	Controller,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { PaymentService } from './payment.service'
import { CurrentUser } from 'src/user/decorators/user.decorator'
import { PaymentDto } from './dto/payment.dto'
import { Auth } from 'src/auth/decorators/auth.decorator'

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
}
