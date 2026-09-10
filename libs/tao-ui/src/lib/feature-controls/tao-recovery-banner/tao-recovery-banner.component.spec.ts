import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoRecoveryBannerComponent } from './tao-recovery-banner.component';

describe('TaoRecoveryBannerComponent', () => {
  let fixture: ComponentFixture<TaoRecoveryBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaoRecoveryBannerComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TaoRecoveryBannerComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoRecoveryBannerComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
