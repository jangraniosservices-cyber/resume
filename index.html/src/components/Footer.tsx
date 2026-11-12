import React from 'react';
import { 
  GraduationCap, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenPolicyModal?: (policyType: 'privacy' | 'terms' | 'refund') => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenPolicyModal }) => {
  return (
    <footer className="bg-[#0b2545] text-slate-300 pt-16 pb-12 border-t-4 border-amber-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-blue-900/60">
          
          {/* Column 1: Organization Branding */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white font-['Outfit'] tracking-tight">
                  JANGRA <span className="text-amber-400">NIOS</span>
                </h3>
                <p className="text-xs text-slate-300 font-medium tracking-wider uppercase">
                  Educational Services
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Premier academic advisory center guiding students across India for successful Class 10th (Secondary) & Class 12th (Senior Secondary) NIOS admissions, solved TMAs, practical exams, and certified completion.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://wa.me/919968834276"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
              <a
                href="tel:+919968834276"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-800/80 hover:bg-blue-700 rounded-md transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call Center</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Quick Navigation</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => setActiveTab('home')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-slate-300"
                >
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('about')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-slate-300"
                >
                  <span>About Our Institute</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('courses')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-slate-300"
                >
                  <span>Courses & Services</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('admission')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-slate-300"
                >
                  <span>Online Admission Form</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('contact')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-slate-300"
                >
                  <span>Contact & Location</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('student')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-amber-300 font-medium"
                >
                  <span>Student Portal Login</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('admin')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-slate-400"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Dashboard</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Specialized Courses */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Key Programs</span>
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>NIOS Class 10th (Secondary)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>NIOS Class 12th (Senior Secondary)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Transfer of Credit (TOC) Guidance</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>On-Demand Examination (ODE) Booking</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Practical Lab Manuals & Solved TMAs</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Study Center & AI Allocation</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Office Details */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Official Address</span>
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                <span>Plot No. 42, Sector 14 Educational Hub, Rohini, Near Metro Pillar 324, New Delhi - 110085, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+919968834276" className="hover:text-white transition-colors">
                  +91-9968834276
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:jangraeducationalservices@gmail.com" className="hover:text-white transition-colors truncate">
                  jangraeducationalservices@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Mon - Sat: 9:00 AM - 7:00 PM (WhatsApp Available 24/7)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Strip: Policies & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} JANGRA NIOS SERVICES. All Rights Reserved. An autonomous private educational consultancy.
          </div>

          <div className="flex items-center gap-5">
            <button 
              onClick={() => onOpenPolicyModal && onOpenPolicyModal('privacy')}
              className="hover:text-amber-400 transition-colors"
            >
              Privacy Policy
            </button>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <button 
              onClick={() => onOpenPolicyModal && onOpenPolicyModal('terms')}
              className="hover:text-amber-400 transition-colors"
            >
              Terms & Conditions
            </button>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <button 
              onClick={() => onOpenPolicyModal && onOpenPolicyModal('refund')}
              className="hover:text-amber-400 transition-colors"
            >
              Refund Policy
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
