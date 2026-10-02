import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, inject, signal } from '@angular/core';

export const TAO_THEMES = [
  { name: 'emerald', label: 'Emerald', swatch: '#319667' },
  { name: 'ocean', label: 'Ocean', swatch: '#316896' },
  { name: 'amethyst', label: 'Amethyst', swatch: '#7a3196' },
  { name: 'rose', label: 'Rose', swatch: '#963147' },
] as const;

export type TaoThemeName = (typeof TAO_THEMES)[number]['name'];

const STORAGE_KEY = 'tao-theme';

@Injectable({ providedIn: 'root' })
export class TaoThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  readonly theme = signal<TaoThemeName>(this.readSavedTheme());

  constructor() {
    this.applyTheme(this.theme());

    const view = this.document.defaultView;

    view?.addEventListener('focus', this.syncSavedTheme);
    this.document.addEventListener('visibilitychange', this.syncSavedTheme);

    this.destroyRef.onDestroy(() => {
      view?.removeEventListener('focus', this.syncSavedTheme);
      this.document.removeEventListener('visibilitychange', this.syncSavedTheme);
    });
  }

  setTheme(theme: TaoThemeName): void {
    this.theme.set(theme);
    this.applyTheme(theme);

    try {
      this.document.cookie = `${STORAGE_KEY}=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
      this.document.defaultView?.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // The theme still applies when browser storage is unavailable.
    }
  }

  private readSavedTheme(): TaoThemeName {
    try {
      const cookieTheme = this.document.cookie
        .split(';')
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith(`${STORAGE_KEY}=`))
        ?.slice(STORAGE_KEY.length + 1);
      const savedTheme =
        cookieTheme ?? this.document.defaultView?.localStorage.getItem(STORAGE_KEY);

      if (TAO_THEMES.some((theme) => theme.name === savedTheme)) {
        return savedTheme as TaoThemeName;
      }
    } catch {
      // Use the default when browser storage is unavailable.
    }

    return 'emerald';
  }

  private readonly syncSavedTheme = (): void => {
    const savedTheme = this.readSavedTheme();

    if (savedTheme !== this.theme()) {
      this.theme.set(savedTheme);
      this.applyTheme(savedTheme);
    }
  };

  private applyTheme(themeName: TaoThemeName): void {
    const theme = TAO_THEMES.find((option) => option.name === themeName) ?? TAO_THEMES[0];
    this.document.documentElement.setAttribute('data-tao-theme', theme.name);
  }
}
