import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { InvitationsService } from '../data-access/invitations.service';
import { ToasterService } from '@tao/ui';
import { Invitations } from './invitations';

describe('Invitations', () => {
  let fixture: ComponentFixture<Invitations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Invitations],
      providers: [
        provideRouter([]),
        { provide: InvitationsService, useValue: { sendInvitations: () => of(undefined) } },
        { provide: ToasterService, useValue: { success: vi.fn(), error: vi.fn() } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(Invitations);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(Invitations);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
