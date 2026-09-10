import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoDocumentViewerComponent } from './tao-document-viewer.component';

describe('TaoDocumentViewerComponent', () => {
  let fixture: ComponentFixture<TaoDocumentViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaoDocumentViewerComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TaoDocumentViewerComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoDocumentViewerComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
