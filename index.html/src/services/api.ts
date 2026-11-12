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
} from '../types/index.ts';

const API_BASE = '/api';

export const api = {
  // Auth
  async adminLogin(username: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },

  async adminChangePassword(currentPassword: string, newPassword: string) {
    const res = await fetch(`${API_BASE}/auth/admin-change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return res.json();
  },

  async studentLogin(identifier: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/student-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    return res.json();
  },

  async studentChangePassword(studentId: string, currentPassword: string, newPassword: string) {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, currentPassword, newPassword }),
    });
    return res.json();
  },

  async studentForgotPassword(identifier: string) {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier }),
    });
    return res.json();
  },

  // Admissions
  async submitAdmission(data: Partial<AdmissionApplication>) {
    const res = await fetch(`${API_BASE}/admissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async submitPublicExam(data: Partial<PublicExamEntry>) {
    const res = await fetch(`${API_BASE}/public-exam`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async checkStatus(query: string) {
    const res = await fetch(`${API_BASE}/admissions/status/${encodeURIComponent(query)}`);
    return res.json();
  },

  async getAdmissions() {
    const res = await fetch(`${API_BASE}/admissions`);
    return res.json();
  },

  async updateAdmission(id: string, updates: Partial<AdmissionApplication>) {
    const res = await fetch(`${API_BASE}/admissions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  // Students
  async getStudents() {
    const res = await fetch(`${API_BASE}/students`);
    return res.json();
  },

  async getStudentProfile(studentId: string) {
    const res = await fetch(`${API_BASE}/students/${studentId}`);
    return res.json();
  },

  async updateStudent(id: string, updates: Partial<StudentUser>) {
    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  async resetStudentPassword(studentId: string) {
    const res = await fetch(`${API_BASE}/students/${studentId}/reset-password`, {
      method: 'POST',
    });
    return res.json();
  },

  // Subscriptions & Payments
  async getPlans() {
    const res = await fetch(`${API_BASE}/subscriptions/plans`);
    return res.json();
  },

  async createPlan(plan: Partial<SubscriptionPlan>) {
    const res = await fetch(`${API_BASE}/subscriptions/plans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan),
    });
    return res.json();
  },

  async updatePlan(id: string, plan: Partial<SubscriptionPlan>) {
    const res = await fetch(`${API_BASE}/subscriptions/plans/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan),
    });
    return res.json();
  },

  async deletePlan(id: string) {
    const res = await fetch(`${API_BASE}/subscriptions/plans/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  async createOrder(studentId: string, planId: string) {
    const res = await fetch(`${API_BASE}/payments/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, planId }),
    });
    return res.json();
  },

  async verifyPayment(payload: {
    studentId: string;
    planId: string;
    paymentMethod: string;
    referenceNumber?: string;
    paymentDetails?: { studentName: string };
  }) {
    const res = await fetch(`${API_BASE}/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async getPayments(studentId?: string) {
    const url = studentId ? `${API_BASE}/payments/history?studentId=${studentId}` : `${API_BASE}/payments/history`;
    const res = await fetch(url);
    return res.json();
  },

  async extendSubscription(studentId: string, days: number) {
    const res = await fetch(`${API_BASE}/subscriptions/${studentId}/extend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ days }),
    });
    return res.json();
  },

  // Content
  async getContent() {
    const res = await fetch(`${API_BASE}/content/all`);
    return res.json();
  },

  async updateContent(data: Partial<SiteSettings>) {
    const res = await fetch(`${API_BASE}/content/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getCourses() {
    const res = await fetch(`${API_BASE}/courses`);
    return res.json();
  },

  async createCourse(course: Partial<Course>) {
    const res = await fetch(`${API_BASE}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course),
    });
    return res.json();
  },

  async updateCourse(id: string, course: Partial<Course>) {
    const res = await fetch(`${API_BASE}/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course),
    });
    return res.json();
  },

  async deleteCourse(id: string) {
    const res = await fetch(`${API_BASE}/courses/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  async getAnnouncements() {
    const res = await fetch(`${API_BASE}/announcements`);
    return res.json();
  },

  async createAnnouncement(data: Partial<Announcement>) {
    const res = await fetch(`${API_BASE}/announcements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteAnnouncement(id: string) {
    const res = await fetch(`${API_BASE}/announcements/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  async getGallery() {
    const res = await fetch(`${API_BASE}/gallery`);
    return res.json();
  },

  async addGalleryItem(data: Partial<GalleryItem>) {
    const res = await fetch(`${API_BASE}/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteGalleryItem(id: string) {
    const res = await fetch(`${API_BASE}/gallery/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  async submitContact(data: Partial<ContactInquiry>) {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getInquiries() {
    const res = await fetch(`${API_BASE}/contact`);
    return res.json();
  },

  async getOverviewStats() {
    const res = await fetch(`${API_BASE}/reports/overview`);
    return res.json();
  }
};
