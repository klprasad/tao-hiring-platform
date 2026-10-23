import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { HttpLoadingService } from '@tao/core';
import { CandidateShellComponent } from './candidate-shell.component';

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
});
