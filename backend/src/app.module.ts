import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
//import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule} from './auth/auth.module';
import { RolesGuard } from './auth/guards/roles.guard';
import { SalonModule } from './salon/salon.module';
import { OwnerModule } from './owner/owner.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USERNAME'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DATABASE'),
        entities: [User],
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([User]),
    UserModule,
    AuthModule,
    SalonModule,
    OwnerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
