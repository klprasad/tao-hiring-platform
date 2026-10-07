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
  httpLoadingInterceptor,
  authInterceptor,
  initializeAppConfig,
  ToasterService,
} from '@tao/core';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    ToasterService,
    provideBrowserGlobalErrorListeners(),

    provideAnimationsAsync(),

    provideRouter(routes),

    provideHttpClient(withInterceptors([httpLoadingInterceptor, authInterceptor])),

    provideAppInitializer(() => {
      const http = inject(HttpClient);
      const configService = inject(AppConfigService);

      return initializeAppConfig(http, configService)();
    }),
  ],
};
