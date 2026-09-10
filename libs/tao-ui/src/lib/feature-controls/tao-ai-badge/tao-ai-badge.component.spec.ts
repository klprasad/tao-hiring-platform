import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoAiBadgeComponent } from './tao-ai-badge.component';

describe('TaoAiBadgeComponent', () => {
  let fixture: ComponentFixture<TaoAiBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoAiBadgeComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoAiBadgeComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoAiBadgeComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
