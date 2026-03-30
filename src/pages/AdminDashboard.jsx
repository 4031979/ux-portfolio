// src/pages/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import PasswordProtected from '../components/PasswordProtected'; // ADD THIS
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load all conversations
  useEffect(() => {
    loadConversations();
    
    // Subscribe to new messages
    const channel = supabase
      .channel('admin_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        () => {
          loadConversations();
          if (selectedSession) {
            loadMessages(selectedSession);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedSession]);

  const loadConversations = async () => {
    const { data, error } = await supabase
      .from('conversation_summaries')
      .select('*')
      .order('last_message_at', { ascending: false });

    if (!error && data) {
      setConversations(data);
    }
  };

  const loadMessages = async (sessionId) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
  };

  const selectConversation = (sessionId) => {
    setSelectedSession(sessionId);
    loadMessages(sessionId);
  };

  const sendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedSession) return;

    setIsLoading(true);

    const { error } = await supabase.from('chat_messages').insert([
      {
        session_id: selectedSession,
        sender: 'admin',
        message: replyText.trim(),
      },
    ]);

    if (!error) {
      setReplyText('');
      loadMessages(selectedSession);
      loadConversations();
    }
    setIsLoading(false);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // WRAP THE ENTIRE COMPONENT WITH PASSWORD PROTECTION
  return (
    <PasswordProtected projectId="admin">
      <div className="admin-dashboard">
        <div className="admin-header">
          <h1>Chat Dashboard</h1>
          <p>Manage your conversations</p>
        </div>

        <div className="admin-content">
          {/* Conversations List */}
          <div className="conversations-list">
            <h2>Conversations ({conversations.length})</h2>
            
            {conversations.map((conv) => (
              <div
                key={conv.session_id}
                className={`conversation-item ${selectedSession === conv.session_id ? 'active' : ''} ${conv.unread_count > 0 ? 'unread' : ''}`}
                onClick={() => selectConversation(conv.session_id)}
              >
                <div className="conversation-header">
                  <strong>{conv.visitor_name || 'Anonymous'}</strong>
                  {conv.unread_count > 0 && (
                    <span className="unread-badge">{conv.unread_count}</span>
                  )}
                </div>
                <p className="last-message">{conv.last_message}</p>
                <span className="time">{formatTime(conv.last_message_at)}</span>
              </div>
            ))}

            {conversations.length === 0 && (
              <div className="empty-state">
                <p>No conversations yet</p>
              </div>
            )}
          </div>

          {/* Messages View */}
          <div className="messages-view">
            {selectedSession ? (
              <>
                <div className="messages-container">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`admin-message ${msg.sender === 'visitor' ? 'visitor' : 'admin'}`}
                    >
                      <div className="message-content">{msg.message}</div>
                      <div className="message-time">
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <form className="reply-form" onSubmit={sendReply}>
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    disabled={isLoading}
                  />
                  <button type="submit" disabled={isLoading || !replyText.trim()}>
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="empty-state">
                <p>Select a conversation to view messages</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PasswordProtected>
  );
};

export default AdminDashboard;