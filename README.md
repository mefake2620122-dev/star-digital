# STAR DIGITAL — Premium Appliance Service Platform

A production-grade, Apple-inspired appliance repair and home-service web platform built for **STAR DIGITAL** (Civil Lines / Power House, Kanpur, Uttar Pradesh, India).

---

## 🌟 Overview & Architecture

STAR DIGITAL delivers high-reliability doorstep diagnostics, repair, preventive jet servicing, and installation across Kanpur for:
1. **Air Conditioners (AC)**: Split, Window, Inverter units
2. **Refrigerators**: Single Door, Double Door, Side-by-Side Inverters
3. **Washing Machines**: Front Load, Top Load, Semi-Automatic
4. **LED / LCD Televisions**: 4K Smart TVs, QLED/OLED, Panel & Backlight repairs, Wall mounting
5. **CCTV Security Systems**: HD Bullet/Dome cameras, NVR/DVR setups, Mobile viewing configuration
6. **Other Appliances**: Microwave Ovens, RO Purifiers, Electric Water Geysers

### 🍎 Apple Human Interface Guidelines (HIG) Design System
- **Strict Typography Scale**: San Francisco (SF Pro) / Inter font stack with optical hierarchy
- **Restrained Spatial System**: 8px spatial grid with generous breathing room
- **Depth & Materials**: Subtle borders (`rgba(15,23,42,0.08)`), soft elevation shadows, and frosted glass navigation
- **Tactile Interactions**: Spring-damped button press physics (`active:scale-[0.98]`)
- **Mobile-First UX**: Dedicated bottom sticky conversion bar with direct `Call Now` and `WhatsApp` triggers

---

## 📁 Repository Structure

```
day1/
├── frontend/                     # React + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── api/                  # REST API client
│   │   ├── components/           # Apple HIG UI components (Button, Badge, Map, Navbar, etc.)
│   │   ├── config/               # Centralized site & contact configuration
│   │   ├── context/              # Toast context & providers
│   │   ├── layouts/              # MainLayout shell
│   │   ├── pages/                # 10 comprehensive pages
│   │   ├── sections/             # Modular homepage sections
│   │   └── types/                # TypeScript interfaces
│   ├── public/                   # Favicon, robots.txt, sitemap.xml
│   └── package.json
│
├── backend/                      # Node.js + TypeScript + Express + Prisma ORM
│   ├── prisma/
│   │   ├── schema.prisma         # Prisma schema (SQLite dev / PostgreSQL prod)
│   │   └── seed.ts               # Database seed script for Kanpur services
│   ├── src/
│   │   ├── config/               # Environment configuration
│   │   ├── controllers/          # HTTP request handlers
│   │   ├── db/                   # Prisma client singleton
│   │   ├── middleware/           # Rate limiting, validation, error handling
│   │   ├── repositories/         # Database access layer
│   │   ├── routes/               # /api/v1 versioned routes
│   │   ├── services/             # Business logic & notification dispatch
│   │   └── validators/           # Zod schema validators
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### 1. Backend Setup
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
npm run build
npm start
```
Backend API will be running at `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run build
npm run dev
```
Frontend application will be accessible at `http://localhost:5173`.

---

## 📡 REST API Endpoints (`/api/v1`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/services` | List all active appliance repair services |
| `GET` | `/api/v1/services/:slug` | Retrieve single service detail with issues & categories |
| `GET` | `/api/v1/services/:slug/issues` | Retrieve common issues for an appliance |
| `GET` | `/api/v1/service-areas` | List supported Kanpur localities and arrival times |
| `GET` | `/api/v1/faqs` | Frequently asked questions |
| `GET` | `/api/v1/reviews` | Verified customer testimonials (CMS managed) |
| `POST` | `/api/v1/service-requests` | Register a new doorstep service booking |
| `GET` | `/api/v1/service-requests/:id` | Check status of a booking by Request ID |
| `POST` | `/api/v1/contact` | Submit general customer support inquiry |
| `GET` | `/api/v1/business/contact` | Centralized business address, phone, and coordinates |
| `GET` | `/api/v1/health` | Service uptime and status check |

---

## 🛡️ Security & Reliability
- **Input Validation**: All POST payloads validated via strict Zod schemas
- **Security Headers**: Helmet enabled with secure CORS policies
- **Rate Limiting**: In-memory IP request throttle on booking and contact submissions
- **Data Protection**: Zero hardcoded credentials; all secrets stored in `.env`
- **Zero Fake Claims**: Testimonials and facts are strictly marked as configurable CMS placeholders as per compliance rules.
