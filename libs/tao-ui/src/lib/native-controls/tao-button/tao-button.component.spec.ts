import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoButtonComponent } from './tao-button.component';

describe('TaoButtonComponent', () => {
  let fixture: ComponentFixture<TaoButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoButtonComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoButtonComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoButtonComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
