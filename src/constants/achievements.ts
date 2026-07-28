import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';

export type AchievementKind = 'totalHours' | 'streakDays' | 'sessions';

export type Achievement = {
  id: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  kind: AchievementKind;
  threshold: number;
};

export const Achievements: Achievement[] = [
  { id: 'hours4', icon: 'paw-outline', kind: 'totalHours', threshold: 4 },
  { id: 'hours24', icon: 'eye-outline', kind: 'totalHours', threshold: 24 },
  { id: 'hours72', icon: 'heart-outline', kind: 'totalHours', threshold: 72 },
  { id: 'hours168', icon: 'shield-outline', kind: 'totalHours', threshold: 168 },
  { id: 'hours360', icon: 'star-outline', kind: 'totalHours', threshold: 360 },
  { id: 'streak3', icon: 'calendar-outline', kind: 'streakDays', threshold: 3 },
  { id: 'streak7', icon: 'calendar-outline', kind: 'streakDays', threshold: 7 },
  { id: 'streak30', icon: 'calendar-outline', kind: 'streakDays', threshold: 30 },
  { id: 'sessions10', icon: 'checkmark-done-outline', kind: 'sessions', threshold: 10 },
  { id: 'sessions50', icon: 'checkmark-done-outline', kind: 'sessions', threshold: 50 },
  { id: 'sessions200', icon: 'checkmark-done-outline', kind: 'sessions', threshold: 200 },
];
