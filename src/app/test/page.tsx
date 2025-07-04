'use client';
import React, { useState, useRef } from 'react';

const themes = ['theme-dark', 'theme-blue', ''];

export default function Page() {
  const [themeIndex, setThemeIndex] = useState(0);

  const [leftWidth, setLeftWidth] = useState(200); // initial px width
  const [rightWidth, setRightWidth] = useState(200);

  const leftResizing = useRef(false);
  const rightResizing = useRef(false);

  const toggleTheme = () => {
    document.body.classList.remove(...themes.filter(Boolean));
    const nextIndex = (themeIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    if (nextTheme) document.body.classList.add(nextTheme);
    setThemeIndex(nextIndex);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (leftResizing.current) {
      setLeftWidth(Math.max(100, e.clientX));
    }
    if (rightResizing.current) {
      setRightWidth(Math.max(100, window.innerWidth - e.clientX));
    }
  };

  const handleMouseUp = () => {
    leftResizing.current = false;
    rightResizing.current = false;
    document.body.style.cursor = 'default';
  };

  const startResizingLeft = () => {
    leftResizing.current = true;
    document.body.style.cursor = 'col-resize';
  };

  const startResizingRight = () => {
    rightResizing.current = true;
    document.body.style.cursor = 'col-resize';
  };

  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-body)] text-[var(--text-color)]">
      {/* Header */}
      <header className="p-4 text-xl font-semibold bg-[var(--bg-header)] border-b border-[var(--border-color)] flex justify-between items-center">
        My Themed Page
        <button
          onClick={toggleTheme}
          className="px-3 py-1 rounded bg-white text-black hover:bg-gray-200"
        >
          Toggle Theme
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <aside
          className={`p-4 bg-[var(--bg-sidebar)] border-r border-[var(--border-color)]`}
          style={{ width: `${leftWidth}px`, minWidth: `${Math.max(leftWidth, 300)}px`}}
        >
          <p>Left Sidebar</p>
        </aside>
        {/* Left Resizer */}
        <div
          onMouseDown={startResizingLeft}
          className="w-1 cursor-col-resize bg-[var(--border-color)]"
        />

        {/* Center Content */}
        <main className="flex-1 p-4">
          <p className="text-lg">This is the center content area.</p>
        </main>

        {/* Right Resizer */}
        <div
          onMouseDown={startResizingRight}
          className="w-1 cursor-col-resize bg-[var(--border-color)]"
        />

        {/* Right Sidebar */}
        <aside
          className={`p-4 bg-[var(--bg-sidebar)] min-w-[400px] border-l border-[var(--border-color)]`}
          style={{ width: `${rightWidth}px`, maxWidth: `${Math.max(rightWidth, 200)}px`}}
        >
          <p>Right Sidebar</p>
        </aside>
      </div>
    </div>
  );
}
