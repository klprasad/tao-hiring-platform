import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'candidate/login',
  },
  {
    path: 'candidate',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
      {
        path: 'invitations/:invitationId',
        loadComponent: () =>
          import('./features/candidate-portal/candidate-landing/candidate-landing.page').then(
            (m) => m.CandidateLandingPage,
          ),
      },
      {
        path: 'login/:invitationId',
        loadComponent: () =>
          import('./features/candidate-portal/authentication/authentication.page').then(
            (m) => m.AuthenticationPage,
          ),
      },

      {
        path: 'consent',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/candidate-portal/consent/consent.page').then((m) => m.ConsentPage),
      },

      {
        path: 'browser-check',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/candidate-portal/browser-check/browser-check.page').then(
            (m) => m.BrowserCheckPage,
          ),
      },
      {
        path: 'landing',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/candidate-portal/assessment-landing/assessment-landing.page').then(
            (m) => m.AssessmentLandingPage,
          ),
      },
      {
        path: 'ready',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/candidate-portal/ready/assessment-ready.page').then(
            (m) => m.AssessmentReadyPage,
          ),
      },
    ],
  },
  {
    path: 'session/:sessionId',
    canActivate: [authGuard],
    children: [
      {
        path: 'welcome',
        loadComponent: () =>
          import('./features/session/welcome/welcome.page').then((m) => m.WelcomePage),
      },

      {
        path: 'question',
        loadComponent: () =>
          import('./features/session/question/question.page').then((m) => m.QuestionPage),
      },

      {
        path: 'coding',
        loadComponent: () =>
          import('./features/coding/coding-workspace/coding-workspace.page').then(
            (m) => m.CodingWorkspacePage,
          ),
      },
      {
        path: 'final-review',
        loadComponent: () =>
          import('./features/session/final-review/final-review.page').then(
            (m) => m.FinalReviewPage,
          ),
      },
      {
        path: 'submitted',
        loadComponent: () =>
          import('./features/completion/submission-confirmation/submission-confirmation.page').then(
            (m) => m.SubmissionConfirmationPage,
          ),
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'access/demo',
  },
];
