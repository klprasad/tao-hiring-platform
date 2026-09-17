import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';

import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { AppConfigService } from './core/config/app-config.service';
import { initializeAppConfig } from './core/config/app-config-loader';
import { httpLoadingInterceptor } from './core/http/http-loading.interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideAnimationsAsync(),

    provideRouter(routes),

    provideHttpClient(withInterceptors([httpLoadingInterceptor])),

    provideAppInitializer(() => {
      const http = inject(HttpClient);
      const configService = inject(AppConfigService);

      return initializeAppConfig(http, configService)();
    }),
  ],
};
