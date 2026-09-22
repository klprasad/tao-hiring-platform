import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthStore, UserSummary } from '@tao/core';

import { TaoShellComponent } from './tao-shell.component';

const recruiter: UserSummary = {
  id: 'recruiter-001',
  organizationId: 'org-001',
  firstName: 'Alex',
  lastName: 'Morgan',
  email: 'alex.morgan@tao.example',
  role: '1',
  status: '1',
};

describe('TaoShellComponent', () => {
  let fixture: ComponentFixture<TaoShellComponent>;
  let authStore: AuthStore;

  const host = (): HTMLElement => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoShellComponent] }).compileComponents();

    authStore = TestBed.inject(AuthStore);
    fixture = TestBed.createComponent(TaoShellComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoShellComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });

  it('renders no user details while nobody is signed in', () => {
    expect(host().querySelector('.avatar')).toBeNull();
    expect(host().querySelector('.user-info')).toBeNull();
    expect(host().querySelector('.user-initials')).toBeNull();
  });

  it('renders the signed-in user details from AuthStore', () => {
    authStore.signIn(recruiter);
    fixture.detectChanges();

    expect(host().querySelector('.user-info strong')?.textContent).toContain('Alex Morgan');
    expect(host().querySelector('.user-info small')?.textContent).toContain(
      'alex.morgan@tao.example',
    );
    expect(host().querySelector('.avatar')?.textContent).toContain('AM');
    expect(host().querySelector('.user-initials')?.textContent).toContain('AM');
  });

  it('updates the user details when the identity changes', () => {
    authStore.signIn(recruiter);
    fixture.detectChanges();

    authStore.signIn({ ...recruiter, firstName: 'Jamie', lastName: 'Chu' });
    fixture.detectChanges();

    expect(host().querySelector('.user-info strong')?.textContent).toContain('Jamie Chu');
    expect(host().querySelector('.avatar')?.textContent).toContain('JC');
  });

  it('falls back to the email address when the name is empty', () => {
    authStore.signIn({ ...recruiter, firstName: '', lastName: '' });
    fixture.detectChanges();

    expect(host().querySelector('.user-info strong')?.textContent).toContain(
      'alex.morgan@tao.example',
    );
    expect(host().querySelector('.avatar')?.textContent).toContain('A');
  });
});
