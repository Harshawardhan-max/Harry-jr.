import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg border border-slate-400 px-3 py-2 text-sm text-slate-800 transition hover:bg-slate-200 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      {theme === 'dark' ? '☀ Light' : '🌙 Dark'}
    </button>
  );
};

export default ThemeToggle;
