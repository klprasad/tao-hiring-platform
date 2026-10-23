import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';
import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { ConsentPage } from './consent.page';

describe('ConsentPage', () => {
  let fixture: ComponentFixture<ConsentPage>;
  const acceptConsent = vi.fn();
  const browserCheck = vi.fn();
  const landing = vi.fn();

  beforeEach(async () => {
    acceptConsent.mockClear();
    browserCheck.mockClear();
    landing.mockClear();
    await TestBed.configureTestingModule({
      imports: [ConsentPage],
      providers: [
        { provide: AssessmentSessionStore, useValue: { acceptConsent } },
        {
          provide: AssessmentNavigationService,
          useValue: { browserCheck, landing },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ConsentPage);
    fixture.detectChanges();
  });

  it('requires all consent items before enabling continuation', () => {
    const page = fixture.componentInstance;
    expect(page.allAccepted()).toBe(false);

    page.updateConsent('ai-interview', true);
    page.updateConsent('assessment-terms', true);
    expect(page.allAccepted()).toBe(false);

    page.updateConsent('no-return', true);
    expect(page.allAccepted()).toBe(true);
  });

  it('does not continue until all consents are accepted', () => {
    fixture.componentInstance.continue();

    expect(acceptConsent).not.toHaveBeenCalled();
    expect(browserCheck).not.toHaveBeenCalled();
  });

  it('records consent and opens the browser check after acceptance', () => {
    for (const consent of fixture.componentInstance.consents()) {
      fixture.componentInstance.updateConsent(consent.id, true);
    }

    fixture.componentInstance.continue();

    expect(acceptConsent).toHaveBeenCalledOnce();
    expect(browserCheck).toHaveBeenCalledOnce();
  });

  it('returns to the landing screen when going back', () => {
    fixture.componentInstance.back();

    expect(landing).toHaveBeenCalledOnce();
  });
});
