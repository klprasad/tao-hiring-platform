import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HiringStrategyEdit } from './hiring-strategy-edit';

describe('HiringStrategyEdit', () => {
  let component: HiringStrategyEdit;
  let fixture: ComponentFixture<HiringStrategyEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HiringStrategyEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(HiringStrategyEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
