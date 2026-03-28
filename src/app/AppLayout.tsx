import { Outlet } from '@tanstack/react-router';
import { ThemeToggle } from '@/shared/ui/theme-toggle';
import styles from './AppLayout.module.css';

export function AppLayout() {
  return (
    <>
      <div className={styles.themeToggle}>
        <ThemeToggle />
      </div>
      <Outlet />
    </>
  );
}
