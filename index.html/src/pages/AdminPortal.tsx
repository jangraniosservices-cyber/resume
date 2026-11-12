import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  CreditCard, 
  Layers, 
  Settings, 
  BellRing, 
  Image as ImageIcon, 
  Download, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit, 
  RefreshCw, 
  AlertCircle,
  Eye,
  Key,
  Calendar,
  Lock,
  DollarSign
} from 'lucide-react';
import { api } from '../services/api.ts';
import { 
  AdmissionApplication, 
  StudentUser, 
  SubscriptionPlan, 
  PaymentTransaction, 
  Course, 
  Announcement, 
  GalleryItem, 
  SiteSettings,
  ContactInquiry 
} from '../types/index.ts';

interface AdminPortalProps {
  isAdminLoggedIn: boolean;
  onAdminLogin: (token: string) => void;
  onAdminLogout: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isAdminLoggedIn,
  onAdminLogin,
  onAdminLogout
}) => {
  // Login State
  const [username, setUsername] = useState('admin@jangranios.com');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Sub-Tab
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'admissions' | 'students' | 'subscriptions' | 'website' | 'reports'>('overview');

  // Overview Stats
  const [stats, setStats] = useState<any>(null);

  // Data Collections
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  // Search & Filters
  const [studentSearch, setStudentSearch] = useState('');
  const [admissionFilter, setAdmissionFilter] = useState<string>('All');

  // Modals & Action State
  const [selectedAdmission, setSelectedAdmission] = useState<AdmissionApplication | null>(null);
  const [selectedDocPreview, setSelectedDocPreview] = useState<{ title: string; dataUrl: string; type: string } | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  // Forms for Website CMS
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState<'Admission' | 'Exam' | 'Results' | 'TMA' | 'Practical'>('Admission');
  const [newNoticeContent, setNewNoticeContent] = useState('');

  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newGalleryCategory, setNewGalleryCategory] = useState<'Campus' | 'Graduation' | 'Labs' | 'Counseling'>('Campus');

  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseFee, setNewCourseFee] = useState<number>(3500);
  const [newCourseDesc, setNewCourseDesc] = useState('');

  // Initial Data Fetch
  useEffect(() => {
    if (isAdminLoggedIn) {
      loadAllAdminData();
    }
  }, [isAdminLoggedIn]);

  async function loadAllAdminData() {
    try {
      const [sRes, aRes, stRes, pRes, payRes, cRes, anRes, gRes, setRes, inqRes] = await Promise.all([
        api.getOverviewStats(),
        api.getAdmissions(),
        api.getStudents(),
        api.getPlans(),
        api.getPayments(),
        api.getCourses(),
        api.getAnnouncements(),
        api.getGallery(),
        api.getContent(),
        api.getInquiries()
      ]);

      if (sRes.success) setStats(sRes.stats);
      if (aRes.success) setAdmissions(aRes.admissions);
      if (stRes.success) setStudents(stRes.students);
      if (pRes.success) setPlans(pRes.plans);
      if (payRes.success) setPayments(payRes.payments);
      if (cRes.success) setCourses(cRes.courses);
      if (anRes.success) setAnnouncements(anRes.announcements);
      if (gRes.success) setGallery(gRes.gallery);
      if (setRes.success) setSiteSettings(setRes.settings);
      if (inqRes.success) setInquiries(inqRes.inquiries);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await api.adminLogin(username, password);
      if (res.success && res.token) {
        onAdminLogin(res.token);
      } else {
        setLoginError(res.message || 'Invalid admin credentials');
      }
    } catch (err) {
      setLoginError('Error connecting to authentication service.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Admission Status update
  const handleUpdateAdmissionStatus = async (id: string, newStatus: any, notes: string) => {
    try {
      const res = await api.updateAdmission(id, { status: newStatus, adminNotes: notes });
      if (res.success) {
        setActionMsg(`Application status updated to "${newStatus}"`);
        loadAllAdminData();
        setSelectedAdmission(null);
        setTimeout(() => setActionMsg(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Reset Student Password
  const handleResetPassword = async (studentId: string) => {
    try {
      const res = await api.resetStudentPassword(studentId);
      if (res.success) {
        alert(`New temporary password for ${studentId} is: ${res.newPassword}`);
        loadAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Student Status
  const handleToggleStudent = async (id: string, currentStatus: boolean) => {
    try {
      await api.updateStudent(id, { isActive: !currentStatus });
      loadAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Add Announcement
  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle || !newNoticeContent) return;
    try {
      const res = await api.createAnnouncement({
        title: newNoticeTitle,
        category: newNoticeCategory,
        content: newNoticeContent,
        isUrgent: false
      });
      if (res.success) {
        setNewNoticeTitle('');
        setNewNoticeContent('');
        loadAllAdminData();
        setActionMsg('Notice published successfully');
        setTimeout(() => setActionMsg(null), 2500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Announcement
  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to remove this announcement?')) return;
    try {
      await api.deleteAnnouncement(id);
      loadAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Add Gallery Image
  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryTitle || !newGalleryUrl) return;
    try {
      const res = await api.addGalleryItem({
        title: newGalleryTitle,
        imageUrl: newGalleryUrl,
        category: newGalleryCategory,
        description: 'Uploaded by administrator'
      });
      if (res.success) {
        setNewGalleryTitle('');
        setNewGalleryUrl('');
        loadAllAdminData();
        setActionMsg('Gallery image added');
        setTimeout(() => setActionMsg(null), 2500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Gallery
  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Delete this gallery photo?')) return;
    try {
      await api.deleteGalleryItem(id);
      loadAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Add Course
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle || !newCourseCode) return;
    try {
      await api.createCourse({
        title: newCourseTitle,
        code: newCourseCode,
        category: 'secondary',
        shortDesc: newCourseDesc,
        fullDesc: newCourseDesc,
        eligibility: 'General eligibility',
        duration: '1 Year',
        subjectsCount: '5 Subjects',
        fee: Number(newCourseFee),
        featured: false,
        features: ['Course curriculum support', 'Assignment guidance']
      });
      setNewCourseTitle('');
      setNewCourseCode('');
      setNewCourseDesc('');
      loadAllAdminData();
      setActionMsg('Course added successfully');
      setTimeout(() => setActionMsg(null), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Course
  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Delete this course?')) return;
    try {
      await api.deleteCourse(id);
      loadAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Update Website Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteSettings) return;
    try {
      await api.updateContent(siteSettings);
      setActionMsg('Website settings updated successfully');
      setTimeout(() => setActionMsg(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Extend student subscription
  const handleExtendStudentSub = async (studentId: string) => {
    const days = prompt('Enter number of days to extend validity:', '30');
    if (!days) return;
    try {
      await api.extendSubscription(studentId, Number(days));
      alert(`Subscription extended by ${days} days`);
      loadAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------------------------------------------
  // ADMIN LOGIN FORM
  // -------------------------------------------------------------
  if (!isAdminLoggedIn) {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-md mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-[#0b2545] text-amber-400 flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0b2545] font-['Outfit']">
            Administrator Portal
          </h1>
          <p className="text-xs text-slate-600">
            Secure backend login for JANGRA NIOS SERVICES admission officers & managers.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Username / Email
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:bg-white focus:outline-hidden focus:border-[#0b2545]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Master Password
              </label>
              <input
                type="password"
                required
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
              className="w-full py-3.5 bg-[#0b2545] hover:bg-slate-900 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all"
            >
              {isLoggingIn ? 'Authenticating...' : 'Sign In as Administrator'}
            </button>
          </form>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500">
            <strong>Default Credentials:</strong><br/>
            Username: <code className="text-blue-900 font-mono">admin@jangranios.com</code><br/>
            Password: <code className="text-blue-900 font-mono">admin123</code>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED ADMINISTRATOR DASHBOARD
  // -------------------------------------------------------------
  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.studentId.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.mobile.includes(studentSearch)
  );

  const filteredAdmissions = admissionFilter === 'All'
    ? admissions
    : admissions.filter(a => a.status === admissionFilter);

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      
      {/* Top Header Bar */}
      <div className="bg-[#0b2545] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-4 border-amber-400 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Master Administrator Control Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-['Outfit']">
            JANGRA NIOS Administration
          </h1>
          <p className="text-xs text-slate-300">
            Logged in as Super Admin · Complete control over admissions, KYC documents, subscriptions & website CMS.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={loadAllAdminData}
            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/20"
            title="Refresh All Records"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span>Refresh</span>
          </button>

          <button
            onClick={onAdminLogout}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: Layers },
          { id: 'admissions', label: 'Admission Applications', icon: FileText, count: admissions.length },
          { id: 'students', label: 'Student Management', icon: Users, count: students.length },
          { id: 'subscriptions', label: 'Subscription & Plans', icon: CreditCard },
          { id: 'website', label: 'Website CMS & Notices', icon: Settings },
          { id: 'reports', label: 'Reports & CSV Export', icon: Download }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeAdminTab === tab.id
                  ? 'bg-white text-[#0b2545] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4 text-amber-500" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Registered Students</span>
              <div className="text-2xl sm:text-3xl font-black text-[#0b2545]">
                {stats?.totalStudents || students.length}
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">All active & enrolled</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">New Applications</span>
              <div className="text-2xl sm:text-3xl font-black text-amber-600">
                {stats?.newApplications || admissions.filter(a => a.status === 'Submitted').length}
              </div>
              <span className="text-[11px] text-amber-700 font-medium">Awaiting document check</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Approved Applications</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-700">
                {stats?.approvedApplications || admissions.filter(a => a.status === 'Documents Approved' || a.status === 'Enrolled').length}
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">Verified & enrolled</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Verified Payments</span>
              <div className="text-2xl sm:text-3xl font-black text-[#0b2545]">
                ₹{(stats?.totalVerifiedPayments || payments.reduce((sum, p) => sum + p.amount, 0)).toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">{payments.length} verified transactions</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pending Applications</span>
              <div className="text-2xl font-black text-amber-700">
                {stats?.pendingApplications || 0}
              </div>
              <span className="text-[11px] text-slate-500">Under counselor review</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Subscriptions</span>
              <div className="text-2xl font-black text-blue-900">
                {stats?.activeSubscriptions || 2}
              </div>
              <span className="text-[11px] text-slate-500">Currently valid access</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Public Exam Entries</span>
              <div className="text-2xl font-black text-slate-900">
                {stats?.totalPublicExams || 1}
              </div>
              <span className="text-[11px] text-slate-500">Upcoming cycle</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Contact Inquiries</span>
              <div className="text-2xl font-black text-slate-900">
                {inquiries.length}
              </div>
              <span className="text-[11px] text-slate-500">Website leads</span>
            </div>

          </div>

          {/* Recent Inquiries List */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[#0b2545] font-['Outfit']">
              Recent Website Inquiries & Leads
            </h3>
            {inquiries.length === 0 ? (
              <p className="text-xs text-slate-500">No contact submissions received yet.</p>
            ) : (
              <div className="space-y-3">
                {inquiries.slice(0, 5).map(inq => (
                  <div key={inq.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900">{inq.name} · {inq.mobile}</strong>
                      <span className="text-slate-400 text-[11px]">{new Date(inq.submittedAt).toLocaleString()}</span>
                    </div>
                    <div className="text-amber-800 font-semibold">{inq.subject}</div>
                    <p className="text-slate-600">{inq.message}</p>
                    <div className="pt-2 flex gap-2">
                      <a
                        href={`https://wa.me/${inq.mobile.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(inq.name)},%20this%20is%20JANGRA%20NIOS%20SERVICES%20replying%20to%20your%20inquiry.`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[11px] font-bold"
                      >
                        Reply on WhatsApp
                      </a>
                      <a
                        href={`tel:${inq.mobile}`}
                        className="px-2.5 py-1 bg-blue-900 text-white rounded text-[11px] font-bold"
                      >
                        Call Student
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ADMISSION APPLICATIONS MANAGEMENT */}
      {activeAdminTab === 'admissions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#0b2545]">
                Admission Applications & Document Verification
              </h2>
              <p className="text-xs text-slate-500">
                Review submitted personal details, view 4 KYC document boxes, approve or reject applications.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Filter by Status:</span>
              <select
                value={admissionFilter}
                onChange={e => setAdmissionFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold"
              >
                <option value="All">All Applications</option>
                <option value="Submitted">Submitted (New)</option>
                <option value="Under Verification">Under Verification</option>
                <option value="Documents Approved">Documents Approved</option>
                <option value="Enrolled">Enrolled</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4 font-semibold">Ref No.</th>
                    <th className="py-3 px-4 font-semibold">Candidate</th>
                    <th className="py-3 px-4 font-semibold">Course & Medium</th>
                    <th className="py-3 px-4 font-semibold">Mobile</th>
                    <th className="py-3 px-4 font-semibold">Documents (4 Boxes)</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAdmissions.map(adm => (
                    <tr key={adm.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-900">
                        {adm.applicationNumber}
                      </td>
                      <td className="py-3 px-4">
                        <strong className="text-slate-900 block">{adm.fullName}</strong>
                        <span className="text-slate-400 text-[10px]">DOB: {adm.dob}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 block">{adm.courseAppliedFor}</span>
                        <span className="text-[10px] text-slate-500">{adm.studyMedium} Medium</span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {adm.mobile}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span title="Photograph" className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${adm.documents?.photo ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                            P
                          </span>
                          <span title="Signature" className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${adm.documents?.signature ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                            S
                          </span>
                          <span title="Aadhaar Card" className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${adm.documents?.aadhaar ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-400'}`}>
                            A
                          </span>
                          <span title="Previous Marksheet" className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${adm.documents?.qualification ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                            Q
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                          {adm.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedAdmission(adm)}
                          className="px-3 py-1.5 bg-[#0b2545] text-amber-400 hover:text-white text-xs font-bold rounded-lg transition-colors"
                        >
                          Review KYC & Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Review Admission Modal */}
      {selectedAdmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Application Review</span>
                <h3 className="text-xl font-bold text-[#0b2545] font-['Outfit']">
                  {selectedAdmission.fullName} ({selectedAdmission.applicationNumber})
                </h3>
              </div>
              <button
                onClick={() => setSelectedAdmission(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Candidate Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div><span className="text-slate-400 block">Father:</span> <strong>{selectedAdmission.fatherName}</strong></div>
              <div><span className="text-slate-400 block">Mother:</span> <strong>{selectedAdmission.motherName}</strong></div>
              <div><span className="text-slate-400 block">DOB:</span> <strong>{selectedAdmission.dob}</strong></div>
              <div><span className="text-slate-400 block">Category:</span> <strong>{selectedAdmission.category}</strong></div>
              <div><span className="text-slate-400 block">Course:</span> <strong>{selectedAdmission.courseAppliedFor}</strong></div>
              <div><span className="text-slate-400 block">Medium:</span> <strong>{selectedAdmission.studyMedium}</strong></div>
              <div><span className="text-slate-400 block">Mobile:</span> <strong>{selectedAdmission.mobile}</strong></div>
              <div><span className="text-slate-400 block">Email:</span> <strong>{selectedAdmission.email || 'N/A'}</strong></div>
              <div className="sm:col-span-4"><span className="text-slate-400 block">Address:</span> <span>{selectedAdmission.address}</span></div>
            </div>

            {/* Documents Preview Box */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Submitted Documents:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Photo */}
                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <strong>1. Photograph</strong>
                    <div className="text-[11px] text-slate-500">{selectedAdmission.documents?.photo?.fileName || 'Uploaded'}</div>
                  </div>
                  {selectedAdmission.documents?.photo?.dataUrl ? (
                    <button
                      onClick={() => setSelectedDocPreview({
                        title: 'Student Photograph',
                        dataUrl: selectedAdmission.documents!.photo!.dataUrl,
                        type: 'image'
                      })}
                      className="px-2.5 py-1 bg-blue-50 text-blue-900 rounded font-semibold text-xs"
                    >
                      View
                    </button>
                  ) : <span className="text-slate-400">Attached</span>}
                </div>

                {/* Signature */}
                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <strong>2. Signature</strong>
                    <div className="text-[11px] text-slate-500">{selectedAdmission.documents?.signature?.fileName || 'Uploaded'}</div>
                  </div>
                  {selectedAdmission.documents?.signature?.dataUrl ? (
                    <button
                      onClick={() => setSelectedDocPreview({
                        title: 'Student Signature',
                        dataUrl: selectedAdmission.documents!.signature!.dataUrl,
                        type: 'image'
                      })}
                      className="px-2.5 py-1 bg-blue-50 text-blue-900 rounded font-semibold text-xs"
                    >
                      View
                    </button>
                  ) : <span className="text-slate-400">Attached</span>}
                </div>

                {/* Aadhaar (Sensitive Access Protected) */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                  <div>
                    <strong className="text-blue-900 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> 3. Aadhaar Card (Restricted)
                    </strong>
                    <div className="text-[11px] text-blue-700">{selectedAdmission.documents?.aadhaar?.fileName || 'Official Aadhaar Record'}</div>
                  </div>
                  {selectedAdmission.documents?.aadhaar?.dataUrl ? (
                    <button
                      onClick={() => setSelectedDocPreview({
                        title: 'Aadhaar Card (Restricted Administrative Access)',
                        dataUrl: selectedAdmission.documents!.aadhaar!.dataUrl,
                        type: 'document'
                      })}
                      className="px-2.5 py-1 bg-[#0b2545] text-amber-400 rounded font-bold text-xs"
                    >
                      Authorize & View
                    </button>
                  ) : <span className="text-emerald-700 font-bold">Securely Stored</span>}
                </div>

                {/* Marksheet */}
                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <strong>4. Previous Marksheet</strong>
                    <div className="text-[11px] text-slate-500">{selectedAdmission.documents?.qualification?.fileName || 'Academic Record'}</div>
                  </div>
                  {selectedAdmission.documents?.qualification?.dataUrl ? (
                    <button
                      onClick={() => setSelectedDocPreview({
                        title: 'Previous Qualification Proof',
                        dataUrl: selectedAdmission.documents!.qualification!.dataUrl,
                        type: 'document'
                      })}
                      className="px-2.5 py-1 bg-blue-50 text-blue-900 rounded font-semibold text-xs"
                    >
                      View
                    </button>
                  ) : <span className="text-slate-400">Attached</span>}
                </div>
              </div>
            </div>

            {/* Counselor Note Editor & Decision Buttons */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-semibold text-slate-700">
                Official Remark / AI Study Center Allocation Notes
              </label>
              <textarea
                id="admin-notes-input"
                defaultValue={selectedAdmission.adminNotes || ''}
                rows={2}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs"
                placeholder="e.g. All documents verified. Assigned to AI Center 270142 Rohini. Admission confirmed."
              />

              <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    const notes = (document.getElementById('admin-notes-input') as HTMLTextAreaElement)?.value;
                    handleUpdateAdmissionStatus(selectedAdmission.id, 'Rejected', notes);
                  }}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold rounded-xl"
                >
                  Reject Application
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const notes = (document.getElementById('admin-notes-input') as HTMLTextAreaElement)?.value;
                    handleUpdateAdmissionStatus(selectedAdmission.id, 'Documents Approved', notes);
                  }}
                  className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 text-xs font-bold rounded-xl"
                >
                  Approve Documents
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const notes = (document.getElementById('admin-notes-input') as HTMLTextAreaElement)?.value;
                    handleUpdateAdmissionStatus(selectedAdmission.id, 'Enrolled', notes);
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Confirm & Mark Enrolled
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Lightbox */}
      {selectedDocPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-bold text-sm text-[#0b2545]">{selectedDocPreview.title}</h4>
              <button
                onClick={() => setSelectedDocPreview(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="max-h-96 overflow-auto flex items-center justify-center bg-slate-100 rounded-xl p-3">
              {selectedDocPreview.dataUrl.startsWith('data:image') || selectedDocPreview.dataUrl.endsWith('.jpg') || selectedDocPreview.dataUrl.endsWith('.png') ? (
                <img
                  src={selectedDocPreview.dataUrl}
                  alt="Document preview"
                  className="max-h-80 max-w-full object-contain rounded"
                />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <FileText className="w-12 h-12 text-blue-900 mx-auto" />
                  <p className="text-xs text-slate-600">Document data stream loaded.</p>
                  <a
                    href={selectedDocPreview.dataUrl}
                    download="document"
                    className="px-3 py-1.5 bg-[#0b2545] text-white text-xs font-bold rounded"
                  >
                    Download File
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STUDENT MANAGEMENT */}
      {activeAdminTab === 'students' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#0b2545]">
                Registered Students Directory
              </h2>
              <p className="text-xs text-slate-500">
                Manage accounts, reset passwords, activate/deactivate access, and extend learning subscriptions.
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by name, ID or mobile..."
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs w-64 focus:outline-hidden focus:border-[#0b2545]"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4 font-semibold">Student ID</th>
                    <th className="py-3 px-4 font-semibold">Student Name</th>
                    <th className="py-3 px-4 font-semibold">Mobile</th>
                    <th className="py-3 px-4 font-semibold">App Ref</th>
                    <th className="py-3 px-4 font-semibold">Subscription</th>
                    <th className="py-3 px-4 font-semibold">Account State</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map(stu => (
                    <tr key={stu.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-900">
                        {stu.studentId}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {stu.fullName}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {stu.mobile}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {stu.applicationNumber}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          stu.subscriptionStatus === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {stu.subscriptionPlanName || 'None'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          stu.isActive ? 'text-emerald-700' : 'text-red-700 bg-red-50'
                        }`}>
                          {stu.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleResetPassword(stu.studentId)}
                          className="px-2.5 py-1 text-slate-700 hover:text-blue-900 bg-slate-100 hover:bg-slate-200 rounded font-semibold text-[11px]"
                          title="Reset student password"
                        >
                          Reset Pass
                        </button>
                        <button
                          onClick={() => handleExtendStudentSub(stu.studentId)}
                          className="px-2.5 py-1 text-amber-900 bg-amber-100 hover:bg-amber-200 rounded font-semibold text-[11px]"
                          title="Extend validity"
                        >
                          + Extend Sub
                        </button>
                        <button
                          onClick={() => handleToggleStudent(stu.id, stu.isActive)}
                          className={`px-2.5 py-1 rounded font-semibold text-[11px] ${
                            stu.isActive ? 'text-red-700 bg-red-50 hover:bg-red-100' : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                          }`}
                        >
                          {stu.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SUBSCRIPTION & PLANS MANAGEMENT */}
      {activeAdminTab === 'subscriptions' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-[#0b2545]">
              Subscription Plans & Fee Management
            </h2>
            <p className="text-xs text-slate-500">
              Manage student study package prices, durations, perks, and view payment transaction history.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map(plan => (
              <div key={plan.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <strong className="text-base font-bold text-slate-900">{plan.name}</strong>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {plan.durationLabel}
                  </span>
                </div>

                <div className="text-2xl font-black text-[#0b2545]">
                  ₹{plan.price.toLocaleString('en-IN')}
                </div>

                <p className="text-xs text-slate-600">{plan.description}</p>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                  <div>Validity: <strong>{plan.durationDays} Days</strong></div>
                  <div>Features: {plan.features.length} study items included</div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className={`text-[11px] font-bold ${plan.isActive ? 'text-emerald-700' : 'text-red-600'}`}>
                    {plan.isActive ? 'Active' : 'Disabled'}
                  </span>
                  <button
                    onClick={async () => {
                      const newPrice = prompt(`Enter new price for "${plan.name}":`, String(plan.price));
                      if (newPrice && !isNaN(Number(newPrice))) {
                        await api.updatePlan(plan.id, { price: Number(newPrice) });
                        loadAllAdminData();
                      }
                    }}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
                  >
                    Edit Price
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Transactions List */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[#0b2545] font-['Outfit']">
              Verified Payment Records & Receipts
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b text-slate-500 uppercase text-[10px]">
                    <th className="p-3">Receipt No</th>
                    <th className="p-3">Transaction ID</th>
                    <th className="p-3">Candidate</th>
                    <th className="p-3">Plan</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map(pay => (
                    <tr key={pay.id}>
                      <td className="p-3 font-mono font-bold text-blue-900">{pay.receiptNumber}</td>
                      <td className="p-3 font-mono text-slate-600">{pay.transactionId}</td>
                      <td className="p-3 font-semibold text-slate-900">{pay.studentName} ({pay.studentId})</td>
                      <td className="p-3">{pay.planName}</td>
                      <td className="p-3 font-bold text-emerald-800">₹{pay.amount}</td>
                      <td className="p-3"><span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold">{pay.paymentMethod}</span></td>
                      <td className="p-3 text-slate-500">{new Date(pay.paidAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: WEBSITE CMS & NOTICES */}
      {activeAdminTab === 'website' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-[#0b2545]">
              Website Content Management (CMS)
            </h2>
            <p className="text-xs text-slate-500">
              Edit homepage banners, announcement tickers, photo gallery, and course catalog.
            </p>
          </div>

          {/* 1. Announcements Management */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-[#0b2545] font-['Outfit'] flex items-center gap-2">
              <BellRing className="w-5 h-5 text-amber-500" />
              <span>Announcements & Datesheet Board</span>
            </h3>

            {/* Add Announcement Form */}
            <form onSubmit={handleAddAnnouncement} className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="sm:col-span-6">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NIOS April 2026 Examination Hall Tickets Released"
                  value={newNoticeTitle}
                  onChange={e => setNewNoticeTitle(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={newNoticeCategory}
                  onChange={e => setNewNoticeCategory(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs"
                >
                  <option value="Admission">Admission</option>
                  <option value="Exam">Exam</option>
                  <option value="Results">Results</option>
                  <option value="TMA">TMA</option>
                  <option value="Practical">Practical</option>
                </select>
              </div>

              <div className="sm:col-span-3 flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-[#0b2545] text-amber-400 font-bold rounded-lg text-xs hover:bg-slate-900 transition-colors"
                >
                  + Publish Notice
                </button>
              </div>

              <div className="sm:col-span-12">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Notice Content / Link Information</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Full announcement details..."
                  value={newNoticeContent}
                  onChange={e => setNewNoticeContent(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs"
                />
              </div>
            </form>

            {/* List Announcements */}
            <div className="space-y-2">
              {announcements.map(ann => (
                <div key={ann.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[10px]">
                        {ann.category}
                      </span>
                      <strong className="text-slate-900">{ann.title}</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{ann.content}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteAnnouncement(ann.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600"
                    title="Remove notice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Photo Gallery Management */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-[#0b2545] font-['Outfit'] flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-500" />
              <span>Campus & Event Photo Gallery</span>
            </h3>

            <form onSubmit={handleAddGallery} className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="sm:col-span-4">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Photo Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Lab Session"
                  value={newGalleryTitle}
                  onChange={e => setNewGalleryTitle(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div className="sm:col-span-5">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Image URL / Path</label>
                <input
                  type="text"
                  required
                  placeholder="/src/assets/images/... or URL"
                  value={newGalleryUrl}
                  onChange={e => setNewGalleryUrl(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono"
                />
              </div>

              <div className="sm:col-span-3 flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-[#0b2545] text-amber-400 font-bold rounded-lg text-xs"
                >
                  + Add to Gallery
                </button>
              </div>
            </form>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {gallery.map(item => (
                <div key={item.id} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between text-white text-xs">
                    <span className="font-bold truncate">{item.title}</span>
                    <button
                      onClick={() => handleDeleteGallery(item.id)}
                      className="self-end p-1.5 bg-red-600 rounded text-white"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Site Settings Form (Phone, Email, Hours, Hero Heading) */}
          {siteSettings && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-[#0b2545] font-['Outfit']">
                Organization Information & Contact Numbers
              </h3>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Business Name</label>
                    <input
                      type="text"
                      value={siteSettings.businessName}
                      onChange={e => setSiteSettings({ ...siteSettings, businessName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Official Mobile / Helpline</label>
                    <input
                      type="text"
                      value={siteSettings.phone}
                      onChange={e => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email Address</label>
                    <input
                      type="email"
                      value={siteSettings.email}
                      onChange={e => setSiteSettings({ ...siteSettings, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Working Hours</label>
                    <input
                      type="text"
                      value={siteSettings.workingHours}
                      onChange={e => setSiteSettings({ ...siteSettings, workingHours: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Main Heading</label>
                    <input
                      type="text"
                      value={siteSettings.heroHeading}
                      onChange={e => setSiteSettings({ ...siteSettings, heroHeading: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Subheading</label>
                    <input
                      type="text"
                      value={siteSettings.heroSubheading}
                      onChange={e => setSiteSettings({ ...siteSettings, heroSubheading: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Office Address</label>
                    <input
                      type="text"
                      value={siteSettings.address}
                      onChange={e => setSiteSettings({ ...siteSettings, address: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs uppercase"
                  >
                    Save Website Content Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: REPORTS & CSV EXPORT */}
      {activeAdminTab === 'reports' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#0b2545]">
              Reports & Excel Data Exports
            </h2>
            <p className="text-xs text-slate-500">
              Download clean CSV spreadsheets compatible with Microsoft Excel and Google Sheets for audit, accounts, and official records.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Student Directory Report</h3>
              <p className="text-xs text-slate-500">Complete list of registered students, mobile numbers, application numbers, and subscription statuses.</p>
              <a
                href="/api/reports/students-csv"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0b2545] text-amber-400 font-bold rounded-xl text-xs hover:bg-slate-900"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Students (CSV)</span>
              </a>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Admission Applications Report</h3>
              <p className="text-xs text-slate-500">Full candidate details, course applied for, mediums, parent names, categories, and verification decisions.</p>
              <a
                href="/api/reports/admissions-csv"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0b2545] text-amber-400 font-bold rounded-xl text-xs hover:bg-slate-900"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Admissions (CSV)</span>
              </a>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Fee Payments & Accounts Report</h3>
              <p className="text-xs text-slate-500">Receipt numbers, transaction IDs, payment methods (UPI/Razorpay), amounts, and timestamps.</p>
              <a
                href="/api/reports/payments-csv"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0b2545] text-amber-400 font-bold rounded-xl text-xs hover:bg-slate-900"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Payments (CSV)</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
