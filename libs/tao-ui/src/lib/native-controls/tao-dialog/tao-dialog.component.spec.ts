import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaoDialogComponent, TaoDialogData } from './tao-dialog.component';

describe('TaoDialogComponent', () => {
  let fixture: ComponentFixture<TaoDialogComponent>;
  const dialogData: TaoDialogData = {
    type: 'confirm',
    title: 'Confirm action',
    message: 'Continue?',
  };
  const close = vi.fn();

  beforeEach(async () => {
    close.mockClear();
    await TestBed.configureTestingModule({
      imports: [TaoDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        { provide: MatDialogRef, useValue: { close } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TaoDialogComponent);
    fixture.detectChanges();
  });

  it('renders the supplied title and message', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoDialogComponent);
    expect(fixture.nativeElement.textContent).toContain(dialogData.title);
    expect(fixture.nativeElement.textContent).toContain(dialogData.message);
  });

  it('closes with true when confirmed', () => {
    fixture.componentInstance.confirm();

    expect(close).toHaveBeenCalledWith(true);
  });

  it('closes with false when cancelled', () => {
    fixture.componentInstance.cancel();

    expect(close).toHaveBeenCalledWith(false);
  });
});
