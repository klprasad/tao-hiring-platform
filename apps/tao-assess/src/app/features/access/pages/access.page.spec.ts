import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessPage } from './access.page';

describe('AccessPage', () => {
  let fixture: ComponentFixture<AccessPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AccessPage] }).compileComponents();
    fixture = TestBed.createComponent(AccessPage);
    fixture.detectChanges();
  });

  it('renders the secure assessment entry form', () => {
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Enter your assessment');
    expect(fixture.nativeElement.querySelector('#email')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('button').textContent).toContain('Continue');
  });
});
