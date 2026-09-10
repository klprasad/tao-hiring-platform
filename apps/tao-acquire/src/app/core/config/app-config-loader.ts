import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { AppConfig } from './app-config.model';
import { AppConfigService } from './app-config.service';

export function initializeAppConfig(
  http: HttpClient,
  configService: AppConfigService,
): () => Promise<void> {
  return async (): Promise<void> => {
    const config = await firstValueFrom(http.get<AppConfig>('assets/config/app-config.json'));

    configService.setConfig(config);
  };
}
