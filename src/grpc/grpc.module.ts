import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'USER_GRPC',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'user',
            protoPath: join(__dirname, './protos/user.proto'),
            url: configService.get<string>('USER_GRPC_URL'),
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GrpcModule {}
