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
  AlertTriangle,
  Trash2,
  Zap,
  Target,
  Settings,
  History
} from 'lucide-react';
import { Instrument } from '../types';

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
  selectedInstrument?: Instrument;
  isVisible?: boolean;
}

type TabType = 'chat' | 'analysis' | 'suggestions';

const SidebarRight: React.FC<SidebarRightProps> = ({ 
  selectedInstrument, 
  isVisible = true 
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(360);
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
    const minWidth = isCollapsed ? 56 : 260;
    const maxWidth = 500;

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
    setWidth(isCollapsed ? 360 : 56);
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
      case 'bullish': return 'text-[var(--positive)]';
      case 'bearish': return 'text-[var(--negative)]';
      default: return 'text-[var(--neutral)]';
    }
  };

  const getAnalysisIcon = (type: string) => {
    switch (type) {
      case 'bullish': return <TrendingUp size={14} />;
      case 'bearish': return <AlertTriangle size={14} />;
      default: return <BarChart3 size={14} />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="relative flex">
      {/* Resize Handle */}
      <div
        ref={resizeRef}
        onMouseDown={startResize}
        className={`w-[1px] ${isCollapsed ? 'hidden': ''} bg-[var(--bg-primary)] hover:bg-[var(--accent)] cursor-ew-resize transition-colors ${
          isResizing ? 'bg-[var(--accent)]' : ''
        }`}
        style={{ height: '100vh' }}
      />
      <div
        ref={resizeRef}
        onMouseDown={startResize}
        className={`w-[1px] ${isCollapsed ? 'hidden': ''} bg-[var(--border)] hover:bg-[var(--accent)] cursor-ew-resize transition-colors ${
          isResizing ? 'bg-[var(--accent)]' : ''
        }`}
        style={{ height: '100vh' }}
      />
      
      <aside
        className="bg-[var(--bg-primary)] text-[var(--text-primary)] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] border-l border-[var(--border)] flex flex-col overflow"
        style={{ width: `${width}px` }}
      >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[var(--border)]">
        <button
          onClick={toggleSidebar}
          className="p-1.5 hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
        
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-gradient-to-br from-[var(--accent-ai)] to-[var(--accent-secondary-ai)] rounded-lg flex items-center justify-center">
              <Brain size={14} className="text-white" />
            </div>
            <span className="font-semibold text-base">Vector AI</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      {!isCollapsed ? (
        <div className="flex border-b border-[var(--border)]">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2 px-3 text-xs font-medium transition-colors flex items-center justify-center space-x-1 ${
              activeTab === 'chat'
                ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] border-b-2 border-[var(--accent-hard)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
            }`}
          >
            <MessageCircle size={14} />
            <span>Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex-1 py-2 px-3 text-xs font-medium transition-colors flex items-center justify-center space-x-1 ${
              activeTab === 'analysis'
                ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] border-b-2 border-[var(--accent-hard)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
            }`}
          >
            <BarChart3 size={14} />
            <span>Analysis</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center border-b border-[var(--border)] py-1.5">
          <button
            onClick={() => setActiveTab('chat')}
            className={`p-1.5 rounded-lg transition-colors mb-1 ${
              activeTab === 'chat' ? 'bg-[var(--bg-secondary)] text-[var(--accent-ai)]' : 'hover:bg-[var(--bg-hover)]'
            }`}
          >
            <MessageCircle size={14} />
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`p-1.5 rounded-lg transition-colors ${
              activeTab === 'analysis' ? 'bg-[var(--bg-secondary)] text-[var(--accent-ai)]' : 'hover:bg-[var(--bg-hover)]'
            }`}
          >
            <BarChart3 size={14} />
          </button>
        </div>
      )}

      {/* Content */}
      {isCollapsed ? (<div className='flex-1'></div>) : 
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'chat' && (
          <>
            {/* Chat Header */}
            {!isCollapsed && (
              <div className="p-3 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-[var(--positive)] rounded-full"></div>
                    <span className="text-xs text-[var(--text-muted)]">AI Online</span>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={clearChat}
                      className="p-1 hover:bg-[var(--bg-hover)] rounded transition-colors"
                      title="Clear chat"
                    >
                      <Trash2 size={12} />
                    </button>
                    <button className="p-1 hover:bg-[var(--bg-hover)] rounded transition-colors" title="Settings">
                      <Settings size={12} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] flex ${
                      message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    } items-start space-x-2`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'user' 
                          ? 'bg-[var(--user-bubble)]' 
                          : 'bg-gradient-to-br from-[var(--accent-ai)] to-[var(--accent-secondary-ai)]'
                      }`}
                    >
                      {message.sender === 'user' ? (
                        <User size={12} />
                      ) : (
                        <Bot size={12} />
                      )}
                    </div>
                    <div
                      className={`rounded-lg p-2 text-sm ${
                        message.sender === 'user'
                          ? 'bg-[var(--user-chat-bubble)] text-[var(--text-primary)]'
                          : 'bg-[var(--ai-chat-bubble)] text-[var(--text-primary)]'
                      }`}
                    >
                      <p>{message.content}</p>
                      <span className="text-xs opacity-70 mt-0.5 block">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-[var(--accent-ai)] to-[var(--accent-secondary-ai)] rounded-full flex items-center justify-center">
                      <Bot size={12} />
                    </div>
                    <div className="bg-[var(--ai-bubble)] rounded-lg p-2">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            {!isCollapsed && (
              <div className="p-4 border-t border-[var(--border)]">
                <div className="flex space-x-1.5">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask about market analysis..."
                    className="flex-1 px-2.5 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg text-md focus:outline-none focus:border-[var(--accent)] transition-colors"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="px-3.5 bg-[var(--accent-send)] py-1.5 hover:bg-[var(--accent-send-hover)] rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'analysis' && (
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {!isCollapsed ? (
              <>
                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-1.5 mb-3">
                  <button className="p-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors flex flex-col items-center space-y-0.5">
                    <Zap size={14} className="text-[var(--neutral)]" />
                    <span className="text-2xs">Quick Analysis</span>
                  </button>
                  <button className="p-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors flex flex-col items-center space-y-0.5">
                    <Target size={14} className="text-[var(--positive)]" />
                    <span className="text-2xs">Price Targets</span>
                  </button>
                </div>

                {/* Current Analysis */}
                {selectedInstrument && (
                  <div className="bg-[var(--bg-secondary)] rounded-lg p-3 mb-3">
                    <h3 className="font-medium text-xs mb-1.5 flex items-center">
                      <BarChart3 size={14} className="mr-1.5" />
                      {selectedInstrument.symbol} Analysis
                    </h3>
                    <div className="space-y-1.5 text-xs text-[var(--text-muted)]">
                      <div className="flex justify-between">
                        <span>Signal:</span>
                        <span className="text-[var(--positive)]">Bullish</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Confidence:</span>
                        <span className="text-[var(--accent)]">72%</span>
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
                  <div key={analysis.id} className="bg-[var(--bg-secondary)] rounded-lg p-3">
                    <div className="flex items-start justify-between mb-1.5">
                      <div className="flex items-center space-x-1.5">
                        <div className={getAnalysisColor(analysis.type)}>
                          {getAnalysisIcon(analysis.type)}
                        </div>
                        <h4 className="font-medium text-xs">{analysis.title}</h4>
                      </div>
                      <span className="text-2xs text-[var(--text-muted)]">
                        {formatTime(analysis.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-primary)] mb-1.5">{analysis.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <span className="text-2xs text-[var(--text-muted)]">Confidence:</span>
                        <span className={`text-2xs font-medium ${getAnalysisColor(analysis.type)}`}>
                          {analysis.confidence}%
                        </span>
                      </div>
                      <button className="text-2xs text-[var(--accent)] hover:text-[var(--accent-hover)]">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <button className="p-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors">
                  <Zap size={14} className="text-[var(--neutral)]" />
                </button>
                <button className="p-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors">
                  <Target size={14} className="text-[var(--positive)]" />
                </button>
                <button className="p-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors">
                  <BarChart3 size={14} className="text-[var(--accent)]" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      }
      {/* Collapsed state bottom buttons */}
      {isCollapsed && (
        <div className="p-1.5 border-t border-[var(--border)]">
          <div className="flex flex-col space-y-1.5">
            <button className="p-1.5 hover:bg-[var(--bg-hover)] rounded-lg transition-colors flex justify-center">
              <Settings size={14} />
            </button>
            <button className="p-1.5 hover:bg-[var(--bg-hover)] rounded-lg transition-colors flex justify-center">
              <History size={14} />
            </button>
          </div>
        </div>
      )}
    </aside>
    </div>
  );
};

export default SidebarRight;