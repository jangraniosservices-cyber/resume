import React, { useEffect, useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Layers, 
  CreditCard, 
  Sparkles, 
  ShieldCheck,
  Star,
  FileCheck,
  FlaskConical,
  Award,
  ChevronDown,
  Info
} from 'lucide-react';
import { Course, SubscriptionPlan } from '../types/index.ts';
import { api } from '../services/api.ts';

interface CoursesPageProps {
  setActiveTab: (tab: string) => void;
  onOpenPaymentModal: (plan: SubscriptionPlan) => void;
  onSelectCourseForAdmission?: (courseName: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({
  setActiveTab,
  onOpenPaymentModal,
  onSelectCourseForAdmission
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    async function loadCoursesAndPlans() {
      try {
        const [cRes, pRes] = await Promise.all([
          api.getCourses(),
          api.getPlans()
        ]);
        if (cRes.success) setCourses(cRes.courses);
        if (pRes.success) setPlans(pRes.plans);
      } catch (err) {
        console.error('Failed to load courses:', err);
      }
    }
    loadCoursesAndPlans();
  }, []);

  const categories = [
    { id: 'all', label: 'All Programs' },
    { id: 'secondary', label: '10th Secondary' },
    { id: 'senior_secondary', label: '12th Senior Secondary' },
    { id: 'assistance', label: 'Admission Assistance' },
    { id: 'guidance', label: 'Exam & Lab Guidance' },
    { id: 'materials', label: 'Study Packages' }
  ];

  const filteredCourses = activeCategory === 'all'
    ? courses
    : courses.filter(c => c.category === activeCategory);

  return (
    <div className="space-y-16 pb-20">
      
      {/* Page Header */}
      <div className="bg-[#0b2545] text-white py-14 border-b-4 border-amber-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Academic Courses & Specialized Advisory
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Outfit']">
            Certified Courses & Educational Services
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Choose from comprehensive Class 10th and 12th programs, practical examination coaching, solved TMA solutions, and flexible learning subscriptions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-[#0b2545] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Course Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map(course => (
            <div
              key={course.id}
              className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden ${
                course.featured
                  ? 'border-amber-400 shadow-md ring-1 ring-amber-400/40'
                  : 'border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md'
              }`}
            >
              {/* Card Top */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs bg-blue-50 text-blue-900 px-2.5 py-1 rounded">
                    {course.code}
                  </span>
                  {course.featured && (
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      ★ Marquee Program
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900">
                  {course.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {course.shortDesc}
                </p>

                {/* Meta details */}
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block font-medium">Eligibility:</span>
                    <span className="font-semibold text-slate-800 truncate block">{course.eligibility}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Duration:</span>
                    <span className="font-semibold text-slate-800 truncate block">{course.duration}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Included Benefits:
                  </div>
                  {course.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer: Fee & Action Buttons */}
              <div className="bg-slate-50/80 p-5 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Program Fee</span>
                  <span className="text-xl font-black text-[#0b2545]">
                    ₹{course.fee.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      if (onSelectCourseForAdmission) {
                        onSelectCourseForAdmission(
                          course.category === 'secondary'
                            ? 'NIOS Secondary (10th)'
                            : 'NIOS Senior Secondary (12th)'
                        );
                      }
                      setActiveTab('admission');
                    }}
                    className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-lg transition-colors shadow-xs"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Detailed Course Modal when clicked */}
        {selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                    {selectedCourse.code}
                  </span>
                  <h3 className="text-2xl font-black text-[#0b2545] font-['Outfit'] mt-1">
                    {selectedCourse.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <p>{selectedCourse.fullDesc}</p>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div><strong>Target Eligibility:</strong> {selectedCourse.eligibility}</div>
                  <div><strong>Course Duration:</strong> {selectedCourse.duration}</div>
                  <div><strong>Subject Count:</strong> {selectedCourse.subjectsCount}</div>
                  <div><strong>Fee Structure:</strong> ₹{selectedCourse.fee.toLocaleString('en-IN')} (One-time guidance & advisory)</div>
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-slate-900">Program Highlights:</div>
                  <ul className="space-y-1.5">
                    {selectedCourse.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedCourse(null);
                    if (onSelectCourseForAdmission) {
                      onSelectCourseForAdmission(
                        selectedCourse.category === 'secondary'
                          ? 'NIOS Secondary (10th)'
                          : 'NIOS Senior Secondary (12th)'
                      );
                    }
                    setActiveTab('admission');
                  }}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
                >
                  Proceed to Online Admission
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 8. SUBSCRIPTION PLANS SECTION */}
        <section className="bg-gradient-to-b from-slate-50 to-slate-100 rounded-3xl p-8 sm:p-12 border border-slate-200 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Student Learning Subscriptions
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0b2545] font-['Outfit']">
              Flexible Study Packages & Exam Pass
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Get immediate access to verified solved TMAs, practical record files, previous 10-year question banks, and dedicated mentor support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                  plan.isPopular
                    ? 'border-amber-400 shadow-lg ring-2 ring-amber-400/30'
                    : 'border-slate-200 shadow-xs hover:border-slate-300'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
                      {plan.durationLabel}
                    </span>
                    {plan.isPopular && (
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
                        Most Popular
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {plan.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {plan.description}
                    </p>
                  </div>

                  <div className="py-2 border-y border-slate-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-[#0b2545]">
                        ₹{plan.price.toLocaleString('en-IN')}
                      </span>
                      {plan.originalPrice > plan.price && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{plan.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Valid for {plan.durationDays} Days
                    </span>
                  </div>

                  {/* Feature checklist */}
                  <div className="space-y-2">
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-4">
                  <button
                    onClick={() => onOpenPaymentModal(plan)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                      plan.isPopular
                        ? 'bg-amber-400 hover:bg-amber-500 text-slate-950'
                        : 'bg-[#0b2545] hover:bg-slate-900 text-white'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Subscribe Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Instant subscription activation upon verified UPI / Razorpay payment. Receipts generated automatically.</span>
            </div>
            <a
              href="https://wa.me/919968834276?text=I%20have%20a%20question%20about%20subscription%20plans."
              target="_blank"
              rel="noreferrer"
              className="text-blue-900 font-bold hover:underline shrink-0"
            >
              Need a Custom Plan? Chat on WhatsApp →
            </a>
          </div>
        </section>

      </div>
    </div>
  );
};
