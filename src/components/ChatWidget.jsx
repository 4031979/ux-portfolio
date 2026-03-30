// src/components/ChatWidget.jsx

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import '../styles/ChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [hasProvidedName, setHasProvidedName] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    let id = localStorage.getItem('chat_session_id');
    let name = localStorage.getItem('chat_visitor_name');
    
    if (!id) {
      id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('chat_session_id', id);
    }
    
    setSessionId(id);
    
    if (name) {
      setVisitorName(name);
      setHasProvidedName(true);
      loadMessages(id);
    }
  }, []);

  const loadMessages = async (sid) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sid)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
  };

  useEffect(() => {
    if (!sessionId || !hasProvidedName) return;

    const channel = supabase
      .channel(`chat_${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, hasProvidedName]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (!visitorName.trim()) return;
    
    localStorage.setItem('chat_visitor_name', visitorName);
    setHasProvidedName(true);
    loadMessages(sessionId);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setIsLoading(true);

    const { error } = await supabase.from('chat_messages').insert([
      {
        session_id: sessionId,
        sender: 'visitor',
        message: inputMessage.trim(),
        visitor_name: visitorName,
      },
    ]);

    if (error) {
      console.error('Supabase insert error:', error);
    } else {
      setInputMessage('');
    }
    setIsLoading(false);
  };

  return (
    <>
      {/* Big "LET'S CHAT!" Button instead of bubble */}
      {!isOpen && (
        <button 
          className="lets-chat-floating" 
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
        >
          LET'S CHAT!
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div>
              <h3>Chat with me</h3>
              <p className="status">● Online</p>
            </div>
            <button 
              className="close-btn" 
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {!hasProvidedName ? (
            <div className="name-form-container">
              <div className="welcome-message">
                <h4>👋 Hi there!</h4>
                <p>What's your name?</p>
              </div>
              <form onSubmit={handleNameSubmit} className="name-form">
                <input
                  type="text"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="Enter your name..."
                  autoFocus
                />
                <button type="submit" disabled={!visitorName.trim()}>
                  Start Chat
                </button>
              </form>
            </div>
          ) : (
            <>
              <div className="chat-messages">
                {messages.length === 0 && (
                  <div className="welcome-message">
                    <p>👋 Hi {visitorName}! Ask me anything about my work or availability!</p>
                  </div>
                )}
                
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`message ${msg.sender === 'visitor' ? 'visitor' : 'admin'}`}
                  >
                    <div className="message-content">
                      {msg.message}
                    </div>
                    <div className="message-time">
                      {new Date(msg.created_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form className="chat-input" onSubmit={sendMessage}>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !inputMessage.trim()}
                  aria-label="Send message"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;