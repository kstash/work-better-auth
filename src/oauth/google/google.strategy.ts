import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') as string,
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') as string,
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') as string,
      scope: ['profile', 'email'],
      passReqToCallback: true,
    });
  }

  validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Function,
  ) {
    console.log('Request:', req);
    console.log('Access Token:', accessToken);
    console.log('Profile:', profile);

    const user = {
      id: profile?.id,
      email: profile?.emails?.[0]?.value,
      name: profile?.displayName,
      photo: profile?.photos?.[0]?.value,
    };

    console.log('Created user:', user);
    done(null, user); // 인증 성공 시 사용자 정보를 반환
  }
}
