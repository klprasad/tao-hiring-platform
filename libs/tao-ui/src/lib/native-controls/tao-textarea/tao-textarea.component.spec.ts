import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoTextareaComponent } from './tao-textarea.component';

describe('TaoTextareaComponent', () => {
  let fixture: ComponentFixture<TaoTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoTextareaComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoTextareaComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoTextareaComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
