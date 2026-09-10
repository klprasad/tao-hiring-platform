import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoTabsComponent } from './tao-tabs.component';

describe('TaoTabsComponent', () => {
  let fixture: ComponentFixture<TaoTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoTabsComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoTabsComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoTabsComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
