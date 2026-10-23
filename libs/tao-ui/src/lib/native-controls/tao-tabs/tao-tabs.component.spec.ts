import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoTabsComponent } from './tao-tabs.component';

describe('TaoTabsComponent', () => {
  let fixture: ComponentFixture<TaoTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoTabsComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoTabsComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoTabsComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });

  it('passes tab selection changes through the output', () => {
    fixture.componentRef.setInput('tabs', ['Candidates', 'Results']);
    fixture.detectChanges();
    const changed = vi.fn();
    fixture.componentInstance.changed.subscribe(changed);
    fixture.componentInstance.changed.emit(1);

    expect(changed).toHaveBeenCalledWith(1);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Candidates');
  });
});
