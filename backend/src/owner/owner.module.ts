import { Module } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { OwnerController } from './owner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Salon } from 'src/salon/entities/salon.entity';
import { Owner } from './entities/owner.entity';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { Review } from 'src/reviews/entities/review.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Owner, User, Salon,Review]), UserModule, AuthModule],
  controllers: [OwnerController],
  providers: [OwnerService],
  exports: [OwnerService],
})
export class OwnerModule {}
