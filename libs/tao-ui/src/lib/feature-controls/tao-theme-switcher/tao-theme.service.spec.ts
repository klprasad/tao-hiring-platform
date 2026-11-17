import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { TaoThemeService } from './tao-theme.service';

describe('TaoThemeService', () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
        removeItem: (key: string) => storage.delete(key),
        clear: () => storage.clear(),
      },
    });
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

    service.setTheme('indigo');

    expect(document.documentElement.getAttribute('data-tao-theme')).toBe('indigo');

    service.setTheme('emerald');

    expect(document.documentElement.getAttribute('data-tao-theme')).toBe('emerald');
    expect(service.theme()).toBe('emerald');
  });

  it('uses Indigo when no supported theme has been saved', () => {
    localStorage.setItem('tao-theme', 'rose');

    const service = TestBed.inject(TaoThemeService);

    expect(service.theme()).toBe('indigo');
    expect(document.documentElement.getAttribute('data-tao-theme')).toBe('indigo');
  });

  it('persists the selected palette', () => {
    const service = TestBed.inject(TaoThemeService);

    service.setTheme('indigo');

    expect(localStorage.getItem('tao-theme')).toBe('indigo');
    expect(document.cookie).toContain('tao-theme=indigo');
  });

  it('restores a previously selected palette on initialization', () => {
    localStorage.setItem('tao-theme', 'indigo');

    const service = TestBed.inject(TaoThemeService);

    expect(service.theme()).toBe('indigo');
    expect(document.documentElement.getAttribute('data-tao-theme')).toBe('indigo');
  });

  it('prefers the shared cookie over app-specific storage', () => {
    localStorage.setItem('tao-theme', 'emerald');
    document.cookie = 'tao-theme=indigo; Path=/; SameSite=Lax';

    const service = TestBed.inject(TaoThemeService);

    expect(service.theme()).toBe('indigo');
  });
});
