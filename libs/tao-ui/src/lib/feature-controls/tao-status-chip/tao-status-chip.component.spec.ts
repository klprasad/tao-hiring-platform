import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoStatusChipComponent } from './tao-status-chip.component';

describe('TaoStatusChipComponent', () => {
  let fixture: ComponentFixture<TaoStatusChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoStatusChipComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoStatusChipComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoStatusChipComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
