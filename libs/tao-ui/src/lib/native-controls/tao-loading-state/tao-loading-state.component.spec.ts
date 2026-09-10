import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoLoadingStateComponent } from './tao-loading-state.component';

describe('TaoLoadingStateComponent', () => {
  let fixture: ComponentFixture<TaoLoadingStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaoLoadingStateComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TaoLoadingStateComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoLoadingStateComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
