import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HiringStrategy } from './hiring-strategy';

describe('HiringStrategy', () => {
  let fixture: ComponentFixture<HiringStrategy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HiringStrategy] }).compileComponents();
    fixture = TestBed.createComponent(HiringStrategy);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(HiringStrategy);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
