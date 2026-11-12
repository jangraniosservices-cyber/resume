export interface SiteSettings {
  businessName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  workingHours: string;
  heroHeading: string;
  heroSubheading: string;
  aboutText: string;
  mission: string;
  vision: string;
  educationalObjectives: string[];
}

export interface Course {
  id: string;
  title: string;
  code: string;
  category: 'secondary' | 'senior_secondary' | 'assistance' | 'guidance' | 'materials';
  shortDesc: string;
  fullDesc: string;
  eligibility: string;
  duration: string;
  subjectsCount: string;
  fee: number;
  featured: boolean;
  features: string[];
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  category: 'Admission' | 'Exam' | 'Results' | 'TMA' | 'Practical';
  content: string;
  isUrgent?: boolean;
  linkText?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Campus' | 'Graduation' | 'Labs' | 'Counseling';
  imageUrl: string;
  description: string;
}

export interface DocumentUpload {
  fileName: string;
  fileSize: number;
  fileType: string;
  dataUrl: string; // base64 or file reference
  uploadedAt: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  notes?: string;
}

export interface AdmissionApplication {
  id: string;
  applicationNumber: string; // e.g. JANGRA-NIOS-2026-48291
  studentId: string; // Auto-generated e.g. STU-99214
  temporaryPassword?: string;
  fullName: string;
  dob: string;
  mobile: string;
  fatherName: string;
  motherName: string;
  email: string;
  address: string;
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'Other';
  previousQualification: string;
  courseAppliedFor: 'NIOS Secondary (10th)' | 'NIOS Senior Secondary (12th)';
  studyMedium: 'Hindi' | 'English' | 'Urdu' | 'Other';
  previousSchoolBoard: string;
  documents: {
    photo?: DocumentUpload;
    signature?: DocumentUpload;
    aadhaar?: DocumentUpload;
    qualification?: DocumentUpload;
  };
  status: 'Submitted' | 'Under Verification' | 'Documents Approved' | 'Enrolled' | 'Action Required' | 'Rejected';
  submittedAt: string;
  adminNotes?: string;
  examStream?: string;
}

export interface PublicExamEntry {
  id: string;
  registrationNumber: string;
  fullName: string;
  dob: string;
  mobile: string;
  email: string;
  enrollmentNumber: string;
  submittedAt: string;
  status: 'Received' | 'Scheduled' | 'Hall Ticket Ready';
}

export interface StudentUser {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  mobile: string;
  passwordHash: string;
  applicationNumber: string;
  isActive: boolean;
  createdAt: string;
  subscriptionPlanId?: string;
  subscriptionPlanName?: string;
  subscriptionExpiryDate?: string;
  subscriptionStatus: 'None' | 'Active' | 'Expired';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  durationLabel: string; // Monthly, Quarterly, Half-Yearly, Annual, Custom
  price: number;
  originalPrice: number;
  durationDays: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
}

export interface PaymentTransaction {
  id: string;
  transactionId: string;
  studentId: string;
  studentName: string;
  planId: string;
  planName: string;
  amount: number;
  paymentMethod: 'UPI' | 'Razorpay' | 'Card' | 'NetBanking';
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED';
  paidAt: string;
  receiptNumber: string;
  notes?: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  mobile: string;
  subject: string;
  message: string;
  submittedAt: string;
  status: 'Unread' | 'Replied';
}
