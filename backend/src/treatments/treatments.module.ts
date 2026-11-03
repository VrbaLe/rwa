import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Salon } from 'src/salon/entities/salon.entity';
import { Treatment } from './entities/treatment.entity';
import { TreatmentsService } from './treatments.service';
import { TreatmentsController } from './treatments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Treatment, Salon]), AuthModule],
  controllers: [TreatmentsController],
  providers: [TreatmentsService],
})
export class TreatmentsModule {}
