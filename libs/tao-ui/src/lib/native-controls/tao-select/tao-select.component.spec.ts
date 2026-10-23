import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoSelectComponent } from './tao-select.component';

describe('TaoSelectComponent', () => {
  let fixture: ComponentFixture<TaoSelectComponent<unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoSelectComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoSelectComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoSelectComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
