import { Component, computed, input, output, signal } from '@angular/core';
import {
  FormField,
  ReadonlyFieldState,
  form,
  maxLength,
  minLength,
  pattern,
  required,
  submit,
} from '@angular/forms/signals';

/**
 * Credentials captured by the acquire login form.
 */
export interface LoginCredentials {
  /** Recruiter user name, which may be an email address. */
  username: string;

  /** Recruiter password. */
  password: string;
}

interface LoginModel {
  username: string;
  password: string;
}

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 64;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

/**
 * Accepted user names: a plain user name (letters, numbers, dots, dashes and
 * underscores) or an email address, so recruiters can sign in with either.
 */
const USERNAME_PATTERN = /^[A-Za-z0-9._-]+(@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+)?$/;

/**
 * Recruiter sign-in form.
 *
 * The component owns the form model and its validation rules and emits
 * validated credentials through `login`. Authentication itself (calling the
 * API, storing the session) stays with the consuming application, which can
 * drive the form's busy state through `submitting` and report failures through
 * `errorMessage`.
 *
 * The user name accepts either a plain user name (`firstname.lastname`) or an
 * email address.
 *
 * Example:
 *
 *   <tao-acquire-login
 *     [submitting]="isSubmitting()"
 *     [errorMessage]="loginError()"
 *     (login)="onLogin($event)"
 *   />
 */
@Component({
  selector: 'tao-acquire-login',
  imports: [FormField],
  styleUrl: './tao-acquire-login.component.scss',
  templateUrl: './tao-acquire-login.component.html',
})
export class TaoAcquireLoginComponent {
  /** Heading displayed above the form. */
  readonly heading = input('Sign in');

  /** Supporting text displayed below the heading. */
  readonly description = input('Use your recruiter account to continue.');

  /** Whether a login request is currently running outside this component. */
  readonly submitting = input(false);

  /** Message describing the last failed login attempt, if any. */
  readonly errorMessage = input<string | null>(null);

  /** Emits validated credentials when the form is submitted. */
  readonly login = output<LoginCredentials>();

  private readonly model = signal<LoginModel>({ username: '', password: '' });

  /** Signal form tree bound by the template. */
  protected readonly loginForm = form(this.model, (path) => {
    required(path.username, { message: 'User name is required.' });

    minLength(path.username, USERNAME_MIN_LENGTH, {
      message: `User name must be at least ${USERNAME_MIN_LENGTH} characters long.`,
    });

    maxLength(path.username, USERNAME_MAX_LENGTH, {
      message: `User name must be at most ${USERNAME_MAX_LENGTH} characters long.`,
    });

    pattern(path.username, USERNAME_PATTERN, {
      message: 'Use letters, numbers, dots, dashes, underscores or a valid email address.',
    });

    required(path.password, { message: 'Password is required.' });

    minLength(path.password, PASSWORD_MIN_LENGTH, {
      message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`,
    });

    maxLength(path.password, PASSWORD_MAX_LENGTH, {
      message: `Password must be at most ${PASSWORD_MAX_LENGTH} characters long.`,
    });
  });

  private readonly submitted = signal(false);

  /** Whether a login is currently running. */
  protected readonly isBusy = computed(() => this.submitting() || this.loginForm().submitting());

  /** Whether the submit action is currently allowed. */
  protected readonly canSubmit = computed(() => this.loginForm().valid() && !this.isBusy());

  protected readonly usernameErrors = computed(() =>
    this.validationMessages(this.loginForm.username()),
  );

  protected readonly passwordErrors = computed(() =>
    this.validationMessages(this.loginForm.password()),
  );

  protected readonly showUsernameErrors = computed(() =>
    this.shouldShowErrors(this.loginForm.username()),
  );

  protected readonly showPasswordErrors = computed(() =>
    this.shouldShowErrors(this.loginForm.password()),
  );

  /**
   * Removes surrounding whitespace from the user name once the field loses
   * focus, so values pasted with trailing spaces still validate.
   */
  protected normalizeUsername(): void {
    const username = this.loginForm.username();
    const trimmed = username.value().trim();

    if (trimmed !== username.value()) {
      username.value.set(trimmed);
    }
  }

  /**
   * Submits the form once it is valid.
   *
   * `submit()` only runs the callback for a valid form and keeps the form's
   * submission state in sync. Submissions are ignored while a login is already
   * running.
   */
  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    if (this.isBusy()) {
      return;
    }

    this.submitted.set(true);

    await submit(this.loginForm, async () => {
      const { username, password } = this.model();

      this.login.emit({ username: username.trim(), password });
    });
  }

  private validationMessages(state: ReadonlyFieldState<string>): readonly string[] {
    return state.errors().map((error) => error.message ?? 'This value is not valid.');
  }

  private shouldShowErrors(state: ReadonlyFieldState<string>): boolean {
    return (this.submitted() || state.touched()) && state.invalid();
  }
}
