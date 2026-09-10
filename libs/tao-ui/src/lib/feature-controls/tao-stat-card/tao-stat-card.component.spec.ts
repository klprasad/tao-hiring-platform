import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoStatCardComponent } from './tao-stat-card.component';

describe('TaoStatCardComponent', () => {
  let fixture: ComponentFixture<TaoStatCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoStatCardComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoStatCardComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoStatCardComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
