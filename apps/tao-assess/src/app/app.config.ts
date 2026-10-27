import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';

import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideRouter } from '@angular/router';

import {
  AppConfigService,
  API_RESPONSE_ERROR_NOTIFIER,
  authInterceptor,
  httpLoadingInterceptor,
  initializeAppConfig,
} from '@tao/core';
import { ToasterService } from '@tao/ui';

import { routes } from './app.routes';
import { AuthService } from './core/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    ToasterService,
    { provide: API_RESPONSE_ERROR_NOTIFIER, useExisting: ToasterService },
    provideBrowserGlobalErrorListeners(),

    provideAnimationsAsync(),

    provideRouter(routes),

    provideHttpClient(withInterceptors([httpLoadingInterceptor, authInterceptor])),

    provideAppInitializer(() => {
      const http = inject(HttpClient);
      const configService = inject(AppConfigService);
      const authService = inject(AuthService);

      return (async () => {
        await initializeAppConfig(http, configService)();
        await authService.restoreSession();
      })();
    }),
  ],
};
