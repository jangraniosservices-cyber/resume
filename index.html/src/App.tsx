import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { WhatsAppWidget } from './components/WhatsAppWidget.tsx';
import { PaymentModal } from './components/PaymentModal.tsx';
import { PolicyModal } from './components/PolicyModal.tsx';

import { HomePage } from './pages/HomePage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { CoursesPage } from './pages/CoursesPage.tsx';
import { AdmissionPage } from './pages/AdmissionPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { StudentPortal } from './pages/StudentPortal.tsx';
import { AdminPortal } from './pages/AdminPortal.tsx';

import { SubscriptionPlan, PaymentTransaction, Course } from './types/index.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentStudent, setCurrentStudent] = useState<any | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Modal states
  const [activePaymentPlan, setActivePaymentPlan] = useState<SubscriptionPlan | null>(null);
  const [activePolicy, setActivePolicy] = useState<'privacy' | 'terms' | 'refund' | null>(null);
  const [preselectedCourseForAdmission, setPreselectedCourseForAdmission] = useState<string>('NIOS Secondary (10th)');

  // Scroll to top upon tab switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const handleStudentLoginSuccess = (student: any) => {
    setCurrentStudent(student);
    setActiveTab('student');
  };

  const handleStudentLogout = () => {
    setCurrentStudent(null);
    setActiveTab('home');
  };

  const handleAdminLoginSuccess = (_token: string) => {
    setIsAdminLoggedIn(true);
    setActiveTab('admin');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setActiveTab('home');
  };

  const handlePaymentSuccess = (payment: PaymentTransaction) => {
    alert(`Payment of ₹${payment.amount} successful! Receipt: ${payment.receiptNumber}. Subscription activated.`);
    setActivePaymentPlan(null);
    if (currentStudent) {
      setCurrentStudent({
        ...currentStudent,
        subscriptionStatus: 'Active',
        subscriptionPlanName: payment.planName,
        subscriptionExpiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
      });
      setActiveTab('student');
    }
  };

  const handleSelectCourse = (course: Course) => {
    setPreselectedCourseForAdmission(
      course.category === 'secondary'
        ? 'NIOS Secondary (10th)'
        : 'NIOS Senior Secondary (12th)'
    );
    setActiveTab('admission');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* 1. Header Navigation with Top Strip */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isStudentLoggedIn={!!currentStudent}
        studentName={currentStudent?.fullName}
        isAdminLoggedIn={isAdminLoggedIn}
        onStudentLogout={handleStudentLogout}
        onAdminLogout={handleAdminLogout}
      />

      {/* 2. Main Page Render */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            setActiveTab={setActiveTab}
            onSelectCourse={handleSelectCourse}
          />
        )}

        {activeTab === 'about' && (
          <AboutPage setActiveTab={setActiveTab} />
        )}

        {activeTab === 'courses' && (
          <CoursesPage
            setActiveTab={setActiveTab}
            onOpenPaymentModal={(plan) => setActivePaymentPlan(plan)}
            onSelectCourseForAdmission={(cName) => {
              setPreselectedCourseForAdmission(cName);
              setActiveTab('admission');
            }}
          />
        )}

        {activeTab === 'admission' && (
          <AdmissionPage
            initialCourse={preselectedCourseForAdmission}
            setActiveTab={setActiveTab}
            onStudentLoginSuccess={handleStudentLoginSuccess}
          />
        )}

        {activeTab === 'contact' && (
          <ContactPage />
        )}

        {activeTab === 'student' && (
          <StudentPortal
            currentStudent={currentStudent}
            onLogin={handleStudentLoginSuccess}
            onLogout={handleStudentLogout}
            onOpenPaymentModal={(plan) => setActivePaymentPlan(plan)}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPortal
            isAdminLoggedIn={isAdminLoggedIn}
            onAdminLogin={handleAdminLoginSuccess}
            onAdminLogout={handleAdminLogout}
          />
        )}
      </main>

      {/* 3. Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenPolicyModal={(type) => setActivePolicy(type)}
      />

      {/* 4. Floating WhatsApp Chat Widget */}
      <WhatsAppWidget />

      {/* 5. Payment Modal (Razorpay / UPI simulation) */}
      {activePaymentPlan && (
        <PaymentModal
          plan={activePaymentPlan}
          studentId={currentStudent?.studentId || 'GUEST'}
          studentName={currentStudent?.fullName || 'Student Candidate'}
          onClose={() => setActivePaymentPlan(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* 6. Policy Modal */}
      {activePolicy && (
        <PolicyModal
          policyType={activePolicy}
          onClose={() => setActivePolicy(null)}
        />
      )}

    </div>
  );
}
