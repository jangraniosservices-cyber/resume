import React, { useState } from 'react';
import { 
  GraduationCap, 
  Phone, 
  MessageCircle, 
  User, 
  ShieldCheck, 
  Menu, 
  X,
  Clock,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isStudentLoggedIn?: boolean;
  studentName?: string;
  isAdminLoggedIn?: boolean;
  onStudentLogout?: () => void;
  onAdminLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isStudentLoggedIn,
  studentName,
  isAdminLoggedIn,
  onStudentLogout,
  onAdminLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'courses', label: 'Courses & Services' },
    { id: 'admission', label: 'Online Admission' },
    { id: 'contact', label: 'Contact Us' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Notification Strip */}
      <div className="bg-[#0b2545] text-white text-xs py-2 px-4 border-b border-blue-900/40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-slate-300 text-xs">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Admissions Open 2026-27</span>
            </span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span className="hidden sm:inline">Stream 1 & 2 (Class 10th & 12th)</span>
            <span className="hidden md:inline" aria-hidden="true">·</span>
            <span className="hidden md:flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Mon-Sat 9 AM - 7 PM</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs ml-auto">
            <a 
              href="tel:+919968834276" 
              className="flex items-center gap-1 text-slate-200 hover:text-amber-400 transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span className="font-medium">+91-9968834276</span>
            </a>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <a 
              href="https://wa.me/919968834276?text=Hello%20Jangra%20NIOS%20Services,%20I%20want%20information%20regarding%20admission."
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="font-medium">WhatsApp</span>
            </a>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                activeTab === 'admin' 
                  ? 'bg-amber-400 text-slate-900 font-semibold' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar (Clean 3-zone contract) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Single element brand wordmark */}
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 text-left group shrink-0 focus:outline-hidden"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0b2545] to-[#1d4e89] flex items-center justify-center text-amber-400 shadow-md group-hover:scale-105 transition-transform">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black tracking-tight text-[#0b2545] font-['Outfit'] uppercase">
                JANGRA <span className="text-amber-600">NIOS</span>
              </div>
              <div className="text-[11px] font-semibold text-slate-600 tracking-wider uppercase">
                Educational Advisory Services
              </div>
            </div>
          </button>

          {/* Zone 2: 5 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700">
            {navLinks.map(link => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`transition-colors whitespace-nowrap py-1 relative ${
                    isActive 
                      ? 'text-[#0b2545] font-bold' 
                      : 'text-slate-600 hover:text-[#0b2545]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action Area */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {isStudentLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('student')}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#0b2545] bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors whitespace-nowrap"
                >
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  <span>{studentName || 'Student Portal'}</span>
                </button>
                <button
                  onClick={onStudentLogout}
                  className="px-2.5 py-2 text-xs font-medium text-slate-500 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setActiveTab('student')}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-[#0b2545] border border-slate-300 rounded-lg hover:border-[#0b2545] hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  <User className="w-3.5 h-3.5 text-[#0b2545]" />
                  <span>Student Login</span>
                </button>

                <button
                  onClick={() => setActiveTab('admission')}
                  className="px-5 py-2.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 rounded-lg shadow-sm hover:shadow-md transition-all whitespace-nowrap uppercase tracking-wider"
                >
                  Apply Admission
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex items-center lg:hidden gap-2">
            <button
              onClick={() => setActiveTab('admission')}
              className="sm:hidden px-3 py-1.5 text-xs font-bold bg-amber-400 text-slate-900 rounded-md"
            >
              Apply
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-[#0b2545] rounded-lg border border-slate-200"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === link.id
                  ? 'bg-amber-50 text-[#0b2545] font-bold border-l-4 border-amber-500'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setActiveTab('student');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-[#0b2545] border border-slate-300 rounded-lg"
            >
              <User className="w-4 h-4" />
              <span>Student Portal Login</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Administrator Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
