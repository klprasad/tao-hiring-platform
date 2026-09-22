import { Injectable, computed, signal } from '@angular/core';

/**
 * Tracks the number of in-flight HTTP requests so the shell can
 * display a single, application-wide loading indicator.
 */
@Injectable({
  providedIn: 'root',
})
export class HttpLoadingService {
  private readonly activeRequests = signal(0);

  readonly isLoading = computed(() => this.activeRequests() > 0);

  start(): void {
    this.activeRequests.update((count) => count + 1);
  }

  stop(): void {
    this.activeRequests.update((count) => Math.max(0, count - 1));
  }

  reset(): void {
    this.activeRequests.set(0);
  }
}
