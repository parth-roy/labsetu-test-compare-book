# labsetu

**PROJECT TITLE:**
Diagnostics Aggregator Platform (PolicyBazaar for Labs) named (LabSetu)

---

**PROJECT OVERVIEW:**
Build a production-ready MVP web platform that aggregates top diagnostic laboratories and allows patients to compare tests, book appointments, make payments, and download reports. The platform earns commission per booking and supports advertisement placements for labs.

Target market: India
Initial launch: Single city
Users: Patients, Labs, Admin

The architecture must be scalable for multi-city expansion.

---

# 1️⃣ USER ROLES

Create three role-based systems:

### 1. Patient (End User)

### 2. Lab Partner (Diagnostics Centre)

### 3. Platform Admin

Each role must have a separate dashboard and secure authentication.

---

# 2️⃣ CORE FEATURES – PATIENT SIDE

### Authentication

* Email + OTP login
* Mobile number login
* Password reset
* Profile management

### Search & Compare

* Search tests (e.g., CBC, Lipid Profile, Full Body Checkup)
* Filter by:

  * Price
  * Rating
  * Distance
  * Home collection availability
* Compare labs side by side
* Show:

  * Lab name
  * NABL certification status
  * Price
  * Turnaround time
  * Rating
  * Home collection option

### Booking Flow

* Select test
* Choose lab
* Select slot (date/time)
* Choose home collection or visit lab
* Enter patient details
* Online payment integration
* Booking confirmation screen
* Email/SMS confirmation

### Reports

* Secure report upload by lab
* Patient can download report
* Maintain test history in profile

---

# 3️⃣ LAB PARTNER DASHBOARD

Lab partner must be able to:

* Register (approval required by admin)
* Upload certifications (NABL, etc.)
* Add / edit test packages
* Set pricing
* Manage slots
* Accept / reject bookings
* Upload patient reports (PDF)
* View earnings & commission deducted
* Basic analytics dashboard:

  * Total bookings
  * Revenue
  * Pending reports

---

# 4️⃣ ADMIN DASHBOARD

Admin should be able to:

* Approve / reject labs
* Manage users
* Set commission percentage globally or per lab
* View total bookings
* View revenue dashboard
* Track commission earnings
* Manage advertisement placements
* Control featured labs
* Access analytics:

  * Daily / weekly / monthly bookings
  * Revenue trends
  * Active labs
  * Top tests booked

---

# 5️⃣ PAYMENT SYSTEM

Integrate:

* Razorpay (India)
* Secure payment gateway
* Commission auto-calculation
* Split payment logic (if supported) OR manual payout tracking

Booking status:

* Pending
* Confirmed
* Completed
* Cancelled
* Refunded

---

# 6️⃣ DATABASE STRUCTURE (MUST INCLUDE)

Entities:

* Users
* Labs
* Tests
* Bookings
* Payments
* Reports
* Reviews
* Commission Records
* Advertisements

Ensure relational integrity.

---

# 7️⃣ TECH STACK REQUIREMENTS

Frontend:

* React or Next.js
* Mobile responsive
* Clean medical UI design
* SEO optimized pages

Backend:

* Node.js (Express) OR Django
* REST API architecture
* JWT authentication
* Role-based access control

Database:

* PostgreSQL

Hosting:

* AWS compatible
* Environment variable configuration
* Production-ready structure

---

# 8️⃣ SECURITY & COMPLIANCE

Must include:

* Encrypted passwords
* HTTPS enforcement
* Secure file upload
* Role-based access control
* Data privacy compliance (health data sensitive)
* Audit logs for admin actions

---

# 9️⃣ MVP SCOPE LIMIT

Initial MVP:

* 1 city only
* 10 labs
* 100 common tests
* No AI features yet
* Web app first (mobile-ready design)

---

# 🔟 UI REQUIREMENTS

* Clean medical branding
* White + blue theme
* Simple comparison tables
* Easy booking flow (max 4 steps)
* Trust badges (NABL certified, verified lab)
* Ratings and reviews section

---

# FUTURE SCALABILITY (Structure Code Accordingly)

* Multi-city expansion
* Subscription health plans
* Corporate dashboards
* AI health insights
* Insurance API integration
* Mobile app expansion

---

# OUTPUT EXPECTATION

Generate:

* Full project structure
* Frontend components
* Backend API structure
* Database schema
* Role-based dashboards
* Working booking flow
* Payment integration
* Clean, production-ready MVP

---

# END OF PROMPT

---

🔥 That’s a serious, structured instruction set. It forces the AI builder to think like a production engineer, not a hobby coder.

---

Now let me level with you for 10 seconds:

Before you build tech, have you already:

* Spoken to 3–5 labs?
* Confirmed commission percentage?
* Identified your first city?

Because without supply-side validation, even the best platform sits empty.

If you want, I can next:

* Help you design a **lab partnership pitch script**
* Or create a **leaner ultra-MVP prompt (₹2–3 lakh build level)**
* Or help you estimate revenue properly for India diagnostics market

Where do you want to go next? 🚀
 diagonostic

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d89fc95e-cf96-4587-aa33-18a67b6f5e89).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
