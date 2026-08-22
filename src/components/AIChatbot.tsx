import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const OPENED_KEY = 'kejafinder-chatbot-opened';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNudge, setShowNudge] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(OPENED_KEY) !== '1';
  });
  const [messages, setMessages] = useState<Message[]>([{
    role: 'model',
    parts: [{ text: 'Hi! I\'m your KejaFinder AI Assistant. How can I help you find your perfect home today?' }]
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', parts: [{ text: userMessage }] }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages([...newMessages, { role: 'model', parts: [{ text: data.text }] }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'model', parts: [{ text: 'Sorry, I encountered an error. Please try again later.' }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(true);
          setShowNudge(false);
          localStorage.setItem(OPENED_KEY, '1');
        }}
        className={`absolute bottom-28 right-6 z-[var(--z-assistant)] bg-emerald-700 text-white rounded-full p-4 shadow-lg ${isOpen ? 'hidden' : 'flex'} items-center justify-center`}
        aria-label="Open AI Assistant"
      >
        <MessageSquare className="w-6 h-6" />
        {showNudge && (
          <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-orange-700 border-2 border-white dark:border-stone-950 animate-pulse" />
        )}
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-24 right-4 sm:right-6 w-[calc(100%-2rem)] sm:w-[350px] h-[500px] max-h-[70vh] bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 z-[var(--z-assistant)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-emerald-700 text-white shadow-sm z-10">
              <div className="flex items-center space-x-2">
                <div className="bg-white/20 p-1.5 rounded-full">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">KejaFinder AI</h3>
                  <p className="text-[10px] text-emerald-100 font-medium">Always here to help</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50 dark:bg-stone-950/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start max-w-[85%] space-x-2 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm ${
                      msg.role === 'user' ? 'bg-emerald-100 text-emerald-700' : 'bg-white dark:bg-stone-800 text-emerald-700 dark:text-emerald-400 border border-neutral-100 dark:border-neutral-700'
                    }`}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`p-3.5 rounded-2xl text-sm shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-emerald-700 text-white rounded-tr-none' 
                        : 'bg-white dark:bg-stone-800 text-neutral-800 dark:text-neutral-200 rounded-tl-none border border-neutral-100 dark:border-neutral-800/80'
                    }`}>
                      {msg.parts.map((p, i) => (
                        <div key={i} className={msg.role === 'model' ? 'markdown-body prose prose-sm dark:prose-invert max-w-none' : ''}>
                          {msg.role === 'model' ? <Markdown>{p.text}</Markdown> : p.text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 mt-1 rounded-full bg-white dark:bg-stone-800 border border-neutral-100 dark:border-neutral-700 flex items-center justify-center shadow-sm">
                      <Bot className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    </div>
                    <div className="p-4 rounded-2xl rounded-tl-none bg-white dark:bg-stone-800 border border-neutral-100 dark:border-neutral-800/80 flex items-center space-x-2 shadow-sm">
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                      <span className="text-xs text-neutral-500 font-medium">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-3 bg-white dark:bg-stone-900 border-t border-neutral-200 dark:border-neutral-800 flex items-end space-x-2 relative z-10">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Ask about listings or locations..."
                className="flex-1 bg-neutral-100 dark:bg-stone-950 border border-transparent rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 focus:bg-white dark:focus:bg-stone-900 transition-colors resize-none h-[46px] max-h-[120px] scrollbar-none"
                disabled={isLoading}
                rows={1}
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-[46px] h-[46px] rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-neutral-200 dark:disabled:bg-stone-800 disabled:text-neutral-550 text-white flex items-center justify-center transition-colors shrink-0 shadow-sm"
              >
                <Send className="w-5 h-5 ml-1" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
