import React, { useState } from 'react';
import { MessageCircle, X, Send, PhoneCall } from 'lucide-react';

export const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const phoneNumber = '919968834276';

  const quickOptions = [
    'I want to apply for NIOS Class 10th admission',
    'I want guidance for NIOS Class 12th admission',
    'I need urgent On-Demand Examination (ODE) assistance',
    'I need solved TMA assignments & practical lab files'
  ];

  const handleSend = (text: string) => {
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${phoneNumber}?text=${encoded}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded WhatsApp Chat Bubble */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-[#075e54] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm">JANGRA NIOS Help Desk</h4>
                <p className="text-xs text-emerald-200">Online | +91-9968834276</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-emerald-100 hover:text-white rounded-lg hover:bg-emerald-700/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-slate-50 space-y-3">
            <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-xs text-xs text-slate-700 leading-relaxed border border-slate-100">
              Namaste! 🙏 Welcome to <strong>JANGRA NIOS SERVICES</strong>. How can our educational counselors assist your admission or examination today?
            </div>

            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Quick Inquiries:
            </div>
            <div className="space-y-1.5">
              {quickOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(opt)}
                  className="w-full text-left text-xs bg-white hover:bg-emerald-50 hover:border-emerald-300 p-2.5 rounded-lg border border-slate-200 text-slate-700 transition-colors"
                >
                  💬 {opt}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="pt-2 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your question..."
                value={customMsg}
                onChange={e => setCustomMsg(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && customMsg.trim()) {
                    handleSend(customMsg);
                  }
                }}
                className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-500"
              />
              <button
                onClick={() => {
                  if (customMsg.trim()) handleSend(customMsg);
                }}
                className="p-2 bg-[#25d366] text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-xs"
                title="Send via WhatsApp"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-1 text-center">
              <a
                href="tel:+919968834276"
                className="inline-flex items-center gap-1.5 text-xs text-blue-900 font-bold hover:underline"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
                <span>Or Click to Call Directly: +91-9968834276</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-[#25d366] text-white font-bold rounded-full shadow-xl hover:bg-emerald-600 transition-transform active:scale-95 focus:outline-hidden"
        aria-label="Direct WhatsApp Enquiry"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="text-sm font-semibold hidden sm:inline">WhatsApp Help</span>
      </button>
    </div>
  );
};
