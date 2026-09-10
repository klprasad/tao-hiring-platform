import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoDialogComponent } from './tao-dialog.component';

describe('TaoDialogComponent', () => {
  let fixture: ComponentFixture<TaoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoDialogComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoDialogComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoDialogComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
