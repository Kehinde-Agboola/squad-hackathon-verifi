import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { OrganisationRepository } from '../../modules/organisations/organisation.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly orgRepository: OrganisationRepository,
  ) {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT secret must be defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: { sub: string; email: string; type: string }) {
    if (payload.type === 'organisation') {
      const org = await this.orgRepository.findById(payload.sub);
      if (!org)
        throw new UnauthorizedException('Organisation no longer exists');
      return org; // attached to req.user
    }
    throw new UnauthorizedException('Invalid token type');
  }
}
