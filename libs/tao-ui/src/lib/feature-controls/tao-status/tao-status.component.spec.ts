import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoStatusComponent } from './tao-status.component';

describe('TaoStatusComponent', () => {
  let fixture: ComponentFixture<TaoStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoStatusComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoStatusComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoStatusComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
