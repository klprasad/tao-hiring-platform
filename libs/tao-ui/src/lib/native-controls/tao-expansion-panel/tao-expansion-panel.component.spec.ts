import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoExpansionPanelComponent } from './tao-expansion-panel.component';

describe('TaoExpansionPanelComponent', () => {
  let fixture: ComponentFixture<TaoExpansionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaoExpansionPanelComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TaoExpansionPanelComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoExpansionPanelComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
