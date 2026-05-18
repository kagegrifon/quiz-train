import { lazy, Suspense } from "react";
import type { ComponentType } from "react";
import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { BASE_PATH } from "../../project.config";
import { AppLayout } from "./AppLayout";

function withSuspense(Component: ComponentType) {
  return function LazyPage() {
    return (
      <Suspense fallback={null}>
        <Component />
      </Suspense>
    );
  };
}

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: withSuspense(
    lazy(() => import("@/pages/start").then((m) => ({ default: m.StartPage }))),
  ),
});

const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/quiz",
  validateSearch: (search: Record<string, unknown>) => ({
    quizId: (search.quizId as string) || "js-basics",
    timerEnabled:
      search.timerEnabled === true || search.timerEnabled === "true",
    timeLimitSec: Number(search.timeLimitSec) || 120,
    revealWhen:
      (search.revealWhen as string) === "afterAnswer"
        ? ("afterAnswer" as const)
        : ("onFinish" as const),
    showCorrect: search.showCorrect === true || search.showCorrect === "true",
    showWrong: search.showWrong === true || search.showWrong === "true",
  }),
  component: withSuspense(
    lazy(() => import("@/pages/quiz").then((m) => ({ default: m.QuizPage }))),
  ),
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/results",
  validateSearch: (search: Record<string, unknown>) => ({
    quizId: (search.quizId as string) || "js-basics",
    answers: (search.answers as string) ?? "",
    revealWhen:
      (search.revealWhen as string) === "afterAnswer"
        ? ("afterAnswer" as const)
        : ("onFinish" as const),
    showCorrect: search.showCorrect === true || search.showCorrect === "true",
    showWrong: search.showWrong === true || search.showWrong === "true",
  }),
  component: withSuspense(
    lazy(() =>
      import("@/pages/results").then((m) => ({ default: m.ResultsPage })),
    ),
  ),
});

const statsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stats",
  validateSearch: (search: Record<string, unknown>) => ({
    quizId: (search.quizId as string) || "",
  }),
  component: withSuspense(
    lazy(() => import("@/pages/stats").then((m) => ({ default: m.StatsPage }))),
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: withSuspense(
    lazy(() =>
      import("@/pages/settings").then((m) => ({ default: m.SettingsPage })),
    ),
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  quizRoute,
  resultsRoute,
  statsRoute,
  settingsRoute,
]);

export const router = createRouter({
  routeTree,
  basepath: import.meta.env.PROD ? BASE_PATH : "/",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
