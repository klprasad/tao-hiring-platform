import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoLoadingStateComponent } from './tao-loading-state.component';

describe('TaoLoadingStateComponent', () => {
  let fixture: ComponentFixture<TaoLoadingStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaoLoadingStateComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TaoLoadingStateComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoLoadingStateComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });

  it('shows the live loading status only when loading is true', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('[role="status"]')).toBeNull();

    fixture.componentRef.setInput('label', 'Loading candidates');
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    expect(host.querySelector('[role="status"]')?.getAttribute('aria-live')).toBe('polite');
    expect(host.textContent).toContain('Loading candidates');
  });
});
