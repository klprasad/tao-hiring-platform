import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoAutocompleteComponent } from './tao-autocomplete.component';

describe('TaoAutocompleteComponent', () => {
  let fixture: ComponentFixture<TaoAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaoAutocompleteComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TaoAutocompleteComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoAutocompleteComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
