import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthStore, UserSummary } from '@tao/core';

import { App } from './app';

const recruiter: UserSummary = {
  id: 'recruiter-001',
  organizationId: 'org-001',
  firstName: 'Alex',
  lastName: 'Morgan',
  email: 'alex.morgan@tao.example',
  role: '1',
  status: '1',
};

describe('App', () => {
  let fixture: ComponentFixture<App>;

  const host = (): HTMLElement => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    // A signed-in identity survives a reload, so every test starts from a clean session.
    sessionStorage.clear();

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    await fixture.whenStable();
  });

  it('renders only the router outlet while nobody is signed in', () => {
    expect(fixture.componentInstance).toBeInstanceOf(App);
    expect(host().querySelector('router-outlet')).toBeTruthy();
    expect(host().querySelector('tao-shell')).toBeNull();
  });

  it('renders the application shell for a signed-in user', async () => {
    TestBed.inject(AuthStore).signIn(recruiter);

    await fixture.whenStable();

    expect(host().querySelector('tao-shell')).toBeTruthy();
  });
});
