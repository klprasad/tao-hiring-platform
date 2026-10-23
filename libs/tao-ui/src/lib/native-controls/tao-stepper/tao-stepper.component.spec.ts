import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoStepperComponent } from './tao-stepper.component';

describe('TaoStepperComponent', () => {
  let fixture: ComponentFixture<TaoStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoStepperComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoStepperComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoStepperComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });

  it('marks earlier steps complete and the current step active', () => {
    fixture.componentRef.setInput('steps', ['Details', 'Review', 'Complete']);
    fixture.componentRef.setInput('current', 1);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const steps = host.querySelectorAll('li');

    expect(steps[0].classList.contains('complete')).toBe(true);
    expect(steps[1].classList.contains('current')).toBe(true);
    expect(steps[2].classList.contains('current')).toBe(false);
  });
});
