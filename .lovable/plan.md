

# LabSetu — Diagnostics Aggregator Platform

A clean, minimal medical platform connecting patients with diagnostic labs. Built with React, Supabase (Lovable Cloud), and a white + blue medical theme.

---

## Phase 1: Foundation & Design System

- **Medical branding**: White + blue color theme with trust-oriented design
- **Responsive layout**: Mobile-first, clean typography, medical iconography
- **Shared layout components**: Header, footer, navigation with role-based menu items

---

## Phase 2: Authentication & User Roles

- **Email + password authentication** via Supabase Auth (mobile OTP deferred to later phase)
- **Three roles**: Patient, Lab Partner, Admin — stored in a secure `user_roles` table
- **Role-based routing**: Each role gets redirected to their respective dashboard after login
- **Profile management**: Name, email, phone, address for patients; business details for labs
- **Registration flow**: Patients register freely; Lab Partners register with admin approval required

---

## Phase 3: Patient-Facing Features

### Home Page
- Search bar for tests (e.g., "CBC", "Full Body Checkup")
- Featured/promoted labs section
- Trust badges and platform highlights
- Popular tests grid

### Search & Compare
- Search tests with filters: price, rating, home collection availability
- Results showing: lab name, NABL certification badge, price, turnaround time, rating, home collection option
- Side-by-side comparison of up to 3 labs for a selected test

### Booking Flow (4 steps max, no payment yet)
1. Select test → view available labs
2. Choose lab → select date/time slot & home collection or visit
3. Enter patient details (name, age, gender, address if home collection)
4. Review & confirm booking

- Booking confirmation screen with booking ID
- Booking history in patient profile

### Reviews & Ratings
- Patients can rate and review labs after completed bookings

### Reports
- View and download lab reports (uploaded by lab partners)
- Test history timeline in patient dashboard

---

## Phase 4: Lab Partner Dashboard

- **Onboarding**: Registration form with certification uploads (NABL, etc.) stored in Supabase Storage
- **Test management**: Add/edit tests and packages with pricing and turnaround time
- **Slot management**: Define available time slots for bookings
- **Booking management**: View, accept, or reject incoming bookings
- **Report upload**: Upload PDF reports for completed bookings
- **Analytics overview**: Total bookings, revenue, pending reports

---

## Phase 5: Admin Dashboard

- **Lab management**: Approve/reject lab registrations, view all labs
- **User management**: View all patients, manage accounts
- **Booking overview**: All bookings across the platform with filters
- **Commission settings**: Set global or per-lab commission percentages
- **Revenue dashboard**: Track total bookings, revenue, commission earnings
- **Featured labs**: Mark labs as featured for homepage promotion
- **Analytics**: Daily/weekly/monthly charts for bookings, revenue, active labs, top tests

---

## Phase 6: Demo Data & Seeding

- Seed database with ~10 sample labs across one city
- ~100 common diagnostic tests with realistic pricing
- Sample bookings and reviews for demo purposes

---

## Database Structure (Supabase/PostgreSQL)

Key tables: profiles, user_roles, labs, tests, lab_tests (pricing per lab), bookings, time_slots, reports, reviews, commission_records, advertisements

All with Row-Level Security policies appropriate to each role.

---

## What's Deferred (Future Phases)

- Payment integration (Razorpay/Stripe)
- Mobile OTP authentication
- SMS/email booking notifications
- Multi-city expansion
- Advertisement management system
- Corporate dashboards & subscription plans
- AI health insights

