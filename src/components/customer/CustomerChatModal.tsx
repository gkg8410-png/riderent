import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Send,
  MessageSquare,
  ShieldCheck,
  PhoneOff,
  Clock,
  Sparkles,
} from 'lucide-react';

interface CustomerChatModalProps {
  bookingId: string;
  onClose: () => void;
}

export const CustomerChatModal: React.FC<CustomerChatModalProps> = ({ bookingId, onClose }) => {
  const { currentUser, messages, sendMessage, bookings } = useApp();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const booking = bookings.find((b) => b.id === bookingId);
  const threadMessages = messages.filter((m) => m.bookingId === bookingId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threadMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(bookingId, inputText.trim());
    setInputText('');
  };

  const handleQuickReply = (text: string) => {
    sendMessage(bookingId, text);
  };

  const otherPersonName =
    currentUser.role === 'CUSTOMER' ? booking?.ownerName : booking?.customerName;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a1a]/80 backdrop-blur-xs p-4">
      <div className="bg-white border-2 border-[#1a1a1a] max-w-lg w-full h-[600px] flex flex-col overflow-hidden shadow-[8px_8px_0px_#1a1a1a]">
        {/* Chat Header */}
        <div className="bg-[#1a1a1a] text-[#f4f1ea] p-4 flex items-center justify-between border-b-2 border-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#ff5d22] text-white flex items-center justify-center font-mono font-bold text-xs border border-white">
              {otherPersonName ? otherPersonName.charAt(0) : 'R'}
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm leading-snug tracking-wide text-white">{otherPersonName || 'Chat Dispatch'}</h3>
              <p className="text-[10px] font-mono text-[#f4f1ea]/70 uppercase tracking-widest">
                Booking {bookingId} • {booking?.vehicleName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 bg-[#f4f1ea] hover:bg-[#ff5d22] hover:text-white flex items-center justify-center text-[#1a1a1a] border border-[#1a1a1a] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Privacy Notice Banner */}
        <div className="bg-[#f4f1ea] px-4 py-2 border-b border-[#1a1a1a] flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-[#1a1a1a]">
          <ShieldCheck className="w-4 h-4 text-[#ff5d22] shrink-0" />
          <span>
            Encrypted Relay: Phone numbers are masked for escrow safety until handover.
          </span>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f4f1ea]/40">
          {threadMessages.length === 0 ? (
            <div className="text-center py-12 text-[#1a1a1a]/40 space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-[#1a1a1a]/30" />
              <p className="text-xs font-mono">No messages yet. Send coordinates or pickup ETA!</p>
            </div>
          ) : (
            threadMessages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[9px] font-mono text-[#1a1a1a]/60 mb-0.5 px-1 uppercase tracking-widest">
                    {isMe ? 'You' : msg.senderName} •{' '}
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <div
                    className={`max-w-[80%] px-3.5 py-2 text-xs leading-relaxed border ${
                      isMe
                        ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-[2px_2px_0px_#ff5d22]'
                        : 'bg-white text-[#1a1a1a] border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a]'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-[#f4f1ea] border-t border-[#1a1a1a] flex gap-1.5 overflow-x-auto text-[10px] font-mono">
          <button
            onClick={() => handleQuickReply('What is the exact pickup landmark?')}
            className="px-2.5 py-1 bg-white hover:bg-[#1a1a1a] hover:text-white text-[#1a1a1a] border border-[#1a1a1a] uppercase shrink-0 transition cursor-pointer"
          >
            Pickup Landmark?
          </button>
          <button
            onClick={() => handleQuickReply('I have arrived at the location!')}
            className="px-2.5 py-1 bg-white hover:bg-[#1a1a1a] hover:text-white text-[#1a1a1a] border border-[#1a1a1a] uppercase shrink-0 transition cursor-pointer"
          >
            I have arrived!
          </button>
          <button
            onClick={() => handleQuickReply('Car is clean and fuel tank is full.')}
            className="px-2.5 py-1 bg-white hover:bg-[#1a1a1a] hover:text-white text-[#1a1a1a] border border-[#1a1a1a] uppercase shrink-0 transition cursor-pointer"
          >
            Clean & Full Tank
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t-2 border-[#1a1a1a] flex gap-2">
          <input
            type="text"
            placeholder="Type message for dispatch..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 p-2.5 bg-[#f4f1ea] border border-[#1a1a1a] text-xs font-sans focus:outline-none focus:border-[#ff5d22]"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-10 h-10 bg-[#ff5d22] hover:bg-[#1a1a1a] text-white flex items-center justify-center transition disabled:opacity-40 cursor-pointer border border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a]"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
