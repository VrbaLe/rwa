import { Module } from '@nestjs/common';
import { SalonService } from './salon.service';
import { SalonController } from './salon.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Salon } from './entities/salon.entity';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
 // imports:[TypeOrmModule.forFeature([Salon, User]), UserModule, AuthModule],
  controllers: [SalonController],
  providers: [SalonService],
  //exports:[SalonService],   
})
export class SalonModule {}
