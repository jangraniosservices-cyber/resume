import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  CreditCard, 
  Download, 
  LogOut, 
  ShieldCheck, 
  Printer, 
  Calendar, 
  Sparkles,
  BookOpen,
  ArrowRight,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { AdmissionReceiptModal } from '../components/AdmissionReceiptModal.tsx';
import { api } from '../services/api.ts';
import { StudentUser, AdmissionApplication, PaymentTransaction, SubscriptionPlan } from '../types/index.ts';

interface StudentPortalProps {
  currentStudent: any | null;
  onLogin: (studentData: any) => void;
  onLogout: () => void;
  onOpenPaymentModal: (plan: SubscriptionPlan) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  currentStudent,
  onLogin,
  onLogout,
  onOpenPaymentModal
}) => {
  // Login states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);

  // Change password modal
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passMsg, setPassMsg] = useState<string | null>(null);

  // Student Profile Data
  const [profileData, setProfileData] = useState<any>(null);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Load student detailed profile if logged in
  useEffect(() => {
    if (currentStudent?.studentId) {
      loadProfile(currentStudent.studentId);
    }
  }, [currentStudent]);

  async function loadProfile(sId: string) {
    try {
      const res = await api.getStudentProfile(sId);
      if (res.success) {
        setProfileData(res);
        setPayments(res.payments || []);
      }
    } catch (err) {
      console.error('Error loading student profile:', err);
    }
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await api.studentLogin(identifier, password);
      if (res.success && res.student) {
        onLogin(res.student);
      } else {
        setLoginError(res.message || 'Invalid login credentials.');
      }
    } catch (err) {
      setLoginError('Server error during login. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.studentForgotPassword(forgotInput);
      if (res.success) {
        setForgotMsg(`Generated new temporary password: "${res.temporaryPassword}" for Student ID ${res.studentId}. Please login now.`);
      } else {
        setForgotMsg(res.message || 'Could not find account.');
      }
    } catch (err) {
      setForgotMsg('Error processing request.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.studentChangePassword(currentStudent.studentId, currPass, newPass);
      if (res.success) {
        setPassMsg('Password successfully updated!');
        setTimeout(() => setShowChangePassModal(false), 1500);
      } else {
        setPassMsg(res.message || 'Failed to update password.');
      }
    } catch (err) {
      setPassMsg('Error updating password.');
    }
  };

  const admission = profileData?.admission || currentStudent?.admission;
  const isSubscribed = currentStudent?.subscriptionStatus === 'Active';

  // -------------------------------------------------------------
  // NOT LOGGED IN STATE
  // -------------------------------------------------------------
  if (!currentStudent) {
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-lg mx-auto space-y-8">
        
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-[#0b2545] text-amber-400 flex items-center justify-center mx-auto shadow-md">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0b2545] font-['Outfit']">
            Student Portal Login
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Access your admission application, verified documents, solved TMAs, and learning subscription.
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student ID or Registered Mobile *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. STU-99214 or 9876543210"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:bg-white focus:outline-hidden focus:border-[#0b2545]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Password *
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] font-semibold text-blue-900 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                required
                placeholder="Enter your student password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:outline-hidden focus:border-[#0b2545]"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all"
            >
              {isLoggingIn ? 'Verifying Account...' : 'Log In to Student Dashboard'}
            </button>
          </form>

          {/* Quick Demo Login Credentials */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Quick Demo Accounts:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setIdentifier('STU-99214');
                  setPassword('Temp@99214');
                }}
                className="p-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg text-left"
              >
                <strong className="block text-slate-800 text-[11px]">Rahul (10th)</strong>
                <span className="text-[10px] text-slate-500 font-mono">STU-99214</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIdentifier('STU-99215');
                  setPassword('Temp@99215');
                }}
                className="p-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg text-left"
              >
                <strong className="block text-slate-800 text-[11px]">Pooja (12th)</strong>
                <span className="text-[10px] text-slate-500 font-mono">STU-99215</span>
              </button>
            </div>
          </div>
        </div>

        {/* Forgot Password Modal */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
              <h3 className="text-base font-bold text-[#0b2545]">Student Password Recovery</h3>
              <p className="text-xs text-slate-600">
                Enter your registered Mobile Number or Student ID to generate a secure temporary reset password.
              </p>
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="e.g. 9876543210 or STU-99214"
                  value={forgotInput}
                  onChange={e => setForgotInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                />
                {forgotMsg && (
                  <div className="p-3 bg-blue-50 text-blue-900 rounded-lg text-xs border border-blue-200 font-medium">
                    {forgotMsg}
                  </div>
                )}
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      setForgotMsg(null);
                    }}
                    className="px-3 py-1.5 text-xs text-slate-600"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0b2545] text-white text-xs font-bold rounded-lg"
                  >
                    Generate Temporary Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    );
  }

  // -------------------------------------------------------------
  // LOGGED IN STUDENT DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      
      {/* Welcome Top Banner */}
      <div className="bg-gradient-to-r from-[#0b2545] via-[#133b5c] to-[#1d4e89] text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-blue-900/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs text-amber-300 font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Active Student Profile · NIOS Candidate</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-['Outfit']">
            Welcome, {currentStudent.fullName}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium">
            <span>Student ID: <strong className="text-amber-400 font-mono">{currentStudent.studentId}</strong></span>
            <span aria-hidden="true">·</span>
            <span>App Ref: <strong className="text-white font-mono">{currentStudent.applicationNumber}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Mobile: <strong className="text-white">{currentStudent.mobile}</strong></span>
          </div>
        </div>

        {/* Top Actions: Change Password & Logout */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowChangePassModal(true)}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/20"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Change Password</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3.5 py-2 bg-red-600/90 hover:bg-red-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Status & Subscriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Admission Status & Documents */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 1. Admission Application Status Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                  Official NIOS Board Application
                </span>
                <h3 className="text-xl font-bold text-[#0b2545] font-['Outfit']">
                  Admission Processing Status
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 bg-amber-400 px-3 py-1 rounded-full shadow-2xs">
                  {admission?.status || 'Submitted'}
                </span>
                {admission && (
                  <button
                    onClick={() => setShowReceiptModal(true)}
                    className="p-1.5 text-slate-600 hover:text-[#0b2545] rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    title="Download Official Admission Receipt"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Application Details Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <span className="text-slate-400 block font-medium">Applied Course:</span>
                <strong className="text-slate-900">{admission?.courseAppliedFor || 'NIOS Secondary (10th)'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Study Medium:</span>
                <strong className="text-slate-900">{admission?.studyMedium || 'Hindi'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Category:</span>
                <strong className="text-slate-900">{admission?.category || 'General'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Submitted Date:</span>
                <strong className="text-slate-900">
                  {admission?.submittedAt ? new Date(admission.submittedAt).toLocaleDateString() : 'Active'}
                </strong>
              </div>
            </div>

            {/* Counselor Review Note */}
            {admission?.adminNotes && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 space-y-1">
                <strong>Academic Counselor Remark:</strong>
                <p className="text-blue-900">{admission.adminNotes}</p>
              </div>
            )}

            {/* 2. Four Uploaded Documents Status */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                KYC Document Verification Status:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">1. Student Photograph</span>
                    <span className="text-[10px] text-slate-500 block">Verified Passport Dimensions</span>
                  </div>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">2. Student Signature</span>
                    <span className="text-[10px] text-slate-500 block">Clear Ink Specimen</span>
                  </div>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">3. Aadhaar Card</span>
                    <span className="text-[10px] text-slate-500 block">Secure Masked Document</span>
                  </div>
                  <span className="text-blue-800 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Protected
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">4. Previous Marksheet / SLC</span>
                    <span className="text-[10px] text-slate-500 block">Eligibility Document</span>
                  </div>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Official Admission Slip CTA */}
            {admission && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowReceiptModal(true)}
                  className="px-4 py-2.5 bg-[#0b2545] hover:bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Download / Print Official Admission Slip</span>
                </button>
              </div>
            )}
          </div>

          {/* 3. Study Material & Solved TMA Download Center */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Academic Resources</span>
                <h3 className="text-lg font-bold text-[#0b2545] font-['Outfit']">
                  Solved TMAs & Practical Lab Manuals
                </h3>
              </div>
              {isSubscribed ? (
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                  Subscription Active
                </span>
              ) : (
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full">
                  Requires Active Plan
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              {[
                { title: 'Tutor Marked Assignment (TMA) 2026-27 - All Subjects Solved PDF', size: '4.2 MB' },
                { title: 'Class 10th / 12th Practical Exam Files & Viva Questions Bank', size: '6.8 MB' },
                { title: 'Previous 5 Years Question Papers with Complete Answer Blueprint', size: '8.1 MB' },
                { title: 'Chapter-wise Fast Track Revision Mindmaps (Hindi & English)', size: '3.5 MB' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-[#0b2545] shrink-0" />
                    <div>
                      <strong className="text-slate-800 block line-clamp-1">{item.title}</strong>
                      <span className="text-[10px] text-slate-500">{item.size} · PDF</span>
                    </div>
                  </div>

                  {isSubscribed ? (
                    <button
                      onClick={() => alert(`Downloading "${item.title}"...`)}
                      className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenPaymentModal({
                        id: 'plan-quarterly',
                        name: 'Quarterly Exam Preparation',
                        durationLabel: 'Quarterly',
                        price: 2499,
                        originalPrice: 3499,
                        durationDays: 90,
                        description: 'Exam revision and TMA solutions access',
                        features: ['Solved TMAs', 'Practical Files'],
                        isActive: true
                      })}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-amber-400 text-slate-800 hover:text-slate-950 font-bold rounded-lg text-xs transition-colors"
                    >
                      Unlock Access
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Subscription Status & Payments */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Subscription Status Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div>
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                Student Learning Pass
              </span>
              <h3 className="text-lg font-bold text-[#0b2545] font-['Outfit']">
                Subscription Status
              </h3>
            </div>

            <div className={`p-4 rounded-2xl border ${
              isSubscribed 
                ? 'bg-emerald-50 border-emerald-300' 
                : 'bg-amber-50 border-amber-300'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  {currentStudent.subscriptionPlanName || 'No Active Plan'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  isSubscribed ? 'bg-emerald-200 text-emerald-950' : 'bg-amber-200 text-amber-950'
                }`}>
                  {currentStudent.subscriptionStatus || 'Inactive'}
                </span>
              </div>

              {currentStudent.subscriptionExpiryDate ? (
                <div className="mt-3 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Expires On: <strong>{new Date(currentStudent.subscriptionExpiryDate).toLocaleDateString()}</strong></span>
                  </div>
                  <p className="text-[11px] text-emerald-700 font-medium">
                    Auto-renew or upgrade anytime to keep accessing verified study files.
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-xs text-slate-600">
                  Subscribe to access solved TMAs, practical files, and 1-on-1 counselor chat.
                </p>
              )}
            </div>

            <button
              onClick={() => onOpenPaymentModal({
                id: 'plan-quarterly',
                name: 'Quarterly Exam Preparation',
                durationLabel: 'Quarterly',
                price: 2499,
                originalPrice: 3499,
                durationDays: 90,
                description: 'Full solved TMAs, practical lab files, and mentor support',
                features: ['Solved TMAs', 'Practical Files', 'WhatsApp Helpline'],
                isActive: true
              })}
              className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <CreditCard className="w-4 h-4" />
              <span>{isSubscribed ? 'Extend / Upgrade Plan' : 'Activate Subscription'}</span>
            </button>
          </div>

          {/* Payment History Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#0b2545] font-['Outfit']">
              Payment History
            </h3>

            {payments.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">
                No payment transactions recorded yet.
              </p>
            ) : (
              <div className="space-y-3">
                {payments.map(pay => (
                  <div key={pay.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900">{pay.planName}</strong>
                      <span className="font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded text-[10px]">
                        ₹{pay.amount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Ref: {pay.receiptNumber}</span>
                      <span>{new Date(pay.paidAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Helpline Card */}
          <div className="bg-[#0b2545] text-white rounded-3xl p-6 border border-amber-400/40 space-y-3">
            <h4 className="text-sm font-bold text-amber-400">Student Helpline Desk</h4>
            <p className="text-xs text-slate-300">
              Need assistance with your study center, TMA uploading, or admit card?
            </p>
            <a
              href="https://wa.me/919968834276"
              target="_blank"
              rel="noreferrer"
              className="block w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs text-center transition-colors"
            >
              Direct WhatsApp Helpline
            </a>
          </div>

        </div>

      </div>

      {/* Change Password Modal */}
      {showChangePassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-[#0b2545]">Change Student Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currPass}
                  onChange={e => setCurrPass(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Password (Min 6 chars)</label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              {passMsg && (
                <div className="p-3 bg-blue-50 text-blue-900 rounded-lg text-xs border border-blue-200">
                  {passMsg}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChangePassModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0b2545] text-white text-xs font-bold rounded-lg"
                >
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && admission && (
        <AdmissionReceiptModal
          admission={admission}
          onClose={() => setShowReceiptModal(false)}
        />
      )}

    </div>
  );
};
