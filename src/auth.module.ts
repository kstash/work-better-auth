import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { OAuthModule } from './oauth';
import { GrpcModule } from './grpc/grpc.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PassportModule.register({
      session: true,
      defaultStrategy: 'google',
    }),
    OAuthModule,
    GrpcModule,
  ],
})
export class AuthModule {}
