import { Outlet } from '@tanstack/react-router';
import { AppHeader } from '@/widgets/app-header';

export function AppLayout() {
  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  );
}
