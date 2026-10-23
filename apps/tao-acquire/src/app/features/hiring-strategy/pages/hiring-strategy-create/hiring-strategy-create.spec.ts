import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HiringStrategyCreate } from './hiring-strategy-create';

describe('HiringStrategyCreate', () => {
  let component: HiringStrategyCreate;
  let fixture: ComponentFixture<HiringStrategyCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HiringStrategyCreate],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HiringStrategyCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
