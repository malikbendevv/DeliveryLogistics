import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DriversModule } from './modules/drivers/drivers.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { OrdersModule } from './modules/orders/orders.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { LocationsModule } from './modules/locations/locations.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaService } from './shared/prisma/prisma.service';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    DriversModule,
    JobsModule,
    OrdersModule,
    NotificationsModule,
    LocationsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
