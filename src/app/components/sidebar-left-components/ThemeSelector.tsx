// ThemeSelector.tsx
import React, { useCallback, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';

const ThemeSelector: React.FC<{
  onBack: () => void;
  isOpen: boolean;
  setTheme: (theme: string) => void;
}> = ({ onBack, isOpen, setTheme }) => {
  const themes = [
    'dark-theme',
    'light-theme',
    'high-contrast-theme',
    'vibrant-theme',
    'pastel-theme',
    'midnight-theme',
    'solarized-theme',
    'monochrome-theme',
  ];

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || '';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  const handleThemeSelect = useCallback((theme: string) => {
    setTheme(theme);
    localStorage.setItem('theme', theme);
  }, [setTheme]);

  if (!isOpen) return null;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-start p-2 overflow-clip font-roboto font-extralight text-[var(--text-primary)]">
      <Image
        alt="Background gradient"
        fill
        src="/assets/images/image.png"
        className="absolute -z-10 object-cover brightness-120"
        priority
        quality={100}
      />
      <div className="relative z-10 w-full">
        {/* Header with Back Arrow */}
        <div className="flex items-center p-2 border-b border-[var(--border)]">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
            aria-label="Back to header"
          >
            <ChevronLeft size={16} />
          </button>
          <h3 className="ml-2 text-sm font-medium text-[var(--text-primary)]">Select Theme</h3>
        </div>

        {/* Theme List */}
        <div className="flex flex-col p-2 space-y-1">
          {themes.map((theme) => (
            <button
              key={theme}
              onClick={() => handleThemeSelect(theme)}
              className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                document.documentElement.className === theme
                  ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--accent)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              {theme.replace('-theme', '').charAt(0).toUpperCase() + theme.slice(8, -6)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;