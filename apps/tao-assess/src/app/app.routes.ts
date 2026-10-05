import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/candidate-portal/authentication/authentication.page').then(
        (m) => m.AuthenticationPage,
      ),
  },
  {
    path: 'access',
    canActivate: [authGuard],
    children: [
      // {
      //   path: '',
      //   pathMatch: 'full',
      //   loadComponent: () =>
      //     import('./features/candidate-portal/secure-access/secure-access.page').then(
      //       (m) => m.SecureAccessPage,
      //     ),
      // },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'landing',
      },
      {
        path: 'landing',
        loadComponent: () =>
          import('./features/candidate-portal/landing/assessment-landing.page').then(
            (m) => m.AssessmentLandingPage,
          ),
      },

      {
        path: 'consent',
        loadComponent: () =>
          import('./features/candidate-portal/consent/consent.page').then((m) => m.ConsentPage),
      },

      {
        path: 'browser-check',
        loadComponent: () =>
          import('./features/candidate-portal/browser-check/browser-check.page').then(
            (m) => m.BrowserCheckPage,
          ),
      },

      {
        path: 'ready',
        loadComponent: () =>
          import('./features/candidate-portal/ready/assessment-ready.page').then(
            (m) => m.AssessmentReadyPage,
          ),
      },
    ],
  },
  {
    path: 'session/:sessionId',
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
