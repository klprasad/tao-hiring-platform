import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';
import { SecureAccessPage } from './secure-access.page';

describe('SecureAccessPage', () => {
  let fixture: ComponentFixture<SecureAccessPage>;
  const authentication = vi.fn();

  beforeEach(async () => {
    authentication.mockClear();
    await TestBed.configureTestingModule({
      imports: [SecureAccessPage],
      providers: [{ provide: AssessmentNavigationService, useValue: { authentication } }],
    }).compileComponents();
    fixture = TestBed.createComponent(SecureAccessPage);
    fixture.detectChanges();
  });

  it('starts with an empty email and continues to authentication', () => {
    expect(fixture.componentInstance.email).toBe('');

    fixture.componentInstance.email = 'candidate@example.test';
    fixture.componentInstance.continue();

    expect(authentication).toHaveBeenCalledOnce();
  });
});
