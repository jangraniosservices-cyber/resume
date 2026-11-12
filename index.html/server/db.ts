import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  SiteSettings,
  Course,
  Announcement,
  GalleryItem,
  AdmissionApplication,
  PublicExamEntry,
  StudentUser,
  SubscriptionPlan,
  PaymentTransaction,
  ContactInquiry
} from '../src/types/index.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

export interface AppDatabase {
  settings: SiteSettings;
  adminCredentials: {
    username: string;
    passwordHash: string; // SHA-256
  };
  courses: Course[];
  announcements: Announcement[];
  gallery: GalleryItem[];
  admissions: AdmissionApplication[];
  publicExams: PublicExamEntry[];
  students: StudentUser[];
  plans: SubscriptionPlan[];
  payments: PaymentTransaction[];
  inquiries: ContactInquiry[];
}

export function hashPassword(plain: string): string {
  return crypto.createHash('sha256').update(plain).digest('hex');
}

// Initial seed data
const initialData: AppDatabase = {
  settings: {
    businessName: 'JANGRA NIOS SERVICES',
    tagline: 'Your Trusted Partner for NIOS Secondary & Senior Secondary Admissions',
    phone: '+91-9968834276',
    whatsapp: '+91-9968834276',
    email: 'jangraeducationalservices@gmail.com',
    address: 'Plot No. 42, Sector 14 Educational Hub, Rohini, Near Metro Pillar 324, New Delhi - 110085, India',
    workingHours: 'Monday - Saturday: 9:00 AM - 7:00 PM (Sunday Closed for In-Person, WhatsApp open)',
    heroHeading: 'Your Education, Your Future',
    heroSubheading: 'Learn Today, Succeed Tomorrow',
    aboutText: 'JANGRA NIOS SERVICES is a premier educational advisory institute dedicated to guiding students toward completing their Secondary (10th) and Senior Secondary (12th) qualifications through the National Institute of Open Schooling (NIOS). With over 12+ years of experience, we provide end-to-end admission guidance, accurate stream and subject selection, practical lab orientation, Tutor Marked Assignment (TMA) solutions, and examination strategy.',
    mission: 'To empower every student, regardless of age, background, or previous academic setbacks, with accessible, recognized, and quality open schooling certification to unlock higher education and rewarding career paths.',
    vision: 'To be the most trusted, transparent, and student-centric NIOS educational consultancy in India, recognized for academic excellence, ethical counseling, and 100% student support.',
    educationalObjectives: [
      'Facilitate seamless online NIOS admission for Class 10th & 12th with zero procedural errors.',
      'Provide personalized subject combination advisory for science, commerce, and arts streams.',
      'Ensure timely submission and top scores in Tutor Marked Assignments (TMAs).',
      'Conduct rigorous practical exam workshops and lab guidance for physics, chemistry, biology, computer science, and data entry.',
      'Deliver round-the-clock student counseling and rapid resolution of examination queries.'
    ]
  },
  adminCredentials: {
    username: 'admin@jangranios.com',
    passwordHash: hashPassword('admin123') // default password admin123
  },
  courses: [
    {
      id: 'course-1',
      title: 'NIOS Secondary Course (Class 10th)',
      code: 'SEC-10',
      category: 'secondary',
      shortDesc: 'Complete admission, curriculum guidance, TMA support and exam preparation for NIOS Class 10th.',
      fullDesc: 'Specially designed for students seeking Class 10th certification. Covers student registration in Stream 1 (fresh) or Stream 2 (failed/drop-out), subject choice assistance, continuous TMA review, and examination preparation with past 10-year solved papers.',
      eligibility: 'Minimum 14 years of age; self-certificate or previous school proof.',
      duration: '1 Year (April/October Exam Cycle)',
      subjectsCount: '5 Minimum (Up to 7 Subjects)',
      fee: 4500,
      featured: true,
      features: [
        'Stream 1 & Stream 2 Online Admission Registration',
        'Official NIOS Study Books & Digital PDFs',
        'Solved Tutor Marked Assignments (TMA) with high score guarantee',
        'Previous 10 Years Question Papers with Answer Keys',
        'Dedicated WhatsApp Student Mentor'
      ]
    },
    {
      id: 'course-2',
      title: 'NIOS Senior Secondary Course (Class 12th)',
      code: 'SR-SEC-12',
      category: 'senior_secondary',
      shortDesc: 'Recognized 12th qualification for NEET, JEE, CUET, NDA, UPSC, and University degrees.',
      fullDesc: 'Comprehensive guidance for Class 12th in Science (PCM/PCB), Commerce, or Humanities/Arts. Recognized by AIU, UGC, and all national universities. Includes practical exam files, lab manual guidance, and entrance exam alignment.',
      eligibility: 'Passed Class 10th from any recognized board.',
      duration: '1 to 2 Years (Flexible exam sessions)',
      subjectsCount: '5 Minimum (Up to 7 Subjects)',
      fee: 5500,
      featured: true,
      features: [
        'Stream 1, 2, 3 & 4 Support (Fresh, Failed, TOC Transfer of Credit)',
        'Science, Commerce & Humanities subject expert counseling',
        'Complete Practical Lab Files & Viva Voce preparation',
        'TMA Solutions (100% verified by senior evaluators)',
        'Hall Ticket & Examination Center Coordination'
      ]
    },
    {
      id: 'course-3',
      title: 'NIOS Admission Assistance & Form Filing',
      code: 'ADM-ASST',
      category: 'assistance',
      shortDesc: 'Zero-error document verification, photo/signature resizing, and portal submission.',
      fullDesc: 'Avoid common rejection traps on the NIOS portal. Our staff validates your name, parent details, date of birth, categories, and uploads high-definition digitized documents conforming strictly to NIOS guidelines.',
      eligibility: 'Students of all ages seeking admission assistance.',
      duration: 'Instant processing within 24-48 hours',
      subjectsCount: 'Full Application Verification',
      fee: 1500,
      featured: false,
      features: [
        'Precise document compression & format verification (Photo, Sign, Aadhaar)',
        'Accurate Study Center (AI Center) selection near your home',
        'Immediate Application Tracking Reference & SMS Alert',
        'Correction and re-verification guarantee until Enrolment Number is generated'
      ]
    },
    {
      id: 'course-4',
      title: 'Subject Selection & Stream Advisory',
      code: 'SUBJ-GUIDE',
      category: 'guidance',
      shortDesc: 'Strategic subject combinations tailored for college admission, competitive exams, or government jobs.',
      fullDesc: 'Ensure your 5 to 7 subjects fulfill the eligibility criteria of courses you wish to pursue post-NIOS (e.g. B.Tech, MBBS, B.Com, LLB, Hotel Management, Armed Forces). Transfer of Credit (TOC) included.',
      eligibility: 'Class 10th or 12th candidates',
      duration: '1-on-1 Counseling Session',
      subjectsCount: 'Personalized Academic Road-mapping',
      fee: 1200,
      featured: false,
      features: [
        'Transfer of Credit (TOC) validation for up to 2 failed subjects',
        'Selection of scoring practical-heavy subjects for higher percentage',
        'Language and vocational subject combination strategy',
        'Counselor guidance via call & WhatsApp'
      ]
    },
    {
      id: 'course-5',
      title: 'Examination & On-Demand Exam (ODE) Guidance',
      code: 'EXAM-ODE',
      category: 'guidance',
      shortDesc: 'Guidance for Public Exams (April/October) and rapid On-Demand Examinations (ODE).',
      fullDesc: 'Need to clear your 10th or 12th quickly without waiting 6 months? We guide you through the NIOS On-Demand Exam booking system, seat selection at NIOS Regional Centers, hall ticket alerts, and fast result tracking.',
      eligibility: 'Registered NIOS students or Board-failed candidates',
      duration: 'Flexible monthly booking',
      subjectsCount: 'Per-subject booking assistance',
      fee: 2000,
      featured: false,
      features: [
        'Real-time ODE seat availability checking across Regional Centers',
        'Exam fee submission and receipt download assistance',
        'Urgent marksheet dispatch tracking',
        'Special revision question banks'
      ]
    },
    {
      id: 'course-6',
      title: 'Practical Examination & Lab Guidance',
      code: 'PRAC-LAB',
      category: 'guidance',
      shortDesc: 'Hands-on practical files, viva questions, and lab procedure demonstrations.',
      fullDesc: 'Master the practical exams for Science, Data Entry, Painting, Home Science, Computer Science, and Mass Communication. Complete solved practical record files ready for submission at AI Study Centers.',
      eligibility: 'Enrolled NIOS Class 10th & 12th students with practical subjects',
      duration: 'Intensive Practical Coaching',
      subjectsCount: 'All Practical Subjects Covered',
      fee: 2500,
      featured: false,
      features: [
        'Formatted and handwritten-ready practical record files',
        'Common viva questions and sample examiner rubrics',
        'Experimental procedures with diagrams and observations',
        'Practical exam date-sheet updates and center coordination'
      ]
    },
    {
      id: 'course-7',
      title: 'Study Material & Student Support Package',
      code: 'STUDY-MAT',
      category: 'materials',
      shortDesc: 'Printed and digital reference guides, chapter-wise summaries, and mentor support.',
      fullDesc: 'Premium study package curated by experienced NIOS educators. Includes simplified notes in Hindi & English medium, mock test papers, solved previous year papers, and continuous student helpline access.',
      eligibility: 'All secondary and senior secondary students',
      duration: 'Full Academic Year',
      subjectsCount: 'All selected subjects',
      fee: 3000,
      featured: false,
      features: [
        'Chapter summaries in easy-to-understand language',
        'Important question marks (2 mark, 4 mark, 6 mark blueprint)',
        'Mobile-friendly PDF notes available 24/7',
        'Doubt clearance via WhatsApp helpline'
      ]
    }
  ],
  announcements: [
    {
      id: 'ann-1',
      title: 'NIOS Class 10th & 12th Online Admissions Open for 2026-2027 Academic Session',
      date: '2026-11-05',
      category: 'Admission',
      content: 'Fresh online registrations for Stream 1 (Block 1 - April Exams) are now active. Submit your applications early to avoid late fee penalties and reserve your preferred Study Center.',
      isUrgent: true,
      linkText: 'Apply Online Now'
    },
    {
      id: 'ann-2',
      title: 'Tutor Marked Assignment (TMA) Submission Deadline Announced',
      date: '2026-11-01',
      category: 'TMA',
      content: 'All enrolled students must upload their TMA solutions on the student dashboard before January 31. Solved TMA files are accessible under the Student Learning Subscription.',
      isUrgent: false,
      linkText: 'Check TMA Guide'
    },
    {
      id: 'ann-3',
      title: 'Public Examination Hall Tickets & Practical Exam Datesheet Released',
      date: '2026-10-24',
      category: 'Exam',
      content: 'Hall tickets for practical examinations can now be downloaded using your Enrolment Number. Contact JANGRA NIOS helpline if your center is not assigned.',
      isUrgent: true,
      linkText: 'View Datesheet'
    },
    {
      id: 'ann-4',
      title: 'On-Demand Examination (ODE) Slot Booking Open for Next Month',
      date: '2026-10-18',
      category: 'Exam',
      content: 'Students desiring urgent re-examination can now book ODE slots at Delhi, Noida, and regional HQ test centers.',
      isUrgent: false
    }
  ],
  gallery: [
    {
      id: 'gal-1',
      title: 'Educational Counseling & Academic Guidance Session',
      category: 'Counseling',
      imageUrl: '/src/assets/images/about_guidance_counseling_1794235956786.jpg',
      description: 'One-on-one student counseling and stream advisory session at our New Delhi guidance center.'
    },
    {
      id: 'gal-2',
      title: 'Modern Science & Practical Examination Laboratory',
      category: 'Labs',
      imageUrl: '/src/assets/images/classroom_practical_lab_1794235957447.jpg',
      description: 'Students engaging in practical science examinations and laboratory experiments under faculty supervision.'
    },
    {
      id: 'gal-3',
      title: 'Annual NIOS Graduation & Certificate Distribution Ceremony',
      category: 'Graduation',
      imageUrl: '/src/assets/images/graduation_success_celebration_1794235957820.jpg',
      description: 'Proud graduates celebrating successful completion of Senior Secondary (12th) certificates.'
    },
    {
      id: 'gal-4',
      title: 'Student Orientation & Campus Learning Community',
      category: 'Campus',
      imageUrl: '/src/assets/images/hero_education_students_1794235957015.jpg',
      description: 'Empowered learners working together toward university entrance examinations and career milestones.'
    }
  ],
  admissions: [
    {
      id: 'adm-demo-1',
      applicationNumber: 'JANGRA-NIOS-2026-10492',
      studentId: 'STU-99214',
      temporaryPassword: 'Temp@99214',
      fullName: 'Rahul Sharma',
      dob: '2007-08-14',
      mobile: '+91 98765 43210',
      fatherName: 'Rajesh Sharma',
      motherName: 'Sunita Sharma',
      email: 'rahul.sharma@example.com',
      address: 'H.No 142, Pocket B-4, Sector 7, Rohini, New Delhi - 110085',
      category: 'General',
      previousQualification: 'Passed 8th Standard / Self-attested declaration',
      courseAppliedFor: 'NIOS Secondary (10th)',
      studyMedium: 'Hindi',
      previousSchoolBoard: 'Govt Boys Senior Secondary School, Delhi',
      documents: {
        photo: {
          fileName: 'passport_photo_rahul.jpg',
          fileSize: 245000,
          fileType: 'image/jpeg',
          dataUrl: '/src/assets/images/hero_education_students_1794235957015.jpg',
          uploadedAt: '2026-11-06T10:30:00Z',
          status: 'Verified'
        },
        signature: {
          fileName: 'signature_rahul.png',
          fileSize: 112000,
          fileType: 'image/png',
          dataUrl: '',
          uploadedAt: '2026-11-06T10:31:00Z',
          status: 'Verified'
        },
        aadhaar: {
          fileName: 'aadhaar_card_masked.pdf',
          fileSize: 520000,
          fileType: 'application/pdf',
          dataUrl: '',
          uploadedAt: '2026-11-06T10:32:00Z',
          status: 'Verified'
        },
        qualification: {
          fileName: 'previous_school_slc.pdf',
          fileSize: 680000,
          fileType: 'application/pdf',
          dataUrl: '',
          uploadedAt: '2026-11-06T10:33:00Z',
          status: 'Verified'
        }
      },
      status: 'Documents Approved',
      submittedAt: '2026-11-06T10:35:00Z',
      adminNotes: 'All KYC documents and photograph verified. Assigned to AI Center 270142 Rohini.'
    },
    {
      id: 'adm-demo-2',
      applicationNumber: 'JANGRA-NIOS-2026-20831',
      studentId: 'STU-99215',
      temporaryPassword: 'Temp@99215',
      fullName: 'Pooja Verma',
      dob: '2005-04-22',
      mobile: '+91 98112 34567',
      fatherName: 'Satish Verma',
      motherName: 'Anita Verma',
      email: 'pooja.verma@example.com',
      address: 'Flat 302, Green Valley Apartments, Dwarka Sector 11, New Delhi - 110075',
      category: 'OBC',
      previousQualification: 'Class 10th Passed (CBSE Board - 2022)',
      courseAppliedFor: 'NIOS Senior Secondary (12th)',
      studyMedium: 'English',
      previousSchoolBoard: 'Central Board of Secondary Education (CBSE)',
      documents: {
        photo: {
          fileName: 'pooja_passport.jpg',
          fileSize: 310000,
          fileType: 'image/jpeg',
          dataUrl: '',
          uploadedAt: '2026-11-07T14:20:00Z',
          status: 'Verified'
        },
        signature: {
          fileName: 'pooja_sign.jpg',
          fileSize: 98000,
          fileType: 'image/jpeg',
          dataUrl: '',
          uploadedAt: '2026-11-07T14:21:00Z',
          status: 'Verified'
        },
        aadhaar: {
          fileName: 'aadhaar_pooja.pdf',
          fileSize: 480000,
          fileType: 'application/pdf',
          dataUrl: '',
          uploadedAt: '2026-11-07T14:22:00Z',
          status: 'Verified'
        },
        qualification: {
          fileName: 'cbse_10th_marksheet.pdf',
          fileSize: 750000,
          fileType: 'application/pdf',
          dataUrl: '',
          uploadedAt: '2026-11-07T14:23:00Z',
          status: 'Verified'
        }
      },
      status: 'Enrolled',
      submittedAt: '2026-11-07T14:25:00Z',
      adminNotes: 'Enrolled in 12th Commerce with Transfer of Credit (TOC) for English & Economics. Active student.'
    }
  ],
  publicExams: [
    {
      id: 'pe-1',
      registrationNumber: 'PE-2026-0412',
      fullName: 'Vikas Kumar',
      dob: '2006-03-12',
      mobile: '+91 97180 88219',
      email: 'vikas.kumar@example.com',
      enrollmentNumber: '270142231089',
      submittedAt: '2026-11-08T09:15:00Z',
      status: 'Hall Ticket Ready'
    }
  ],
  students: [
    {
      id: 'stu-1',
      studentId: 'STU-99214',
      fullName: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      mobile: '9876543210',
      passwordHash: hashPassword('Temp@99214'),
      applicationNumber: 'JANGRA-NIOS-2026-10492',
      isActive: true,
      createdAt: '2026-11-06T10:35:00Z',
      subscriptionPlanId: 'plan-quarterly',
      subscriptionPlanName: 'Quarterly Academic Plan',
      subscriptionExpiryDate: '2027-02-06T10:35:00Z',
      subscriptionStatus: 'Active'
    },
    {
      id: 'stu-2',
      studentId: 'STU-99215',
      fullName: 'Pooja Verma',
      email: 'pooja.verma@example.com',
      mobile: '9811234567',
      passwordHash: hashPassword('Temp@99215'),
      applicationNumber: 'JANGRA-NIOS-2026-20831',
      isActive: true,
      createdAt: '2026-11-07T14:25:00Z',
      subscriptionPlanId: 'plan-annual',
      subscriptionPlanName: 'Annual Comprehensive Plan',
      subscriptionExpiryDate: '2027-11-07T14:25:00Z',
      subscriptionStatus: 'Active'
    }
  ],
  plans: [
    {
      id: 'plan-monthly',
      name: 'Monthly Study Access',
      durationLabel: 'Monthly',
      price: 999,
      originalPrice: 1499,
      durationDays: 30,
      description: 'Ideal for short-term revision and urgent TMA submission assistance.',
      features: [
        'Access to Solved TMA PDF files (All Subjects)',
        'Class 10th/12th Chapter Revision Summaries',
        'Direct WhatsApp Doubt Resolution Support',
        'Valid for 30 Days from Activation'
      ],
      isPopular: false,
      isActive: true
    },
    {
      id: 'plan-quarterly',
      name: 'Quarterly Exam Preparation',
      durationLabel: 'Quarterly',
      price: 2499,
      originalPrice: 3499,
      durationDays: 90,
      description: 'Most selected plan for 3-month focused exam sprint and practical file guidance.',
      features: [
        'Complete Solved TMA Answers with 100% Accuracy Guarantee',
        'Ready-to-Write Practical Science & Lab Manual Files',
        'Previous 5-Year Solved Question Papers & Blueprint',
        'Dedicated Study Mentor via WhatsApp Helpline',
        'Valid for 90 Days from Activation'
      ],
      isPopular: true,
      isActive: true
    },
    {
      id: 'plan-half-yearly',
      name: 'Half-Yearly Full Term Plan',
      durationLabel: 'Half-Yearly',
      price: 4499,
      originalPrice: 5999,
      durationDays: 180,
      description: 'Comprehensive coverage for one full examination cycle (April or October).',
      features: [
        'Everything in Quarterly Plan Included',
        'Mock Online Test Papers with Detailed Feedback',
        'Practical Exam Viva Voce Simulation Notes',
        'Admission Form Re-check & Hall Ticket Alerts',
        'Priority Call Support (+91-9968834276)',
        'Valid for 180 Days from Activation'
      ],
      isPopular: false,
      isActive: true
    },
    {
      id: 'plan-annual',
      name: 'Annual Complete Pass (10th / 12th)',
      durationLabel: 'Annual',
      price: 7999,
      originalPrice: 11999,
      durationDays: 365,
      description: 'Unrestricted year-round guidance from admission to result declaration and certificate dispatch.',
      features: [
        'Zero-Error NIOS Online Admission Assistance Included',
        'Complete Solved TMAs for both semesters',
        'Handwritten format Practical Files + Lab Manual PDFs',
        'Transfer of Credit (TOC) Guidance',
        'Special On-Demand Exam (ODE) Seat Coordination',
        'Dedicated Senior Educational Counselor',
        'Valid for Full 365 Days'
      ],
      isPopular: false,
      isActive: true
    },
    {
      id: 'plan-custom',
      name: 'Custom Individual Coaching Package',
      durationLabel: 'Custom',
      price: 12500,
      originalPrice: 16000,
      durationDays: 365,
      description: 'Tailored 1-on-1 tutoring, rapid ODE preparation, and personalized curriculum road-mapping.',
      features: [
        'Personalized subject tutor assigned',
        'Daily doubt-solving over WhatsApp & Google Meet',
        'Full admission, practical file, and TMA submission handling',
        'University admission guidance after Class 12th'
      ],
      isPopular: false,
      isActive: true
    }
  ],
  payments: [
    {
      id: 'pay-1',
      transactionId: 'TXN-RAZORPAY-99120',
      studentId: 'STU-99214',
      studentName: 'Rahul Sharma',
      planId: 'plan-quarterly',
      planName: 'Quarterly Exam Preparation',
      amount: 2499,
      paymentMethod: 'UPI',
      status: 'SUCCESS',
      paidAt: '2026-11-06T11:00:00Z',
      receiptNumber: 'JNS-REC-2026-0819',
      notes: 'Paid via PhonePe UPI (ref: 431092841029)'
    },
    {
      id: 'pay-2',
      transactionId: 'TXN-RAZORPAY-99121',
      studentId: 'STU-99215',
      studentName: 'Pooja Verma',
      planId: 'plan-annual',
      planName: 'Annual Complete Pass (10th / 12th)',
      amount: 7999,
      paymentMethod: 'Razorpay',
      status: 'SUCCESS',
      paidAt: '2026-11-07T14:40:00Z',
      receiptNumber: 'JNS-REC-2026-0820',
      notes: 'Paid via HDFC Net Banking'
    }
  ],
  inquiries: [
    {
      id: 'inq-1',
      name: 'Amit Rawat',
      email: 'amit.rawat@example.com',
      mobile: '+91 99100 12345',
      subject: 'Inquiry for Class 12th Science Stream with PCB',
      message: 'Hello, I failed CBSE 12th physics and chemistry in 2024. Can I apply for NIOS with Transfer of Credit for Biology and English? Please call me.',
      submittedAt: '2026-11-08T16:20:00Z',
      status: 'Unread'
    }
  ]
};

class DatabaseManager {
  private data: AppDatabase;

  constructor() {
    this.ensureDirectory();
    this.data = this.load();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private load(): AppDatabase {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Merge with initial data to ensure all keys exist
        return {
          ...initialData,
          ...parsed,
          settings: { ...initialData.settings, ...(parsed.settings || {}) },
          adminCredentials: { ...initialData.adminCredentials, ...(parsed.adminCredentials || {}) }
        };
      }
    } catch (err) {
      console.error('Error loading DB file, fallback to initial data:', err);
    }
    this.save(initialData);
    return JSON.parse(JSON.stringify(initialData));
  }

  public save(dataToSave?: AppDatabase): void {
    if (dataToSave) {
      this.data = dataToSave;
    }
    try {
      this.ensureDirectory();
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  public getDB(): AppDatabase {
    return this.data;
  }
}

export const dbManager = new DatabaseManager();
