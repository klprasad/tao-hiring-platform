import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { TaoDialogComponent } from './tao-dialog.component';
import { TaoDialogService } from './tao-dialog.service';

describe('TaoDialogService', () => {
  let service: TaoDialogService;
  let closedResult: boolean | undefined;
  const dialogRef = { afterClosed: () => of(closedResult) };
  const dialog = { open: vi.fn(() => dialogRef) };

  beforeEach(() => {
    closedResult = undefined;
    dialog.open.mockClear();

    TestBed.configureTestingModule({
      providers: [TaoDialogService, { provide: MatDialog, useValue: dialog }],
    });
    service = TestBed.inject(TaoDialogService);
  });

  it('opens a confirmation and returns true when confirmed', () => {
    closedResult = true;
    let result = false;

    service.showConfirmBox('Remove round?', 'Remove round 1?').subscribe((confirmed) => {
      result = confirmed;
    });

    expect(dialog.open).toHaveBeenCalledWith(
      TaoDialogComponent,
      expect.objectContaining({
        data: { type: 'confirm', title: 'Remove round?', message: 'Remove round 1?' },
      }),
    );
    expect(result).toBe(true);
  });

  it('treats dismissal as a cancelled confirmation', () => {
    let result = true;

    service.showConfirmBox('Remove round?', 'Remove round 1?').subscribe((confirmed) => {
      result = confirmed;
    });

    expect(result).toBe(false);
  });

  it('opens an alert dialog', () => {
    service.showAlertBox('Notice', 'Saved.');

    expect(dialog.open).toHaveBeenCalledWith(
      TaoDialogComponent,
      expect.objectContaining({
        data: { type: 'alert', title: 'Notice', message: 'Saved.' },
      }),
    );
  });
});
