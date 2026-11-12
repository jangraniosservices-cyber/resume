import React, { useEffect, useState } from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  Award, 
  Users, 
  Clock, 
  BellRing, 
  ChevronRight, 
  FileText, 
  Sparkles, 
  PhoneCall, 
  MessageCircle, 
  Quote,
  Calendar,
  Layers,
  ShieldCheck,
  Star
} from 'lucide-react';
import { Course, Announcement, GalleryItem, SiteSettings } from '../types/index.ts';
import { api } from '../services/api.ts';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
  onSelectCourse: (course: Course) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab, onSelectCourse }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [activeGalleryFilter, setActiveGalleryFilter] = useState<string>('All');

  useEffect(() => {
    async function loadData() {
      try {
        const [cRes, aRes, gRes, sRes] = await Promise.all([
          api.getCourses(),
          api.getAnnouncements(),
          api.getGallery(),
          api.getContent()
        ]);
        if (cRes.success) setCourses(cRes.courses);
        if (aRes.success) setAnnouncements(aRes.announcements);
        if (gRes.success) setGallery(gRes.gallery);
        if (sRes.success) setSettings(sRes.settings);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      }
    }
    loadData();
  }, []);

  const heroImage = '/src/assets/images/hero_education_students_1794235957015.jpg';
  const labImage = '/src/assets/images/classroom_practical_lab_1794235957447.jpg';
  const graduationImage = '/src/assets/images/graduation_success_celebration_1794235957820.jpg';
  const counselingImage = '/src/assets/images/about_guidance_counseling_1794235956786.jpg';

  const successStories = [
    {
      name: 'Mohit Tanwar',
      course: 'Senior Secondary (12th Science)',
      score: '84.6% in NIOS Board',
      current: 'Now Pursuing B.Tech Computer Science at IP University',
      image: graduationImage,
      review: 'I had dropped out due to health issues during regular 11th. JANGRA NIOS SERVICES handled my entire registration, practical files, and solved TMAs. I cleared Class 12th in one attempt without wasting a year!'
    },
    {
      name: 'Aanya Srivastava',
      course: 'Secondary (10th Standard)',
      score: '81.2% in NIOS Board',
      current: 'Enrolled in 11th Commerce with Mathematics',
      image: heroImage,
      review: 'Their counselor Sunita ma’am personally guided my subject combination. The solved assignments were 100% verified and scored maximum marks. Highly recommended for any student wanting stress-free education.'
    },
    {
      name: 'Gurpreet Singh',
      course: 'Senior Secondary (12th Commerce)',
      score: '78.5% with Transfer of Credit (TOC)',
      current: 'Working as Junior Accountant & B.Com Final Year',
      image: counselingImage,
      review: 'I needed Transfer of Credit for 2 subjects I had passed in CBSE. JANGRA NIOS completed the TOC documentation smoothly. Genuine guidance and immediate WhatsApp help whenever I had doubts.'
    }
  ];

  const filteredGallery = activeGalleryFilter === 'All' 
    ? gallery 
    : gallery.filter(g => g.category.toLowerCase() === activeGalleryFilter.toLowerCase());

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO BANNER SECTION (Inspired by Bright Future International School reference) */}
      <section className="relative bg-[#0b2545] text-white overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Premier NIOS Board Educational Consultancy · New Delhi</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight font-['Outfit']">
                {settings?.heroHeading || 'Your Education, Your Future'}
              </h1>

              <p className="text-xl sm:text-2xl font-semibold text-amber-400 font-['Outfit']">
                {settings?.heroSubheading || 'Learn Today, Succeed Tomorrow'}
              </p>

              <p className="text-base text-slate-300 leading-relaxed max-w-2xl">
                Get certified Class 10th (Secondary) & Class 12th (Senior Secondary) through the National Institute of Open Schooling. Complete online admission support, stream selection, solved TMA assignments, practical files, and examination center guidance.
              </p>

              {/* Action Buttons Group */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <button
                  onClick={() => setActiveTab('admission')}
                  className="px-6 py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm tracking-wide uppercase"
                >
                  <span>Apply for Admission</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('student')}
                  className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all text-sm flex items-center gap-2"
                >
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Student Login</span>
                </button>

                <button
                  onClick={() => setActiveTab('admin')}
                  className="px-4 py-3.5 text-slate-300 hover:text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Admin Login</span>
                </button>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-6 border-t border-blue-900/60 grid grid-cols-3 gap-4 text-xs text-slate-300">
                <div>
                  <div className="text-xl font-black text-amber-400 font-['Outfit']">100%</div>
                  <div className="text-slate-400 mt-0.5">MHRD & Govt. Recognized</div>
                </div>
                <div>
                  <div className="text-xl font-black text-amber-400 font-['Outfit']">12,500+</div>
                  <div className="text-slate-400 mt-0.5">Students Guided</div>
                </div>
                <div>
                  <div className="text-xl font-black text-amber-400 font-['Outfit']">24/7</div>
                  <div className="text-slate-400 mt-0.5">WhatsApp Helpline</div>
                </div>
              </div>

            </div>

            {/* Right Educational Hero Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-4/3 group">
                <img
                  src={heroImage}
                  alt="JANGRA NIOS Services Students"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b2545]/90 via-transparent to-transparent" />

                {/* Overlaid Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3.5 text-slate-900 shadow-lg border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#0b2545]">Next Admission Cycle 2026-27</div>
                      <div className="text-[11px] text-slate-600">Stream 1 (April Block) & On-Demand (ODE)</div>
                    </div>
                    <button
                      onClick={() => setActiveTab('admission')}
                      className="px-3 py-1.5 bg-[#0b2545] text-amber-400 font-bold text-xs rounded-md hover:bg-blue-900"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. LIVE ANNOUNCEMENTS & TICKER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0b2545]">Latest Announcements & Datesheets</h3>
                <p className="text-xs text-slate-600">Official NIOS updates and exam schedules</p>
              </div>
            </div>

            {/* Notice Cards Ticker */}
            <div className="flex-1 overflow-x-auto flex items-center gap-3 pb-1 md:pb-0">
              {announcements.slice(0, 3).map(ann => (
                <div 
                  key={ann.id}
                  className="bg-white border border-amber-200/80 rounded-xl p-3 shrink-0 w-72 sm:w-80 shadow-2xs hover:border-amber-400 transition-colors cursor-pointer"
                  onClick={() => setActiveTab('courses')}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-amber-800 uppercase tracking-wider">{ann.category}</span>
                    <span className="text-slate-400">{ann.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {ann.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 3. ABOUT OUR SERVICES & NIOS ADMISSION INFO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-5">
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Comprehensive Admission Assistance
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#0b2545] font-['Outfit']">
              Complete Guidance for NIOS Secondary & Senior Secondary Certification
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              The National Institute of Open Schooling (NIOS) is an autonomous institution under the Ministry of Education, Government of India. At <strong>JANGRA NIOS SERVICES</strong>, we simplify the entire process so students, working professionals, and private candidates can achieve valid 10th and 12th board qualifications without obstacles.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Stream 1 (Block 1 & 2) – Fresh Online Admission</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Eligible for any candidate seeking regular 10th or 12th exam sessions in April or October.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Stream 2 – Direct Admission for Board-Failed Candidates</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Failed students from CBSE, ICSE, or State Boards can save their precious academic year.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Transfer of Credit (TOC) & On-Demand Exam (ODE)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Transfer marks for up to two passed subjects and take on-demand tests at your own schedule.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveTab('about')}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#0b2545] hover:text-amber-600 transition-colors"
              >
                <span>Read Full Institute Profile & Objectives</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden shadow-md aspect-4/3 border border-slate-200">
              <img
                src={counselingImage}
                alt="One on one counseling"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md aspect-4/3 border border-slate-200 mt-6">
              <img
                src={labImage}
                alt="Practical Examination Laboratory"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 4. FEATURED COURSES & SERVICES */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                Academic Programs & Support
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0b2545] font-['Outfit'] mt-1">
                Courses & Guidance Services
              </h2>
            </div>

            <button
              onClick={() => setActiveTab('courses')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b2545] hover:text-amber-600 transition-colors"
            >
              <span>View All 7 Courses & Packages</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 6).map(course => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-amber-400 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                      {course.code}
                    </span>
                    <span className="text-slate-500 font-medium">
                      {course.duration}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0b2545] transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {course.shortDesc}
                  </p>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    {course.features.slice(0, 3).map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Guidance Fee</span>
                    <span className="text-lg font-black text-[#0b2545]">
                      ₹{course.fee.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectCourse(course)}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => setActiveTab('admission')}
                      className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-lg transition-colors"
                    >
                      Enroll
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. PHOTO GALLERY (Admin Managed) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Life At Our Institute
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0b2545] font-['Outfit'] mt-1">
              Campus & Student Photo Gallery
            </h2>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {['All', 'Campus', 'Labs', 'Graduation', 'Counseling'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveGalleryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeGalleryFilter === cat
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredGallery.map(item => (
            <div 
              key={item.id} 
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              <div className="aspect-4/3 overflow-hidden bg-slate-100 relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#0b2545]/80 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded">
                  {item.category}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. SUCCESS STORIES & TESTIMONIALS */}
      <section className="bg-[#0b2545] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Real Student Outcomes
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-['Outfit']">
              Student Success Stories & Testimonials
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Thousands of students who faced academic setbacks have rebuilt their careers with high marks through our personalized NIOS guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {successStories.map((story, i) => (
              <div 
                key={i} 
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xs flex flex-col justify-between hover:border-amber-400/50 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{story.review}"
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-900 font-bold flex items-center justify-center shrink-0">
                    {story.name[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{story.name}</h4>
                    <p className="text-[11px] text-amber-400">{story.score}</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{story.current}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. CTA / ADMISSION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-3xl p-8 sm:p-12 text-slate-950 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-black font-['Outfit']">
              Ready to Complete Your 10th or 12th Board?
            </h2>
            <p className="text-sm font-medium text-slate-900 max-w-xl">
              Don't let another academic year slip away. Apply online today or speak with our senior counselor for personalized advice.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('admission')}
              className="px-6 py-3.5 bg-[#0b2545] text-white hover:bg-slate-900 font-bold rounded-xl text-xs uppercase tracking-wider shadow-md transition-all"
            >
              Fill Online Admission
            </button>
            <a
              href="tel:+919968834276"
              className="px-5 py-3.5 bg-white hover:bg-slate-100 text-[#0b2545] font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md"
            >
              <PhoneCall className="w-4 h-4 text-amber-600" />
              <span>Call: +91-9968834276</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
