import React from 'react';
import { X, ShieldCheck, FileText, RefreshCw } from 'lucide-react';

interface PolicyModalProps {
  policyType: 'privacy' | 'terms' | 'refund' | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ policyType, onClose }) => {
  if (!policyType) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto border border-slate-200 shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2.5">
            {policyType === 'privacy' && <ShieldCheck className="w-6 h-6 text-emerald-600" />}
            {policyType === 'terms' && <FileText className="w-6 h-6 text-blue-900" />}
            {policyType === 'refund' && <RefreshCw className="w-6 h-6 text-amber-600" />}
            <h3 className="text-xl font-black text-[#0b2545] font-['Outfit']">
              {policyType === 'privacy' && 'Privacy & Data Protection Policy'}
              {policyType === 'terms' && 'Terms and Conditions of Service'}
              {policyType === 'refund' && 'Fee Structure & Refund Policy'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {policyType === 'privacy' && (
            <>
              <p>
                <strong>1. Data Collection & Purpose:</strong> JANGRA NIOS SERVICES collects candidate information strictly for the purpose of processing online admission applications, allocating official Study Centers (AI), verifying previous academic credentials, and communicating exam updates.
              </p>
              <p>
                <strong>2. KYC Document Protection (Box 3 - Aadhaar):</strong> In accordance with Indian digital identity standards, candidate Aadhaar cards and photographs are encrypted and restricted solely to authorized administrative admission evaluators. Sensitive documents are never published, shared with third-party advertisers, or monetized.
              </p>
              <p>
                <strong>3. Payment Security:</strong> Online transactions conducted via UPI or Razorpay gateways adhere to PCI-DSS standards. We never store credit or debit card CVV, pins, or banking credentials on our local servers.
              </p>
            </>
          )}

          {policyType === 'terms' && (
            <>
              <p>
                <strong>1. Institutional Status:</strong> JANGRA NIOS SERVICES is an independent educational consultancy facilitating online admission guidance, curriculum assistance, and examination coaching for the National Institute of Open Schooling (NIOS), an autonomous institution under the Ministry of Education, Government of India.
              </p>
              <p>
                <strong>2. Candidate Responsibility:</strong> Candidates are responsible for ensuring that all uploaded documents (marksheet, birth proof, photographs) are authentic. Submission of forged credentials may result in disqualification by NIOS.
              </p>
              <p>
                <strong>3. Subscription & Content Access:</strong> Student learning subscriptions provide digital access to solved Tutor Marked Assignments (TMAs), practical files, and mentor consultations during the active subscription period.
              </p>
            </>
          )}

          {policyType === 'refund' && (
            <>
              <p>
                <strong>1. Consultation & Advisory Fees:</strong> Guidance and form processing fees cover staff hours and document preparation. If an application is rejected prior to portal submission due to advisory oversight, a full 100% refund is initiated within 5 working days.
              </p>
              <p>
                <strong>2. Government Board Fees:</strong> Examination and admission registration fees already remitted directly to the official NIOS portal are subject to NIOS official refund regulations.
              </p>
              <p>
                <strong>3. Subscription Cancellations:</strong> Student study packages may be cancelled within 48 hours of initial activation if digital files have not been downloaded. For refund inquiries, contact: <strong>jangraeducationalservices@gmail.com</strong>.
              </p>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#0b2545] text-white font-bold rounded-xl text-xs"
          >
            I Understand & Agree
          </button>
        </div>

      </div>
    </div>
  );
};
