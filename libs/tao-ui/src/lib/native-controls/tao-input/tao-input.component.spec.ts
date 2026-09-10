import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoInputComponent } from './tao-input.component';

describe('TaoInputComponent', () => {
  let fixture: ComponentFixture<TaoInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoInputComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoInputComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoInputComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
