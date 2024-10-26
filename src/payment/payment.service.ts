import { ConflictException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import * as YooKassa from 'yookassa'
import { PaymentDto } from './dto/payment.dto'
import { AuthModuleOptions } from '@nestjs/passport'
import { config } from 'process'
const yooKassa = new YooKassa({
	shopId: process.env.env['SHOP_ID'],
	secretKey: process.env['PAYMENT_TOKEN']
})
@Injectable()
export class PaymentService {
	constructor(
		private prisma: PrismaService,
		private userService: UserService
	) {}

	async checkout(dto: PaymentDto, userId: string) {
		const user = await this.userService.getById(userId)
		if (user.isHasPremium)
			throw new ConflictException(
				'У пользователя уже есть  активная  премиум-подписка.'
			)
		const order = await this.prisma.payment.create({
			data: {
				status: dto.status,
				amount: dto.amount,
				user: {
					connect: {
						id: userId
					}
				}
			}
		})

		const payment = await yooKassa.createPayment({
			amount: { value: dto.amount.toFixed(2), currency: 'KGS' },
			payment_method_data: {
				type: 'back_card'
			},
			confirmation: {
				type: 'redirect',
				return_url: `${process.env['APP_URL']}/thanks`
			},
			description: `Покупка платной подписки на премиум в Yume | Stories. Id платежа #${order.id}, Id пользователя  #${order.userId}`
		})
		return payment
	}
}
