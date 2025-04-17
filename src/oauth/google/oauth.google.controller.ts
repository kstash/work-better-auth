import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { OAuthGoogleService } from './oauth.google.service';

@Controller('oauth')
export class OAuthGoogleController {
  constructor(private readonly oauthService: OAuthGoogleService) {}

  // Google 로그인 페이지로 리다이렉트
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // Passport가 자동으로 Google 로그인 페이지로 리다이렉트
  }

  // Google 로그인 콜백
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request) {
    return this.oauthService.handleGoogleCallback(req);
  }
}
