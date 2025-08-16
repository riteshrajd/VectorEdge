import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useStore } from '@/store/store';
import { 
  ChevronLeft, 
  ChevronRight, 
  Brain,
  Send,
  Bot,
  User,
  Trash2,
  Settings,
  History
} from 'lucide-react';
// Types
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'analysis' | 'suggestion' | 'alert';
}

interface SidebarRightProps {
  isVisible?: boolean;
}


const SidebarRight: React.FC<SidebarRightProps> = ({ isVisible = true }) => {
  const { selectedInstrument } = useStore();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(360);
  const [isResizing, setIsResizing] = useState<boolean>(false);
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

      {/* Content */}
      {isCollapsed ? (<div className='flex-1'></div>) : 
      <div className="flex-1 flex flex-col overflow-hidden">
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