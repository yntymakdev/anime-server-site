import { Module } from '@nestjs/common'
import { StatisticService } from './statistic.service'
import { StatisticController } from './statistic.controller'
import { PrismaService } from 'src/prisma.service'

@Module({
	controllers: [StatisticController],
	providers: [StatisticService, PrismaService]
})
export class StatisticModule {}
