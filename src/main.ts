import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import session from 'express-session';
import passport from 'passport';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, ClientGrpc } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const config = app.get(ConfigService);

  // gRPC 클라이언트 초기화
  const grpcClient = ClientsModule.register([
    {
      name: 'USER_PACKAGE',
      transport: 2, // gRPC
      options: {
        url: config.get<string>('USER_GRPC_URL'),
        package: 'user',
        protoPath: 'dist/grpc/protos/user.proto',
      },
    },
  ]);

  // Redis Client
  const redisClient = createClient({
    socket: {
      host: config.get<string>('REDIS_HOST'),
      port: config.get<number>('REDIS_PORT'),
    },
    legacyMode: true,
  });
  await redisClient.connect();

  // Express Session + redis 연결
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: config.get<string>('SESSION_SECRET') as string,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24hours
        httpOnly: true,
        secure: config.get<string>('NODE_ENV') === 'production',
      },
    }),
  );

  // Passport 초기화
  app.use(passport.initialize());
  app.use(passport.session());

  // 서버 실행
  const port = config.get<number>('PORT') as number;
  await app.listen(port);
  console.log(`OAuth Service is running on port ${port}`);
}
bootstrap();
