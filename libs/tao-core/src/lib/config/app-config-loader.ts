import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { AppConfig } from './app-config.model';
import { AppConfigService } from './app-config.service';

/**
 * Application initializer that loads the runtime configuration
 * from `assets/config/app-config.json` before the application starts.
 *
 * Usage:
 *
 *   provideAppInitializer(() => {
 *     const http = inject(HttpClient);
 *     const configService = inject(AppConfigService);
 *
 *     return initializeAppConfig(http, configService)();
 *   });
 *
 * @param configUrl Location of the runtime configuration file.
 *                  Defaults to `assets/config/app-config.json`.
 */
export function initializeAppConfig(
  http: HttpClient,
  configService: AppConfigService,
  configUrl = 'assets/config/app-config.json',
): () => Promise<void> {
  return async (): Promise<void> => {
    const config = await firstValueFrom(http.get<AppConfig>(configUrl));

    configService.setConfig(config);
  };
}
