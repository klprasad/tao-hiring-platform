import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoErrorStateComponent } from './tao-error-state.component';

describe('TaoErrorStateComponent', () => {
  let fixture: ComponentFixture<TaoErrorStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoErrorStateComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoErrorStateComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoErrorStateComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
