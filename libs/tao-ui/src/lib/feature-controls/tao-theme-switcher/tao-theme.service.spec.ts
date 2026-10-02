import { TestBed } from '@angular/core/testing';

import { TaoThemeService } from './tao-theme.service';

describe('TaoThemeService', () => {
  beforeEach(() => {
    document.cookie = 'tao-theme=; Path=/; Max-Age=0; SameSite=Lax';
    localStorage.removeItem('tao-theme');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    document.documentElement.removeAttribute('data-tao-theme');
    document.cookie = 'tao-theme=; Path=/; Max-Age=0; SameSite=Lax';
    localStorage.removeItem('tao-theme');
  });

  it('selects a CSS theme and restores the Emerald palette', () => {
    const service = TestBed.inject(TaoThemeService);

    service.setTheme('ocean');

    expect(document.documentElement.getAttribute('data-tao-theme')).toBe('ocean');

    service.setTheme('emerald');

    expect(document.documentElement.getAttribute('data-tao-theme')).toBe('emerald');
    expect(service.theme()).toBe('emerald');
  });

  it('persists the selected palette', () => {
    const service = TestBed.inject(TaoThemeService);

    service.setTheme('amethyst');

    expect(localStorage.getItem('tao-theme')).toBe('amethyst');
    expect(document.cookie).toContain('tao-theme=amethyst');
  });

  it('restores a previously selected palette on initialization', () => {
    localStorage.setItem('tao-theme', 'rose');

    const service = TestBed.inject(TaoThemeService);

    expect(service.theme()).toBe('rose');
    expect(document.documentElement.getAttribute('data-tao-theme')).toBe('rose');
  });

  it('prefers the shared cookie over app-specific storage', () => {
    localStorage.setItem('tao-theme', 'emerald');
    document.cookie = 'tao-theme=ocean; Path=/; SameSite=Lax';

    const service = TestBed.inject(TaoThemeService);

    expect(service.theme()).toBe('ocean');
  });
});
