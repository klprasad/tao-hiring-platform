import { Routes } from '@angular/router';

export const CANDIDATE_PORTAL_ROUTES: Routes = [
  {
    path: 'access/:token',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./secure-access/secure-access.page').then((m) => m.SecureAccessPage),
      },
      {
        path: 'auth',
        loadComponent: () =>
          import('./authentication/authentication.page').then((m) => m.AuthenticationPage),
      },
      {
        path: 'landing',
        loadComponent: () =>
          import('./landing/assessment-landing.page').then((m) => m.AssessmentLandingPage),
      },
      {
        path: 'consent',
        loadComponent: () => import('./consent/consent.page').then((m) => m.ConsentPage),
      },
      {
        path: 'browser-check',
        loadComponent: () =>
          import('./browser-check/browser-check.page').then((m) => m.BrowserCheckPage),
      },
      {
        path: 'ready',
        loadComponent: () =>
          import('./ready/assessment-ready.page').then((m) => m.AssessmentReadyPage),
      },
    ],
  },
  {
    path: 'session/:sessionId',
    children: [
      {
        path: 'welcome',
        loadComponent: () => import('../session/welcome/welcome.page').then((m) => m.WelcomePage),
      },
      {
        path: 'question',
        loadComponent: () =>
          import('../session/question/question.page').then((m) => m.QuestionPage),
      },
      {
        path: 'coding',
        loadComponent: () =>
          import('../coding/coding-workspace/coding-workspace.page').then(
            (m) => m.CodingWorkspacePage,
          ),
      },
      {
        path: 'follow-up',
        loadComponent: () =>
          import('../session/follow-up/follow-up.page').then((m) => m.FollowUpPage),
      },
      {
        path: 'round-transition',
        loadComponent: () =>
          import('../session/round-transition/round-transition.page').then(
            (m) => m.RoundTransitionPage,
          ),
      },
      {
        path: 'recovery',
        loadComponent: () =>
          import('../session/recovery/recovery.page').then((m) => m.RecoveryPage),
      },
      {
        path: 'final-review',
        loadComponent: () =>
          import('../session/final-review/final-review.page').then((m) => m.FinalReviewPage),
      },
      {
        path: 'submitted',
        loadComponent: () =>
          import('../completion/submission-confirmation/submission-confirmation.page').then(
            (m) => m.SubmissionConfirmationPage,
          ),
      },
      {
        path: 'expired',
        loadComponent: () =>
          import('../completion/expired/expired.page').then((m) => m.ExpiredPage),
      },
    ],
  },
];
