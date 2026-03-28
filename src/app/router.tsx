import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { StartPage } from '@/pages/start';
import { QuizPage } from '@/pages/quiz';
import { ResultsPage } from '@/pages/results';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: StartPage,
});

const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quiz',
  component: QuizPage,
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/results',
  validateSearch: (search: Record<string, unknown>) => ({
    answers: (search.answers as string) ?? '',
  }),
  component: ResultsPage,
});

const routeTree = rootRoute.addChildren([indexRoute, quizRoute, resultsRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
