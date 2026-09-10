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
});
