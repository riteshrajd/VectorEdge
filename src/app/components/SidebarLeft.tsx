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
  Plus,
  Settings,
  Filter,
  LucideIcon,
  Zap,
  FuelIcon,
  PiIcon,
  TvIcon,
  Tv2Icon,
  InfoIcon,
  Cog
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
      colorClass: isPositive ? 'text-green-400' : 'text-red-400'
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
        isCollapsed ? "w-16" : "w-72"
      } bg-zinc-950 text-white transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] border-r border-zinc-800 flex flex-col overflow-hidden`}
    >
      {/* Header with toggle */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <Image
                src={"/assets/images/logo.png"}
                alt="VectorEdge Pro Logo"
                width={20}
                height={20}
                className="block shrink-0" // Ensures image is always visible
              />
            </div>
            <span className="font-bold text-lg shrink-0">VectorEdge <span>Pro</span></span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-zinc-800">
        {isCollapsed ? (
          <button
            className="w-full p-2 hover:bg-zinc-800 rounded-lg transition-colors flex justify-center"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        ) : (
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search instruments..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {
        <div className="p-4 border-b border-zinc-800">
          <div className="flex space-x-2 justify-evenly">
            <button
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              aria-label="Filter"
            >
              <Settings size={16} />
            </button>
            <button
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              aria-label="Filter"
            >
              <InfoIcon size={16} />
            </button>
            <button
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              aria-label="Filter"
            >
              <FuelIcon size={16} />
            </button>
            <button
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              aria-label="Filter"
            >
              <Tv2Icon size={16} />
            </button>
            <button
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              aria-label="Filter"
            >
              <Zap size={16} />
            </button>
            <button
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              aria-label="Settings"
            >
              <Filter size={16} />
            </button>
          </div>
        </div>
      }

      {/* Tabs */}
      {!isCollapsed ? (
        <div className="flex border-b border-zinc-800">
          <button
            onClick={() => handleTabChange("stocks")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "stocks"
                ? "bg-zinc-800 text-white border-b-2 border-white"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            Stocks
          </button>
          <button
            onClick={() => handleTabChange("futures")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "futures"
                ? "bg-zinc-800 text-white border-b-2 border-white"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            Futures
          </button>
        </div>
      ) : (
        <div className="flex justify-center border-b border-zinc-800 min-h-12.5">
          <button
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            aria-label="Settings"
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
              className="flex items-center p-3 hover:bg-zinc-800 cursor-pointer border-b border-zinc-800/50 transition-colors group"
            >
              {/* Icon */}
              <div
                className={`${
                  isCollapsed ? "mx-auto" : "mr-3"
                } w-8 h-8 rounded-full flex items-center justify-center`}
                style={{ backgroundColor: item.color }}
              >
                <IconComponent size={16} className="text-white" />
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
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-zinc-400"
                          }
                        />
                      </button>
                    </div>
                    <p className="text-xs text-zinc-400 truncate">
                      {item.name}
                    </p>
                  </div>

                  {/* Price and Change */}
                  <div className="text-right ml-2">
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
      {isCollapsed && (
        <div className="p-2 border-t border-zinc-800">
          <div className="flex flex-col space-y-2">
            <button
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors flex justify-center"
              aria-label="Settings"
            >
              <Settings size={18} />
            </button>
            <button
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors flex justify-center"
              aria-label="Filter"
            >
              <Filter size={18} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default SidebarLeft;