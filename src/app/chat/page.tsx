'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import {
  MessageSquare,
  Send,
  ShieldCheck,
  MapPin,
  Clock,
  User,
  ArrowLeft,
  Phone,
  CheckCheck,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSelf: boolean;
}

export interface Conversation {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerCollege: string;
  isVerified: boolean;
  productId?: string;
  productTitle?: string;
  productPrice?: number;
  productImage?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-aarav',
    sellerId: 'user-demo-1',
    sellerName: 'Aarav Sharma',
    sellerCollege: 'Government Engineering College',
    isVerified: true,
    productId: 'p-1',
    productTitle: 'Casio FX-991EX Scientific Calculator',
    productPrice: 850,
    productImage: 'https://images.unsplash.com/photo-1632571401005-458e9d244591?w=600',
    lastMessage: 'Yes, it is available! We can meet near the library canteen at 4 PM.',
    lastMessageTime: '10:42 AM',
    unreadCount: 1,
    messages: [
      {
        id: 'm-1',
        senderId: 'user-demo-1',
        senderName: 'Aarav Sharma',
        text: 'Hi there! Thanks for reaching out about the Casio FX-991EX calculator.',
        timestamp: '10:40 AM',
        isSelf: false,
      },
      {
        id: 'm-2',
        senderId: 'buyer-current',
        senderName: 'You',
        text: 'Hi Aarav, is this calculator still available for campus pickup today?',
        timestamp: '10:41 AM',
        isSelf: true,
      },
      {
        id: 'm-3',
        senderId: 'user-demo-1',
        senderName: 'Aarav Sharma',
        text: 'Yes, it is available! We can meet near the library canteen at 4 PM.',
        timestamp: '10:42 AM',
        isSelf: false,
      },
    ],
  },
  {
    id: 'conv-priya',
    sellerId: 'user-demo-2',
    sellerName: 'Priya Verma',
    sellerCollege: 'Institute of Technology & Science',
    isVerified: true,
    productId: 'p-2',
    productTitle: 'Higher Engineering Mathematics - B.S. Grewal (44th Ed)',
    productPrice: 420,
    productImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
    lastMessage: 'Sure, I can bring the book to the main gate tomorrow morning.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    messages: [
      {
        id: 'm-4',
        senderId: 'buyer-current',
        senderName: 'You',
        text: 'Hello Priya, are all pages intact in the Grewal Maths book?',
        timestamp: 'Yesterday 3:15 PM',
        isSelf: true,
      },
      {
        id: 'm-5',
        senderId: 'user-demo-2',
        senderName: 'Priya Verma',
        text: 'Yes! All 1200+ pages are complete with neat pencil annotations.',
        timestamp: 'Yesterday 3:20 PM',
        isSelf: false,
      },
      {
        id: 'm-6',
        senderId: 'user-demo-2',
        senderName: 'Priya Verma',
        text: 'Sure, I can bring the book to the main gate tomorrow morning.',
        timestamp: 'Yesterday 3:22 PM',
        isSelf: false,
      },
    ],
  },
  {
    id: 'conv-rohan',
    sellerId: 'user-demo-3',
    sellerName: 'Rohan Mehta',
    sellerCollege: 'Government Engineering College',
    isVerified: true,
    productId: 'p-3',
    productTitle: 'Cotton White Lab Coat & Safety Apron (Size M)',
    productPrice: 280,
    productImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600',
    lastMessage: 'Let me know what time works best for you.',
    lastMessageTime: '2 days ago',
    unreadCount: 0,
    messages: [
      {
        id: 'm-7',
        senderId: 'user-demo-3',
        senderName: 'Rohan Mehta',
        text: 'Lab coat is freshly washed and ready for chemistry practicals.',
        timestamp: '2 days ago',
        isSelf: false,
      },
    ],
  },
];

export default function ChatPage() {
  const searchParams = useSearchParams();
  const sellerIdParam = searchParams.get('sellerId');
  const productIdParam = searchParams.get('productId');

  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string>('conv-aarav');
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load from localStorage or URL query params
  useEffect(() => {
    const saved = localStorage.getItem('campuskart_chat_conversations');
    let convList = INITIAL_CONVERSATIONS;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          convList = parsed;
        }
      } catch (e) {}
    }

    // Handle deep link from Product Card / Product Page contact button
    if (productIdParam) {
      const productObj = MOCK_PRODUCTS.find((p) => p.id === productIdParam);
      if (productObj) {
        const sellerName = productObj.seller?.full_name || 'Verified Student Seller';
        const existingConv = convList.find((c) => c.productId === productObj.id || c.sellerId === productObj.seller_id);

        if (existingConv) {
          setActiveConvId(existingConv.id);
        } else {
          // Create new conversation dynamically for this product!
          const newConv: Conversation = {
            id: `conv-${Date.now()}`,
            sellerId: productObj.seller_id || `seller-${Date.now()}`,
            sellerName,
            sellerCollege: productObj.seller?.college_name || 'Campus Institute',
            isVerified: true,
            productId: productObj.id,
            productTitle: productObj.title,
            productPrice: productObj.price,
            productImage: productObj.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
            lastMessage: `Inquiry started about "${productObj.title}"`,
            lastMessageTime: 'Just now',
            unreadCount: 0,
            messages: [
              {
                id: `m-init-${Date.now()}`,
                senderId: 'system',
                senderName: 'CampusKart',
                text: `You started a chat with ${sellerName} about "${productObj.title}" (₹${productObj.price}).`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isSelf: false,
              },
            ],
          };
          convList = [newConv, ...convList];
          setActiveConvId(newConv.id);
        }
      }
    }

    setConversations(convList);
    localStorage.setItem('campuskart_chat_conversations', JSON.stringify(convList));
  }, [productIdParam, sellerIdParam]);

  // Scroll chat timeline to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeConvId]);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const handleSendMessage = (textToSend?: string) => {
    const content = textToSend || inputMessage;
    if (!content.trim() || !activeConv) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      senderId: 'buyer-current',
      senderName: 'You',
      text: content.trim(),
      timestamp: timeStr,
      isSelf: true,
    };

    const updated = conversations.map((c) => {
      if (c.id === activeConv.id) {
        return {
          ...c,
          lastMessage: content.trim(),
          lastMessageTime: timeStr,
          messages: [...c.messages, newMsg],
        };
      }
      return c;
    });

    setConversations(updated);
    localStorage.setItem('campuskart_chat_conversations', JSON.stringify(updated));
    setInputMessage('');

    // Simulate automated seller response after 1.5 seconds for interactive demo
    setTimeout(() => {
      const sellerReply: ChatMessage = {
        id: `m-reply-${Date.now()}`,
        senderId: activeConv.sellerId,
        senderName: activeConv.sellerName,
        text: `Thanks for messaging! Sure, I am available on campus. Let's confirm pickup near ${activeConv.productTitle ? 'library' : 'main gate'}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSelf: false,
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConv.id) {
            return {
              ...c,
              lastMessage: sellerReply.text,
              lastMessageTime: sellerReply.timestamp,
              messages: [...c.messages, sellerReply],
            };
          }
          return c;
        })
      );
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Campus Student Direct Chat</h1>
            <p className="text-xs text-slate-500">Contact owners directly for instant campus pickup & price negotiations</p>
          </div>
        </div>
        <Link href="/marketplace" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>
      </div>

      {/* Main Chat Interface Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[650px] rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-xl">
        
        {/* Left Sidebar: Conversation List (4 cols) */}
        <div className="md:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/70">
          <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
            <h2 className="font-bold text-xs uppercase tracking-wider text-slate-500">Messages & Conversations</h2>
            <span className="text-[10px] font-extrabold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full">
              {conversations.length} Active
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.map((conv) => {
              const isActive = conv.id === activeConvId;
              return (
                <button
                  key={conv.id}
                  onClick={() => {
                    setActiveConvId(conv.id);
                    // Clear unread
                    setConversations((prev) =>
                      prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
                    );
                  }}
                  className={`w-full p-4 text-left transition-all flex items-start gap-3 relative ${
                    isActive ? 'bg-indigo-50/90 border-l-4 border-indigo-600' : 'hover:bg-slate-100/80 bg-white'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm">
                    {conv.sellerName.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xs text-slate-900 truncate flex items-center gap-1">
                        {conv.sellerName}
                        {conv.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-medium">{conv.lastMessageTime}</span>
                    </div>

                    {conv.productTitle && (
                      <p className="text-[10px] font-semibold text-indigo-700 truncate mt-0.5">
                        📦 {conv.productTitle}
                      </p>
                    )}

                    <p className="text-xs text-slate-500 truncate mt-1">
                      {conv.lastMessage}
                    </p>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Chat Room (8 cols) */}
        {activeConv ? (
          <div className="md:col-span-8 flex flex-col h-full bg-slate-50/30">
            
            {/* Active Chat Header */}
            <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  {activeConv.sellerName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    {activeConv.sellerName}
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Verified Seller
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {activeConv.sellerCollege}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toast.info(`Phone contact option requested for ${activeConv.sellerName}`)}
                  className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors text-xs font-bold flex items-center gap-1 border border-slate-200"
                >
                  <Phone className="w-3.5 h-3.5" /> Direct Call
                </button>
              </div>
            </div>

            {/* Product Context Card Banner */}
            {activeConv.productTitle && (
              <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white px-5 py-3 flex items-center justify-between text-xs shadow-inner">
                <div className="flex items-center gap-3">
                  {activeConv.productImage && (
                    <img
                      src={activeConv.productImage}
                      alt={activeConv.productTitle}
                      className="w-9 h-9 rounded-lg object-cover border border-white/20"
                    />
                  )}
                  <div>
                    <p className="font-bold text-white line-clamp-1">{activeConv.productTitle}</p>
                    <p className="text-[11px] text-amber-300 font-extrabold">Price: ₹{activeConv.productPrice}</p>
                  </div>
                </div>

                <Link
                  href={`/products/${activeConv.productId}`}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1"
                >
                  View Item <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            )}

            {/* Chat Timeline */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              {activeConv.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                      msg.isSelf
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : msg.senderId === 'system'
                        ? 'bg-amber-50 text-amber-900 border border-amber-200 text-center mx-auto my-2 rounded-xl'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'
                    }`}
                  >
                    {!msg.isSelf && msg.senderId !== 'system' && (
                      <div className="font-bold text-[10px] text-indigo-600 mb-1">{msg.senderName}</div>
                    )}
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <div
                      className={`text-[9px] mt-1 text-right ${
                        msg.isSelf ? 'text-indigo-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Suggestion Chips */}
            <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px]">
              <span className="text-slate-400 font-bold flex-shrink-0">Quick Chat:</span>
              <button
                onClick={() => handleSendMessage('Hi, is this product still available for pickup?')}
                className="px-3 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-full font-medium flex-shrink-0 transition-colors"
              >
                "Is this item available?"
              </button>
              <button
                onClick={() => handleSendMessage('Can we meet at the campus central library gate?')}
                className="px-3 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-full font-medium flex-shrink-0 transition-colors"
              >
                "Meet at Library Gate?"
              </button>
              <button
                onClick={() => handleSendMessage('Is the price negotiable for diploma students?')}
                className="px-3 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-full font-medium flex-shrink-0 transition-colors"
              >
                "Price negotiable?"
              </button>
            </div>

            {/* Message Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-4 bg-white border-t border-slate-200 flex items-center gap-3"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Type a message to ${activeConv.sellerName}...`}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>
        ) : (
          <div className="md:col-span-8 flex items-center justify-center p-8 text-center text-slate-400 text-xs">
            Select a conversation on the left sidebar to start chatting.
          </div>
        )}

      </div>

    </div>
  );
}
