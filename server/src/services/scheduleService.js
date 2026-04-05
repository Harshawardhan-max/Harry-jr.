export const buildSchedule = ({ tasks, totalMinutes, productivityScore = 50 }) => {
  const sorted = [...tasks].sort((a, b) => (b.importance || 3) - (a.importance || 3));

  const maxContinuous = 90;
  const breakDuration = 10;
  let clock = 0;
  let continuousWork = 0;

  const timeline = [];

  for (const task of sorted) {
    const effortModifier = productivityScore > 70 ? 0.9 : productivityScore < 40 ? 1.1 : 1;
    const taskDuration = Math.max(10, Math.round((task.estimatedMinutes || 30) * effortModifier));

    if (clock + taskDuration > totalMinutes) {
      break;
    }

    if (continuousWork + taskDuration > maxContinuous) {
      timeline.push({
        type: 'break',
        title: 'Recovery break',
        duration: breakDuration,
        startMinute: clock,
        endMinute: clock + breakDuration
      });
      clock += breakDuration;
      continuousWork = 0;
    }

    timeline.push({
      type: 'task',
      title: task.title,
      importance: task.importance || 3,
      duration: taskDuration,
      startMinute: clock,
      endMinute: clock + taskDuration
    });

    clock += taskDuration;
    continuousWork += taskDuration;
  }

  return timeline;
};
