import React, { useEffect, useState } from 'react';
import { 
  GraduationCap, 
  Target, 
  Eye, 
  CheckCircle2, 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  BookOpen,
  Award,
  Users
} from 'lucide-react';
import { SiteSettings } from '../types/index.ts';
import { api } from '../services/api.ts';

interface AboutPageProps {
  setActiveTab: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setActiveTab }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await api.getContent();
        if (res.success) setSettings(res.settings);
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    }
    fetchSettings();
  }, []);

  const guidanceSteps = [
    {
      step: '01',
      title: 'Free Profile Evaluation & Eligibility Check',
      desc: 'Our academic counselor reviews your previous marksheet, gap years, and target career goals to choose the right NIOS stream (Stream 1 for fresh candidates, Stream 2 for failed candidates).'
    },
    {
      step: '02',
      title: 'Subject Selection & Transfer of Credit (TOC)',
      desc: 'We select scoring combinations from languages, science, commerce, and vocational subjects, ensuring transfer of up to 2 passed subjects from your previous recognized board.'
    },
    {
      step: '03',
      title: 'Error-Free Online Portal Registration',
      desc: 'Our team digitizes, compresses, and uploads your KYC documents (photograph, signature, Aadhaar card, previous certificate) to ensure zero rejections and instant confirmation.'
    },
    {
      step: '04',
      title: 'Study Center Allocation & Books Dispatch',
      desc: 'Selection of the closest accredited AI Study Center to your residence, along with receipt of official NIOS textbooks and digital reference notes.'
    },
    {
      step: '05',
      title: 'TMA Solutions & Practical Exam Preparation',
      desc: 'Assistance in solving Tutor Marked Assignments (TMAs) for high scores, ready-to-write practical science files, and viva-voce simulation workshops.'
    },
    {
      step: '06',
      title: 'Hall Ticket & Examination Coordination',
      desc: 'Timely download of practical and theory examination admit cards, examination center alerts, and result mark-sheet dispatch guidance.'
    }
  ];

  const counselingImg = '/src/assets/images/about_guidance_counseling_1794235956786.jpg';

  return (
    <div className="space-y-16 pb-20">
      
      {/* Page Header */}
      <div className="bg-[#0b2545] text-white py-14 border-b-4 border-amber-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            About Our Institution
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Outfit']">
            Empowering Learners Through Recognized Open Schooling
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Discover the legacy, mission, and student-first values behind <strong>JANGRA NIOS SERVICES</strong>.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Business Introduction */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Who We Are
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0b2545] font-['Outfit']">
              {settings?.businessName || 'JANGRA NIOS SERVICES'}
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {settings?.aboutText || 
                'JANGRA NIOS SERVICES is an established premier educational advisory institute dedicated to guiding students toward completing their Secondary (10th) and Senior Secondary (12th) qualifications through the National Institute of Open Schooling (NIOS).'}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Whether you are a student who experienced difficulties in standard board examinations, an athlete or artist needing flexible learning hours, or an adult learner aiming to qualify for government employment, we provide honest, transparent, and structured support from admission to the day your official board certificate arrives.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg">
                <Award className="w-4 h-4 text-amber-600" />
                <span>12+ Years Advisory Experience</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg">
                <Users className="w-4 h-4 text-amber-600" />
                <span>10,000+ Students Passed</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Government Recognized Certificate</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 aspect-4/3">
              <img
                src={counselingImg}
                alt="Educational Counseling at Jangra NIOS Services"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Mission & Vision Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
              <Target className="w-6 h-6 text-[#0b2545]" />
            </div>
            <h3 className="text-xl font-black text-[#0b2545] font-['Outfit']">Our Mission</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {settings?.mission || 'To empower every student with accessible, recognized, and quality open schooling certification to unlock higher education and rewarding career paths.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
              <Eye className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-black text-[#0b2545] font-['Outfit']">Our Vision</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {settings?.vision || 'To be the most trusted, transparent, and student-centric NIOS educational consultancy in India, recognized for academic excellence, ethical counseling, and 100% student support.'}
            </p>
          </div>
        </section>

        {/* Educational Objectives */}
        <section className="bg-slate-100/70 rounded-3xl p-8 sm:p-12 border border-slate-200 space-y-6">
          <div>
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">Core Commitments</div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0b2545] font-['Outfit'] mt-1">
              Our Educational Objectives
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(settings?.educationalObjectives || []).map((obj, i) => (
              <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-700 leading-relaxed">{obj}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Step-by-Step NIOS Admission Guidance Pathway */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">Step-By-Step Pathway</div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0b2545] font-['Outfit']">
              How We Guide Your NIOS Journey
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Clear, transparent, and structured support from first consultation through exam day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guidanceSteps.map((step, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3 relative group hover:border-[#0b2545] transition-colors">
                <div className="text-2xl font-black font-['Outfit'] text-amber-500">
                  {step.step}
                </div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-[#0b2545] transition-colors">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Institute Contact & Office Card */}
        <section className="bg-[#0b2545] rounded-3xl p-8 sm:p-12 text-white border-2 border-amber-400 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-blue-900/80 pb-6">
            <div>
              <h3 className="text-2xl font-black font-['Outfit']">Connect With Our Educational Advisors</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Admissions are open for the 2026-2027 academic session. In-person and online counseling available.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="https://wa.me/919968834276?text=Hello%20Jangra%20NIOS,%20I%20would%20like%20to%20discuss%20admission."
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: +91-9968834276</span>
              </a>
              <a
                href="tel:+919968834276"
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call Directly</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-slate-300">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Contact Number</span>
              </div>
              <p className="text-slate-300">{settings?.phone || '+91-9968834276'}</p>
              <p className="text-[11px] text-slate-400">Available Mon-Sat for instant calls</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>Email Address</span>
              </div>
              <p className="text-slate-300">{settings?.email || 'jangraeducationalservices@gmail.com'}</p>
              <p className="text-[11px] text-slate-400">Response within 24 hours</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Working Hours</span>
              </div>
              <p className="text-slate-300">{settings?.workingHours || 'Mon-Sat: 9 AM - 7 PM'}</p>
              <p className="text-[11px] text-slate-400">Sunday WhatsApp support active</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Center Address</span>
              </div>
              <p className="text-slate-300 line-clamp-3">{settings?.address || 'Plot 42, Sec 14 Educational Hub, Rohini, New Delhi - 110085'}</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
