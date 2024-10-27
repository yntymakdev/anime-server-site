import { Controller, Get } from '@nestjs/common'
import { StatisticService } from './statistic.service'
import { Auth } from 'src/auth/decorators/auth.decorator'

@Controller('statistics')
export class StatisticController {
	constructor(private readonly statisticService: StatisticService) {}
	@Get('main')
	@Auth('admin')
	async getMainStatisctic() {
		return this.statisticService.getMainStatisctics()
	}
	@Get('middle')
	@Auth('admin')
	async getMiddleStatistics() {
		return this.statisticService.getMiddleStatistics()
	}
}
