import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoMenuComponent } from './tao-menu.component';

describe('TaoMenuComponent', () => {
  let fixture: ComponentFixture<TaoMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoMenuComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoMenuComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoMenuComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
