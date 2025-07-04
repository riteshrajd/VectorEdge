"use client";

import React, { useState, useCallback } from 'react';
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611
import { ChevronLeft, ChevronRight, Search, TrendingUp, BarChart3, PieChart, Activity, DollarSign, Globe, Building2, Fuel, Landmark, Star, Settings, Filter, DivideIcon as LucideIcon, Zap, Info, Tv2, Eye } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
<<<<<<< HEAD
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611
=======
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611

// Import types and data
import { 
  SidebarLeftProps, 
  Instrument, 
  TabType, 
  ChangeData 
} from '../types';
import { stocksData, futuresData } from '../data/tradingData';

// Icon mapping type
type IconMap = Record<string, LucideIcon>;

const SidebarLeft: React.FC<SidebarLeftProps> = ({ onItemSelect }) => {
<<<<<<< HEAD
<<<<<<< HEAD
  const sub : string = 'Lite';
=======
  const sub: string = 'Pro';
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611
=======
  const sub: string = 'Pro';
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611

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
<<<<<<< HEAD
<<<<<<< HEAD
      colorClass: isPositive ? 'text-[var(--positive)]' : 'text-[var(--negative)]'
=======
      colorClass: isPositive ? 'text-green-500' : 'text-red-500'
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611
=======
      colorClass: isPositive ? 'text-green-500' : 'text-red-500'
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611
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
<<<<<<< HEAD
<<<<<<< HEAD
        isCollapsed ? "w-14" : "w-62"
      } bg-[var(--bg-primary)] text-[var(--text-primary)] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] border-r border-[var(--border)] flex flex-col overflow-clip`}
    >
      {/* Header with toggle */}
      <div className="flex items-center justify-between p-3 border-b border-[var(--border)]">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[var(--bg-secondary)]">
=======
        isCollapsed ? "w-16" : "w-80"
      } bg-background border-r border-border transition-all duration-300 ease-in-out flex flex-col overflow-hidden`}
    >
      {/* Header with toggle */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 p-1.5 shadow-lg">
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611
              <Image
                src="/assets/images/logo.png"
                alt="VectorEdge Pro Logo"
<<<<<<< HEAD
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
=======
                width={20}
                height={20}
                className="h-full w-full object-contain brightness-0 invert dark:invert-0"
                priority
              />
            </div>
=======
        isCollapsed ? "w-16" : "w-80"
      } bg-background border-r border-border transition-all duration-300 ease-in-out flex flex-col overflow-hidden`}
    >
      {/* Header with toggle */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 p-1.5 shadow-lg">
              <Image
                src="/assets/images/logo.png"
                alt="VectorEdge Pro Logo"
                width={20}
                height={20}
                className="h-full w-full object-contain brightness-0 invert dark:invert-0"
                priority
              />
            </div>
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-foreground font-quicksand">
                VectorEdge
              </span>
              <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
<<<<<<< HEAD
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611
=======
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611
                {sub}
              </span>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
          className="h-8 w-8"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-border">
        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="w-full h-10">
                <Search size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Search instruments</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611
=======
          className="h-8 w-8"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-border">
        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="w-full h-10">
                <Search size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Search instruments</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611
            <input
              type="text"
              placeholder="Search instruments..."
              value={searchTerm}
              onChange={handleSearchChange}
<<<<<<< HEAD
<<<<<<< HEAD
              className="w-full pl-9 pr-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg text-sm focus:outline-none focus:border-[var(--accent)] focus:border-opacity-50 transition-colors"
=======
              className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611
=======
              className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611
            />
          </div>
        )}
      </div>

<<<<<<< HEAD
<<<<<<< HEAD
      {/* Tabs */}
      {!isCollapsed ? (
        <div className="flex border-b border-[var(--border)]">
          <button
            onClick={() => handleTabChange("stocks")}
            className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
              activeTab === "stocks"
                ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] border-b-2 border-[var(--accent-hard)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
            }`}
          >
            Stocks
          </button>
          <button
            onClick={() => handleTabChange("futures")}
            className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
              activeTab === "futures"
                ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] border-b-2 border-[var(--accent-hard)]"
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
=======
      {/* Action Buttons */}
      <div className="p-4 border-b border-border">
        <div className={`grid ${isCollapsed ? 'grid-cols-1 gap-2' : 'grid-cols-6 gap-2'}`}>
          {[
            { icon: Settings, tooltip: "Settings" },
            { icon: Info, tooltip: "Information" },
            { icon: Fuel, tooltip: "Energy" },
            { icon: Tv2, tooltip: "Media" },
            { icon: Zap, tooltip: "Quick Actions" },
            { icon: Filter, tooltip: "Filter" }
          ].map(({ icon: Icon, tooltip }, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Icon size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side={isCollapsed ? "right" : "top"}>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Tabs */}
      {!isCollapsed ? (
        <div className="px-4 py-2 border-b border-border">
          <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as TabType)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stocks" className="text-sm">Stocks</TabsTrigger>
              <TabsTrigger value="futures" className="text-sm">Futures</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      ) : (
=======
      {/* Action Buttons */}
      <div className="p-4 border-b border-border">
        <div className={`grid ${isCollapsed ? 'grid-cols-1 gap-2' : 'grid-cols-6 gap-2'}`}>
          {[
            { icon: Settings, tooltip: "Settings" },
            { icon: Info, tooltip: "Information" },
            { icon: Fuel, tooltip: "Energy" },
            { icon: Tv2, tooltip: "Media" },
            { icon: Zap, tooltip: "Quick Actions" },
            { icon: Filter, tooltip: "Filter" }
          ].map(({ icon: Icon, tooltip }, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Icon size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side={isCollapsed ? "right" : "top"}>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Tabs */}
      {!isCollapsed ? (
        <div className="px-4 py-2 border-b border-border">
          <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as TabType)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stocks" className="text-sm">Stocks</TabsTrigger>
              <TabsTrigger value="futures" className="text-sm">Futures</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      ) : (
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611
        <div className="flex justify-center py-2 border-b border-border">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Filter size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Toggle view</p>
            </TooltipContent>
          </Tooltip>
<<<<<<< HEAD
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611
=======
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611
        </div>
      )}

      {/* Instruments List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="space-y-1 p-2">
          {filteredData().map((item: Instrument) => {
            const IconComponent = getIconForSymbol(item.symbol, activeTab);
            const changeData = formatChange(item.change, item.changePercent);
            const isFavorite = favorites.has(item.symbol);

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
            return (
              <Card
                key={item.symbol}
                className="p-3 cursor-pointer hover:bg-accent/50 transition-all duration-200 border-0 bg-muted/20 hover:shadow-md group"
                onClick={() => handleItemClick(item)}
              >
                <div className="flex items-center space-x-3">
                  {/* Icon */}
                  <div
                    className={`${
                      isCollapsed ? "mx-auto" : ""
                    } w-10 h-10 rounded-full flex items-center justify-center shadow-sm`}
                    style={{ backgroundColor: item.color }}
                  >
                    <IconComponent size={18} className="text-white" />
                  </div>

                  {!isCollapsed && (
                    <>
                      {/* Symbol and Name */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm truncate text-foreground">
                            {item.symbol}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleFavoriteClick(e, item.symbol)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                          >
                            <Star
                              size={12}
                              className={
                                isFavorite
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }
                            />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.name}
                        </p>
                      </div>

                      {/* Price and Change */}
                      <div className="text-right">
                        <div className="text-sm font-semibold font-mono text-foreground">
                          {formatPrice(item.price)}
                        </div>
                        <div className={`text-xs font-mono ${changeData.colorClass}`}>
                          {changeData.change}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Collapsed state bottom buttons */}
=======
            return (
              <Card
                key={item.symbol}
                className="p-3 cursor-pointer hover:bg-accent/50 transition-all duration-200 border-0 bg-muted/20 hover:shadow-md group"
                onClick={() => handleItemClick(item)}
              >
                <div className="flex items-center space-x-3">
                  {/* Icon */}
                  <div
                    className={`${
                      isCollapsed ? "mx-auto" : ""
                    } w-10 h-10 rounded-full flex items-center justify-center shadow-sm`}
                    style={{ backgroundColor: item.color }}
                  >
                    <IconComponent size={18} className="text-white" />
                  </div>

                  {!isCollapsed && (
                    <>
                      {/* Symbol and Name */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm truncate text-foreground">
                            {item.symbol}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleFavoriteClick(e, item.symbol)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                          >
                            <Star
                              size={12}
                              className={
                                isFavorite
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }
                            />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.name}
                        </p>
                      </div>

                      {/* Price and Change */}
                      <div className="text-right">
                        <div className="text-sm font-semibold font-mono text-foreground">
                          {formatPrice(item.price)}
                        </div>
                        <div className={`text-xs font-mono ${changeData.colorClass}`}>
                          {changeData.change}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Collapsed state bottom buttons */}
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611
      {isCollapsed && (
        <div className="p-2 border-t border-border">
          <div className="flex flex-col space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Watchlist</p>
              </TooltipContent>
            </Tooltip>
<<<<<<< HEAD
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611
=======
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611
          </div>
        </div>
    </aside>
  );
};

export default SidebarLeft;