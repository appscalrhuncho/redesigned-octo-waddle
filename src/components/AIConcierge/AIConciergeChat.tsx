import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { 
  Bot, 
  Send, 
  Sparkles, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  User, 
  Zap, 
  PhoneCall, 
  Heart, 
  Compass, 
  Utensils, 
  Key, 
  ShieldCheck, 
  Paperclip,
  Share2
} from 'lucide-react';

export const AIConciergeChat: React.FC = () => {
  const { 
    reservations, 
    rooms, 
    guests, 
    addServiceRequest, 
    addFolioItem, 
    messageThreads, 
    sendGuestMessage,
    formatCurrency
  } = useHotel();

  // Active sub-mode: AI Concierge interactive assistant vs Unified Staff Messaging Inbox
  const [activeMode, setActiveMode] = useState<'ai_concierge' | 'unified_inbox'>('ai_concierge');

  // AI Concierge Chat State
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string; actions?: Array<{ label: string; action: () => void }> }>>([
    {
      sender: 'ai',
      text: 'Good day! I am Aura, your personal AI Concierge at The Azure Sanctuary. How may I elevate your stay today? I can arrange private yacht charters, reserve your table at the Cliffside Terrace, dispatch luxury amenities, or assist with your departure.',
      time: 'Just now',
      actions: [
        { label: '🍷 Reserve Sommelier Tasting', action: () => handleAuraAction('Reserve Sommelier Tasting') },
        { label: '⛵ Sunset Catamaran Charter', action: () => handleAuraAction('Sunset Catamaran Charter') },
        { label: '🛁 Extra Eucalyptus Bath Salts', action: () => handleAuraAction('Extra Eucalyptus Bath Salts') }
      ]
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Unified Messaging Inbox State
  const [selectedThreadId, setSelectedThreadId] = useState<string>(messageThreads[0]?.id || 'TH-01');
  const [staffReplyText, setStaffReplyText] = useState('');

  const activeThread = messageThreads.find(t => t.id === selectedThreadId) || messageThreads[0];

  const handleAuraAction = (promptText: string) => {
    handleSendAuraMessage(promptText);
  };

  const handleSendAuraMessage = (queryToSend?: string) => {
    const text = queryToSend || inputQuery;
    if (!text.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = { sender: 'user' as const, text, time: userTime };
    setMessages(prev => [...prev, newMsg]);
    if (!queryToSend) setInputQuery('');
    setIsTyping(true);

    // Contextual AI Intelligence & Hospitality Knowledge Engine
    setTimeout(() => {
      setIsTyping(false);
      const lower = text.toLowerCase();
      let reply = '';
      let actions: Array<{ label: string; action: () => void }> | undefined = undefined;

      if (lower.includes('catamaran') || lower.includes('yacht') || lower.includes('boat')) {
        reply = 'I would be delighted to arrange our 48ft Luxury Sunset Catamaran Charter for you. It includes a chilled bottle of Laurent-Perrier Grand Siècle, fresh reef oysters, and private snorkeling with our marine biologist.';
        actions = [
          {
            label: 'Confirm Catamaran ($650)',
            action: () => {
              const res = reservations[0];
              if (res) {
                addFolioItem(res.id, {
                  category: 'Excursion',
                  description: 'Private 48ft Sunset Catamaran Charter',
                  amount: 650,
                  postedBy: 'Aura AI Concierge'
                });
                setMessages(prev => [...prev, {
                  sender: 'ai',
                  text: 'Splendid! Your private catamaran charter is confirmed for 17:30 tomorrow. The charge of $650 has been posted to your suite master folio.',
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
              }
            }
          }
        ];
      } else if (lower.includes('bath') || lower.includes('pillow') || lower.includes('towel') || lower.includes('housekeeping')) {
        reply = 'I have logged this request directly with Elena in our Housekeeping Department. Extra hypoallergenic down pillows and fresh botanical bath salts are being prepared and will be delivered to your suite within 15 minutes.';
        addServiceRequest({
          roomNumber: reservations[0]?.roomNumber || '101',
          guestName: reservations[0]?.guestName || 'Guest',
          category: 'Housekeeping',
          item: text,
          notes: 'Dispatched automatically by Aura AI Concierge.'
        });
      } else if (lower.includes('wine') || lower.includes('dining') || lower.includes('tasting') || lower.includes('dinner')) {
        reply = 'The Cliffside Terrace features Chef Alessandro’s 7-course seasonal Mediterranean tasting menu tonight, paired with cellar vintages curated by our Master Sommelier. Shall I reserve a premier table overlooking the cove for 19:30?';
        actions = [
          {
            label: 'Reserve Table for 19:30',
            action: () => {
              setMessages(prev => [...prev, {
                sender: 'ai',
                text: 'Your reservation for 19:30 at Cliffside Terrace Table #4 (Cliffside Perch) is confirmed. Your server Marcus has been briefed on your preferences.',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }]);
            }
          }
        ];
      } else if (lower.includes('checkout') || lower.includes('late')) {
        reply = 'As a recognized VIP member, we have extended your suite departure time to 14:00 on Sunday complimentary. Our private chauffeured EV is available should you require an airport transfer.';
      } else {
        reply = `Certainly. I have communicated your request regarding "${text}" directly to our Duty Manager and Concierge team to ensure exquisite care. Is there anything else I may prepare for your evening?`;
      }

      setMessages(prev => [...prev, {
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions
      }]);
    }, 900);
  };

  const handleStaffSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffReplyText.trim() || !activeThread) return;

    sendGuestMessage(activeThread.id, staffReplyText, 'hotel');
    setStaffReplyText('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Mode Toggle */}
      <div className="bg-[#141A17] text-[#FBF9F5] rounded-2xl p-5 border border-[#2D3E35] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-purple-950/80 text-purple-300 border border-purple-800">
              AI Sanctuary Intelligence & Concierge Layer
            </span>
            <span className="text-xs text-[#A6B4AE]">AI Concierge + Omnichannel Messaging</span>
          </div>
          <h1 className="font-serif-heading text-2xl font-bold text-[#F7F4EE]">
            AI Concierge ("Aura") & Unified Messaging Hub
          </h1>
          <p className="text-xs text-[#8EA299]">
            Instant luxury recommendations, automated PMS service request dispatch, and unified WhatsApp/SMS communications.
          </p>
        </div>

        {/* Mode Toggle Switch */}
        <div className="flex items-center bg-[#1C2621] p-1.5 rounded-xl border border-[#304239] text-xs">
          <button
            onClick={() => setActiveMode('ai_concierge')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
              activeMode === 'ai_concierge' ? 'bg-[#D4AF37] text-[#141A17] shadow-sm' : 'text-[#8EA299] hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI Concierge "Aura"</span>
          </button>

          <button
            onClick={() => setActiveMode('unified_inbox')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
              activeMode === 'unified_inbox' ? 'bg-[#D4AF37] text-[#141A17] shadow-sm' : 'text-[#8EA299] hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Unified Messaging Inbox ({messageThreads.length})</span>
          </button>
        </div>
      </div>

      {/* Mode 1: AI Concierge Aura Assistant */}
      {activeMode === 'ai_concierge' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Chat Interface (8 Cols) */}
          <div className="lg:col-span-8 bg-white border border-[#EAE3D6] rounded-2xl shadow-md flex flex-col h-[620px] overflow-hidden">
            
            {/* Header */}
            <div className="bg-[#FAF8F4] border-b border-[#EAE3D6] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1E2522] text-[#D4AF37] flex items-center justify-center shadow-inner">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif-heading font-bold text-sm text-[#1E2522]">Aura Concierge AI</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Active & Grounded
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7A8C84]">Luxury Brand Voice • Connected to Core PMS & Inventory</p>
                </div>
              </div>

              <div className="text-right text-xs">
                <span className="text-[11px] text-[#7A8C84] block">Guest In Context:</span>
                <span className="font-bold text-[#1E2522]">{reservations[0]?.guestName} (Suite {reservations[0]?.roomNumber})</span>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FBF9F5]">
              {messages.map((msg, i) => (
                <div 
                  key={i}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-[#8EA299] mb-1 px-1">
                    <span>{msg.sender === 'user' ? 'You' : 'Aura'}</span>
                    <span>•</span>
                    <span>{msg.time}</span>
                  </div>

                  <div 
                    className={`max-w-xl p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-[#1E2522] text-[#F7F4EE] rounded-tr-none'
                        : 'bg-white border border-[#EAE3D6] text-[#1E2522] rounded-tl-none'
                    }`}
                  >
                    {msg.text}

                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-[#EAE3D6] flex flex-wrap gap-2">
                        {msg.actions.map((act, actIdx) => (
                          <button
                            key={actIdx}
                            onClick={act.action}
                            className="px-3 py-1.5 bg-[#FAF8F4] hover:bg-[#EAE3D6] text-[#9E7D23] border border-[#D4AF37]/50 rounded-xl text-xs font-semibold transition-all shadow-sm"
                          >
                            {act.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-[#8EA299] italic p-2">
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                  <span>Aura is composing a personalized itinerary recommendation...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendAuraMessage();
              }}
              className="p-3 bg-white border-t border-[#EAE3D6] flex gap-2"
            >
              <input 
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask Aura anything (e.g. 'Book sunset catamaran', 'Extra towels', 'Wine recommendations')..."
                className="flex-1 bg-[#FAF8F4] border border-[#D8CEBF] rounded-xl px-4 py-2.5 text-xs sm:text-sm outline-none focus:border-[#9E7D23]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#1E2522] text-[#E0CDA9] hover:bg-[#2C3B34] rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>

          </div>

          {/* AI Knowledge Base & Context Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="bg-[#FAF8F4] border border-[#EAE3D6] rounded-2xl p-4 shadow-sm">
              <h3 className="font-serif-heading text-sm font-bold text-[#1E2522] mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>AI Concierge Operating Principles</span>
              </h3>
              <ul className="text-[11px] text-[#52645D] space-y-1.5">
                <li>• <strong>No Hallucinated Rates:</strong> AI references actual live BAR and inventory records.</li>
                <li>• <strong>Direct Dispatch:</strong> Requests write directly into the Housekeeping / Butler task queues.</li>
                <li>• <strong>Folio Integration:</strong> Upsold excursions and wines post cleanly to the guest's ledger.</li>
                <li>• <strong>Human Escalation:</strong> Complex inquiries route immediately to the Duty Manager.</li>
              </ul>
            </div>

            <div className="bg-white border border-[#EAE3D6] rounded-2xl p-4 shadow-sm">
              <h3 className="font-serif-heading text-sm font-bold text-[#1E2522] mb-3">Quick AI Inquiry Prompts</h3>
              <div className="space-y-2 text-xs">
                {[
                  'What are Chef Alessandro’s signature dishes tonight?',
                  'Can you schedule morning yoga on the cliffside deck?',
                  'What are the best private island snorkeling spots?',
                  'Please deliver 2 extra down pillows to Suite 201.'
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAuraAction(prompt)}
                    className="w-full text-left p-2.5 bg-[#FAF8F4] hover:bg-[#EAE3D6] border border-[#D8CEBF] rounded-xl text-[#1E2522] font-medium transition-colors"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Mode 2: Unified Staff Omnichannel Inbox */}
      {activeMode === 'unified_inbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-[#EAE3D6] rounded-2xl shadow-md overflow-hidden h-[620px]">
          
          {/* Left 4 Cols: Thread List */}
          <div className="lg:col-span-4 border-r border-[#EAE3D6] flex flex-col bg-[#FAF8F4]">
            <div className="p-4 border-b border-[#EAE3D6]">
              <h3 className="font-serif-heading font-bold text-sm text-[#1E2522]">Unified Messaging Channels</h3>
              <p className="text-[10px] text-[#7A8C84]">WhatsApp • SMS • Portal Chat • OTA</p>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#EAE3D6]">
              {messageThreads.map(thread => {
                const isSelected = selectedThreadId === thread.id;
                return (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThreadId(thread.id)}
                    className={`w-full text-left p-4 transition-colors flex flex-col gap-1 ${
                      isSelected ? 'bg-white border-l-4 border-l-[#9E7D23]' : 'hover:bg-[#F2ECE1]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#1E2522]">{thread.guestName}</span>
                      <span className="text-[10px] text-[#8EA299]">{thread.lastMessageTime}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span className="px-1.5 py-0.2 bg-[#EAE3D6] text-[#52645D] rounded font-semibold">
                        {thread.channel}
                      </span>
                      <span className="text-[#7A8C84]">Suite {thread.roomNumber || '—'}</span>
                    </div>

                    <p className="text-xs text-[#52645D] line-clamp-1 mt-0.5">{thread.lastMessage}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right 8 Cols: Active Thread Stream & Instant Reply */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-white">
            
            {/* Header */}
            <div className="p-4 border-b border-[#EAE3D6] bg-[#FAF8F4] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#1E2522]">{activeThread?.guestName}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-900 rounded-full">
                    {activeThread?.channel}
                  </span>
                </div>
                <span className="text-xs text-[#7A8C84]">Suite {activeThread?.roomNumber} • Live Synchronized Channel</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FBF9F5]">
              {activeThread?.messages.map((m) => (
                <div 
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'hotel' ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-[#8EA299] mb-1">
                    {m.senderName} • {m.timestamp}
                  </span>
                  <div 
                    className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                      m.sender === 'hotel'
                        ? 'bg-[#1E2522] text-[#FBF9F5] rounded-tr-none'
                        : 'bg-white border border-[#EAE3D6] text-[#1E2522] rounded-tl-none'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleStaffSendReply} className="p-3 border-t border-[#EAE3D6] bg-white flex gap-2">
              <input 
                type="text"
                value={staffReplyText}
                onChange={(e) => setStaffReplyText(e.target.value)}
                placeholder={`Reply to ${activeThread?.guestName} via ${activeThread?.channel}...`}
                className="flex-1 bg-[#FAF8F4] border border-[#D8CEBF] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#9E7D23]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#1E2522] text-[#E0CDA9] rounded-xl font-bold text-xs hover:bg-[#2C3B34] transition-colors"
              >
                Reply
              </button>
            </form>

          </div>

        </div>
      )}

    </div>
  );
};
