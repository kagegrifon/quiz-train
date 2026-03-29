import { ActionIcon, Group, Text, Tooltip, UnstyledButton } from '@mantine/core';
import { IconChartBar, IconSettings } from '@tabler/icons-react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { ThemeToggle } from '@/shared/ui/theme-toggle';
import styles from './AppHeader.module.css';

export function AppHeader() {
  const navigate = useNavigate();
  const { location } = useRouterState();

  return (
    <header className={styles.root}>
      <Group h="100%" px="md" justify="space-between">
        <UnstyledButton onClick={() => navigate({ to: '/' })}>
          <Text fw={700} size="lg">Квиз</Text>
        </UnstyledButton>

        <Group gap="xs">
          <Tooltip label="Статистика">
            <ActionIcon
              variant={location.pathname === '/stats' ? 'filled' : 'subtle'}
              aria-label="Статистика"
              onClick={() => navigate({ to: '/stats', search: { quizId: '' } })}
            >
              <IconChartBar size={20} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Настройки">
            <ActionIcon
              variant={location.pathname === '/settings' ? 'filled' : 'subtle'}
              aria-label="Настройки"
              onClick={() => navigate({ to: '/settings' })}
            >
              <IconSettings size={20} />
            </ActionIcon>
          </Tooltip>
          <ThemeToggle />
        </Group>
      </Group>
    </header>
  );
}
