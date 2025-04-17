import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Request } from 'express';

import {
  UserLookupServiceClient,
  CheckUserExistsResponse,
} from './types/user.interface';
import { firstValueFrom } from 'rxjs';
import { OAuthPayload } from '@work-better/core';

@Injectable()
export class OAuthGoogleService implements OnModuleInit {
  private userService: UserLookupServiceClient;

  constructor(
    @Inject('USER_GRPC')
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userService =
      this.client.getService<UserLookupServiceClient>('UserService');
  }

  async isUserExists(email: string): Promise<boolean> {
    const response = await firstValueFrom(
      this.userService.checkUserExists({ email }),
    );
    return response.exists;
  }

  async handleGoogleCallback(req: Request) {
    // 1. 구글 프로필 정보 가져오기
    const user = req.user as OAuthPayload;

    // 2. user-service 에 사용자 존재 확인 요청 (gRPC 또는 REST)
    const { exists } = await firstValueFrom(
      this.userService.checkUserExists({
        email: user.email,
      }),
    );

    if (exists) {
      // 3. Redis 세션에 사용자 정보 저장 (passport + session이 처리함)
      (req.session as any).user = user;
      return { message: '로그인 성공', user };
    } else {
      // 4. 회원가입 유도
      return { message: '회원가입 필요', user };
    }
  }
}
