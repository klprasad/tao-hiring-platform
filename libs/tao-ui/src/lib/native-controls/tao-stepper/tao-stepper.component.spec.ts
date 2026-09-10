import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoStepperComponent } from './tao-stepper.component';

describe('TaoStepperComponent', () => {
  let fixture: ComponentFixture<TaoStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoStepperComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoStepperComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoStepperComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
