import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AppConfigService } from '../config/app-config.service';
import { API_RESPONSE_ERROR_NOTIFIER } from './api-response';
import { ApiClientService } from './api-client.service';

describe('ApiClientService', () => {
  const error = vi.fn();
  const success = vi.fn();
  let httpTestingController: HttpTestingController;
  let apiClient: ApiClientService;

  beforeEach(() => {
    error.mockReset();
    success.mockReset();
    TestBed.configureTestingModule({
      providers: [
        ApiClientService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiUrl: 'https://api.test' } },
        { provide: API_RESPONSE_ERROR_NOTIFIER, useValue: { error, success } },
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    apiClient = TestBed.inject(ApiClientService);
  });

  afterEach(() => httpTestingController.verify());

  it('returns the data when the API response succeeds', () => {
    let response: unknown;

    apiClient.get('/resource').subscribe((result) => (response = result));
    httpTestingController.expectOne('https://api.test/resource').flush({
      success: true,
      data: { id: 1 },
      message: 'Loaded',
    });

    expect(error).not.toHaveBeenCalled();
    expect(success).not.toHaveBeenCalled();
    expect(response).toEqual({ id: 1 });
  });

  it('shows the API message as a success toast for a null data response', () => {
    let response: unknown;

    apiClient.get('/resource').subscribe((result) => (response = result));
    httpTestingController.expectOne('https://api.test/resource').flush({
      success: true,
      data: null,
      message: 'Operation completed',
    });

    expect(success).toHaveBeenCalledWith('Operation completed');
    expect(response).toBeNull();
  });

  it('shows the API message and errors the stream when the API response fails', () => {
    let requestError: unknown;

    apiClient.get('/resource').subscribe({ error: (caught) => (requestError = caught) });
    httpTestingController.expectOne('https://api.test/resource').flush({
      success: false,
      message: 'Access denied',
    });

    expect(error).toHaveBeenCalledWith('Access denied');
    expect(success).not.toHaveBeenCalled();
    expect(requestError).toMatchObject({ message: 'Access denied' });
  });

  it('preserves responses that are not API envelopes', () => {
    let response: unknown;

    apiClient.get('/resource').subscribe((result) => (response = result));
    httpTestingController.expectOne('https://api.test/resource').flush({ id: 1 });

    expect(response).toEqual({ id: 1 });
    expect(error).not.toHaveBeenCalled();
    expect(success).not.toHaveBeenCalled();
  });
});
