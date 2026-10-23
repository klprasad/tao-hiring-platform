import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoPageHeaderComponent } from './tao-page-header.component';

describe('TaoPageHeaderComponent', () => {
  let fixture: ComponentFixture<TaoPageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoPageHeaderComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoPageHeaderComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoPageHeaderComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });

  it('renders custom title and description inputs', () => {
    fixture.componentRef.setInput('title', 'Candidate pipeline');
    fixture.componentRef.setInput('description', 'Review active candidates.');
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('h1')?.textContent).toContain('Candidate pipeline');
    expect(host.querySelector('.description')?.textContent).toContain('Review active candidates.');
  });
});
