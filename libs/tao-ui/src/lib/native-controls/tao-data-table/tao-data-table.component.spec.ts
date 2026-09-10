import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoDataTableComponent } from './tao-data-table.component';

describe('TaoDataTableComponent', () => {
  let fixture: ComponentFixture<TaoDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoDataTableComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoDataTableComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoDataTableComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
