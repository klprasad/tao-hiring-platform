import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoEmptyStateComponent } from './tao-empty-state.component';

describe('TaoEmptyStateComponent', () => {
  let fixture: ComponentFixture<TaoEmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoEmptyStateComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoEmptyStateComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoEmptyStateComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });

  it('renders custom empty-state text with status semantics', () => {
    fixture.componentRef.setInput('title', 'No candidates');
    fixture.componentRef.setInput('message', 'Invite a candidate to get started.');
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('[role="status"]')).toBeTruthy();
    expect(host.textContent).toContain('No candidates');
    expect(host.textContent).toContain('Invite a candidate to get started.');
  });
});
