# CyberShield AI

CyberShield AI is a hackathon MVP frontend for detecting digital fraud, scam messages, phishing URLs, suspicious screenshots, and email-based cyber threats.

It provides a modern cybersecurity command center where users can review suspicious content, understand the risk level, view red flags, and take direct safety action.

## 🚀 Overview

CyberShield AI is designed to protect everyday users from digital fraud by offering a simple and visual way to analyze suspicious content such as:

- Scam SMS and WhatsApp messages
- Phishing URLs
- Fraud emails
- Suspicious screenshots
- Fake KYC or OTP messages
- Digital fraud indicators

The current version is a frontend prototype built for hackathon demonstration purposes.

## 🎯 Problem Statement

Online scams, fake banking messages, phishing links, OTP fraud, and impersonation attacks are becoming increasingly common. Many users are unable to quickly identify whether a message, link, or email is dangerous.

CyberShield AI solves this by giving users a clean dashboard to detect possible fraud signals and understand what action they should take next.

## ✨ Key Features

- Professional dark cybersecurity dashboard
- CyberShield Command Center interface
- Message scam analyzer page
- URL phishing scanner page
- Screenshot scanner page
- Email scanner page
- Threat intelligence page
- Scan history page
- Analytics dashboard
- Reports section
- Threat score visualization
- Red flags detection panel
- Recommended action section
- Direct cybercrime reporting button
- Notification dropdown
- Theme dropdown
- Workspace dropdown
- Sidebar profile dropdown
- Interactive dashboard feature cards
- Responsive sidebar navigation
- Modern SaaS-style UI

## 🧠 Core User Flow

```txt
User opens CyberShield AI
        ↓
Selects message, URL, screenshot, or email scanner
        ↓
Submits suspicious content
        ↓
System displays threat score
        ↓
System shows red flags and explanation
        ↓
User gets recommended action
        ↓
User can directly report to the cybercrime portal
```

## 🛠️ Tech Stack

- React
- Vite
- Tailwind CSS
- React Router DOM
- Lucide React Icons

## 📁 Project Structure

```txt
CYBERSHIELD/
├── public/
│   ├── favicon.ico
│   └── logo.png
│
├── src/
│   ├── app/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── logos/
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   └── Topbar.jsx
│   │   ├── dashboard/
│   │   └── common/
│   │
│   ├── layouts/
│   │   └── MainLayout.jsx
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── MessageAnalyzer.jsx
│   │   ├── UrlScanner.jsx
│   │   ├── ScreenshotScanner.jsx
│   │   ├── EmailScanner.jsx
│   │   ├── ThreatIntelligence.jsx
│   │   ├── Reports.jsx
│   │   ├── History.jsx
│   │   ├── Analytics.jsx
│   │   ├── Settings.jsx
│   │   └── NotFound.jsx
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── services/
│   ├── hooks/
│   ├── utils/
│   ├── data/
│   └── styles/
│       └── global.css
│
├── .env
├── .gitignore
├── README.md
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 📌 Main Pages

### Dashboard

Main CyberShield command center with quick actions, threat score preview, red flags, recent scans, safety score, reports, and analytics widgets.

### Message Analyzer

Allows users to paste suspicious SMS, WhatsApp messages, or text content for scam detection flow.

### URL Scanner

Provides a dedicated interface for checking suspicious URLs and phishing links.

### Screenshot Scanner

Designed for uploading screenshots of suspicious chats, payment requests, or fraud messages.

### Email Scanner

Allows suspicious email content to be reviewed for phishing and fraud signals.

### Threat Intelligence

Shows common scam patterns, suspicious indicators, and fraud-related insights.

### History

Displays previous scans and their risk classifications.

### Analytics

Shows scan statistics, threat trends, and detection insights.

### Reports

Displays generated fraud analysis reports and future PDF export options.

### Settings

Contains prototype-level preferences for analysis and alerts.

## 🚨 Cybercrime Reporting Feature

CyberShield AI includes a direct reporting action that can navigate users to the official cybercrime reporting portal when a high-risk fraud case is detected.

This helps complete the user journey:

```txt
Detect Fraud → Understand Risk → Take Action → Report Incident
```

For financial cyber fraud, users may also contact the national cyber fraud helpline number `1930`.

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/your-username/CYBERSHIELD.git
```

Move into the project folder:

```bash
cd CYBERSHIELD
```
```bash
cd backend
```
Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```
```bash
cd frontend
```
Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the project in your browser:

```txt
http://localhost:5173
```

## 📦 Dependencies

Install required packages if needed:

```bash
npm install react-router-dom lucide-react
```

Tailwind CSS is used for styling with the Vite setup.

## 🧪 MVP Status

This project is currently a frontend hackathon MVP.

Current focus:

- Professional UI/UX
- Cybersecurity dashboard experience
- Page navigation
- Static scan previews
- Threat score interface
- Red flag panels
- Report action flow

Not yet implemented:

- Real AI API integration
- Real backend
- Database storage
- User authentication
- Real OCR analysis
- Real PDF generation

## 🔮 Future Scope

- Gemini API integration for message analysis
- Google Safe Browsing API integration for URL checks
- OCR-based screenshot analysis
- PDF report generation
- MongoDB scan history
- Firebase authentication
- Hindi and Hinglish scam detection
- WhatsApp bot integration
- Browser extension
- Cybercrime report prefill flow
- Real-time threat intelligence feed

## 🧑‍💻 Team Deep Logic

- **Mudasir Bashir Ganaie** — Complete Frontend Development
- **Dhiraj Kumar** — Backend Development
- **Adarsh Mishra** — Presentation & Pitch

## 📜 License

This project is created for educational, demonstration, and hackathon purposes.
