import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { ConfigModule } from '@nestjs/config'
import { GenreModule } from './genre/genre.module'
import { ActorModule } from './actor/actor.module'
import { ReviewModule } from './review/review.module'
import { MovieModule } from './movie/movie.module'
import { FileModule } from './file/file.module'
import { StatisticModule } from './statistic/statistic.module'
import { PaymentModule } from './payment/payment.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		AuthModule,
		UserModule,
		GenreModule,
		ActorModule,
		ReviewModule,
		MovieModule,
		FileModule,
		StatisticModule,
		PaymentModule
	]
})
export class AppModule {}
