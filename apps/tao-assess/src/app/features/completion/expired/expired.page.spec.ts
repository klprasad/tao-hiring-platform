import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpiredPage } from './expired.page';

describe('ExpiredPage', () => {
  let fixture: ComponentFixture<ExpiredPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ExpiredPage] }).compileComponents();
    fixture = TestBed.createComponent(ExpiredPage);
    fixture.detectChanges();
  });

  it('renders the expired assessment message', () => {
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Assessment unavailable');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('session has expired');
  });
});
