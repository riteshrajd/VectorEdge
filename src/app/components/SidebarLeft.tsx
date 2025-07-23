import React, { useCallback, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Settings,
  Filter

} from 'lucide-react';

import Image from 'next/image';
import InstrumentHistoryList from './sidebar-left-components/InstrumentHistoryList';
import { useStore } from '@/store/store';
import InstrumentSearchList from './sidebar-left-components/InstrumentSearchList';

// Icon mapping type
const SidebarLeft = () => {
  const sub: string = 'Lite';
  const store = useStore();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchClick = useCallback(() => {
    if (store.isLeftCollapsed) {
      store.setIsLeftCollapsed();
    }
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 300); // Delay to ensure the sidebar has expanded
  }, [store])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'k') {
        e.preventDefault();
        handleSearchClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSearchClick]);
  
  return (
    <aside
      className={`${
        store.isLeftCollapsed ? "w-14" : "w-62"
      } bg-[var(--bg-primary)] text-[var(--text-primary)] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] border-r border-[var(--border)] flex flex-col overflow-clip`}
    >
      {/* Header with toggle */}
      <div className="flex items-center justify-between p-3 border-b border-[var(--border)]">
        {!store.isLeftCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[var(--bg-secondary)]">
              <Image
                src={"/assets/images/logo1.png"}
                alt="VectorEdge Pro Logo"
                width={22}
                height={22}
                className="block shrink-0"
              />
            </div>
            <span className="font-bold text-base shrink-0 pb-1">VectorEdge 
              <span className=
                {`${sub==='Lite' ? 'text-[var(--text-muted)] rounded-xl font-quicksand text-sm font-light px-1' : ''}
                ${sub==='Plus' ? 'border border-[var(--text-muted)] ml-1 text-[var(--text-primary)] rounded-xl font-roboto font-light px-1' : ''}
                ${sub==='Pro' ? 'border-2 border-[var(--text-muted)] text-[var(--text-Primary)] rounded-lg ml-1 pb-0.5 px-1' : ''}`}>
                {sub}
              </span>
            </span>
          </div>
        )}
        <button
          onClick={store.setIsLeftCollapsed}
          className="p-1.5 hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
          aria-label={store.isLeftCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {store.isLeftCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Search Bar */}
      <div className={`p-3 border-b border-[var(--border)]`}>
        {store.isLeftCollapsed ? (
          <button
            className="w-full p-1 hover:bg-[var(--bg-hover)] rounded-lg transition-colors flex justify-center"
            aria-label="Search"
            onClick={handleSearchClick}
          >
            <Search size={16} />
          </button>
        ) : (
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]"
              size={14}
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search (alt+k)"
              value={store.searchTerm}
              onChange={(e) => store.setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg text-sm focus:outline-none focus:border-[var(--accent)] focus:border-opacity-50 transition-colors"
            />
          </div>
        )}
      </div>

      <div className='flex-1 w-full overflow-hidden'>
        { store.searchTerm.trim() ? <InstrumentSearchList /> : <InstrumentHistoryList /> }
      </div>

      {/* Collapsed state bottom buttons */}
      <div className={` flex p-1.5 border-t border-[var(--border)] pl-3`}>
        <div className="flex flex-col space-y-1.5">
          <button
            className="p-1.5 hover:bg-[var(--bg-hover)] rounded-lg transition-colors flex justify-center"
            aria-label="Settings"
          >
            <Settings size={16} />
          </button>
          <button
            className="p-1.5 hover:bg-[var(--bg-hover)] rounded-lg transition-colors flex justify-center"
            aria-label="Filter"
          >
            <Filter size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SidebarLeft;