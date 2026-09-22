import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCredentials, TaoAcquireLoginComponent } from './tao-acquire-login.component';

describe('TaoAcquireLoginComponent', () => {
  let fixture: ComponentFixture<TaoAcquireLoginComponent>;
  let component: TaoAcquireLoginComponent;
  let emitted: LoginCredentials[];

  const host = (): HTMLElement => fixture.nativeElement as HTMLElement;

  /**
   * Sets the value of a bound input and notifies Angular
   * through a native input event.
   */
  const typeInto = (selector: string, value: string): void => {
    const input = host().querySelector<HTMLInputElement>(selector);

    expect(input).toBeTruthy();

    input!.value = value;
    input!.dispatchEvent(new Event('input'));
  };

  const blur = (selector: string): void => {
    host().querySelector(selector)?.dispatchEvent(new Event('blur'));
  };

  const submitForm = async (): Promise<void> => {
    const form = host().querySelector('form');

    form!.dispatchEvent(new Event('submit', { cancelable: true }));

    await fixture.whenStable();
  };

  const submitButton = (): HTMLButtonElement =>
    host().querySelector<HTMLButtonElement>('button[type="submit"]')!;

  const errorText = (selector: string): string => host().querySelector(selector)?.textContent ?? '';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaoAcquireLoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaoAcquireLoginComponent);
    component = fixture.componentInstance;

    emitted = [];
    component.login.subscribe((credentials) => emitted.push(credentials));

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable the submit button while the form is invalid', () => {
    expect(submitButton().disabled).toBe(true);
  });

  it('should not emit credentials when the form is invalid', async () => {
    await submitForm();

    expect(emitted).toEqual([]);
  });

  it('should report validation errors after an invalid submission', async () => {
    typeInto('#tao-login-username', 'ab');
    await submitForm();

    expect(errorText('#tao-login-username-errors')).toContain(
      'User name must be at least 3 characters long.',
    );
    expect(errorText('#tao-login-password-errors')).toContain('Password is required.');
  });

  it('should reject a user name with unsupported characters', async () => {
    typeInto('#tao-login-username', 'alex morgan');
    typeInto('#tao-login-password', 'secret123');
    await submitForm();

    expect(emitted).toEqual([]);
    expect(errorText('#tao-login-username-errors')).toContain(
      'Use letters, numbers, dots, dashes, underscores or a valid email address.',
    );
  });

  it('should accept an email address as the user name', async () => {
    typeInto('#tao-login-username', 'alex.morgan@tao.example');
    typeInto('#tao-login-password', 'secret123');
    await fixture.whenStable();

    expect(submitButton().disabled).toBe(false);

    await submitForm();

    expect(emitted).toEqual([{ username: 'alex.morgan@tao.example', password: 'secret123' }]);
  });

  it('should reject an email address without a domain suffix', async () => {
    typeInto('#tao-login-username', 'alex.morgan@tao');
    typeInto('#tao-login-password', 'secret123');
    await submitForm();

    expect(emitted).toEqual([]);
    expect(errorText('#tao-login-username-errors')).toContain(
      'Use letters, numbers, dots, dashes, underscores or a valid email address.',
    );
  });

  it('should reject a password shorter than the minimum length', async () => {
    typeInto('#tao-login-username', 'alex.morgan');
    typeInto('#tao-login-password', 'short');
    await submitForm();

    expect(emitted).toEqual([]);
    expect(errorText('#tao-login-password-errors')).toContain(
      'Password must be at least 8 characters long.',
    );
  });

  it('should emit credentials for a valid form', async () => {
    typeInto('#tao-login-username', 'alex.morgan');
    typeInto('#tao-login-password', 'secret123');
    await fixture.whenStable();

    expect(submitButton().disabled).toBe(false);

    await submitForm();

    expect(emitted).toEqual([{ username: 'alex.morgan', password: 'secret123' }]);
  });

  it('should ignore surrounding whitespace in the user name', async () => {
    typeInto('#tao-login-username', '  alex.morgan  ');
    typeInto('#tao-login-password', 'secret123');

    blur('#tao-login-username');
    await fixture.whenStable();

    expect(host().querySelector<HTMLInputElement>('#tao-login-username')?.value).toBe(
      'alex.morgan',
    );
    expect(submitButton().disabled).toBe(false);

    await submitForm();

    expect(emitted).toEqual([{ username: 'alex.morgan', password: 'secret123' }]);
  });

  it('should expose the form validation state to the template', async () => {
    typeInto('#tao-login-username', 'alex.morgan');
    typeInto('#tao-login-password', 'secret123');
    await fixture.whenStable();

    expect(host().querySelector('#tao-login-username')?.getAttribute('aria-invalid')).toBe('false');
  });

  it('should display the supplied error message', async () => {
    fixture.componentRef.setInput('errorMessage', 'Invalid user name or password.');
    await fixture.whenStable();

    expect(errorText('[role="alert"]')).toContain('Invalid user name or password.');
  });

  it('should block submission while a login request is running', async () => {
    typeInto('#tao-login-username', 'alex.morgan');
    typeInto('#tao-login-password', 'secret123');

    fixture.componentRef.setInput('submitting', true);
    await fixture.whenStable();

    expect(submitButton().disabled).toBe(true);
    expect(submitButton().textContent).toContain('Signing in');

    await submitForm();

    expect(emitted).toEqual([]);
  });
});
