import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MovieModule } from './movie/movie.module';
import { PaymentModule } from './payment/pay.module';
import { User } from './user/entities/user.entity';
import { PaySubscription } from './payment/entities/pay-subscription.entity';
import { SubscriptionModule } from './subscription/subscription.module';
import { MovieSubscription } from './movie-subscription/entities/movie-subscription.entity';
import { Subscription } from './subscription/entities/subscription.entity';
import { Movie } from './movie/entities/movie.entity';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Pay } from './payment/entities/pay.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'test',
      password: 'test',
      database: 'test',
      entities: [
        User,
        Movie,
        Pay,
        PaySubscription,
        Subscription,
        MovieSubscription,
      ],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    MovieModule,
    PaymentModule,
    SubscriptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
