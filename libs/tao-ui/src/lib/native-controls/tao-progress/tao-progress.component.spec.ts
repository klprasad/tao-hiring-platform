import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoProgressComponent } from './tao-progress.component';

describe('TaoProgressComponent', () => {
  let fixture: ComponentFixture<TaoProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoProgressComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoProgressComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoProgressComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
