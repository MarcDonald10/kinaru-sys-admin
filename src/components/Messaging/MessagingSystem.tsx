import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Send, Paperclip, MoreVertical, Flag, Archive, Pin, MessageSquare, Users, Bell, Filter, Eye, Trash2, AlertTriangle } from 'lucide-react';
import { mockMessages, mockUsers } from '../../data/mockData';
import { Message, User } from '../../types';

export default function MessagingSystem() {
  const [messages] = useState<Message[]>(mockMessages);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'moderation' | 'notifications'>('chat');
  const [isTyping, setIsTyping] = useState(false);
  const [flaggedMessages, setFlaggedMessages] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  // Grouper les messages par conversation
  const conversations = useMemo(() => {
    const convMap = new Map();
    
    messages.filter(m => m.type === 'message').forEach(message => {
      const otherUserId = message.senderId === '4' ? message.receiverId : message.senderId;
      const key = otherUserId;
      
      if (!convMap.has(key)) {
        convMap.set(key, {
          userId: otherUserId,
          user: mockUsers.find(u => u.id === otherUserId),
          messages: [],
          lastMessage: null,
          unreadCount: 0
        });
      }
      
      const conv = convMap.get(key);
      conv.messages.push(message);
      
      if (!conv.lastMessage || new Date(message.timestamp) > new Date(conv.lastMessage.timestamp)) {
        conv.lastMessage = message;
      }
      
      if (message.status === 'non_lu' && message.receiverId === '4') {
        conv.unreadCount++;
      }
    });
    
    return Array.from(convMap.values()).sort((a, b) => 
      new Date(b.lastMessage?.timestamp || 0).getTime() - new Date(a.lastMessage?.timestamp || 0).getTime()
    );
  }, [messages]);

  const filteredConversations = conversations.filter(conv =>
    conv.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage?.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentConversationMessages = useMemo(() => {
    if (!selectedConversation) return [];
    return messages
      .filter(m => 
        (m.senderId === selectedConversation && m.receiverId === '4') ||
        (m.senderId === '4' && m.receiverId === selectedConversation)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [messages, selectedConversation]);

  const moderationMessages = messages.filter(m => m.flagged || flaggedMessages.includes(m.id));

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    console.log('Envoi message:', newMessage, 'à', selectedConversation);
    setNewMessage('');
    
    // Simuler une réponse automatique
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        console.log('Réponse automatique reçue');
      }, 2000);
    }, 1000);
  };

  const handleFlagMessage = (messageId: string) => {
    setFlaggedMessages(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const ConversationItem = ({ conversation }: { conversation: any }) => (
    <div
      onClick={() => setSelectedConversation(conversation.userId)}
      className={`p-4 border-b border-gray-100 dark:border-slate-700 cursor-pointer transition-colors ${
        selectedConversation === conversation.userId 
          ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' 
          : 'hover:bg-gray-50 dark:hover:bg-slate-700'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
            {conversation.user?.name?.split(' ').map((n: string) => n[0]).join('') || '?'}
          </div>
          {conversation.unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">{conversation.unreadCount}</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 dark:text-white truncate">
              {conversation.user?.name || 'Utilisateur inconnu'}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {conversation.lastMessage && new Date(conversation.lastMessage.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
            {conversation.lastMessage?.content || 'Aucun message'}
          </p>
        </div>
      </div>
    </div>
  );

  const MessageBubble = ({ message }: { message: Message }) => {
    const isOwn = message.senderId === '4';
    const sender = mockUsers.find(u => u.id === message.senderId);
    
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwn 
            ? 'bg-orange-500 text-white' 
            : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white'
        }`}>
          {!isOwn && (
            <p className="text-xs font-medium mb-1 opacity-70">
              {sender?.name || 'Inconnu'}
            </p>
          )}
          <p className="text-sm">{message.content}</p>
          <div className="flex items-center justify-between mt-1">
            <span className={`text-xs ${isOwn ? 'text-orange-100' : 'text-gray-500 dark:text-gray-400'}`}>
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            {!isOwn && (
              <button
                onClick={() => handleFlagMessage(message.id)}
                className={`ml-2 p-1 rounded ${
                  flaggedMessages.includes(message.id) || message.flagged
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-gray-400 hover:text-red-500'
                }`}
                title="Signaler"
              >
                <Flag className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 h-full">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 h-[calc(100vh-8rem)] flex flex-col">
        {/* Header avec onglets */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Système de Messagerie</h1>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-orange-500 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-orange-500 transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex space-x-1 bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'chat' 
                  ? 'bg-white dark:bg-slate-600 text-orange-500 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('moderation')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'moderation' 
                  ? 'bg-white dark:bg-slate-600 text-orange-500 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Flag className="w-4 h-4" />
              <span>Modération</span>
              {moderationMessages.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {moderationMessages.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'notifications' 
                  ? 'bg-white dark:bg-slate-600 text-orange-500 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Notifications</span>
            </button>
          </div>
        </div>

        {/* Contenu selon l'onglet actif */}
        <div className="flex-1 flex overflow-hidden">
          {activeTab === 'chat' && (
            <>
              {/* Liste des conversations */}
              <div className="w-1/3 border-r border-gray-200 dark:border-slate-700 flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                  <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Rechercher une conversation..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  {filteredConversations.map(conversation => (
                    <ConversationItem key={conversation.userId} conversation={conversation} />
                  ))}
                </div>
              </div>

              {/* Zone de chat */}
              <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                  <>
                    {/* Header de conversation */}
                    <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {mockUsers.find(u => u.id === selectedConversation)?.name?.split(' ').map(n => n[0]).join('') || '?'}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {mockUsers.find(u => u.id === selectedConversation)?.name || 'Utilisateur inconnu'}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {isTyping ? 'En train d\'écrire...' : 'En ligne'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-orange-500 transition-colors">
                          <Pin className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-orange-500 transition-colors">
                          <Archive className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-orange-500 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {currentConversationMessages.map(message => (
                        <MessageBubble key={message.id} message={message} />
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 dark:bg-slate-700 rounded-lg px-4 py-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Zone de saisie */}
                    <div className="p-4 border-t border-gray-200 dark:border-slate-700">
                      <div className="flex items-center space-x-3">
                        <button className="p-2 text-gray-400 hover:text-orange-500 transition-colors">
                          <Paperclip className="w-5 h-5" />
                        </button>
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Tapez votre message..."
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                          />
                        </div>
                        <button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Sélectionnez une conversation
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Choisissez une conversation dans la liste pour commencer à discuter
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'moderation' && (
            <div className="flex-1 p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Messages signalés
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {moderationMessages.length} message(s) nécessite(nt) votre attention
                </p>
              </div>
              
              <div className="space-y-4">
                {moderationMessages.map(message => {
                  const sender = mockUsers.find(u => u.id === message.senderId);
                  const receiver = mockUsers.find(u => u.id === message.receiverId);
                  
                  return (
                    <div key={message.id} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span className="font-medium text-red-800 dark:text-red-200">
                              Message signalé
                            </span>
                          </div>
                          <p className="text-gray-900 dark:text-white mb-2">{message.content}</p>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            <span>De: {sender?.name || 'Inconnu'}</span>
                            <span className="mx-2">•</span>
                            <span>À: {receiver?.name || 'Inconnu'}</span>
                            <span className="mx-2">•</span>
                            <span>{new Date(message.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors" title="Voir conversation">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleFlagMessage(message.id)}
                            className="p-2 text-gray-400 hover:text-green-500 transition-colors" 
                            title="Approuver"
                          >
                            <Flag className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Supprimer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="flex-1 p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Notifications globales
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Envoyez des notifications à vos utilisateurs
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Destinataires
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white">
                      <option>Tous les utilisateurs</option>
                      <option>Clients uniquement</option>
                      <option>Propriétaires uniquement</option>
                      <option>Agents uniquement</option>
                      <option>Par ville</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                      rows={4}
                      placeholder="Rédigez votre notification..."
                    />
                  </div>
                  
                  <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                    Envoyer notification
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}