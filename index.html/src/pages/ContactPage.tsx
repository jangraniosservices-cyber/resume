import React, { useState } from 'react';
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api.ts';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name || !mobile || !message) {
      setError('Please provide your name, mobile number and inquiry message.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitContact({
        name,
        mobile,
        email,
        subject: subject || 'General Admission Query',
        message
      });

      if (res.success) {
        setSuccess(res.message);
        setName('');
        setMobile('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setError(res.message || 'Failed to submit inquiry.');
      }
    } catch (err) {
      setError('An error occurred. Please call or WhatsApp us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* Page Header */}
      <div className="bg-[#0b2545] text-white py-14 border-b-4 border-amber-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Admissions Helpline & Support Desk
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Outfit']">
            Contact JANGRA NIOS SERVICES
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Reach out via phone, direct WhatsApp, email, or visit our Delhi advisory center for immediate admission assistance.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: WhatsApp */}
          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-emerald-950">Direct WhatsApp Help</h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Connect instantly with our admission counselors on WhatsApp for instant doubts, fee details, and TMA submission queries.
              </p>
              <div className="text-sm font-black text-emerald-900 font-mono">
                +91-9968834276
              </div>
            </div>

            <a
              href="https://wa.me/919968834276?text=Hello%20JANGRA%20NIOS%20Services,%20I%20want%20information%20regarding%20admission."
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs text-center transition-colors block"
            >
              Start WhatsApp Chat
            </a>
          </div>

          {/* Card 2: Click to Call */}
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-amber-950">Click-to-Call Helpline</h3>
              <p className="text-xs text-amber-800 leading-relaxed">
                Speak directly with our senior educational advisors during office hours for personalized stream guidance.
              </p>
              <div className="text-sm font-black text-amber-950 font-mono">
                +91-9968834276
              </div>
            </div>

            <a
              href="tel:+919968834276"
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs text-center transition-colors block"
            >
              Call +91-9968834276
            </a>
          </div>

          {/* Card 3: Email Support */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-xl bg-[#0b2545] text-amber-400 flex items-center justify-center font-bold">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-blue-950">Official Email</h3>
              <p className="text-xs text-blue-800 leading-relaxed">
                Send official inquiries, previous marksheets for eligibility checks, or partnership questions.
              </p>
              <div className="text-xs font-bold text-blue-900 font-mono truncate">
                jangraeducationalservices@gmail.com
              </div>
            </div>

            <a
              href="mailto:jangraeducationalservices@gmail.com"
              className="w-full py-2.5 bg-[#0b2545] hover:bg-slate-900 text-white font-bold rounded-xl text-xs text-center transition-colors block truncate"
            >
              Send Official Email
            </a>
          </div>

        </div>

        {/* Contact Form & Office Location Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Inquiry Form (Sent to Admin Dashboard) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-black text-[#0b2545] font-['Outfit']">
                Send an Admission Inquiry
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Fill the form below and our counseling coordinator will respond within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Candidate name"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-[#0b2545]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    placeholder="+91-9968834276"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-[#0b2545]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email ID</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="candidate@example.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-[#0b2545]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-[#0b2545]"
                  >
                    <option value="Admission for Class 10th">Admission for Class 10th</option>
                    <option value="Admission for Class 12th">Admission for Class 12th</option>
                    <option value="Transfer of Credit (TOC) Guidance">Transfer of Credit (TOC) Guidance</option>
                    <option value="On-Demand Exam (ODE) Booking">On-Demand Exam (ODE) Booking</option>
                    <option value="TMA & Practical Files Inquiry">TMA & Practical Files Inquiry</option>
                    <option value="Other Assistance">Other Assistance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Message / Questions *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell us about your previous qualification, board, and how we can help you..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-[#0b2545]"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#0b2545] hover:bg-slate-900 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending...' : 'Submit Inquiry'}</span>
              </button>
            </form>
          </div>

          {/* Location & Office Details + Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-[#0b2545] font-['Outfit']">
                Visit Our Educational Center
              </h3>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>Head Advisory Office:</strong>
                    <p className="text-slate-600 mt-0.5">
                      Plot No. 42, Sector 14 Educational Hub, Rohini, Near Metro Pillar 324, New Delhi - 110085, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>Office Working Hours:</strong>
                    <p className="text-slate-600 mt-0.5">
                      Monday to Saturday: 9:00 AM to 7:00 PM<br/>
                      Sunday: WhatsApp & Online Helpline Active
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Official Registration:</strong>
                    <p className="text-slate-600 mt-0.5">
                      Govt. Registered Academic Advisory Entity. Direct coordination with accredited NIOS AI Study Centers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive / Visual Map Section */}
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 aspect-16/10 relative">
              <iframe
                title="Google Maps Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d111956.1287955512!2d77.03746654862551!3d28.729112265007324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d0684f50f38b5%3A0xc3cf33842c8d281!2sRohini%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-bold text-[#0b2545] shadow-xs">
                📍 JANGRA NIOS SERVICES · Rohini, Delhi
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
