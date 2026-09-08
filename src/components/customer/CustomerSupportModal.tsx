import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SupportTicket } from '../../types';
import {
  X,
  LifeBuoy,
  PlusCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
} from 'lucide-react';

interface CustomerSupportModalProps {
  onClose: () => void;
}

export const CustomerSupportModal: React.FC<CustomerSupportModalProps> = ({ onClose }) => {
  const { currentUser, tickets, createSupportTicket } = useApp();

  const [activeTab, setActiveTab] = useState<'NEW' | 'HISTORY'>('NEW');

  // Form states
  const [category, setCategory] = useState<SupportTicket['category']>('Booking');
  const [priority, setPriority] = useState<SupportTicket['priority']>('MEDIUM');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  // Tickets for current user
  const userTickets = tickets.filter((t) => t.userId === currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    createSupportTicket(category, subject.trim(), description.trim(), priority);
    setSubmittedMessage(true);
    setSubject('');
    setDescription('');
    setTimeout(() => {
      setSubmittedMessage(false);
      setActiveTab('HISTORY');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a1a]/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border-2 border-[#1a1a1a] max-w-lg w-full overflow-hidden shadow-[8px_8px_0px_#1a1a1a] my-8">
        {/* Header */}
        <div className="bg-[#1a1a1a] text-[#f4f1ea] p-5 flex items-center justify-between border-b-2 border-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#ff5d22] text-white flex items-center justify-center font-bold border border-white">
              <LifeBuoy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base tracking-wide text-white">Grievance & Support Desk</h3>
              <p className="text-[10px] font-mono text-[#f4f1ea]/70 uppercase tracking-wider">24/7 Verified Escrow Concierge</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-[#f4f1ea] hover:bg-[#ff5d22] hover:text-white flex items-center justify-center text-[#1a1a1a] border border-[#1a1a1a] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b-2 border-[#1a1a1a] text-xs font-mono font-bold uppercase bg-[#f4f1ea]">
          <button
            onClick={() => setActiveTab('NEW')}
            className={`flex-1 py-3 text-center transition cursor-pointer ${
              activeTab === 'NEW'
                ? 'bg-white text-[#1a1a1a] border-b-2 border-[#ff5d22]'
                : 'text-[#1a1a1a]/60 hover:text-[#1a1a1a]'
            }`}
          >
            Register Ticket
          </button>
          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`flex-1 py-3 text-center transition cursor-pointer ${
              activeTab === 'HISTORY'
                ? 'bg-white text-[#1a1a1a] border-b-2 border-[#ff5d22]'
                : 'text-[#1a1a1a]/60 hover:text-[#1a1a1a]'
            }`}
          >
            Resolution History ({userTickets.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'NEW' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {submittedMessage ? (
                <div className="p-4 bg-[#f4f1ea] border-2 border-[#1a1a1a] text-center space-y-2">
                  <CheckCircle className="w-8 h-8 text-[#ff5d22] mx-auto" />
                  <h4 className="font-serif font-bold text-sm text-[#1a1a1a]">Grievance Logged!</h4>
                  <p className="text-xs font-mono text-[#1a1a1a]/70">
                    Your complaint has entered priority arbitration queue.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 font-mono">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1a1a1a]/70 block">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] text-xs focus:outline-none"
                      >
                        <option value="Booking">Booking & Dates</option>
                        <option value="Payment">Payment & Refund</option>
                        <option value="Vehicle">Vehicle Condition / Fastag</option>
                        <option value="Account">KYC & Account</option>
                        <option value="Other">Other Query</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1a1a1a]/70 block">
                        Urgency Level
                      </label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as any)}
                        className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] text-xs focus:outline-none"
                      >
                        <option value="LOW">Low (General Inquiry)</option>
                        <option value="MEDIUM">Medium (Within 24 hrs)</option>
                        <option value="HIGH">High (Active Trip SOS)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase text-[#1a1a1a]/70 block">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Concise overview of your dispute or question"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] text-xs focus:outline-none focus:border-[#ff5d22]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase text-[#1a1a1a]/70 block">
                      Detailed Particulars
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Include booking reference ID, vehicle plate, or exact event chronology..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full mt-1 p-2.5 bg-[#f4f1ea] border border-[#1a1a1a] text-xs focus:outline-none focus:border-[#ff5d22]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#ff5d22] hover:bg-[#1a1a1a] text-white font-mono font-bold text-xs uppercase tracking-widest border-2 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] transition cursor-pointer"
                  >
                    Transmit Grievance Docket
                  </button>
                </>
              )}
            </form>
          ) : (
            /* Ticket History */
            <div className="space-y-3 max-h-[380px] overflow-y-auto">
              {userTickets.length === 0 ? (
                <div className="text-center py-8 text-[#1a1a1a]/50 text-xs font-mono">
                  No active or historical support dockets recorded.
                </div>
              ) : (
                userTickets.map((t) => (
                  <div key={t.id} className="p-4 bg-[#f4f1ea] border border-[#1a1a1a] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-[#1a1a1a] bg-white px-2 py-0.5 border border-[#1a1a1a]">
                        {t.id}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 border border-[#1a1a1a] ${
                          t.status === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-950'
                            : 'bg-amber-100 text-amber-950'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-[#1a1a1a]">{t.subject}</h4>
                    <p className="text-[11px] text-[#1a1a1a]/70 font-sans">{t.description}</p>

                    {/* Admin response */}
                    {t.adminResponse && (
                      <div className="mt-2 p-2.5 bg-white border border-[#1a1a1a] text-[11px] text-[#1a1a1a] font-mono">
                        <span className="font-bold text-[#ff5d22] block mb-0.5 uppercase">Officer Resolution Note:</span>
                        {t.adminResponse}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
