import React from 'react';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  GraduationCap, 
  Download,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { AdmissionApplication } from '../types/index.ts';

interface AdmissionReceiptModalProps {
  admission: AdmissionApplication;
  onClose: () => void;
}

export const AdmissionReceiptModal: React.FC<AdmissionReceiptModalProps> = ({
  admission,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Toolbar (Excluded from print) */}
        <div className="no-print bg-[#0b2545] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">Official Admission Acknowledgment Slip</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-lg text-xs font-bold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Slip Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 bg-white">
          
          {/* Header with Logo & Institute Details */}
          <div className="border-b-2 border-slate-800 pb-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-[#0b2545] text-amber-400 flex items-center justify-center font-bold shrink-0">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0b2545] font-['Outfit'] tracking-tight">
                  JANGRA NIOS SERVICES
                </h2>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Educational Advisory & Student Admission Center
                </p>
                <p className="text-[11px] text-slate-500">
                  Plot 42, Sec 14 Educational Hub, Rohini, New Delhi - 110085 · +91-9968834276
                </p>
              </div>
            </div>

            <div className="sm:text-right shrink-0">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Application Ref No.</div>
              <div className="text-sm font-black font-mono text-[#0b2545] bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                {admission.applicationNumber}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Date: {new Date(admission.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Student Login Credentials Box */}
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Student Portal Credentials (Save For Online Access)</span>
              </div>
              <p className="text-xs text-amber-800 mt-0.5">
                Use these credentials to log in to your student dashboard, view verified documents, and download TMAs.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-amber-200 shrink-0 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Student ID</span>
                <strong className="font-mono text-blue-900">{admission.studentId}</strong>
              </div>
              <span className="text-slate-300">|</span>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Temp Password</span>
                <strong className="font-mono text-emerald-800">{admission.temporaryPassword || 'Generated'}</strong>
              </div>
            </div>
          </div>

          {/* Student & Course Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
                Personal Information
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Candidate Name:</span>
                <span className="font-semibold text-slate-900">{admission.fullName}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Date of Birth:</span>
                <span className="font-semibold text-slate-900">{admission.dob}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Father’s Name:</span>
                <span className="font-semibold text-slate-900">{admission.fatherName}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Mother’s Name:</span>
                <span className="font-semibold text-slate-900">{admission.motherName}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Category:</span>
                <span className="font-semibold text-slate-900">{admission.category}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Mobile Number:</span>
                <span className="font-semibold text-slate-900">{admission.mobile}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Email Address:</span>
                <span className="font-semibold text-slate-900 truncate max-w-[180px]">{admission.email || 'N/A'}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
                Academic & Admission Profile
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Course Applied:</span>
                <span className="font-bold text-[#0b2545]">{admission.courseAppliedFor}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Medium of Study:</span>
                <span className="font-semibold text-slate-900">{admission.studyMedium}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Prev. Qualification:</span>
                <span className="font-semibold text-slate-900">{admission.previousQualification || 'Standard/Self'}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Previous Board:</span>
                <span className="font-semibold text-slate-900">{admission.previousSchoolBoard || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Application Status:</span>
                <span className="font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                  {admission.status}
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Residential Address:</span>
                <span className="font-medium text-slate-800 text-right max-w-[180px] truncate">{admission.address}</span>
              </div>
            </div>

          </div>

          {/* Uploaded Documents Verification Checklist */}
          <div>
            <div className="font-bold text-slate-900 text-xs mb-2">
              KYC Document Receipt Status (4 Boxes Upload Check):
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded border border-slate-200 bg-slate-50 text-center">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">1. Photograph</div>
                <div className="font-medium text-emerald-700 mt-1 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{admission.documents?.photo ? 'Received' : 'Pending'}</span>
                </div>
              </div>

              <div className="p-2.5 rounded border border-slate-200 bg-slate-50 text-center">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">2. Signature</div>
                <div className="font-medium text-emerald-700 mt-1 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{admission.documents?.signature ? 'Received' : 'Pending'}</span>
                </div>
              </div>

              <div className="p-2.5 rounded border border-slate-200 bg-slate-50 text-center">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">3. Aadhaar Card</div>
                <div className="font-medium text-blue-700 mt-1 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{admission.documents?.aadhaar ? 'Restricted' : 'Pending'}</span>
                </div>
              </div>

              <div className="p-2.5 rounded border border-slate-200 bg-slate-50 text-center">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">4. Marksheet / SLC</div>
                <div className="font-medium text-emerald-700 mt-1 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{admission.documents?.qualification ? 'Received' : 'Pending'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Notes & Disclaimer */}
          <div className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-200 pt-3">
            <p><strong>Counselor Remark:</strong> {admission.adminNotes || 'Application submitted successfully. Enrollment verification and Study Center allocation is in progress.'}</p>
            <p className="mt-1">
              * This is a computer-generated admission confirmation slip issued by JANGRA NIOS SERVICES. For admission queries or Study Center changes, contact helpline: <strong>+91-9968834276</strong> or email <strong>jangraeducationalservices@gmail.com</strong>.
            </p>
          </div>

          {/* Stamp & Authorized Signature */}
          <div className="pt-4 flex items-center justify-between">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-blue-900/40 flex items-center justify-center text-[10px] font-bold text-blue-900 uppercase transform -rotate-12">
                JANGRA NIOS<br/>VERIFIED
              </div>
            </div>
            <div className="text-right">
              <div className="font-['Outfit'] font-bold text-sm text-[#0b2545]">
                Academic Director
              </div>
              <div className="text-[11px] text-slate-500">
                JANGRA NIOS SERVICES
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
