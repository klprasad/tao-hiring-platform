import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { TaoThemeName, TaoThemeService } from './tao-theme.service';
import { TaoThemeSwitcherComponent } from './tao-theme-switcher.component';

describe('TaoThemeSwitcherComponent', () => {
  let fixture: ComponentFixture<TaoThemeSwitcherComponent>;
  const host = (): HTMLElement => fixture.nativeElement as HTMLElement;
  const setTheme = vi.fn();
  const theme = signal<TaoThemeName>('emerald');

  beforeEach(async () => {
    setTheme.mockClear();
    theme.set('emerald');
    await TestBed.configureTestingModule({
      imports: [TaoThemeSwitcherComponent],
      providers: [{ provide: TaoThemeService, useValue: { theme, setTheme } }],
    }).compileComponents();
    fixture = TestBed.createComponent(TaoThemeSwitcherComponent);
    fixture.detectChanges();
  });

  it('renders a selected state for the active palette', () => {
    expect(host().querySelector('[aria-pressed="true"]')).toBeTruthy();
    expect(host().querySelectorAll('.theme-picker__swatch').length).toBeGreaterThan(1);
  });

  it('selects the palette named by the activated swatch', () => {
    const button = host().querySelector<HTMLButtonElement>('button[aria-label="Ocean theme"]');
    expect(button).toBeTruthy();

    button!.click();

    expect(setTheme).toHaveBeenCalledWith('ocean');
  });
});
