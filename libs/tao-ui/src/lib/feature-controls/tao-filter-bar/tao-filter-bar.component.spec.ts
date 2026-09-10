import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoFilterBarComponent } from './tao-filter-bar.component';

describe('TaoFilterBarComponent', () => {
  let fixture: ComponentFixture<TaoFilterBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoFilterBarComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoFilterBarComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoFilterBarComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
