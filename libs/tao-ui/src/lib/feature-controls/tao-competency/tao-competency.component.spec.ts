import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoCompetencyComponent } from './tao-competency.component';

describe('TaoCompetencyComponent', () => {
  let fixture: ComponentFixture<TaoCompetencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoCompetencyComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoCompetencyComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoCompetencyComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
