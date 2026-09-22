import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { AppConfigService, AuthStore, UserSummary } from '@tao/core';

import { Login } from './login';

describe('Login', () => {
  let fixture: ComponentFixture<Login>;
  let http: HttpTestingController;

  beforeEach(() => {
    // A signed-in identity survives a reload, so every test starts from a clean session.
    sessionStorage.clear();
  });

  const recruiter: UserSummary = {
    id: 'recruiter-001',
    organizationId: 'org-001',
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex.morgan@tao.example',
    role: '1',
    status: '1',
  };

  const host = (): HTMLElement => fixture.nativeElement as HTMLElement;

  const typeInto = (selector: string, value: string): void => {
    const input = host().querySelector<HTMLInputElement>(selector);

    expect(input).toBeTruthy();

    input!.value = value;
    input!.dispatchEvent(new Event('input'));
  };

  /**
   * Submits the form and answers the sign-in request the page sends, so the
   * pending promise in the component can settle.
   */
  const submitCredentials = async (username: string, password: string): Promise<void> => {
    typeInto('#tao-login-username', username);
    typeInto('#tao-login-password', password);
    await fixture.whenStable();

    host()
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { cancelable: true }));

    const request = http.expectOne((req) => req.url.endsWith('/api/auth/login'));

    expect(request.request.body).toEqual({ email: username, password });

    request.flush(recruiter);

    await vi.waitFor(() => expect(TestBed.inject(AuthStore).isAuthenticated()).toBe(true));
  };

  const createPage = async (redirectTo?: string) => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        ...(redirectTo
          ? [
              {
                provide: ActivatedRoute,
                useValue: { snapshot: { queryParamMap: convertToParamMap({ redirectTo }) } },
              },
            ]
          : []),
      ],
    }).compileComponents();

    TestBed.inject(AppConfigService).setConfig({ apiUrl: 'https://api.tao.test' });

    http = TestBed.inject(HttpTestingController);

    const navigateByUrl = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);

    fixture = TestBed.createComponent(Login);
    await fixture.whenStable();

    return { navigateByUrl };
  };

  it('renders the acquire login form', async () => {
    await createPage();

    expect(host().querySelector('tao-acquire-login')).toBeTruthy();
  });

  it('signs the user in before navigating to the dashboard', async () => {
    const { navigateByUrl } = await createPage();

    await submitCredentials('alex.morgan', 'secret123');

    const authStore = TestBed.inject(AuthStore);

    expect(authStore.isAuthenticated()).toBe(true);
    expect(authStore.user()?.email).toBe('alex.morgan@tao.example');

    await vi.waitFor(() => expect(navigateByUrl).toHaveBeenCalledWith('/'));
  });

  it('returns to the route requested before the redirect', async () => {
    const { navigateByUrl } = await createPage('/campaigns/123');

    await submitCredentials('alex.morgan', 'secret123');

    await vi.waitFor(() => expect(navigateByUrl).toHaveBeenCalledWith('/campaigns/123'));
  });

  it('ignores a redirect target outside the application', async () => {
    const { navigateByUrl } = await createPage('//evil.example/login');

    await submitCredentials('alex.morgan', 'secret123');

    await vi.waitFor(() => expect(navigateByUrl).toHaveBeenCalledWith('/'));
  });

  it('keeps the user on the login screen and reports a failed request', async () => {
    const { navigateByUrl } = await createPage();

    typeInto('#tao-login-username', 'alex.morgan');
    typeInto('#tao-login-password', 'secret123');
    await fixture.whenStable();

    host()
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { cancelable: true }));

    http
      .expectOne((req) => req.url.endsWith('/api/auth/login'))
      .flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });

    await vi.waitFor(() => expect(TestBed.inject(AuthStore).isAuthenticated()).toBe(false));

    expect(navigateByUrl).not.toHaveBeenCalled();
  });

  it('does not sign in while the form is invalid', async () => {
    const { navigateByUrl } = await createPage();

    typeInto('#tao-login-username', 'ab');
    await fixture.whenStable();

    host()
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { cancelable: true }));

    await fixture.whenStable();

    expect(TestBed.inject(AuthStore).isAuthenticated()).toBe(false);
    expect(http.match((req) => req.url.endsWith('/api/auth/login')).length).toBe(0);
    expect(navigateByUrl).not.toHaveBeenCalled();
  });
});
