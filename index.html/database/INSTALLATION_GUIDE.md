# JANGRA NIOS SERVICES – Complete Installation & Deployment Guide

This document provides step-by-step, beginner-friendly instructions to install, run, and host the **JANGRA NIOS SERVICES** educational website and student management portal.

---

## 1. System Requirements

- **Node.js**: v18.0.0 or higher (v20+ Recommended)
- **NPM**: v9.0.0 or higher
- **MySQL Database**: v5.7+ or v8.0+ / MariaDB (Optional for relational deployment; system includes an automated high-performance JSON persistence engine for zero-config startup)
- **Modern Web Browser**: Chrome, Firefox, Safari, Edge

---

## 2. Local Setup & Running on Your Computer

### Step A: Clone or Download the Project Files
Extract the project folder onto your computer (e.g., `C:\projects\jangra-nios-services` or `~/projects/jangra-nios-services`).

### Step B: Open Terminal / Command Prompt
Navigate to the project root:
```bash
cd jangra-nios-services
```

### Step C: Install Dependencies
```bash
npm install
```

### Step D: Start the Full-Stack Application
```bash
npm run dev
```
The server will start on: **`http://localhost:3000`**

Open your web browser and navigate to `http://localhost:3000` to view the website, submit admission applications, make test payments, or access the portals.

---

## 3. Default Login Credentials

### Administrator Portal
- **URL**: `http://localhost:3000` -> Click **Admin Portal** or navigate to Admin tab
- **Username**: `admin@jangranios.com`
- **Password**: `admin123`
*(You can change the admin password at any time inside the Admin Settings tab)*

### Demo Student Accounts (Pre-configured)
1. **Student 1 (Class 10th)**
   - **Student ID**: `STU-99214` (or Mobile: `9876543210`)
   - **Password**: `Temp@99214`
2. **Student 2 (Class 12th)**
   - **Student ID**: `STU-99215` (or Mobile: `9811234567`)
   - **Password**: `Temp@99215`

*Note: Whenever a new student submits the Online Admission form, the system automatically generates their unique Student ID and temporary password displayed on screen and stored in the database.*

---

## 4. Setting up MySQL (Optional for External SQL Server)

If your institution uses a dedicated MySQL server:

1. Open **phpMyAdmin** or your MySQL command line client.
2. Create a new database:
   ```sql
   CREATE DATABASE jangra_nios_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Import the file located at:
   ```
   /database/schema.sql
   ```
4. Configure your `.env` file with your credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=jangra_nios_db
   PORT=3000
   ```

---

## 5. Deployment to Live Hosting Server

### Option A: Hosting on cPanel (with Node.js Selector)
1. Log in to your **cPanel**.
2. Go to **Setup Node.js App**.
3. Click **Create Application**:
   - Node.js version: Select **20.x** or higher.
   - Application mode: **Production**.
   - Application root: `public_html` (or your subdomain folder).
   - Application startup file: `server.ts` (or `dist/server.js`).
4. Upload all project files via FTP or File Manager.
5. In cPanel terminal or SSH:
   ```bash
   npm install
   npm run build
   ```
6. Click **Restart** in the Node.js selector panel.

### Option B: Hosting on Cloud VPS (Ubuntu / Debian / AWS / DigitalOcean)
1. Connect via SSH to your server.
2. Install Node.js and PM2:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```
3. Copy project files and install dependencies:
   ```bash
   cd /var/www/jangra-nios
   npm install
   npm run build
   ```
4. Start process manager with PM2:
   ```bash
   pm2 start server.ts --name "jangra-nios" --interpreter tsx
   pm2 save
   pm2 startup
   ```
5. Configure Nginx Reverse Proxy:
   ```nginx
   server {
       listen 80;
       server_name jangranios.com www.jangranios.com;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           client_max_body_size 25M;
       }
   }
   ```
6. Issue free SSL with Let's Encrypt:
   ```bash
   sudo certbot --nginx -d jangranios.com -d www.jangranios.com
   ```

---

## 6. Official Institute Contact

- **Helpline / WhatsApp**: `+91-9968834276`
- **Official Email**: `jangraeducationalservices@gmail.com`
- **Advisory Office**: Plot No. 42, Sector 14 Educational Hub, Rohini, Near Metro Pillar 324, New Delhi - 110085
