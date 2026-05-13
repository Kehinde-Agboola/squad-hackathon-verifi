import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { OrganisationService } from '../../modules/organisations/organisation.service';
import { OrgStatus } from 'src/modules/organisations/organisation.entity';

type ApiKeyRequest = Request & { organisation?: any };

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly orgService: OrganisationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<ApiKeyRequest>();
    const apiKeyHeader = request.headers['x-api-key'];
    const apiKey = Array.isArray(apiKeyHeader) ? apiKeyHeader[0] : apiKeyHeader;

    if (!apiKey) {
      throw new UnauthorizedException(
        'API key is required. Pass it as x-api-key header.',
      );
    }

    const org = await this.orgService.validateApiKey(apiKey);
    if (!org) {
      throw new UnauthorizedException('Invalid API key');
    }

    if (org.status === OrgStatus.SUSPENDED) {
      throw new UnauthorizedException('This organisation account is suspended');
    }

    // Attach org to request so controllers can access it
    request.organisation = org;
    return true;
  }
}
