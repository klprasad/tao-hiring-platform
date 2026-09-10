import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoShellComponent } from './tao-shell.component';

describe('TaoShellComponent', () => {
  let fixture: ComponentFixture<TaoShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoShellComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoShellComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoShellComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
