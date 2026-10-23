import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { throwError } from 'rxjs';
import { AssessmentStrategyService } from '../../data-access/assessment-strategy.service';
import { ToasterService } from '@tao/ui';
import { AssessmentOverview } from './assessment-overview';

describe('AssessmentOverview', () => {
  let component: AssessmentOverview;
  let fixture: ComponentFixture<AssessmentOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentOverview],
      providers: [
        provideRouter([]),
        {
          provide: AssessmentStrategyService,
          useValue: { getAssessmentStrategy: () => throwError(() => new Error('not configured')) },
        },
        { provide: ToasterService, useValue: { error: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentOverview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
