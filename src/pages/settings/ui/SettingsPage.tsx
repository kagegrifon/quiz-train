import { Button, Divider, Group, NumberInput, Paper, SegmentedControl, Stack, Switch, Text, Title } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import type { QuizSettings } from '@/shared/types/quiz-settings';
import { DEFAULT_SETTINGS, loadSettings, saveSettings } from '@/shared/lib/quiz-settings-storage';
import styles from './SettingsPage.module.css';

export function SettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<QuizSettings>(() => loadSettings());

  const update = (patch: Partial<QuizSettings>) =>
    setSettings((prev) => ({ ...prev, ...patch }));

  const handleSave = () => {
    saveSettings(settings);
    navigate({ to: '/' });
  };

  const handleReset = () => setSettings({ ...DEFAULT_SETTINGS });

  return (
    <div className={styles.root}>
      <Stack align="center" gap="xl" w={420}>
        <Title order={1}>Настройки</Title>

        <Paper withBorder p="lg" radius="md" w="100%">
          <Stack gap="md">
            <Switch
              label="Включить таймер"
              checked={settings.timerEnabled}
              onChange={(e) => update({ timerEnabled: e.currentTarget.checked })}
            />
            {settings.timerEnabled && (
              <NumberInput
                label="Время на квиз (секунды)"
                value={settings.timeLimitSec}
                onChange={(v) => update({ timeLimitSec: Number(v) })}
                min={10}
                max={600}
                step={10}
              />
            )}

            <Divider />

            <Text size="sm" fw={500}>Показывать ответы</Text>
            <SegmentedControl
              value={settings.revealWhen}
              onChange={(v) => update({ revealWhen: v as QuizSettings['revealWhen'] })}
              data={[
                { label: 'Только в результатах', value: 'onFinish' },
                { label: 'После ответа', value: 'afterAnswer' },
              ]}
            />
            <Switch
              label="Показывать правильные"
              checked={settings.showCorrect}
              onChange={(e) => update({ showCorrect: e.currentTarget.checked })}
            />
            <Switch
              label="Показывать неправильные"
              checked={settings.showWrong}
              onChange={(e) => update({ showWrong: e.currentTarget.checked })}
            />
          </Stack>
        </Paper>

        <Group w="100%" grow>
          <Button variant="default" onClick={handleReset}>Сбросить</Button>
          <Button onClick={handleSave}>Сохранить</Button>
        </Group>
      </Stack>
    </div>
  );
}
