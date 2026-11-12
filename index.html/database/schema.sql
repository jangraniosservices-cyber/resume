-- ==============================================================
-- JANGRA NIOS SERVICES - DATABASE SCHEMA (MySQL 5.7+ / 8.0+)
-- Complete relational database script for production deployment
-- ==============================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS contact_inquiries;
DROP TABLE IF EXISTS payment_transactions;
DROP TABLE IF EXISTS student_subscriptions;
DROP TABLE IF EXISTS subscription_plans;
DROP TABLE IF EXISTS admission_documents;
DROP TABLE IF EXISTS public_exam_entries;
DROP TABLE IF EXISTS admission_applications;
DROP TABLE IF EXISTS student_users;
DROP TABLE IF EXISTS gallery_images;
DROP TABLE IF EXISTS announcements;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS site_settings;
DROP TABLE IF EXISTS admin_users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Admin Users Table
CREATE TABLE admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'SUPER_ADMIN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Website Settings Table
CREATE TABLE site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  business_name VARCHAR(150) NOT NULL DEFAULT 'JANGRA NIOS SERVICES',
  tagline VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  whatsapp VARCHAR(50) NOT NULL,
  email VARCHAR(150) NOT NULL,
  address TEXT NOT NULL,
  working_hours VARCHAR(255) NOT NULL,
  hero_heading VARCHAR(255) NOT NULL,
  hero_subheading VARCHAR(255) NOT NULL,
  about_text LONGTEXT NOT NULL,
  mission LONGTEXT NOT NULL,
  vision LONGTEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Courses & Services Table
CREATE TABLE courses (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  code VARCHAR(50) NOT NULL,
  category ENUM('secondary', 'senior_secondary', 'assistance', 'guidance', 'materials') NOT NULL,
  short_desc TEXT NOT NULL,
  full_desc LONGTEXT NOT NULL,
  eligibility VARCHAR(255) NOT NULL,
  duration VARCHAR(100) NOT NULL,
  subjects_count VARCHAR(100) NOT NULL,
  fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  featured BOOLEAN DEFAULT FALSE,
  features_json JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Announcements & Notices Table
CREATE TABLE announcements (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  publish_date DATE NOT NULL,
  category ENUM('Admission', 'Exam', 'Results', 'TMA', 'Practical') NOT NULL,
  content LONGTEXT NOT NULL,
  is_urgent BOOLEAN DEFAULT FALSE,
  link_text VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Photo Gallery Table
CREATE TABLE gallery_images (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  category ENUM('Campus', 'Graduation', 'Labs', 'Counseling') DEFAULT 'Campus',
  image_url VARCHAR(500) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Students Registered Table
CREATE TABLE student_users (
  id VARCHAR(50) PRIMARY KEY,
  student_id VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150),
  mobile VARCHAR(20) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  application_number VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  subscription_plan_id VARCHAR(50),
  subscription_plan_name VARCHAR(100),
  subscription_expiry_date DATETIME,
  subscription_status ENUM('None', 'Active', 'Expired') DEFAULT 'None',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_student_mobile (mobile),
  INDEX idx_student_id (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Admission Applications Table
CREATE TABLE admission_applications (
  id VARCHAR(50) PRIMARY KEY,
  application_number VARCHAR(100) NOT NULL UNIQUE,
  student_id VARCHAR(50) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  dob DATE NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  father_name VARCHAR(150) NOT NULL,
  mother_name VARCHAR(150) NOT NULL,
  email VARCHAR(150),
  address TEXT NOT NULL,
  category ENUM('General', 'OBC', 'SC', 'ST', 'Other') NOT NULL DEFAULT 'General',
  previous_qualification VARCHAR(255),
  course_applied_for ENUM('NIOS Secondary (10th)', 'NIOS Senior Secondary (12th)') NOT NULL,
  study_medium ENUM('Hindi', 'English', 'Urdu', 'Other') NOT NULL DEFAULT 'Hindi',
  previous_school_board VARCHAR(255),
  status ENUM('Submitted', 'Under Verification', 'Documents Approved', 'Enrolled', 'Action Required', 'Rejected') NOT NULL DEFAULT 'Submitted',
  admin_notes TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_app_number (application_number),
  FOREIGN KEY (student_id) REFERENCES student_users(student_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Document Uploads Table (Secure Storage)
CREATE TABLE admission_documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id VARCHAR(50) NOT NULL,
  document_type ENUM('photo', 'signature', 'aadhaar', 'qualification') NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INT NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  storage_path_or_url LONGTEXT NOT NULL,
  status ENUM('Pending', 'Verified', 'Rejected') DEFAULT 'Pending',
  notes VARCHAR(255),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES admission_applications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Public Exam Registrations Table
CREATE TABLE public_exam_entries (
  id VARCHAR(50) PRIMARY KEY,
  registration_number VARCHAR(100) NOT NULL UNIQUE,
  full_name VARCHAR(150) NOT NULL,
  dob DATE NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  email VARCHAR(150),
  enrollment_number VARCHAR(100) NOT NULL,
  status ENUM('Received', 'Scheduled', 'Hall Ticket Ready') DEFAULT 'Received',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Subscription Plans Table
CREATE TABLE subscription_plans (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  duration_label VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2) NOT NULL,
  duration_days INT NOT NULL,
  description TEXT,
  features_json JSON,
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Payment Transactions Table
CREATE TABLE payment_transactions (
  id VARCHAR(50) PRIMARY KEY,
  transaction_id VARCHAR(100) NOT NULL UNIQUE,
  student_id VARCHAR(50) NOT NULL,
  student_name VARCHAR(150) NOT NULL,
  plan_id VARCHAR(50) NOT NULL,
  plan_name VARCHAR(150) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method ENUM('UPI', 'Razorpay', 'Card', 'NetBanking') NOT NULL,
  status ENUM('SUCCESS', 'PENDING', 'FAILED', 'REFUNDED') DEFAULT 'SUCCESS',
  paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  receipt_number VARCHAR(100) NOT NULL UNIQUE,
  notes VARCHAR(255),
  INDEX idx_pay_txn (transaction_id),
  INDEX idx_pay_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Contact Inquiries Table
CREATE TABLE contact_inquiries (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150),
  mobile VARCHAR(20) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  message LONGTEXT NOT NULL,
  status ENUM('Unread', 'Replied') DEFAULT 'Unread',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================
-- DEFAULT SEED DATA INSERTION
-- ==============================================================

-- Default Administrator (admin@jangranios.com / admin123)
-- SHA-256 for 'admin123': 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
INSERT INTO admin_users (username, password_hash, role) VALUES 
('admin@jangranios.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'SUPER_ADMIN');

-- Site Settings
INSERT INTO site_settings (id, business_name, tagline, phone, whatsapp, email, address, working_hours, hero_heading, hero_subheading, about_text, mission, vision)
VALUES (
  1,
  'JANGRA NIOS SERVICES',
  'Your Trusted Partner for NIOS Secondary & Senior Secondary Admissions',
  '+91-9968834276',
  '+91-9968834276',
  'jangraeducationalservices@gmail.com',
  'Plot No. 42, Sector 14 Educational Hub, Rohini, Near Metro Pillar 324, New Delhi - 110085, India',
  'Monday - Saturday: 9:00 AM - 7:00 PM (Sunday Closed for In-Person, WhatsApp open)',
  'Your Education, Your Future',
  'Learn Today, Succeed Tomorrow',
  'JANGRA NIOS SERVICES is a premier educational advisory institute dedicated to guiding students toward completing their Secondary (10th) and Senior Secondary (12th) qualifications through the National Institute of Open Schooling (NIOS).',
  'To empower every student, regardless of age, background, or previous academic setbacks, with accessible, recognized, and quality open schooling certification to unlock higher education and rewarding career paths.',
  'To be the most trusted, transparent, and student-centric NIOS educational consultancy in India, recognized for academic excellence, ethical counseling, and 100% student support.'
);

-- Default Subscription Plans
INSERT INTO subscription_plans (id, name, duration_label, price, original_price, duration_days, description, is_popular, is_active)
VALUES
('plan-monthly', 'Monthly Study Access', 'Monthly', 999.00, 1499.00, 30, 'Short-term revision and urgent TMA submission assistance.', 0, 1),
('plan-quarterly', 'Quarterly Exam Preparation', 'Quarterly', 2499.00, 3499.00, 90, 'Most selected plan for 3-month focused exam sprint and practical file guidance.', 1, 1),
('plan-half-yearly', 'Half-Yearly Full Term Plan', 'Half-Yearly', 4499.00, 5999.00, 180, 'Comprehensive coverage for one full examination cycle (April or October).', 0, 1),
('plan-annual', 'Annual Complete Pass (10th / 12th)', 'Annual', 7999.00, 11999.00, 365, 'Unrestricted year-round guidance from admission to result declaration.', 0, 1),
('plan-custom', 'Custom Individual Coaching Package', 'Custom', 12500.00, 16000.00, 365, 'Tailored 1-on-1 tutoring, rapid ODE preparation, and personalized road-mapping.', 0, 1);
