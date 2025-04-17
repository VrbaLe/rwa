import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/reviews/entities/review.entity';
import { User } from 'src/user/entities/user.entity';
import { Salon } from 'src/salon/entities/salon.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Appointment } from './entities/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment,Review, User, Salon]), AuthModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
    exports: [AppointmentsService]
})
export class AppointmentsModule {}
