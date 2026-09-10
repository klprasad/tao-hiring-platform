import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoTimelineComponent } from './tao-timeline.component';

describe('TaoTimelineComponent', () => {
  let fixture: ComponentFixture<TaoTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoTimelineComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoTimelineComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoTimelineComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
