# ShiftEase — Web-Based Employee Scheduling & Workforce Management

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore%20%7C%20Analytics-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Build with CRA](https://img.shields.io/badge/Build-Create%20React%20App-09D3AC?logo=create-react-app&logoColor=white)](https://create-react-app.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![CI](https://github.com/Manavj99/ShiftEase/actions/workflows/ci.yml/badge.svg)](https://github.com/Manavj99/ShiftEase/actions/workflows/ci.yml)

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore%20%7C%20Analytics-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Build with CRA](https://img.shields.io/badge/Build-Create%20React%20App-09D3AC?logo=create-react-app&logoColor=white)](https://create-react-app.dev/)
[![License](https://img.shields.io/badge/License-Not%20Specified-lightgrey)](#license)

A full‑stack scheduling and employee management app built with **React** (Create React App) and **Firebase** (Auth, Firestore, Realtime Database, Analytics). The app supports **role‑based access**, **shift scheduling**, **task assignment**, and **announcements**, with a clean, responsive UI. Certain data flows can also be backed by a REST API (see `src/components/services/api.js`).

---

## ✨ Features

- **Authentication & Roles** — Firebase Auth with roles like Admin / Manager / Employee (see Firestore `users` collection).
- **Shift Scheduling** — Create, edit, and delete shifts in Firestore (`shifts` collection and `ShiftsData` subcollection), with a modal scheduler UI.
- **Task Management** — CRUD for tasks (Firestore `tasks` collection).
- **Announcements** — Create & list org‑wide announcements (Firestore `announcements` collection).
- **Dashboard** — Employee list, quick stats, and navigation components.
- **Extensible Data Layer** — Optional REST calls via `API_BASE_URL` (see `src/components/services/api.js`), plus direct Firebase access via service modules.
- **Responsive UI** — Built with React and common UI utilities; toast notifications, routing, and more.


## 🧱 Tech Stack

**Core**  
- React 18, Create React App (react-scripts), React Router DOM

**Firebase**  
- firebase (Auth, Firestore, Realtime DB, Analytics)

**UI & Styling**  
- MUI (@mui/material), Emotion (@emotion/react, @emotion/styled)  
- styled-components  
- Bootstrap, React-Bootstrap  
- Font Awesome (@fortawesome/react-fontawesome, free-solid-svg-icons)

**Scheduling & UX**  
- react-big-calendar, moment  
- react-select, react-toastify

**Data & HTTP**  
- axios

**Build & Assets**  
- svgo, postcss, web-vitals

**Testing**  
- @testing-library/react, @testing-library/jest-dom, @testing-library/user-event

**(Server-Side Only — consider moving out of client)**  
- express, cors, cookie, firebase-admin


<details>
<summary><strong>Full dependency list (from package.json)</strong></summary>

**dependencies**
- `@emotion/react`: `^11.13.3`
- `@emotion/styled`: `^11.13.0`
- `@fortawesome/free-solid-svg-icons`: `^6.6.0`
- `@fortawesome/react-fontawesome`: `^0.2.2`
- `@mui/material`: `^6.1.4`
- `@testing-library/jest-dom`: `^5.17.0`
- `@testing-library/react`: `^13.4.0`
- `@testing-library/user-event`: `^13.5.0`
- `axios`: `^1.7.9`
- `bootstrap`: `^5.3.3`
- `cookie`: `^0.7.2`
- `cors`: `^2.8.5`
- `express`: `^2.5.11`
- `firebase`: `^10.14.1`
- `firebase-admin`: `^12.7.0`
- `moment`: `^2.30.1`
- `nth-check`: `^2.1.1`
- `postcss`: `^8.4.47`
- `react`: `^18.3.1`
- `react-big-calendar`: `^1.15.0`
- `react-bootstrap`: `^2.10.6`
- `react-dom`: `^18.3.1`
- `react-router-dom`: `^6.27.0`
- `react-scripts`: `5.0.1`
- `react-select`: `^5.8.3`
- `react-toastify`: `^10.0.6`
- `styled-components`: `^6.1.13`
- `svgo`: `^3.3.2`
- `web-vitals`: `^2.1.4`

**devDependencies**
_(none)_

</details>


## 📁 Project Structure (abridged)

```text
ShiftEase-main/
  • README.md, firebase.json, package.json
  └─ public/
     • index.html, manifest.json
  └─ src/
     • App.css, App.jsx, App.test.js, firebaseConfig.js, index.css, index.js, reportWebVitals.js, setupTests.js
     └─ components/
        └─ AddUser/
           • AddRoleModal.jsx, AddUser.jsx, AddUserForm.jsx ...
        └─ Announcement/
           • AnnouncementForm.css, AnnouncementForm.jsx
        └─ DashBoard/
           • AddEmployeeModal.css, AddEmployeeModal.jsx, Dashboard.css ...
        └─ Home/
           • CreateAccount.css, CreateAccount.jsx, Home.js ...
        └─ NavBar/
           • Card1.css, Card1.js, Intermediate_Area_Part2.css ...
        └─ Schedule/
           • Scheduler.jsx, ShiftModal.css, ShiftModal.jsx
        └─ Tasks/
           • Tasks.jsx, tasks.css
        └─ services/
           • announcementService.js, api.js, firebase.js ...
```

## 🚀 Getting Started (Local)

### 1) Prerequisites
- **Node.js** 18+ (LTS recommended)
- **npm** 9+

### 2) Install dependencies
```bash
npm install
```

### 3) Configure Firebase
Update **`src/components/services/firebase.js`** with your Firebase project config:

```js
// src/components/services/firebase.js
import {{ initializeApp }} from 'firebase/app';
import {{ getAuth }} from 'firebase/auth';
import {{ getFirestore }} from 'firebase/firestore';
import {{ getDatabase }} from 'firebase/database';
import {{ getAnalytics }} from 'firebase/analytics';

const firebaseConfig = {{
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
}};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);
export const analytics = getAnalytics(app);
```

> Tip: Many teams use environment variables with Create React App (prefix with `REACT_APP_`) and read them here instead of hard‑coding.

### 4) (Optional) Configure REST API base
`src/components/services/api.js` points to:
```
http://cassini.cs.kent.edu/shiftease/api
```
If you don’t have access to that backend, replace `API_BASE_URL` with your own, or refactor calls to rely purely on Firebase.

### 5) Run the app
```bash
npm start
```
Open http://localhost:3000 in your browser.

### 6) Run tests
```bash
npm test
```

### 7) Build for production
```bash
npm run build
```

## 🔐 Roles & Access

- **Auth:** Firebase Authentication (email/password out of the box)
- **Authorization:** Role read from Firestore `users/{{uid}}` document (`role` field); used by `shiftService.js` helpers.

> Ensure your Firestore rules align with role expectations (e.g., Admins can create shifts, Employees can view their own tasks).

## 🗄️ Data Model (Firestore)

- `users/{{uid}}` → `role`, profile fields
- `shifts/{{orgId}}/ShiftsData/{{shiftId}}` → shift details (`date`, `startTime`, `endTime`, `totalHours`, `orgs`, `subgroup`)
- `tasks/{{taskId}}` → task details + timestamps
- `announcements/{{id}}` → message, author, createdAt

> Adjust names if your collections differ; this mapping was inferred from the service modules.

## 🧭 Key Screens & Components

- **Authentication:** `Home/CreateAccount.jsx`, `Home/Login.jsx`, `Home/VerificationPage.jsx`
- **Scheduling:** `Schedule/Scheduler.jsx`, `Schedule/ShiftModal.jsx`
- **Tasks:** `Tasks/Tasks.jsx`
- **Announcements:** `Announcement/AnnouncementForm.jsx`
- **Users & Dashboard:** `DashBoard/Dashboard.jsx`, `DashBoard/EmployeeList.jsx`
- **Shell & Nav:** `NavBar/*`, `App.js`

## 🧪 Testing

The project uses Create React App’s testing setup (`react-scripts test`). Add tests under `src/` and name them `*.test.js` to be detected.

## 🧭 Roadmap Ideas

- ✅ Migrate Firebase config to environment variables (`REACT_APP_*`) and add `.env.example`
- ✅ Role‑based routing guards
- ✅CI (GitHub Actions) for lint/test/build
- ⬜ E2E tests (Playwright/Cypress)
- ⬜ Dark mode & accessibility pass (ARIA, keyboard nav)
- ⬜ Deployment guides (Firebase Hosting / Vercel / Netlify)

## 🛡️ Security Notes (Important)

- **Never commit private keys:** The repo includes a `serviceAccountKey.json` under `src/components/services/`. Remove it from source control immediately and rotate the associated credentials. Commit only **public** client configs; admin keys must stay server‑side.
- Configure **Firestore & Realtime Database rules** to restrict access by role.
- Do not expose secrets in `firebase.js`; prefer environment variables and secure build configs.

## 🧩 Optional Backend (server/)

This repo now ships with a minimal **Express + Firebase Admin** backend skeleton in `server/` for endpoints that require privileged access (e.g., server-side validation, admin operations).

- Configure `FIREBASE_SERVICE_ACCOUNT_B64` (base64 of your service account JSON) before starting.
- Client can talk to it via `REACT_APP_API_BASE_URL`.

```bash
cd server
npm install
npm run dev
```

## 📦 Deployment

- **Firebase Hosting:** Build (`npm run build`) and deploy with Firebase CLI (`firebase init hosting && firebase deploy`).
- **Vercel / Netlify:** Use the CRA build output; set environment variables in project settings.


## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
