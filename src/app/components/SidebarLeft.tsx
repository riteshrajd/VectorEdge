import React, { useState } from 'react';
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
  Filter
} from 'lucide-react';

// Import your data
import { stocksData, futuresData } from '../data/tradingData';

export default function SidebarLeft({ onItemSelect}: {onItemSelect: null} ) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('stocks');
  const [favorites, setFavorites] = useState(new Set());

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleFavorite = (symbol: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(symbol)) {
      newFavorites.delete(symbol);
    } else {
      newFavorites.add(symbol);
    }
    setFavorites(newFavorites);
  };

  const getIconForSymbol = (symbol: string): string => {
    const iconMap = {
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
  };

  const filteredData = () => {
    const data = activeTab === 'stocks' ? stocksData : futuresData;
    return data.filter(item => 
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatChange = (change: number, changePercent: number) => {
    const isPositive = change >= 0;
    return {
      change: isPositive ? `+${change.toFixed(2)}` : change.toFixed(2),
      changePercent: isPositive ? `+${changePercent.toFixed(2)}%` : `${changePercent.toFixed(2)}%`,
      colorClass: isPositive ? 'text-green-400' : 'text-red-400'
    };
  };

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-72'} bg-zinc-900 text-white transition-all duration-300 ease-in-out border-r border-zinc-800 flex flex-col`}>
      {/* Header with toggle */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
            <span className="font-bold text-lg">VectorEdge Pro</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-zinc-800">
        {isCollapsed ? (
          <button className="w-full p-2 hover:bg-zinc-800 rounded-lg transition-colors flex justify-center">
            <Search size={18} />
          </button>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={16} />
            <input
              type="text"
              placeholder="Search instruments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {!isCollapsed && (
        <div className="p-4 border-b border-zinc-800">
          <div className="flex space-x-2">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1">
              <Plus size={14} />
              <span>Compare Model</span>
            </button>
            <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
              <Filter size={16} />
            </button>
            <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
              <Settings size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      {!isCollapsed && (
        <div className="flex border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('stocks')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'stocks'
                ? 'bg-zinc-800 text-white border-b-2 border-blue-500'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            Stocks
          </button>
          <button
            onClick={() => setActiveTab('futures')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'futures'
                ? 'bg-zinc-800 text-white border-b-2 border-blue-500'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            Futures
          </button>
        </div>
      )}

      {/* Instruments List */}
      <div className="flex-1 overflow-y-auto">
        {filteredData().map((item) => {
          const IconComponent = getIconForSymbol(item.symbol, activeTab);
          const changeData = formatChange(item.change, item.changePercent);
          const isFavorite = favorites.has(item.symbol);

          return (
            <div
              key={item.symbol}
              onClick={() => onItemSelect && onItemSelect(item)}
              className="flex items-center p-3 hover:bg-zinc-800 cursor-pointer border-b border-zinc-800/50 transition-colors group"
            >
              {/* Icon */}
              <div className={`${isCollapsed ? 'mx-auto' : 'mr-3'} w-8 h-8 rounded-full flex items-center justify-center`} 
                   style={{ backgroundColor: item.color }}>
                <IconComponent size={16} className="text-white" />
              </div>

              {!isCollapsed && (
                <>
                  {/* Symbol and Name */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm truncate">{item.symbol}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.symbol);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Star 
                          size={14} 
                          className={isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-400'} 
                        />
                      </button>
                    </div>
                    <p className="text-xs text-zinc-400 truncate">{item.name}</p>
                  </div>

                  {/* Price and Change */}
                  <div className="text-right ml-2">
                    <div className="text-sm font-medium">{formatPrice(item.price)}</div>
                    <div className={`text-xs ${changeData.colorClass}`}>
                      {changeData.change}
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Collapsed state icons */}
      {isCollapsed && (
        <div className="p-2 border-t border-zinc-800">
          <div className="flex flex-col space-y-2">
            <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors flex justify-center">
              <Settings size={18} />
            </button>
            <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors flex justify-center">
              <Filter size={18} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}