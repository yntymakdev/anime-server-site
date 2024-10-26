import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import * as YooKassa from 'yookassa'
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

	async checkout() {}
}
