import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoEvidenceComponent } from './tao-evidence.component';

describe('TaoEvidenceComponent', () => {
  let fixture: ComponentFixture<TaoEvidenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoEvidenceComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoEvidenceComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoEvidenceComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
