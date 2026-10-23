import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { ToasterMessageComponent } from './toaster-message.component';

describe('ToasterMessageComponent', () => {
  let fixture: ComponentFixture<ToasterMessageComponent>;
  const host = (): HTMLElement => fixture.nativeElement as HTMLElement;
  const dismiss = vi.fn();

  beforeEach(async () => {
    dismiss.mockClear();
    await TestBed.configureTestingModule({
      imports: [ToasterMessageComponent],
      providers: [
        { provide: MAT_SNACK_BAR_DATA, useValue: { message: 'Saved successfully' } },
        { provide: MatSnackBarRef, useValue: { dismiss } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ToasterMessageComponent);
    fixture.detectChanges();
  });

  it('renders the supplied notification message', () => {
    expect(host().querySelector('.toast-message')?.textContent).toContain('Saved successfully');
  });

  it('dismisses the notification when the accessible dismiss button is activated', () => {
    host().querySelector<HTMLButtonElement>('.toast-dismiss')?.click();

    expect(dismiss).toHaveBeenCalledOnce();
  });
});
