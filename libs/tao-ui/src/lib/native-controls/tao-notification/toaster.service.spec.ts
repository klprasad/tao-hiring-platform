import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { vi } from 'vitest';

import { ToasterService } from './toaster.service';

describe('ToasterService', () => {
  const openFromComponent = vi.fn();

  beforeEach(() => {
    openFromComponent.mockReset();
    TestBed.configureTestingModule({
      providers: [ToasterService, { provide: MatSnackBar, useValue: { openFromComponent } }],
    });
  });

  it('shows success messages with polite announcements', () => {
    TestBed.inject(ToasterService).success('Saved');

    expect(openFromComponent).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        data: { message: 'Saved' },
        announcementMessage: 'Saved',
        duration: 4000,
        panelClass: 'tao-toast--success',
        politeness: 'polite',
      }),
    );
  });

  it('shows error messages with assertive announcements', () => {
    TestBed.inject(ToasterService).error('Could not save');

    expect(openFromComponent).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        data: { message: 'Could not save' },
        announcementMessage: 'Could not save',
        duration: 30000,
        panelClass: 'tao-toast--error',
        politeness: 'assertive',
      }),
    );
  });
});
