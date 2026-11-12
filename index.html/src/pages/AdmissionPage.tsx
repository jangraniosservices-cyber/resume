import React, { useState } from 'react';
import { 
  FileText, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles,
  Printer,
  Clock,
  ArrowRight
} from 'lucide-react';
import { DocumentUploadBox } from '../components/DocumentUploadBox.tsx';
import { AdmissionReceiptModal } from '../components/AdmissionReceiptModal.tsx';
import { DocumentUpload, AdmissionApplication, PublicExamEntry } from '../types/index.ts';
import { api } from '../services/api.ts';

interface AdmissionPageProps {
  initialCourse?: string;
  setActiveTab: (tab: string) => void;
  onStudentLoginSuccess?: (student: any) => void;
}

export const AdmissionPage: React.FC<AdmissionPageProps> = ({
  initialCourse = 'NIOS Secondary (10th)',
  setActiveTab,
  onStudentLoginSuccess
}) => {
  const [activeFormTab, setActiveFormTab] = useState<'admission' | 'publicExam' | 'checkStatus'>('admission');

  // Admission Form Fields
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [mobile, setMobile] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState<'General' | 'OBC' | 'SC' | 'ST' | 'Other'>('General');
  const [previousQualification, setPreviousQualification] = useState('');
  const [courseAppliedFor, setCourseAppliedFor] = useState<'NIOS Secondary (10th)' | 'NIOS Senior Secondary (12th)'>(
    initialCourse as any || 'NIOS Secondary (10th)'
  );
  const [studyMedium, setStudyMedium] = useState<'Hindi' | 'English' | 'Urdu' | 'Other'>('Hindi');
  const [previousSchoolBoard, setPreviousSchoolBoard] = useState('');
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  // 4 Document Boxes
  const [photoDoc, setPhotoDoc] = useState<DocumentUpload | undefined>(undefined);
  const [signatureDoc, setSignatureDoc] = useState<DocumentUpload | undefined>(undefined);
  const [aadhaarDoc, setAadhaarDoc] = useState<DocumentUpload | undefined>(undefined);
  const [qualificationDoc, setQualificationDoc] = useState<DocumentUpload | undefined>(undefined);

  // Public Exam Form Fields
  const [peFullName, setPeFullName] = useState('');
  const [peDob, setPeDob] = useState('');
  const [peMobile, setPeMobile] = useState('');
  const [peEmail, setPeEmail] = useState('');
  const [peEnrollment, setPeEnrollment] = useState('');

  // Status Search
  const [statusQuery, setStatusQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedAdmission, setSubmittedAdmission] = useState<AdmissionApplication | null>(null);
  const [submittedPublicExam, setSubmittedPublicExam] = useState<PublicExamEntry | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Submit Admission
  const handleSubmitAdmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validation
    if (!fullName || !dob || !mobile || !fatherName || !motherName || !address) {
      setSubmitError('Please complete all mandatory personal details marked with an asterisk (*).');
      return;
    }

    if (!photoDoc || !signatureDoc || !aadhaarDoc || !qualificationDoc) {
      setSubmitError('All four document upload boxes (Photo, Signature, Aadhaar, Previous Marksheet) are compulsory.');
      return;
    }

    if (!declarationAccepted) {
      setSubmitError('Please accept the declaration checkbox to confirm accuracy of submitted details.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitAdmission({
        fullName,
        dob,
        mobile,
        fatherName,
        motherName,
        email,
        address,
        category,
        previousQualification,
        courseAppliedFor,
        studyMedium,
        previousSchoolBoard,
        documents: {
          photo: photoDoc,
          signature: signatureDoc,
          aadhaar: aadhaarDoc,
          qualification: qualificationDoc
        }
      });

      if (res.success && res.admission) {
        setSubmittedAdmission(res.admission);
        setShowReceiptModal(true);
      } else {
        setSubmitError(res.message || 'Failed to submit admission application.');
      }
    } catch (err: unknown) {
      console.error('Admission submit error:', err);
      setSubmitError('An error occurred during submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Public Exam
  const handleSubmitPublicExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!peFullName || !peDob || !peMobile || !peEnrollment) {
      setSubmitError('All fields and official Enrollment Number are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitPublicExam({
        fullName: peFullName,
        dob: peDob,
        mobile: peMobile,
        email: peEmail,
        enrollmentNumber: peEnrollment
      });

      if (res.success && res.entry) {
        setSubmittedPublicExam(res.entry);
      } else {
        setSubmitError(res.message || 'Failed to register public examination.');
      }
    } catch (err) {
      setSubmitError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check Status Lookup
  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setSearchResult(null);

    try {
      const res = await api.checkStatus(statusQuery.trim());
      if (res.success && res.data) {
        setSearchResult(res);
      } else {
        setSearchError(res.message || 'No record found with the given details.');
      }
    } catch (err) {
      setSearchError('Could not locate any application. Please verify your number.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      
      {/* Page Header */}
      <div className="bg-[#0b2545] text-white py-14 border-b-4 border-amber-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            National Institute of Open Schooling (NIOS) Portal
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Outfit']">
            Online Admission & Examination Portal
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Apply online for Class 10th (Secondary) & Class 12th (Senior Secondary), submit public examination forms, or track your live verification status.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Tabs between Admission, Public Exam & Status Check */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveFormTab('admission')}
            className={`flex-1 py-3 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeFormTab === 'admission'
                ? 'bg-white text-[#0b2545] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-amber-500" />
            <span>10th / 12th Admission Form</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFormTab('publicExam')}
            className={`flex-1 py-3 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeFormTab === 'publicExam'
                ? 'bg-white text-[#0b2545] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-500" />
            <span>Public Exam Form</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFormTab('checkStatus')}
            className={`flex-1 py-3 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeFormTab === 'checkStatus'
                ? 'bg-white text-[#0b2545] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-4 h-4 text-amber-500" />
            <span>Track Application Status</span>
          </button>
        </div>

        {/* TAB 1: FRESH ONLINE ADMISSION FORM */}
        {activeFormTab === 'admission' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
            
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-2xl font-black text-[#0b2545] font-['Outfit']">
                Complete NIOS Online Admission Form
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Academic Session 2026-2027 · Stream 1 & Stream 2 (April/October Block)
              </p>
            </div>

            <form onSubmit={handleSubmitAdmission} className="space-y-8">
              
              {/* SECTION A: PERSONAL INFORMATION */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[#0b2545] border-b border-slate-100 pb-2">
                  <User className="w-4 h-4 text-amber-500" />
                  <span>Personal Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 1. Student Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      1. Student Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="As per Aadhaar or previous certificate"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs focus:bg-white focus:outline-hidden focus:border-[#0b2545]"
                    />
                  </div>

                  {/* 2. Date of Birth */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      2. Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={e => setDob(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs focus:bg-white focus:outline-hidden focus:border-[#0b2545]"
                    />
                  </div>

                  {/* 3. Mobile Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      3. Mobile Number (WhatsApp) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 99688 34276"
                      value={mobile}
                      onChange={e => setMobile(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs focus:bg-white focus:outline-hidden focus:border-[#0b2545]"
                    />
                  </div>

                  {/* 4. Father's Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      4. Father's Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Father's full name"
                      value={fatherName}
                      onChange={e => setFatherName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs focus:bg-white focus:outline-hidden focus:border-[#0b2545]"
                    />
                  </div>

                  {/* 5. Mother's Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      5. Mother's Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Mother's full name"
                      value={motherName}
                      onChange={e => setMotherName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs focus:bg-white focus:outline-hidden focus:border-[#0b2545]"
                    />
                  </div>

                  {/* 6. Email Address */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      6. Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. student@gmail.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs focus:bg-white focus:outline-hidden focus:border-[#0b2545]"
                    />
                  </div>

                  {/* 8. Category */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      8. Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs focus:bg-white focus:outline-hidden focus:border-[#0b2545]"
                    >
                      <option value="General">General</option>
                      <option value="OBC">OBC (Other Backward Classes)</option>
                      <option value="SC">SC (Scheduled Caste)</option>
                      <option value="ST">ST (Scheduled Tribe)</option>
                      <option value="Other">Other / Minority</option>
                    </select>
                  </div>

                  {/* 7. Full Residential Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      7. Full Residential Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="House/Flat No., Street, Area, City, State, PIN Code"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs focus:bg-white focus:outline-hidden focus:border-[#0b2545]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: EDUCATIONAL INFORMATION */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[#0b2545] border-b border-slate-100 pb-2">
                  <GraduationCap className="w-4 h-4 text-amber-500" />
                  <span>Educational Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 10. Course Applied For */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      10. Course Applied For <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={courseAppliedFor}
                      onChange={e => setCourseAppliedFor(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs font-bold text-blue-950 focus:bg-white focus:outline-hidden focus:border-[#0b2545]"
                    >
                      <option value="NIOS Secondary (10th)">NIOS Secondary (Class 10th)</option>
                      <option value="NIOS Senior Secondary (12th)">NIOS Senior Secondary (Class 12th)</option>
                    </select>
                  </div>

                  {/* 11. Study Medium */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      11. Medium of Study <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={studyMedium}
                      onChange={e => setStudyMedium(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs focus:bg-white focus:outline-hidden focus:border-[#0b2545]"
                    >
                      <option value="Hindi">Hindi Medium</option>
                      <option value="English">English Medium</option>
                      <option value="Urdu">Urdu Medium</option>
                      <option value="Other">Other Regional Medium</option>
                    </select>
                  </div>

                  {/* 9. Previous Qualification */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      9. Previous Qualification <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 8th Passed / 10th Failed CBSE / Self Declaration"
                      value={previousQualification}
                      onChange={e => setPreviousQualification(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs focus:bg-white focus:outline-hidden focus:border-[#0b2545]"
                    />
                  </div>

                  {/* 12. Previous School / Board Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      12. Previous School / Board Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CBSE / State Board / Govt School"
                      value={previousSchoolBoard}
                      onChange={e => setPreviousSchoolBoard(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs focus:bg-white focus:outline-hidden focus:border-[#0b2545]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION C: FOUR DOCUMENT UPLOAD BOXES (STRICT REQUIREMENTS) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#0b2545]">
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span>Four Compulsory Document Upload Boxes</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Max 1.0 MB per document · JPG, PNG, PDF, DOC</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Box 1: Photograph */}
                  <DocumentUploadBox
                    boxNumber={1}
                    title="Student Photograph"
                    subtitle="Recent passport size color photograph with clear white background."
                    value={photoDoc}
                    onChange={setPhotoDoc}
                    required={true}
                  />

                  {/* Box 2: Signature */}
                  <DocumentUploadBox
                    boxNumber={2}
                    title="Student Signature"
                    subtitle="Clear signature with dark blue/black ink on plain white paper."
                    value={signatureDoc}
                    onChange={setSignatureDoc}
                    required={true}
                  />

                  {/* Box 3: Aadhaar Card (Restricted & Protected) */}
                  <DocumentUploadBox
                    boxNumber={3}
                    title="Aadhaar Card Document"
                    subtitle="Valid Indian Aadhaar Card (Front and Back). Sensitive data protected."
                    isSecureAadhaar={true}
                    value={aadhaarDoc}
                    onChange={setAadhaarDoc}
                    required={true}
                  />

                  {/* Box 4: Previous Qualification Proof */}
                  <DocumentUploadBox
                    boxNumber={4}
                    title="Previous Qualification Proof"
                    subtitle="Previous school marksheet, School Leaving Certificate, or Birth proof."
                    value={qualificationDoc}
                    onChange={setQualificationDoc}
                    required={true}
                  />
                </div>
              </div>

              {/* Declaration Checkbox */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={declarationAccepted}
                    onChange={e => setDeclarationAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    I hereby declare that all the information and educational documents provided above are genuine, true, and correct to the best of my knowledge. I authorize <strong>JANGRA NIOS SERVICES</strong> to assist in filing my online admission and examination enrollment on the official NIOS portal.
                  </span>
                </label>
              </div>

              {submitError && (
                <div className="p-3.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Processing Application & Generating Student ID...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Online Admission Application</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 2: ONLINE PUBLIC EXAM FORM */}
        {activeFormTab === 'publicExam' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-2xl font-black text-[#0b2545] font-['Outfit']">
                Online Public Examination Form
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                For already enrolled NIOS candidates registering for the upcoming Public Examination cycle.
              </p>
            </div>

            {submittedPublicExam ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-emerald-950">
                  Public Exam Registration Received!
                </h3>
                <p className="text-xs text-emerald-800">
                  Registration Ref: <strong>{submittedPublicExam.registrationNumber}</strong> | Enrollment: <strong>{submittedPublicExam.enrollmentNumber}</strong>
                </p>
                <button
                  onClick={() => setSubmittedPublicExam(null)}
                  className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg"
                >
                  Register Another Candidate
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitPublicExam} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 1. Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      1. Student Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={peFullName}
                      onChange={e => setPeFullName(e.target.value)}
                      placeholder="Candidate full name"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>

                  {/* 2. Date of Birth */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      2. Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={peDob}
                      onChange={e => setPeDob(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>

                  {/* 3. Mobile Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      3. Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={peMobile}
                      onChange={e => setPeMobile(e.target.value)}
                      placeholder="+91-9968834276"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>

                  {/* 4. Email Address */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      4. Email Address
                    </label>
                    <input
                      type="email"
                      value={peEmail}
                      onChange={e => setPeEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>

                  {/* 5. Enrollment Number */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      5. Official NIOS Enrollment Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={peEnrollment}
                      onChange={e => setPeEnrollment(e.target.value)}
                      placeholder="12-digit Enrollment Number (e.g. 270142231089)"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono font-bold text-blue-900"
                    />
                  </div>
                </div>

                {submitError && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#0b2545] hover:bg-slate-900 text-white font-bold rounded-xl text-xs uppercase tracking-wider"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Public Examination Registration'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: TRACK APPLICATION STATUS */}
        {activeFormTab === 'checkStatus' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-2xl font-black text-[#0b2545] font-['Outfit']">
                Track Application & Admission Status
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your Application Number, Student ID, or Registered Mobile Number.
              </p>
            </div>

            <form onSubmit={handleCheckStatus} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. JANGRA-NIOS-2026-10492 or STU-99214 or 9876543210"
                value={statusQuery}
                onChange={e => setStatusQuery(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-hidden focus:border-[#0b2545]"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="px-6 py-3 bg-[#0b2545] hover:bg-slate-900 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2"
              >
                {isSearching ? 'Searching...' : 'Check Status'}
              </button>
            </form>

            {searchError && (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl text-xs border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{searchError}</span>
              </div>
            )}

            {searchResult && searchResult.data && (
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase font-semibold">Candidate Name</span>
                    <h3 className="text-lg font-bold text-slate-900">{searchResult.data.fullName}</h3>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase font-semibold block sm:text-right">Current Status</span>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950">
                      {searchResult.data.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Ref / App No:</span>
                    <strong className="font-mono text-blue-900">{searchResult.data.applicationNumber || searchResult.data.registrationNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Course:</span>
                    <strong className="text-slate-800">{searchResult.data.courseAppliedFor || 'Public Exam'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Mobile:</span>
                    <strong className="text-slate-800">{searchResult.data.mobile}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Submitted On:</span>
                    <strong className="text-slate-800">{new Date(searchResult.data.submittedAt).toLocaleDateString()}</strong>
                  </div>
                </div>

                {searchResult.data.adminNotes && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700">
                    <strong>Counselor Remark:</strong> {searchResult.data.adminNotes}
                  </div>
                )}

                {searchResult.type === 'Admission' && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        setSubmittedAdmission(searchResult.data);
                        setShowReceiptModal(true);
                      }}
                      className="px-4 py-2 bg-amber-400 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View Official Admission Slip</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Official Admission Slip Modal */}
      {showReceiptModal && submittedAdmission && (
        <AdmissionReceiptModal
          admission={submittedAdmission}
          onClose={() => setShowReceiptModal(false)}
        />
      )}

    </div>
  );
};
