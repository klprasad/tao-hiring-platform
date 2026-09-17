import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HiringStrategyCreate } from './hiring-strategy-create';

describe('HiringStrategyCreate', () => {
  let component: HiringStrategyCreate;
  let fixture: ComponentFixture<HiringStrategyCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HiringStrategyCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(HiringStrategyCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
