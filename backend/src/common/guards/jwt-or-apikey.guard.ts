/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OrganisationRepository } from '../../modules/organisations/organisation.repository';

@Injectable()
export class JwtOrApiKeyGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly orgRepository: OrganisationRepository,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // ── Try API Key first ──────────────────────────────────────
    const apiKey = request.headers['x-api-key'];
    if (apiKey) {
      const org = await this.orgRepository.findByApiKey(apiKey);
      if (!org) throw new UnauthorizedException('Invalid API key');
      if (org.status === 'suspended') {
        throw new UnauthorizedException('Organisation account is suspended');
      }
      // Attach org — same shape for both auth methods
      request.organisation = org;
      request.user = org;
      return true;
    }

    // ── Try Bearer JWT ─────────────────────────────────────────
    const authHeader = request.headers['authorization'];
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payload = this.jwtService.verify(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });
        const org = await this.orgRepository.findById(payload.sub);
        if (!org) throw new UnauthorizedException('Organisation not found');
        if (org.status === 'suspended') {
          throw new UnauthorizedException('Organisation account is suspended');
        }
        request.organisation = org;
        request.user = org;
        return true;
      } catch {
        throw new UnauthorizedException('Invalid or expired token');
      }
    }

    // ── Neither provided ───────────────────────────────────────
    throw new UnauthorizedException(
      'Authentication required. Provide a Bearer token or x-api-key header',
    );
  }
}
