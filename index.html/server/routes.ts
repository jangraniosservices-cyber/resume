import express, { Request, Response } from 'express';
import crypto from 'crypto';
import { dbManager, hashPassword } from './db.ts';
import {
  AdmissionApplication,
  PublicExamEntry,
  StudentUser,
  PaymentTransaction,
  SubscriptionPlan,
  Course,
  Announcement,
  GalleryItem,
  ContactInquiry
} from '../src/types/index.ts';

export const apiRouter = express.Router();

// Helper to generate IDs
function generateNumericId(prefix: string, length = 5): string {
  const num = Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
  return `${prefix}-${num}`;
}

// -------------------------------------------------------------
// 1. AUTHENTICATION (ADMIN & STUDENT)
// -------------------------------------------------------------

// Admin Login
apiRouter.post('/auth/admin-login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  const db = dbManager.getDB();
  const hashedPassword = hashPassword(password);

  if (
    username.toLowerCase() === db.adminCredentials.username.toLowerCase() &&
    hashedPassword === db.adminCredentials.passwordHash
  ) {
    // Generate simple session token
    const token = crypto.randomBytes(32).toString('hex');
    return res.json({
      success: true,
      token,
      admin: {
        username: db.adminCredentials.username,
        role: 'SUPER_ADMIN'
      }
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
});

// Admin change password
apiRouter.post('/auth/admin-change-password', (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const db = dbManager.getDB();
  if (hashPassword(currentPassword) !== db.adminCredentials.passwordHash) {
    return res.status(400).json({ success: false, message: 'Current password does not match' });
  }
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
  }
  db.adminCredentials.passwordHash = hashPassword(newPassword);
  dbManager.save();
  return res.json({ success: true, message: 'Admin password updated successfully' });
});

// Student Login (accepts Student ID or registered Mobile)
apiRouter.post('/auth/student-login', (req: Request, res: Response) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ success: false, message: 'Student ID or Mobile and password are required' });
  }

  const db = dbManager.getDB();
  const cleanId = String(identifier).trim();
  const cleanMobile = cleanId.replace(/\D/g, '');
  const hashedInput = hashPassword(password);

  const student = db.students.find(s => 
    (s.studentId.toLowerCase() === cleanId.toLowerCase() ||
     s.mobile.replace(/\D/g, '') === cleanMobile ||
     s.email.toLowerCase() === cleanId.toLowerCase()) &&
    s.passwordHash === hashedInput
  );

  if (!student) {
    return res.status(401).json({ success: false, message: 'Invalid Student ID / Mobile or password' });
  }

  if (!student.isActive) {
    return res.status(403).json({ success: false, message: 'This student account has been deactivated. Please contact support.' });
  }

  // Find linked admission
  const admission = db.admissions.find(a => a.studentId === student.studentId);

  return res.json({
    success: true,
    student: {
      id: student.id,
      studentId: student.studentId,
      fullName: student.fullName,
      email: student.email,
      mobile: student.mobile,
      applicationNumber: student.applicationNumber,
      subscriptionPlanId: student.subscriptionPlanId,
      subscriptionPlanName: student.subscriptionPlanName,
      subscriptionExpiryDate: student.subscriptionExpiryDate,
      subscriptionStatus: student.subscriptionStatus,
      admission
    }
  });
});

// Student change password
apiRouter.post('/auth/change-password', (req: Request, res: Response) => {
  const { studentId, currentPassword, newPassword } = req.body;
  const db = dbManager.getDB();
  const student = db.students.find(s => s.studentId === studentId);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  if (student.passwordHash !== hashPassword(currentPassword)) {
    return res.status(400).json({ success: false, message: 'Incorrect current password' });
  }

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
  }

  student.passwordHash = hashPassword(newPassword);
  dbManager.save();
  return res.json({ success: true, message: 'Password updated successfully' });
});

// Student forgot password
apiRouter.post('/auth/forgot-password', (req: Request, res: Response) => {
  const { identifier } = req.body;
  if (!identifier) {
    return res.status(400).json({ success: false, message: 'Mobile or Student ID required' });
  }

  const db = dbManager.getDB();
  const cleanId = String(identifier).trim();
  const cleanMobile = cleanId.replace(/\D/g, '');

  const student = db.students.find(s => 
    s.studentId.toLowerCase() === cleanId.toLowerCase() ||
    s.mobile.replace(/\D/g, '') === cleanMobile ||
    s.email.toLowerCase() === cleanId.toLowerCase()
  );

  if (!student) {
    return res.status(404).json({ success: false, message: 'No registered student found with provided details' });
  }

  // Generate temporary password
  const tempPass = 'Temp@' + Math.floor(10000 + Math.random() * 90000);
  student.passwordHash = hashPassword(tempPass);
  dbManager.save();

  return res.json({
    success: true,
    message: `Temporary password generated for ${student.fullName}. You may now log in.`,
    temporaryPassword: tempPass,
    studentId: student.studentId
  });
});

// -------------------------------------------------------------
// 2. ADMISSION & PUBLIC EXAM SUBMISSIONS
// -------------------------------------------------------------

// Submit Online Admission Form (with 4 documents)
apiRouter.post('/admissions', (req: Request, res: Response) => {
  const {
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
    documents
  } = req.body;

  // Validation
  if (!fullName || !dob || !mobile || !fatherName || !motherName || !address || !courseAppliedFor || !studyMedium) {
    return res.status(400).json({ success: false, message: 'Please fill in all mandatory admission fields.' });
  }

  const db = dbManager.getDB();

  // Generate application number & student ID
  const year = new Date().getFullYear();
  const appNumber = `JANGRA-NIOS-${year}-${Math.floor(10000 + Math.random() * 90000)}`;
  const studentId = `STU-${Math.floor(10000 + Math.random() * 90000)}`;
  const temporaryPassword = `Jangra@${Math.floor(1000 + Math.random() * 9000)}`;

  const newAdmission: AdmissionApplication = {
    id: 'adm-' + Date.now(),
    applicationNumber: appNumber,
    studentId,
    temporaryPassword,
    fullName: String(fullName).trim(),
    dob,
    mobile: String(mobile).trim(),
    fatherName: String(fatherName).trim(),
    motherName: String(motherName).trim(),
    email: String(email || '').trim(),
    address: String(address).trim(),
    category: category || 'General',
    previousQualification: String(previousQualification || '').trim(),
    courseAppliedFor,
    studyMedium,
    previousSchoolBoard: String(previousSchoolBoard || '').trim(),
    documents: {
      photo: documents?.photo || undefined,
      signature: documents?.signature || undefined,
      aadhaar: documents?.aadhaar || undefined,
      qualification: documents?.qualification || undefined
    },
    status: 'Submitted',
    submittedAt: new Date().toISOString(),
    adminNotes: 'Application received online. Documents awaiting review by academic counselor.'
  };

  // Create Student Account automatically
  const newStudent: StudentUser = {
    id: 'user-' + Date.now(),
    studentId,
    fullName: String(fullName).trim(),
    email: String(email || '').trim(),
    mobile: String(mobile).trim(),
    passwordHash: hashPassword(temporaryPassword),
    applicationNumber: appNumber,
    isActive: true,
    createdAt: new Date().toISOString(),
    subscriptionStatus: 'None'
  };

  db.admissions.unshift(newAdmission);
  db.students.unshift(newStudent);
  dbManager.save();

  return res.status(201).json({
    success: true,
    message: 'Admission Application Submitted Successfully!',
    admission: newAdmission,
    credentials: {
      studentId,
      temporaryPassword,
      applicationNumber: appNumber
    }
  });
});

// Submit Public Exam Form
apiRouter.post('/public-exam', (req: Request, res: Response) => {
  const { fullName, dob, mobile, email, enrollmentNumber } = req.body;

  if (!fullName || !dob || !mobile || !enrollmentNumber) {
    return res.status(400).json({ success: false, message: 'All personal fields and Enrollment Number are required' });
  }

  const db = dbManager.getDB();
  const year = new Date().getFullYear();
  const regNo = `PE-${year}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newExamEntry: PublicExamEntry = {
    id: 'pe-' + Date.now(),
    registrationNumber: regNo,
    fullName: String(fullName).trim(),
    dob,
    mobile: String(mobile).trim(),
    email: String(email || '').trim(),
    enrollmentNumber: String(enrollmentNumber).trim(),
    submittedAt: new Date().toISOString(),
    status: 'Received'
  };

  db.publicExams.unshift(newExamEntry);
  dbManager.save();

  return res.status(201).json({
    success: true,
    message: 'Public Exam Registration Submitted Successfully!',
    entry: newExamEntry
  });
});

// Check Admission Application Status
apiRouter.get('/admissions/status/:query', (req: Request, res: Response) => {
  const query = req.params.query.trim().toLowerCase();
  const db = dbManager.getDB();

  const cleanNum = query.replace(/\D/g, '');

  const admission = db.admissions.find(a => 
    a.applicationNumber.toLowerCase() === query ||
    a.studentId.toLowerCase() === query ||
    (cleanNum.length >= 10 && a.mobile.replace(/\D/g, '').includes(cleanNum))
  );

  if (!admission) {
    // Check if it exists in public exams
    const pe = db.publicExams.find(p => 
      p.registrationNumber.toLowerCase() === query ||
      p.enrollmentNumber.toLowerCase() === query ||
      (cleanNum.length >= 10 && p.mobile.replace(/\D/g, '').includes(cleanNum))
    );

    if (pe) {
      return res.json({
        success: true,
        type: 'PublicExam',
        data: pe
      });
    }

    return res.status(404).json({
      success: false,
      message: 'No record found with the given Application Number, Student ID, or Mobile Number.'
    });
  }

  return res.json({
    success: true,
    type: 'Admission',
    data: admission
  });
});

// Admin list admissions
apiRouter.get('/admissions', (req: Request, res: Response) => {
  const db = dbManager.getDB();
  return res.json({ success: true, admissions: db.admissions });
});

// Admin update admission status
apiRouter.patch('/admissions/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminNotes, courseAppliedFor } = req.body;
  const db = dbManager.getDB();

  const adm = db.admissions.find(a => a.id === id || a.applicationNumber === id);
  if (!adm) {
    return res.status(404).json({ success: false, message: 'Admission not found' });
  }

  if (status) adm.status = status;
  if (adminNotes !== undefined) adm.adminNotes = adminNotes;
  if (courseAppliedFor) adm.courseAppliedFor = courseAppliedFor;

  dbManager.save();
  return res.json({ success: true, admission: adm, message: 'Admission application updated successfully' });
});

// -------------------------------------------------------------
// 3. STUDENT MANAGEMENT (ADMIN)
// -------------------------------------------------------------

apiRouter.get('/students', (req: Request, res: Response) => {
  const db = dbManager.getDB();
  // Return students with their latest application details
  const result = db.students.map(s => {
    const admission = db.admissions.find(a => a.studentId === s.studentId);
    return {
      ...s,
      admission
    };
  });
  return res.json({ success: true, students: result });
});

apiRouter.get('/students/:studentId', (req: Request, res: Response) => {
  const { studentId } = req.params;
  const db = dbManager.getDB();
  const student = db.students.find(s => s.studentId === studentId);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  const admission = db.admissions.find(a => a.studentId === studentId);
  const payments = db.payments.filter(p => p.studentId === studentId);

  return res.json({
    success: true,
    student,
    admission,
    payments
  });
});

apiRouter.patch('/students/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { fullName, email, mobile, isActive } = req.body;
  const db = dbManager.getDB();

  const student = db.students.find(s => s.id === id || s.studentId === id);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  if (fullName) student.fullName = fullName;
  if (email) student.email = email;
  if (mobile) student.mobile = mobile;
  if (isActive !== undefined) student.isActive = isActive;

  dbManager.save();
  return res.json({ success: true, student, message: 'Student details updated' });
});

apiRouter.post('/students/:studentId/reset-password', (req: Request, res: Response) => {
  const { studentId } = req.params;
  const db = dbManager.getDB();
  const student = db.students.find(s => s.studentId === studentId);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  const newTemp = 'Pass@' + Math.floor(10000 + Math.random() * 90000);
  student.passwordHash = hashPassword(newTemp);
  dbManager.save();

  return res.json({
    success: true,
    message: `Password reset successfully for ${student.fullName}`,
    newPassword: newTemp
  });
});

// -------------------------------------------------------------
// 4. SUBSCRIPTION & PAYMENT SYSTEM
// -------------------------------------------------------------

apiRouter.get('/subscriptions/plans', (req: Request, res: Response) => {
  const db = dbManager.getDB();
  return res.json({ success: true, plans: db.plans });
});

apiRouter.post('/subscriptions/plans', (req: Request, res: Response) => {
  const { name, durationLabel, price, originalPrice, durationDays, description, features, isPopular } = req.body;
  if (!name || !price || !durationDays) {
    return res.status(400).json({ success: false, message: 'Name, price and duration are required' });
  }

  const db = dbManager.getDB();
  const newPlan: SubscriptionPlan = {
    id: 'plan-' + Date.now(),
    name,
    durationLabel: durationLabel || 'Custom',
    price: Number(price),
    originalPrice: Number(originalPrice || price * 1.3),
    durationDays: Number(durationDays),
    description: description || '',
    features: Array.isArray(features) ? features : [],
    isPopular: !!isPopular,
    isActive: true
  };

  db.plans.push(newPlan);
  dbManager.save();
  return res.status(201).json({ success: true, plan: newPlan, message: 'Subscription plan created' });
});

apiRouter.put('/subscriptions/plans/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const db = dbManager.getDB();
  const plan = db.plans.find(p => p.id === id);
  if (!plan) {
    return res.status(404).json({ success: false, message: 'Plan not found' });
  }

  const { name, durationLabel, price, originalPrice, durationDays, description, features, isPopular, isActive } = req.body;
  if (name) plan.name = name;
  if (durationLabel) plan.durationLabel = durationLabel;
  if (price !== undefined) plan.price = Number(price);
  if (originalPrice !== undefined) plan.originalPrice = Number(originalPrice);
  if (durationDays !== undefined) plan.durationDays = Number(durationDays);
  if (description !== undefined) plan.description = description;
  if (features) plan.features = features;
  if (isPopular !== undefined) plan.isPopular = isPopular;
  if (isActive !== undefined) plan.isActive = isActive;

  dbManager.save();
  return res.json({ success: true, plan, message: 'Plan updated' });
});

apiRouter.delete('/subscriptions/plans/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const db = dbManager.getDB();
  db.plans = db.plans.filter(p => p.id !== id);
  dbManager.save();
  return res.json({ success: true, message: 'Plan deleted' });
});

// Create payment order (Razorpay / UPI simulation)
apiRouter.post('/payments/create-order', (req: Request, res: Response) => {
  const { studentId, planId } = req.body;
  const db = dbManager.getDB();

  const plan = db.plans.find(p => p.id === planId);
  if (!plan) {
    return res.status(404).json({ success: false, message: 'Selected plan not found' });
  }

  const orderId = `order_${crypto.randomBytes(8).toString('hex')}`;
  return res.json({
    success: true,
    orderId,
    amount: plan.price,
    currency: 'INR',
    planName: plan.name,
    upiId: 'jangraeducationalservices@okaxis',
    qrCodeMock: `upi://pay?pa=jangraeducationalservices@okaxis&pn=JANGRA%20NIOS%20SERVICES&am=${plan.price}&cu=INR`
  });
});

// Verify & complete payment
apiRouter.post('/payments/verify', (req: Request, res: Response) => {
  const { studentId, planId, paymentMethod, referenceNumber, paymentDetails } = req.body;
  const db = dbManager.getDB();

  const plan = db.plans.find(p => p.id === planId);
  if (!plan) {
    return res.status(404).json({ success: false, message: 'Plan not found' });
  }

  let student = db.students.find(s => s.studentId === studentId);
  const studentName = student ? student.fullName : (paymentDetails?.studentName || 'Student Candidate');

  const txnId = `TXN-RAZORPAY-${Math.floor(100000 + Math.random() * 900000)}`;
  const receiptNo = `JNS-REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newPayment: PaymentTransaction = {
    id: 'pay-' + Date.now(),
    transactionId: txnId,
    studentId: studentId || 'GUEST',
    studentName,
    planId: plan.id,
    planName: plan.name,
    amount: plan.price,
    paymentMethod: paymentMethod || 'UPI',
    status: 'SUCCESS',
    paidAt: new Date().toISOString(),
    receiptNumber: receiptNo,
    notes: referenceNumber ? `Reference: ${referenceNumber}` : 'Online verified transaction'
  };

  db.payments.unshift(newPayment);

  // If student exists, update subscription
  if (student) {
    const now = new Date();
    const expiry = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
    student.subscriptionPlanId = plan.id;
    student.subscriptionPlanName = plan.name;
    student.subscriptionExpiryDate = expiry.toISOString();
    student.subscriptionStatus = 'Active';
  }

  dbManager.save();

  return res.json({
    success: true,
    message: 'Payment verified successfully! Subscription activated.',
    payment: newPayment,
    subscriptionExpiry: student?.subscriptionExpiryDate
  });
});

apiRouter.get('/payments/history', (req: Request, res: Response) => {
  const { studentId } = req.query;
  const db = dbManager.getDB();
  if (studentId) {
    const list = db.payments.filter(p => p.studentId === studentId);
    return res.json({ success: true, payments: list });
  }
  return res.json({ success: true, payments: db.payments });
});

// Admin extend student subscription
apiRouter.post('/subscriptions/:studentId/extend', (req: Request, res: Response) => {
  const { studentId } = req.params;
  const { days } = req.body;
  const db = dbManager.getDB();
  const student = db.students.find(s => s.studentId === studentId);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  const currentExpiry = student.subscriptionExpiryDate ? new Date(student.subscriptionExpiryDate) : new Date();
  const baseTime = currentExpiry > new Date() ? currentExpiry.getTime() : Date.now();
  const newExpiry = new Date(baseTime + Number(days || 30) * 24 * 60 * 60 * 1000);

  student.subscriptionExpiryDate = newExpiry.toISOString();
  student.subscriptionStatus = 'Active';
  dbManager.save();

  return res.json({
    success: true,
    message: `Subscription extended by ${days || 30} days`,
    student
  });
});

// -------------------------------------------------------------
// 5. WEBSITE CONTENT MANAGEMENT (CMS)
// -------------------------------------------------------------

apiRouter.get('/content/all', (req: Request, res: Response) => {
  const db = dbManager.getDB();
  return res.json({
    success: true,
    settings: db.settings
  });
});

apiRouter.put('/content/update', (req: Request, res: Response) => {
  const db = dbManager.getDB();
  db.settings = {
    ...db.settings,
    ...req.body
  };
  dbManager.save();
  return res.json({ success: true, settings: db.settings, message: 'Website settings updated successfully' });
});

// Courses
apiRouter.get('/courses', (req: Request, res: Response) => {
  const db = dbManager.getDB();
  return res.json({ success: true, courses: db.courses });
});

apiRouter.post('/courses', (req: Request, res: Response) => {
  const db = dbManager.getDB();
  const newCourse: Course = {
    id: 'course-' + Date.now(),
    ...req.body
  };
  db.courses.push(newCourse);
  dbManager.save();
  return res.status(201).json({ success: true, course: newCourse, message: 'Course created' });
});

apiRouter.put('/courses/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const db = dbManager.getDB();
  const index = db.courses.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }
  db.courses[index] = { ...db.courses[index], ...req.body };
  dbManager.save();
  return res.json({ success: true, course: db.courses[index], message: 'Course updated' });
});

apiRouter.delete('/courses/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const db = dbManager.getDB();
  db.courses = db.courses.filter(c => c.id !== id);
  dbManager.save();
  return res.json({ success: true, message: 'Course deleted' });
});

// Announcements
apiRouter.get('/announcements', (req: Request, res: Response) => {
  const db = dbManager.getDB();
  return res.json({ success: true, announcements: db.announcements });
});

apiRouter.post('/announcements', (req: Request, res: Response) => {
  const db = dbManager.getDB();
  const newAnn: Announcement = {
    id: 'ann-' + Date.now(),
    date: new Date().toISOString().split('T')[0],
    ...req.body
  };
  db.announcements.unshift(newAnn);
  dbManager.save();
  return res.status(201).json({ success: true, announcement: newAnn, message: 'Announcement published' });
});

apiRouter.delete('/announcements/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const db = dbManager.getDB();
  db.announcements = db.announcements.filter(a => a.id !== id);
  dbManager.save();
  return res.json({ success: true, message: 'Announcement removed' });
});

// Gallery
apiRouter.get('/gallery', (req: Request, res: Response) => {
  const db = dbManager.getDB();
  return res.json({ success: true, gallery: db.gallery });
});

apiRouter.post('/gallery', (req: Request, res: Response) => {
  const { title, category, imageUrl, description } = req.body;
  if (!title || !imageUrl) {
    return res.status(400).json({ success: false, message: 'Title and Image URL required' });
  }
  const db = dbManager.getDB();
  const newItem: GalleryItem = {
    id: 'gal-' + Date.now(),
    title,
    category: category || 'Campus',
    imageUrl,
    description: description || ''
  };
  db.gallery.unshift(newItem);
  dbManager.save();
  return res.status(201).json({ success: true, item: newItem, message: 'Gallery image added' });
});

apiRouter.delete('/gallery/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const db = dbManager.getDB();
  db.gallery = db.gallery.filter(g => g.id !== id);
  dbManager.save();
  return res.json({ success: true, message: 'Gallery image deleted' });
});

// Contact Inquiries
apiRouter.post('/contact', (req: Request, res: Response) => {
  const { name, email, mobile, subject, message } = req.body;
  if (!name || !mobile || !message) {
    return res.status(400).json({ success: false, message: 'Name, mobile and message are required' });
  }

  const db = dbManager.getDB();
  const inquiry: ContactInquiry = {
    id: 'inq-' + Date.now(),
    name,
    email: email || '',
    mobile,
    subject: subject || 'General Admission Inquiry',
    message,
    submittedAt: new Date().toISOString(),
    status: 'Unread'
  };

  db.inquiries.unshift(inquiry);
  dbManager.save();

  return res.status(201).json({ success: true, message: 'Thank you! Your message has been received. Our counselor will contact you shortly.' });
});

apiRouter.get('/contact', (req: Request, res: Response) => {
  const db = dbManager.getDB();
  return res.json({ success: true, inquiries: db.inquiries });
});

// -------------------------------------------------------------
// 6. REPORTS & EXPORTS
// -------------------------------------------------------------

apiRouter.get('/reports/overview', (req: Request, res: Response) => {
  const db = dbManager.getDB();
  const totalStudents = db.students.length;
  const newApplications = db.admissions.filter(a => a.status === 'Submitted').length;
  const approvedApplications = db.admissions.filter(a => a.status === 'Documents Approved' || a.status === 'Enrolled').length;
  const pendingApplications = db.admissions.filter(a => a.status === 'Under Verification' || a.status === 'Submitted').length;
  const rejectedApplications = db.admissions.filter(a => a.status === 'Rejected').length;
  const activeSubscriptions = db.students.filter(s => s.subscriptionStatus === 'Active').length;
  const expiredSubscriptions = db.students.filter(s => s.subscriptionStatus === 'Expired').length;
  const totalVerifiedPayments = db.payments.filter(p => p.status === 'SUCCESS').reduce((sum, p) => sum + p.amount, 0);

  return res.json({
    success: true,
    stats: {
      totalStudents,
      newApplications,
      approvedApplications,
      pendingApplications,
      rejectedApplications,
      activeSubscriptions,
      expiredSubscriptions,
      totalVerifiedPayments,
      totalAdmissions: db.admissions.length,
      totalPublicExams: db.publicExams.length
    }
  });
});

// CSV Export for Students
apiRouter.get('/reports/students-csv', (req: Request, res: Response) => {
  const db = dbManager.getDB();
  let csv = 'Student ID,Full Name,Email,Mobile,Application Number,Status,Subscription,Expiry Date\n';
  db.students.forEach(s => {
    csv += `"${s.studentId}","${s.fullName}","${s.email}","${s.mobile}","${s.applicationNumber}","${s.isActive ? 'Active' : 'Inactive'}","${s.subscriptionPlanName || 'None'}","${s.subscriptionExpiryDate ? s.subscriptionExpiryDate.split('T')[0] : 'N/A'}"\n`;
  });
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="jangra_students_report.csv"');
  return res.send(csv);
});

// CSV Export for Admissions
apiRouter.get('/reports/admissions-csv', (req: Request, res: Response) => {
  const db = dbManager.getDB();
  let csv = 'Application Number,Student ID,Full Name,Course,DOB,Mobile,Email,Category,Medium,Status,Submitted At\n';
  db.admissions.forEach(a => {
    csv += `"${a.applicationNumber}","${a.studentId}","${a.fullName}","${a.courseAppliedFor}","${a.dob}","${a.mobile}","${a.email}","${a.category}","${a.studyMedium}","${a.status}","${a.submittedAt.split('T')[0]}"\n`;
  });
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="jangra_admissions_report.csv"');
  return res.send(csv);
});

// CSV Export for Payments
apiRouter.get('/reports/payments-csv', (req: Request, res: Response) => {
  const db = dbManager.getDB();
  let csv = 'Receipt No,Transaction ID,Student ID,Student Name,Plan Name,Amount (INR),Method,Status,Date\n';
  db.payments.forEach(p => {
    csv += `"${p.receiptNumber}","${p.transactionId}","${p.studentId}","${p.studentName}","${p.planName}",${p.amount},"${p.paymentMethod}","${p.status}","${p.paidAt.split('T')[0]}"\n`;
  });
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="jangra_payments_report.csv"');
  return res.send(csv);
});
