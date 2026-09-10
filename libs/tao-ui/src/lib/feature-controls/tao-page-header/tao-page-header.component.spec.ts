import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoPageHeaderComponent } from './tao-page-header.component';

describe('TaoPageHeaderComponent', () => {
  let fixture: ComponentFixture<TaoPageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoPageHeaderComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoPageHeaderComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoPageHeaderComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
