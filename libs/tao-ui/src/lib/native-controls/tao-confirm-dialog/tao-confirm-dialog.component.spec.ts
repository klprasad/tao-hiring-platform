import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoConfirmDialogComponent } from './tao-confirm-dialog.component';

describe('TaoConfirmDialogComponent', () => {
  let fixture: ComponentFixture<TaoConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaoConfirmDialogComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TaoConfirmDialogComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoConfirmDialogComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });

  it('emits the selected confirmation action', () => {
    const confirmed = vi.fn();
    const cancelled = vi.fn();
    fixture.componentInstance.confirmed.subscribe(confirmed);
    fixture.componentInstance.cancelled.subscribe(cancelled);
    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll('button');
    buttons[0].click();
    buttons[1].click();

    expect(cancelled).toHaveBeenCalledOnce();
    expect(confirmed).toHaveBeenCalledOnce();
  });
});
