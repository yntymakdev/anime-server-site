import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { addAbortListener } from 'events'
import { validateHeaderValue } from 'http'
import { PrismaService } from 'src/prisma.service'
dayjs.locale('ru')

@Injectable()
export class StatisticService {
	constructor(private prisma: PrismaService) {}

	async getMainStatisctics() {
		const countUsers = await this.prisma.user.count()
		const countMovies = await this.prisma.movie.count()
		const countViews = await this.prisma.movie.aggregate({
			_sum: {
				views: true
			}
		})
		const averageRating = await this.prisma.review.aggregate({
			_avg: {
				rating: true
			}
		})

		return [
			{ id: 1, name: 'Просмотры', value: countViews._sum.views },
			{ id: 2, name: 'Фильмы', value: countMovies },
			{ id: 3, name: 'Пользователи', value: countUsers },
			{
				id: 4,
				name: 'Средний рейтинг',
				value: averageRating._avg.rating || 0
			}
		]
	}
}
