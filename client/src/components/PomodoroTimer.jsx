import { useEffect, useMemo, useState } from 'react';

const DEFAULT_SECONDS = 25 * 60;

const PomodoroTimer = () => {
  const [seconds, setSeconds] = useState(DEFAULT_SECONDS);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || seconds <= 0) return;
    const timer = setInterval(() => setSeconds((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [running, seconds]);

  const formatted = useMemo(() => {
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  }, [seconds]);

  return (
    <div className="rounded-xl bg-white p-4 shadow-md dark:bg-slate-900">
      <h3 className="mb-3 text-lg font-semibold">Pomodoro</h3>
      <p className="text-3xl font-bold text-brand-500">{formatted}</p>
      <div className="mt-3 flex gap-2">
        <button onClick={() => setRunning((r) => !r)} className="rounded bg-brand-500 px-3 py-1 text-white">
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setSeconds(DEFAULT_SECONDS);
          }}
          className="rounded border border-slate-400 px-3 py-1"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
