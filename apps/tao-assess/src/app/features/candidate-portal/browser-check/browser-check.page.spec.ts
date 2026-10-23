import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';
import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { BrowserCheckPage } from './browser-check.page';

describe('BrowserCheckPage', () => {
  let fixture: ComponentFixture<BrowserCheckPage>;
  const markBrowserReady = vi.fn();
  const consent = vi.fn();
  const landing = vi.fn();

  beforeEach(async () => {
    markBrowserReady.mockClear();
    consent.mockClear();
    landing.mockClear();
    await TestBed.configureTestingModule({
      imports: [BrowserCheckPage],
      providers: [
        { provide: AssessmentSessionStore, useValue: { markBrowserReady } },
        { provide: AssessmentNavigationService, useValue: { consent, landing } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(BrowserCheckPage);
  });

  afterEach(() => fixture.destroy());

  it('runs the browser, JavaScript, network, and screen-size checks', () => {
    const page = fixture.componentInstance;
    expect(page.checks().map((check) => check.label)).toEqual([
      'Browser supported',
      'JavaScript enabled',
      'Network connection',
      'Screen size supported',
    ]);
    expect(page.checks()[1].status).toBe('passed');
  });

  it('does not continue while any browser requirement fails', () => {
    fixture.componentInstance.checks.update((checks) =>
      checks.map((check, index) => (index === 0 ? { ...check, status: 'failed' } : check)),
    );
    fixture.componentInstance.continue();

    expect(markBrowserReady).not.toHaveBeenCalled();
    expect(landing).not.toHaveBeenCalled();
  });

  it('marks the browser ready and navigates when all checks pass', () => {
    const page = fixture.componentInstance;
    page.checks.update((checks) => checks.map((check) => ({ ...check, status: 'passed' })));
    page.continue();

    expect(markBrowserReady).toHaveBeenCalledOnce();
    expect(landing).toHaveBeenCalledOnce();
  });

  it('returns to consent', () => {
    fixture.componentInstance.back();
    expect(consent).toHaveBeenCalledOnce();
  });
});
