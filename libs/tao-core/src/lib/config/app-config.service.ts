import { Injectable, signal } from '@angular/core';

import { AppConfig } from './app-config.model';

/**
 * Holds the runtime application configuration.
 *
 * The configuration is loaded once during application bootstrap
 * (see `initializeAppConfig`) and is shared by every feature that
 * needs infrastructure values such as the API base URL.
 */
@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private readonly config = signal<AppConfig | null>(null);

  setConfig(config: AppConfig): void {
    this.validateConfig(config);

    this.config.set(config);
  }

  get apiUrl(): string {
    const config = this.config();

    if (!config) {
      throw new Error('Application configuration has not been loaded.');
    }

    return config.apiUrl;
  }

  get allowCopyPaste(): boolean {
    return this.config()?.allowCopyPaste ?? false;
  }

  get maxAllowedWindowLeavePopups(): number {
    return Math.max(0, this.config()?.maxAllowedWindowLeavePopups ?? 2);
  }

  get value(): AppConfig {
    const config = this.config();

    if (!config) {
      throw new Error('Application configuration has not been loaded.');
    }

    return config;
  }

  private validateConfig(config: AppConfig): void {
    if (!config?.apiUrl) {
      throw new Error('Application configuration is invalid: apiUrl is required.');
    }

    try {
      new URL(config.apiUrl);
    } catch {
      throw new Error(`Invalid API URL: ${config.apiUrl}`);
    }
  }
}
