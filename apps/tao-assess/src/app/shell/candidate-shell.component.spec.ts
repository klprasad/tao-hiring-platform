import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { AppConfigService, HttpLoadingService } from '@tao/core';
import { vi } from 'vitest';
import { CandidateShellComponent } from './candidate-shell.component';
import { AssessmentNavigationService } from '../core/assessment-navigation.service';
import { AssessmentSessionStore } from '../core/assessment-session.store';

describe('CandidateShellComponent', () => {
  let fixture: ComponentFixture<CandidateShellComponent>;
  const isLoading = signal(false);
  const submitted = vi.fn();

  beforeEach(async () => {
    isLoading.set(false);
    submitted.mockReset();
    await TestBed.configureTestingModule({
      imports: [CandidateShellComponent],
      providers: [
        { provide: HttpLoadingService, useValue: { isLoading } },
        { provide: AssessmentNavigationService, useValue: { submitted } },
      ],
    }).compileComponents();
    TestBed.inject(AppConfigService).setConfig({
      apiUrl: 'https://localhost:44329',
      maxAllowedWindowLeavePopups: 2,
    });
    fixture = TestBed.createComponent(CandidateShellComponent);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('reflects the shared HTTP loading state', () => {
    expect(fixture.componentInstance.loading()).toBe(false);
    isLoading.set(true);
    expect(fixture.componentInstance.loading()).toBe(true);
  });

  it('renders the route outlet and theme switcher', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('router-outlet')).toBeTruthy();
    expect(host.querySelector('tao-theme-switcher')).toBeTruthy();
  });

  it('does not warn about focus loss before the assessment starts', () => {
    window.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alertdialog"]')).toBeNull();
  });

  it('shows a dismissible warning when an active assessment regains window focus', () => {
    TestBed.inject(AssessmentSessionStore).started.set(true);

    window.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(fixture.componentInstance.focusWarningPending()).toBe(true);
    expect(host.querySelector('[role="alertdialog"]')).toBeNull();

    window.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    expect(host.querySelector('[role="alertdialog"]')).toBeTruthy();
    expect(host.querySelector('#focus-warning-description')?.textContent).toContain(
      'leave the assessment window up to 2 times',
    );
    expect(host.querySelector('#focus-warning-description')?.textContent).toContain(
      'submitted automatically',
    );
    host.querySelector<HTMLButtonElement>('[role="alertdialog"] button')?.click();
    fixture.detectChanges();
    expect(host.querySelector('[role="alertdialog"]')).toBeNull();
    expect(fixture.componentInstance.focusWarningPending()).toBe(false);
  });

  it('shows a warning when an active assessment tab becomes hidden', () => {
    const visibilityDescriptor = Object.getOwnPropertyDescriptor(document, 'visibilityState');
    TestBed.inject(AssessmentSessionStore).started.set(true);
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });

    document.dispatchEvent(new Event('visibilitychange'));
    fixture.detectChanges();
    expect(fixture.componentInstance.focusWarningPending()).toBe(true);
    expect(fixture.nativeElement.querySelector('[role="alertdialog"]')).toBeNull();

    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
    document.dispatchEvent(new Event('visibilitychange'));
    window.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('[role="alertdialog"]')).toHaveLength(1);
    expect(fixture.componentInstance.focusWarningPending()).toBe(false);

    if (visibilityDescriptor) {
      Object.defineProperty(document, 'visibilityState', visibilityDescriptor);
    } else {
      Reflect.deleteProperty(document, 'visibilityState');
    }
  });

  it('submits the assessment after more focus-loss popups than configured', () => {
    const store = TestBed.inject(AssessmentSessionStore);
    store.started.set(true);
    const component = fixture.componentInstance;

    for (let count = 0; count < 2; count += 1) {
      window.dispatchEvent(new Event('blur'));
      window.dispatchEvent(new Event('focus'));
      fixture.detectChanges();
      expect(component.focusWarningCount()).toBe(count + 1);
      const host = fixture.nativeElement as HTMLElement;
      host.querySelector<HTMLButtonElement>('[role="alertdialog"] button')?.click();
      fixture.detectChanges();
    }

    window.dispatchEvent(new Event('blur'));
    window.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    expect(component.focusWarningCount()).toBe(3);
    expect(store.submitted()).toBe(true);
    expect(submitted).toHaveBeenCalledOnce();
    expect(fixture.nativeElement.querySelector('[role="alertdialog"]')).toBeNull();
  });
});
