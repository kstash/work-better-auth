import { Module } from '@nestjs/common';
import {
  OAuthGoogleController,
  OAuthGoogleService,
  GoogleStrategy,
} from './google';
import { GrpcModule } from '../grpc/grpc.module';

@Module({
  imports: [GrpcModule],
  controllers: [OAuthGoogleController],
  providers: [OAuthGoogleService, GoogleStrategy],
})
export class OAuthModule {}
