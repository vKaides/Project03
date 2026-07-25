import type { WeeklyScheduleEntry } from '../types/anime';

interface ScheduleViewProps {
  schedule: WeeklyScheduleEntry[];
  loading: boolean;
  error: string | null;
}

const weekdayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function groupScheduleByDay(schedule: WeeklyScheduleEntry[]) {
  const groups = weekdayLabels.map((label) => ({
    label,
    items: [] as WeeklyScheduleEntry[],
  }));

  schedule.forEach((entry) => {
    const date = new Date(entry.airingAt * 1000);
    const dayIndex = date.getDay();
    groups[dayIndex].items.push(entry);
  });

  return groups;
}

export function ScheduleView({ schedule, loading, error }: ScheduleViewProps) {
  if (loading) {
    return <p className="state-message">Loading weekly schedule...</p>;
  }

  if (error) {
    return <p className="state-message state-error">Error: {error}</p>;
  }

  const groupedSchedule = groupScheduleByDay(schedule);

  return (
    <div className="schedule-page">
      <p className="schedule-description">
        Upcoming anime for the next 7 days, grouped by weekday.
      </p>

      <div className="schedule-grid">
        {groupedSchedule.map((group) => (
          <section key={group.label} className="schedule-day-card">
            <h3>{group.label}</h3>

            {group.items.length === 0 ? (
              <p className="schedule-empty">No releases scheduled</p>
            ) : (
              <ul className="schedule-day-list">
                {group.items.map((entry) => {
                  const date = new Date(entry.airingAt * 1000);
                  const timeLabel = date.toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                  });
                  const title = entry.media.title.english || entry.media.title.romaji;

                  return (
                    <li key={`${entry.media.id}-${entry.episode}-${entry.airingAt}`} className="schedule-item">
                      <div className="schedule-item-title">{title}</div>
                      <div className="schedule-item-meta">
                        <span>Ep {entry.episode}</span>
                        <span>{timeLabel}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
