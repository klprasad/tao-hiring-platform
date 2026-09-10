import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoCardComponent } from './tao-card.component';

describe('TaoCardComponent', () => {
  let fixture: ComponentFixture<TaoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoCardComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoCardComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoCardComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
