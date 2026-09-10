import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Invitations } from './invitations';

describe('Invitations', () => {
  let fixture: ComponentFixture<Invitations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Invitations] }).compileComponents();
    fixture = TestBed.createComponent(Invitations);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(Invitations);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
