import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoProgressComponent } from './tao-progress.component';

describe('TaoProgressComponent', () => {
  let fixture: ComponentFixture<TaoProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoProgressComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoProgressComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoProgressComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });

  it('shows the accessible label and numeric progress when labels are enabled', () => {
    fixture.componentRef.setInput('value', 65);
    fixture.componentRef.setInput('label', 'Assessment progress');
    fixture.componentRef.setInput('hideLabel', false);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.textContent).toContain('Assessment progress');
    expect(host.textContent).toContain('65%');
    expect(host.querySelector('mat-progress-bar')?.getAttribute('aria-valuenow')).toBe('65');
  });
});
