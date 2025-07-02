import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  MessageCircle,
  Brain,
  BarChart3,
  TrendingUp,
  Send,
  Bot,
  User,
  Lightbulb,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Trash2,
  RefreshCw,
  Zap,
  X,
  Plus,
  Settings,
  History,
  Bookmark
} from 'lucide-react';

// Types
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'analysis' | 'suggestion' | 'alert';
}

interface AnalysisItem {
  id: string;
  title: string;
  content: string;
  type: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  timestamp: Date;
}

interface SidebarRightProps {
  selectedInstrument?: any;
  isVisible?: boolean;
}

type TabType = 'chat' | 'analysis' | 'suggestions';

const SidebarRight: React.FC<SidebarRightProps> = ({ 
  selectedInstrument, 
  isVisible = true 
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(320);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const resizeRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI trading assistant. How can I help you analyze the markets today?',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sample analysis data
  const [analyses] = useState<AnalysisItem[]>([
    {
      id: '1',
      title: 'Technical Analysis',
      content: 'NIFTY showing bullish momentum with RSI at 65. Strong support at 25,400.',
      type: 'bullish',
      confidence: 78,
      timestamp: new Date(Date.now() - 1000 * 60 * 15)
    },
    {
      id: '2',
      title: 'Market Sentiment',
      content: 'Banking sector showing mixed signals. Recommend cautious approach.',
      type: 'neutral',
      confidence: 65,
      timestamp: new Date(Date.now() - 1000 * 60 * 30)
    }
  ]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Resize functionality
  const startResize = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  const handleResize = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const newWidth = window.innerWidth - e.clientX;
    const minWidth = isCollapsed ? 64 : 280;
    const maxWidth = 600;
    
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setWidth(newWidth);
    }
  }, [isResizing, isCollapsed]);

  const stopResize = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', stopResize);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', stopResize);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleResize, stopResize]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const toggleSidebar = useCallback((): void => {
    setIsCollapsed(!isCollapsed);
    setWidth(isCollapsed ? 320 : 64);
  }, [isCollapsed]);

  const handleSendMessage = useCallback(async (): Promise<void> => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  }, [inputMessage]);

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      'Based on current market conditions, I recommend monitoring the key support levels.',
      'The technical indicators suggest a potential breakout. Keep an eye on volume patterns.',
      'Market sentiment appears mixed. Consider diversifying your portfolio.',
      'RSI levels indicate the instrument might be oversold. This could be a buying opportunity.',
      'I\'ve analyzed the chart patterns and identified potential resistance at current levels.'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = useCallback((e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const clearChat = useCallback((): void => {
    setMessages([{
      id: '1',
      content: 'Chat cleared. How can I assist you?',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }]);
  }, []);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });
  };

  const getAnalysisColor = (type: string): string => {
    switch (type) {
      case 'bullish': return 'text-green-400';
      case 'bearish': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getAnalysisIcon = (type: string) => {
    switch (type) {
      case 'bullish': return <TrendingUp size={16} />;
      case 'bearish': return <AlertTriangle size={16} />;
      default: return <BarChart3 size={16} />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="relative flex">
      {/* Resize Handle */}
      <div
        ref={resizeRef}
        onMouseDown={startResize}
        className={`w-1 bg-zinc-800 hover:bg-blue-500 cursor-ew-resize transition-colors ${
          isResizing ? 'bg-blue-500' : ''
        }`}
        style={{ height: '100vh' }}
      />
      
      <aside
        className="bg-zinc-950 text-white transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] border-l border-zinc-800 flex flex-col overflow"
        style={{ width: `${width}px` }}
      >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
        
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg">AI Assistant</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      {!isCollapsed ? (
        <div className="flex border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
              activeTab === 'chat'
                ? "bg-zinc-800 text-white border-b-2 border-blue-500"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <MessageCircle size={16} />
            <span>Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
              activeTab === 'analysis'
                ? "bg-zinc-800 text-white border-b-2 border-blue-500"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <BarChart3 size={16} />
            <span>Analysis</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center border-b border-zinc-800 py-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`p-2 rounded-lg transition-colors mb-1 ${
              activeTab === 'chat' ? 'bg-zinc-800 text-blue-400' : 'hover:bg-zinc-800'
            }`}
          >
            <MessageCircle size={16} />
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`p-2 rounded-lg transition-colors ${
              activeTab === 'analysis' ? 'bg-zinc-800 text-blue-400' : 'hover:bg-zinc-800'
            }`}
          >
            <BarChart3 size={16} />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'chat' && (
          <>
            {/* Chat Header */}
            {!isCollapsed && (
              <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-zinc-300">AI Online</span>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={clearChat}
                      className="p-1 hover:bg-zinc-700 rounded transition-colors"
                      title="Clear chat"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button className="p-1 hover:bg-zinc-700 rounded transition-colors" title="Settings">
                      <Settings size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] ${
                      isCollapsed ? 'max-w-[90%]' : ''
                    } flex ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'user' 
                          ? 'bg-blue-600' 
                          : 'bg-gradient-to-br from-purple-500 to-blue-600'
                      }`}
                    >
                      {message.sender === 'user' ? (
                        <User size={14} />
                      ) : (
                        <Bot size={14} />
                      )}
                    </div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-zinc-800 text-zinc-100'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs opacity-60 mt-1 block">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Bot size={14} />
                    </div>
                    <div className="bg-zinc-800 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            {!isCollapsed && (
              <div className="p-4 border-t border-zinc-800">
                <div className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about market analysis..."
                    className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'analysis' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!isCollapsed ? (
              <>
                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors flex flex-col items-center space-y-1">
                    <Zap size={16} className="text-yellow-400" />
                    <span className="text-xs">Quick Analysis</span>
                  </button>
                  <button className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors flex flex-col items-center space-y-1">
                    <Target size={16} className="text-green-400" />
                    <span className="text-xs">Price Targets</span>
                  </button>
                </div>

                {/* Current Analysis */}
                {selectedInstrument && (
                  <div className="bg-zinc-800 rounded-lg p-4 mb-4">
                    <h3 className="font-medium text-sm mb-2 flex items-center">
                      <BarChart3 size={16} className="mr-2" />
                      {selectedInstrument.symbol} Analysis
                    </h3>
                    <div className="space-y-2 text-sm text-zinc-300">
                      <div className="flex justify-between">
                        <span>Signal:</span>
                        <span className="text-green-400">Bullish</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Confidence:</span>
                        <span className="text-blue-400">72%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Support:</span>
                        <span>{(selectedInstrument.price * 0.98).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Resistance:</span>
                        <span>{(selectedInstrument.price * 1.02).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Analysis List */}
                {analyses.map((analysis) => (
                  <div key={analysis.id} className="bg-zinc-800 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={getAnalysisColor(analysis.type)}>
                          {getAnalysisIcon(analysis.type)}
                        </div>
                        <h4 className="font-medium text-sm">{analysis.title}</h4>
                      </div>
                      <span className="text-xs text-zinc-400">
                        {formatTime(analysis.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-300 mb-2">{analysis.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-zinc-400">Confidence:</span>
                        <span className={`text-xs font-medium ${getAnalysisColor(analysis.type)}`}>
                          {analysis.confidence}%
                        </span>
                      </div>
                      <button className="text-xs text-blue-400 hover:text-blue-300">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <button className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
                  <Zap size={16} className="text-yellow-400" />
                </button>
                <button className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
                  <Target size={16} className="text-green-400" />
                </button>
                <button className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
                  <BarChart3 size={16} className="text-blue-400" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Collapsed state bottom buttons */}
      {isCollapsed && (
        <div className="p-2 border-t border-zinc-800">
          <div className="flex flex-col space-y-2">
            <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors flex justify-center">
              <Settings size={16} />
            </button>
            <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors flex justify-center">
              <History size={16} />
            </button>
          </div>
        </div>
      )}
    </aside>
    </div>
  );
};

export default SidebarRight;