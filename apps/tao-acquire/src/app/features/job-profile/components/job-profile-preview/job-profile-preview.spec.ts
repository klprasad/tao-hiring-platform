import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { JobProfilePreviewComponent } from './job-profile-preview';

describe('JobProfilePreviewComponent', () => {
  let fixture: ComponentFixture<JobProfilePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobProfilePreviewComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: { get: () => 'campaign-route' },
              queryParamMap: { get: () => null },
            },
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(JobProfilePreviewComponent);
  });

  it('resolves the campaign route and renders generated markdown', () => {
    fixture.componentRef.setInput(
      'generatedContent',
      '# Engineer\n\nBuild **reliable** systems.\n- TypeScript',
    );
    fixture.detectChanges();

    expect(fixture.componentInstance.campaignId).toBe('campaign-route');
    expect(fixture.componentInstance.hasGeneratedContent()).toBe(true);
    expect((fixture.nativeElement as HTMLElement).querySelector('h1')?.textContent).toBe(
      'Engineer',
    );
    expect((fixture.nativeElement as HTMLElement).querySelector('strong')?.textContent).toBe(
      'reliable',
    );
    expect((fixture.nativeElement as HTMLElement).querySelector('li')?.textContent).toBe(
      'TypeScript',
    );
  });

  it('returns no parsed blocks for empty content', () => {
    expect(fixture.componentInstance.hasGeneratedContent()).toBe(false);
    expect(fixture.componentInstance.parsedGeneratedContent()).toEqual([]);
  });
});
