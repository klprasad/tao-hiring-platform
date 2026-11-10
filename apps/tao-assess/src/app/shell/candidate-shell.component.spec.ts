import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { HttpLoadingService } from '@tao/core';
import { CandidateShellComponent } from './candidate-shell.component';
import { AssessmentSessionStore } from '../core/assessment-session.store';

describe('CandidateShellComponent', () => {
  let fixture: ComponentFixture<CandidateShellComponent>;
  const isLoading = signal(false);

  beforeEach(async () => {
    isLoading.set(false);
    await TestBed.configureTestingModule({
      imports: [CandidateShellComponent],
      providers: [{ provide: HttpLoadingService, useValue: { isLoading } }],
    }).compileComponents();
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
    expect(fixture.componentInstance.focusWarningPending()).toBe(true);

    if (visibilityDescriptor) {
      Object.defineProperty(document, 'visibilityState', visibilityDescriptor);
    } else {
      Reflect.deleteProperty(document, 'visibilityState');
    }
  });
});
