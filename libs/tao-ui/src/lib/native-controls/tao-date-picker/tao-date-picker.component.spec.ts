import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoDatePickerComponent } from './tao-date-picker.component';

describe('TaoDatePickerComponent', () => {
  let fixture: ComponentFixture<TaoDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoDatePickerComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoDatePickerComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoDatePickerComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
