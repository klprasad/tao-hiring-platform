import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RecoveryPage } from './recovery.page';

describe('RecoveryPage', () => {
  let fixture: ComponentFixture<RecoveryPage>;
  const navigate = vi.fn();

  beforeEach(async () => {
    navigate.mockClear();
    await TestBed.configureTestingModule({
      imports: [RecoveryPage],
      providers: [{ provide: Router, useValue: { navigate } }],
    }).compileComponents();
    fixture = TestBed.createComponent(RecoveryPage);
  });

  it('resumes the assessment at the question route', () => {
    fixture.componentInstance.resume();

    expect(navigate).toHaveBeenCalledWith(['/session/demo-session/question']);
  });
});
