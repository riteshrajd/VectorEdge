import React, { useState, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Activity,
  DollarSign,
  Globe,
  Building2,
  Fuel,
  Landmark,
  Star,
  Settings,
  Filter,
  LucideIcon,
  Zap,
  Info,
  Tv2
} from 'lucide-react';

// Import types and data
import { 
  SidebarLeftProps, 
  Instrument, 
  TabType, 
  ChangeData 
} from '../types';
import { stocksData, futuresData } from '../data/tradingData';
import Image from 'next/image';

// Icon mapping type
type IconMap = Record<string, LucideIcon>;

const SidebarLeft: React.FC<SidebarLeftProps> = ({ onItemSelect }) => {
  const sub : string = 'Lite';

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabType>('stocks');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const toggleSidebar = useCallback((): void => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed]);

  const toggleFavorite = useCallback((symbol: string): void => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(symbol)) {
      newFavorites.delete(symbol);
    } else {
      newFavorites.add(symbol);
    }
    setFavorites(newFavorites);
  }, [favorites]);

  const getIconForSymbol = useCallback((symbol: string, category: TabType): LucideIcon => {
    const iconMap: IconMap = {
      // Stocks
      'NIFTY': TrendingUp,
      'BANKNIFTY': Building2,
      'SENSEX': BarChart3,
      'CNXIT': Globe,
      'SPX': DollarSign,
      'RELIANCE': Fuel,
      'AXISBANK': Landmark,
      'HDFCBANK': Landmark,
      'ICICIBANK': Landmark,
      'BAJFINANCE': Building2,
      // Futures
      'NIFTYFUT': Activity,
      'BANKNIFTYFUT': Building2,
    };
    
    return iconMap[symbol] || PieChart;
  }, []);

  const filteredData = useCallback((): Instrument[] => {
    const data = activeTab === 'stocks' ? stocksData : futuresData;
    return data.filter((item: Instrument) => 
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activeTab, searchTerm]);

  const formatPrice = useCallback((price: number): string => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  }, []);

  const formatChange = useCallback((change: number, changePercent: number): ChangeData => {
    const isPositive = change >= 0;
    return {
      change: isPositive ? `+${change.toFixed(2)}` : change.toFixed(2),
      changePercent: isPositive ? `+${changePercent.toFixed(2)}%` : `${changePercent.toFixed(2)}%`,
      colorClass: isPositive ? 'text-[var(--positive)]' : 'text-[var(--negative)]'
    };
  }, []);

  const handleItemClick = useCallback((item: Instrument): void => {
    onItemSelect?.(item);
  }, [onItemSelect]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  }, []);

  const handleTabChange = useCallback((tab: TabType): void => {
    setActiveTab(tab);
  }, []);

  const handleFavoriteClick = useCallback((e: React.MouseEvent, symbol: string): void => {
    e.stopPropagation();
    toggleFavorite(symbol);
  }, [toggleFavorite]);

  return (
    <aside
      className={`${
        isCollapsed ? "w-14" : "w-62"
      } bg-[var(--bg-primary)] text-[var(--text-primary)] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] border-r border-[var(--border)] flex flex-col overflow-clip`}
    >
      {/* Header with toggle */}
      <div className="flex items-center justify-between p-3 border-b border-[var(--border)]">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[var(--bg-secondary)]">
              <Image
                src={"/assets/images/logo.png"}
                alt="VectorEdge Pro Logo"
                width={16}
                height={16}
                className="block shrink-0"
              />
            </div>
            <span className="font-bold text-base shrink-0">VectorEdge 
              <span className=
                {`${sub==='Lite' ? 'text-[var(--text-muted)] rounded-xl font-quicksand text-sm font-light px-1' : ''}
                ${sub==='Plus' ? 'border border-[var(--border)] ml-1 text-[var(--text-primary)] rounded-xl font-roboto font-light px-1' : ''}
                ${sub==='Pro' ? 'border border-[var(--accent)] text-[var(--accent)] rounded-lg ml-1 pb-0.5 px-1' : ''}`}>
                {sub}
              </span>
            </span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-[var(--border)]">
        {isCollapsed ? (
          <button
            className="w-full p-1.5 hover:bg-[var(--bg-hover)] rounded-lg transition-colors flex justify-center"
            aria-label="Search"
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
              type="text"
              placeholder="Search instruments..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg text-sm focus:outline-none focus:border-[var(--accent)] focus:border-opacity-50 transition-colors"
            />
          </div>
        )}
      </div>

      {/* Tabs */}
      {!isCollapsed ? (
        <div className="flex border-b border-[var(--border)]">
          <button
            onClick={() => handleTabChange("stocks")}
            className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
              activeTab === "stocks"
                ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] border-b-2 border-[var(--accent-main)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
            }`}
          >
            Stocks
          </button>
          <button
            onClick={() => handleTabChange("futures")}
            className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
              activeTab === "futures"
                ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] border-b-2 border-[var(--accent-main)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
            }`}
          >
            Futures
          </button>
        </div>
      ) : (
        <div className="flex justify-center border-b border-[var(--border)] min-h-10">
          <button
            className="p-1.5 my-4 hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
            aria-label="Filter"
          >
            <Filter size={16} />
          </button>
        </div>
      )}

      {/* Instruments List */}
      <div className="flex-1 overflow-y-auto">
        {filteredData().map((item: Instrument) => {
          const IconComponent = getIconForSymbol(item.symbol, activeTab);
          const changeData = formatChange(item.change, item.changePercent);
          const isFavorite = favorites.has(item.symbol);

          return (
            <div
              key={item.symbol}
              onClick={() => handleItemClick(item)}
              className={`flex items-center p-2 ${!isCollapsed ? 'pr-3':''} hover:bg-[var(--bg-hover)] cursor-pointer border-b border-[var(--border-secondary)] transition-colors group`}
            >
              {/* Icon */}
              <div
                className={`${
                  isCollapsed ? "mx-auto" : "mr-2"
                } w-7 h-7 rounded-full flex items-center justify-center`}
                style={{ backgroundColor: item.color }}
              >
                <IconComponent size={16} className="text-[var(--text-primary)]" />
              </div>

              {!isCollapsed && (
                <>
                  {/* Symbol and Name */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm truncate">
                        {item.symbol}
                      </span>
                      <button
                        onClick={(e) => handleFavoriteClick(e, item.symbol)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={
                          isFavorite
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                      >
                        <Star
                          size={14}
                          className={
                            isFavorite
                              ? "fill-[var(--star-fill)] text-[var(--star-fill)]"
                              : "text-[var(--text-muted)]"
                          }
                        />
                      </button>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] truncate leading-tight">
                      {item.name}
                    </p>
                  </div>

                  {/* Price and Change */}
                  <div className="text-right ml-1">
                    <div className="text-sm font-medium font-mono">
                      {formatPrice(item.price)}
                    </div>
                    <div
                      className={`text-xs font-mono ${changeData.colorClass}`}
                    >
                      {changeData.change}
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
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