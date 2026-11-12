import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  CreditCard, 
  QrCode, 
  Building, 
  ShieldCheck, 
  Lock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SubscriptionPlan, PaymentTransaction } from '../types/index.ts';
import { api } from '../services/api.ts';

interface PaymentModalProps {
  plan: SubscriptionPlan;
  studentId?: string;
  studentName?: string;
  onClose: () => void;
  onSuccess: (payment: PaymentTransaction) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  plan,
  studentId = 'GUEST',
  studentName = 'Student Candidate',
  onClose,
  onSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [upiIdInput, setUpiIdInput] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states for card simulation (never saved)
  const [cardHolder, setCardHolder] = useState(studentName);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Simulate realistic payment gateway authorization delay (1.2s)
      await new Promise(r => setTimeout(r, 1200));

      const res = await api.verifyPayment({
        studentId,
        planId: plan.id,
        paymentMethod,
        referenceNumber: referenceNumber || (paymentMethod === 'UPI' ? upiIdInput : 'CARD-AUTH-OK'),
        paymentDetails: { studentName }
      });

      if (res.success && res.payment) {
        onSuccess(res.payment);
      } else {
        setError(res.message || 'Payment verification failed. Please try again.');
      }
    } catch (err: unknown) {
      console.error('Payment error:', err);
      setError('An error occurred during payment processing. Please retry.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-[#0b2545] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold">Secure Fee Checkout</h3>
              <p className="text-xs text-slate-300">JANGRA NIOS SERVICES · Powered by Razorpay</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plan Summary Banner */}
        <div className="bg-amber-50/80 border-b border-amber-200/80 p-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-900">{plan.name}</span>
              <span className="text-[11px] bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded font-medium">
                {plan.durationLabel} ({plan.durationDays} Days)
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Candidate: <strong>{studentName}</strong> ({studentId})
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl font-black text-[#0b2545]">
              ₹{plan.price.toLocaleString('en-IN')}
            </div>
            {plan.originalPrice > plan.price && (
              <div className="text-xs text-slate-400 line-through">
                ₹{plan.originalPrice.toLocaleString('en-IN')}
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Method Selector */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('UPI')}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                paymentMethod === 'UPI'
                  ? 'border-amber-500 bg-amber-50/50 text-[#0b2545] font-bold shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              <QrCode className="w-5 h-5 text-amber-600" />
              <span className="text-xs">UPI / QR</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('Card')}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                paymentMethod === 'Card'
                  ? 'border-amber-500 bg-amber-50/50 text-[#0b2545] font-bold shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              <CreditCard className="w-5 h-5 text-amber-600" />
              <span className="text-xs">Debit / Credit</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('NetBanking')}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                paymentMethod === 'NetBanking'
                  ? 'border-amber-500 bg-amber-50/50 text-[#0b2545] font-bold shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              <Building className="w-5 h-5 text-amber-600" />
              <span className="text-xs">Net Banking</span>
            </button>
          </div>

          {/* UPI Method Details */}
          {paymentMethod === 'UPI' && (
            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                {/* Simulated QR Code */}
                <div className="w-32 h-32 bg-white p-2 rounded-xl border border-slate-300 flex flex-col items-center justify-center shrink-0 shadow-xs">
                  <div className="w-24 h-24 border-2 border-slate-800 rounded flex flex-col items-center justify-center relative p-1">
                    <div className="grid grid-cols-4 gap-1 w-full h-full p-1 opacity-80">
                      <div className="bg-slate-900 rounded-xs" />
                      <div className="bg-slate-900 rounded-xs" />
                      <div className="bg-amber-500 rounded-xs" />
                      <div className="bg-slate-900 rounded-xs" />
                      <div className="bg-slate-900 rounded-xs" />
                      <div className="bg-slate-200 rounded-xs" />
                      <div className="bg-slate-900 rounded-xs" />
                      <div className="bg-slate-900 rounded-xs" />
                      <div className="bg-amber-500 rounded-xs" />
                      <div className="bg-slate-900 rounded-xs" />
                      <div className="bg-slate-900 rounded-xs" />
                      <div className="bg-slate-200 rounded-xs" />
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-slate-600 mt-1 uppercase">Scan & Pay</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700">
                  <p className="font-semibold text-slate-900">
                    Scan with any UPI App: GPay, PhonePe, Paytm, BHIM
                  </p>
                  <p className="text-slate-500">
                    Institute VPA: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-blue-900 font-bold">jangraeducationalservices@okaxis</code>
                  </p>
                  <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 justify-center sm:justify-start">
                    <CheckCircle2 className="w-3 h-3" /> Zero transaction fees on UPI
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Or Enter Your UPI ID / Mobile (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. yourname@oksbi"
                  value={upiIdInput}
                  onChange={e => setUpiIdInput(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  UPI UTR / Reference No. (Optional for auto-verification)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 431092841029"
                  value={referenceNumber}
                  onChange={e => setReferenceNumber(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* Card Method Details */}
          {paymentMethod === 'Card' && (
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-bit SSL encrypted. Card credentials are never stored.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={e => setCardHolder(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="4532 ···· ···· 8891"
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  maxLength={19}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Valid Thru</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardExp}
                    onChange={e => setCardExp(e.target.value)}
                    maxLength={5}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CVV</label>
                  <input
                    type="password"
                    placeholder="···"
                    value={cardCvv}
                    onChange={e => setCardCvv(e.target.value)}
                    maxLength={4}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Net Banking Details */}
          {paymentMethod === 'NetBanking' && (
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Your Bank</label>
              <select className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs">
                <option>State Bank of India (SBI)</option>
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>Punjab National Bank (PNB)</option>
                <option>Axis Bank</option>
                <option>Bank of Baroda</option>
              </select>
              <p className="text-xs text-slate-500">
                You will be securely routed through your bank’s 2FA authentication portal.
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs">
              {error}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Total Payable: <strong className="text-slate-900 text-sm">₹{plan.price.toLocaleString('en-IN')}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg shadow-sm hover:shadow transition-all text-xs"
            >
              {isProcessing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Payment...</span>
                </>
              ) : (
                <>
                  <span>Confirm & Pay ₹{plan.price}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
