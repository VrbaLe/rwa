import { Module } from '@nestjs/common';
import { SalonService } from './salon.service';
import { SalonController } from './salon.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Salon } from './entities/salon.entity';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { Owner } from 'src/owner/entities/owner.entity';
import { OwnerModule } from 'src/owner/owner.module';

@Module({
  imports:[TypeOrmModule.forFeature([Salon, Owner]), OwnerModule, AuthModule],
  controllers: [SalonController],
  providers: [SalonService],
})
export class SalonModule {}
