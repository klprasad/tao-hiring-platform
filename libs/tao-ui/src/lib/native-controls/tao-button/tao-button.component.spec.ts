import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoButtonComponent } from './tao-button.component';

describe('TaoButtonComponent', () => {
  let fixture: ComponentFixture<TaoButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoButtonComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoButtonComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoButtonComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });

  it('reflects the label, appearance, and disabled input', () => {
    fixture.componentRef.setInput('label', 'Save changes');
    fixture.componentRef.setInput('appearance', 'outlined');
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const button = (fixture.nativeElement as HTMLElement).querySelector('button');
    expect(button?.textContent).toContain('Save changes');
    expect(button?.classList.contains('tao-button--outlined')).toBe(true);
    expect(button?.disabled).toBe(true);
  });

  it('treats loading as disabled and hides the icon', () => {
    fixture.componentRef.setInput('icon', 'save');
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    expect(fixture.componentInstance.isDisabled()).toBe(true);
    expect(fixture.componentInstance.hasIcon()).toBe(false);
    expect((fixture.nativeElement as HTMLElement).querySelector('button')?.disabled).toBe(true);
    expect((fixture.nativeElement as HTMLElement).querySelector('mat-spinner')).toBeTruthy();
  });
});
