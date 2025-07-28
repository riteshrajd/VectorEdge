'use client';

import { useStore } from '@/store/store';
import { useCallback } from 'react';
import Image from 'next/image';

const ThemeSelector = () => {
  const { selectTheme, setSelectTheme, setSearchTerm } = useStore();
  const themes = [
    { name: 'Dark', className: '', previewColor: 'hsl(0, 0%, 15%)' },
    { name: 'Light', className: 'light-theme', previewColor: 'hsl(0, 0%, 95%)' },
    { name: 'High-Contrast', className: 'high-contrast-theme', previewColor: 'hsl(0, 0%, 0%)' },
    { name: 'Solarized', className: 'solarized-theme', previewColor: 'hsl(30, 20%, 15%)' },
    { name: 'Neon', className: 'neon-theme', previewColor: 'hsl(240, 10%, 10%)' },
    { name: 'TokyoNight', className: 'tokyo-night-theme', previewColor: 'hsl(240, 17%, 10%)' },
  ];

  const setTheme = useCallback((theme: string) => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
    setSearchTerm(''); // Clear search term if needed
  }, [setSearchTerm]);

  if (!selectTheme) return null;

  return (
    <div className="h-full w-full overflow-hidden flex flex-col text-white bg-[var(--bg-primary)]">
      <div className="flex border-b border-[var(--border)]">
        <button
          onClick={() => setSelectTheme(false)}
          className="flex-1 py-2 px-3 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] border-b-2 border-transparent"
        >
          Close
        </button>
      </div>
      <div className="flex-1 h-full overflow-y-auto px-1 pt-1">
        <div className="flex flex-col space-y-2 p-2">
          {themes.map((theme) => (
            <div
              key={theme.className}
              onClick={() => setTheme(theme.className)}
              className="flex items-center cursor-pointer hover:bg-[var(--bg-hover)] rounded-lg p-1 transition-colors"
            >
              <div
                className="w-12 h-6 rounded-lg border border-[var(--border)]"
                style={{ backgroundColor: theme.previewColor }}
              />
              <span className="ml-2 text-sm text-[var(--text-primary)]">{theme.name}</span>
            </div>
          ))}
        </div>
      </div>
      <Image
        alt="Background gradient"
        fill
        src="/assets/images/image.png"
        className="absolute -z-10 object-cover brightness-120 blur-[1px]"
        priority
        quality={100}
      />
    </div>
  );
};

export default ThemeSelector;