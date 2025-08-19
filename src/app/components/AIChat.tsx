import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useStore } from '@/store/store';
import {
  Send,
  Bot,
  User,
  Trash2,
  Settings,
} from 'lucide-react';
import { useDataStore } from '@/store/dataStroe';
import { CombinedData } from '@/types/types';
import { generateAIResponse } from '@/services/getAIChatResponse';
import { useUserStore } from '@/store/userStore';

// Types
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'analysis' | 'suggestion' | 'alert';
}

const AIChat: React.FC = () => {
  const store = useStore();
  const [data, setData] = useState<CombinedData | null>(null);
  const dataStore = useDataStore();

  useEffect(() => {
    setData(null);
    if (store.selectedInstrument) {
      const data = dataStore.data.find((item) => item.ticker === store.selectedInstrument?.symbol);
      if (data) setData(data);
    }
  }, [dataStore.data, store]);

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

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const getAIResponse = useCallback(async (
    userInput: string,
  ): Promise<string> => {
    if (!data) return 'No data for reference, please select an instrument';
    try {
      const response = await generateAIResponse(userInput, data);

      if (response.success) {
        return response.data as string;
      } else {
        console.error(`AI response error: ${JSON.stringify(response)}`);
        return response.error || "Sorry, an unknown error occurred.";
      }
    } catch (error) {
      console.error("Failed to execute getAIResponse server action:", error);
      return "Unable to connect to the server. Please check your connection and try again.";
    }
  }, [data]);

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

    setTimeout(async () => {
      let content = '';
      if(!useUserStore.getState().user?.is_paid_member) {
        content = 'Get Premium to enable this feature'
      }
      else content = await getAIResponse(inputMessage);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  }, [getAIResponse, inputMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent): void => {
    if(isTyping) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage, isTyping]);

  const clearChat = useCallback((): void => {
    setMessages([
      {
        id: '1',
        content: 'Chat cleared. How can I assist you?',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      }
    ]);
  }, []);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="bg-sidebar text-foreground border-l border-border flex flex-col h-full w-full">
      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-3 border-b border-border bg-accent">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <div className="w-1.5 h-1.5 bg-positive rounded-full"></div>
              <span className="text-xs text-muted-foreground">Vector AI</span>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={clearChat}
                className="p-1 hover:bg-accent-hover rounded transition-colors"
                title="Clear chat"
              >
                <Trash2 size={12} className="text-muted-foreground" />
              </button>
              <button className="p-1 hover:bg-accent-hover rounded transition-colors" title="Settings">
                <Settings size={12} className="text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

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
                      ? 'bg-sidebar-accent'
                      : 'bg-primary'
                  }`}
                >
                  {message.sender === 'user' ? (
                    <User size={12} className="text-user-bubble-foreground" />
                  ) : (
                    <Bot size={12} className="text-primary-foreground" />
                  )}
                </div>
                <div
                  className={`rounded-lg p-2 text-sm ${
                    message.sender === 'user'
                      ? 'bg-user-chat-bubble text-user-chat-bubble-foreground'
                      : 'bg-ai-chat-bubble text-ai-chat-bubble-foreground'
                  }`}
                >
                  <p className={`${message.sender === 'user' ? 'p-2 bg-accent rounded-b-lg rounded-tl-lg' : ''}`}>{message.content}</p>
                  <span className={`text-xs opacity-70 mt-0.5 block`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Bot size={12} className="text-primary-foreground" />
                </div>
                <div className="bg-ai-bubble rounded-lg p-2">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex space-x-1.5">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about market analysis..."
              className="flex-1 px-2.5 py-1.5 bg-accent border border-border-secondary rounded-lg text-md focus:outline-none focus:border-ring transition-colors"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="px-3.5 bg-accent-send py-1.5 hover:bg-accent-send-hover rounded-lg transition-colors flex items-center justify-center bg-accent p-2 hover:cursor-pointer hover:bg-sidebar-accent"
            >
              <Send size={14} className="text-accent-send-foreground" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;