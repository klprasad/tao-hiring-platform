import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoAnswerEditorComponent } from './tao-answer-editor.component';

describe('TaoAnswerEditorComponent', () => {
  let fixture: ComponentFixture<TaoAnswerEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaoAnswerEditorComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TaoAnswerEditorComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoAnswerEditorComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
