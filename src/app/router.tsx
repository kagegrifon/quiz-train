import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { AppLayout } from './AppLayout';
import { StartPage } from '@/pages/start';
import { QuizPage } from '@/pages/quiz';
import { ResultsPage } from '@/pages/results';
import { StatsPage } from '@/pages/stats';
import { SettingsPage } from '@/pages/settings';

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: StartPage,
});

const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quiz',
  validateSearch: (search: Record<string, unknown>) => ({
    quizId: (search.quizId as string) || 'js-basics',
    timerEnabled: search.timerEnabled === true || search.timerEnabled === 'true',
    timeLimitSec: Number(search.timeLimitSec) || 120,
    revealWhen: (search.revealWhen as string) === 'afterAnswer' ? ('afterAnswer' as const) : ('onFinish' as const),
    showCorrect: search.showCorrect === true || search.showCorrect === 'true',
    showWrong: search.showWrong === true || search.showWrong === 'true',
  }),
  component: QuizPage,
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/results',
  validateSearch: (search: Record<string, unknown>) => ({
    quizId: (search.quizId as string) || 'js-basics',
    answers: (search.answers as string) ?? '',
    revealWhen: (search.revealWhen as string) === 'afterAnswer' ? ('afterAnswer' as const) : ('onFinish' as const),
    showCorrect: search.showCorrect === true || search.showCorrect === 'true',
    showWrong: search.showWrong === true || search.showWrong === 'true',
  }),
  component: ResultsPage,
});

const statsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/stats',
  validateSearch: (search: Record<string, unknown>) => ({
    quizId: (search.quizId as string) || '',
  }),
  component: StatsPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([indexRoute, quizRoute, resultsRoute, statsRoute, settingsRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
