/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { Organisation } from './organisation.entity';
import { OrganisationRepository } from './organisation.repository';
import { OrganisationService } from './organisation.service';
import { OrganisationController } from './organisation.controller';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organisation]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [OrganisationController],
  providers: [OrganisationService, OrganisationRepository, JwtStrategy],
  exports: [OrganisationService, OrganisationRepository], // exported so ApiKeyGuard can use it
})
export class OrganisationModule {}
