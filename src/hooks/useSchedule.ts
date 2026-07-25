import { useEffect, useState } from 'react';
import type { WeeklyScheduleEntry } from '../types/anime';

const FALLBACK_SCHEDULE: WeeklyScheduleEntry[] = [
  {
    airingAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    episode: 1,
    media: {
      id: 9991,
      title: {
        romaji: 'Sample Weekly Release',
        english: 'Sample Weekly Release',
      },
    },
  },
  {
    airingAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 2,
    episode: 2,
    media: {
      id: 9992,
      title: {
        romaji: 'Another Upcoming Anime',
        english: 'Another Upcoming Anime',
      },
    },
  },
];

export function useSchedule() {
  const [schedule] = useState<WeeklyScheduleEntry[]>(FALLBACK_SCHEDULE);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      // no-op: keep the schedule view available without remote data
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return {
    schedule,
    loading,
    error,
  };
}
