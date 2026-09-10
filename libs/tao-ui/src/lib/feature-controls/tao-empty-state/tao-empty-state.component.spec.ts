import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoEmptyStateComponent } from './tao-empty-state.component';

describe('TaoEmptyStateComponent', () => {
  let fixture: ComponentFixture<TaoEmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoEmptyStateComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoEmptyStateComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoEmptyStateComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
