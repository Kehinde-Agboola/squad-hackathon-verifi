# TrustShield Frontend

AI-powered vendor verification platform for Nigeria. Complete Next.js 15 frontend with TypeScript, React Hook Form, Zustand, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js 15 app directory
│   ├── page.tsx           # Landing page
│   ├── login/page.tsx     # Login
│   ├── register/page.tsx  # Registration
│   ├── verify/page.tsx    # 5-step verification flow
│   └── dashboard/
│       ├── vendor/        # Vendor dashboard
│       └── admin/         # Admin dashboard
├── components/
│   ├── layout/            # TopNav, Sidebar, DashShell
│   ├── ui/                # Button, Badge, ScoreRing, etc.
│   ├── stepper/           # 5 verification steps
│   ├── vendor/            # Vendor dashboard panels
│   └── admin/             # Admin dashboard panels
├── store/                 # Zustand global state
├── services/              # API layer with Axios
├── hooks/                 # useToast, useVerification
├── constants/             # verifyTypes, DOCUMENT_TYPES
└── mocks/                 # Mock data for development
```

## 🎨 Design System

**Colors:**
- Primary: `#0B3D2E` (Deep Forest Green)
- Gold: `#C8973A`
- Danger: `#C0392B`
- Background: `#FAF8F4`

**Typography:**
- Display: Playfair Display
- Body: DM Sans

**Components:**
- Button (4 variants)
- Badge (5 status types)
- ScoreRing (animated SVG)
- MetricCard, SectionCard, Toast

## 📋 Features

### Pages

1. **Landing** (`/`)
   - Hero section with CTAs
   - Stats bar
   - Features grid
   - News callout

2. **Register** (`/register`)
   - Form validation with React Hook Form + Zod
   - Plan selection
   - Redirects to `/dashboard/vendor` on success

3. **Login** (`/login`)
   - Email/password authentication
   - Role-based redirect (vendor/admin)

4. **Verification Flow** (`/verify`)
   - Step 1: Choose type
   - Step 2: Select documents
   - Step 3: Upload files (drag-drop)
   - Step 4: Payment via Squad
   - Step 5: Real-time AI checks

5. **Vendor Dashboard** (`/dashboard/vendor`)
   - Overview (trust score, metrics)
   - Verifications (history, expandable details)
   - Documents (upload, download, delete)
   - Trust Badge (shareable, QR code)
   - Billing (plan, transactions)

6. **Admin Dashboard** (`/dashboard/admin`)
   - Overview (live metrics, recent activity)
   - All Vendors (searchable, scores)
   - Flagged (suspicious vendors, actions)
   - Squad Ledger (bonds, transactions)

## 🔧 API Integration

**Base Configuration:**
- Uses Axios with automatic token attachment
- 401 response triggers logout + redirect
- Centralized error handling

## 🔐 State Management

### useAuthStore (Zustand)
- `user`, `token`, `isAuthenticated`
- `login()`, `logout()`, `setUser()`
- Persists to localStorage

### useVerifyStore (Zustand)
- `step`, `selectedType`, `selectedDocs`, `uploadedFiles`
- `verificationId`, `checkProgress`, `trustScore`

## 🪝 Hooks

**useToast()** - Toast notifications with auto-dismiss
**useVerification()** - Polls status every 3 seconds

## 📦 Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SQUAD_PUBLIC_KEY=sandbox_pk_xxxx
NEXT_PUBLIC_APP_NAME=TrustShield
```

## 🧪 Development

Mock data in `src/mocks/mockData.ts` enables full UI testing without backend. All components are fully functional with responsive design.

## 🛠️ Build & Deploy

```bash
npm run build
npm start
```

---

**Built with:** Next.js 15 • React 18 • TypeScript • Tailwind CSS • Zustand • React Hook Form
