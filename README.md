# Leave Management System

A beginner-friendly React + Express Leave Management System built for the interview assignment.

## Features
- Mocked login
- Employee dashboard with leave balance (Casual: 10, Sick: 10, Annual: 15)
- Leave application form with working-day calculation
- Leave history with status
- Optional admin approve/reject view
- Separate API service layer
- Helper/validation utility
- Assets folder for reusable visual assets
- Tailwind CSS UI
- Light/dark mode toggle
- Responsive layout

## Assignment-friendly structure

```text
frontend/src/
├── components/     # Reusable UI components
├── pages/          # Page-level views
├── services/       # API calls and data handling
├── utils/          # Helper functions
├── assets/         # Images and styles
├── App.js
└── index.js
```

## Demo accounts

Employee:
- Email: rahul@gmail.com
- Password: password123

Admin:
- Email: admin@gmail.com
- Password: admin123

## Run

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

## Notes

The backend uses a local JSON file in `backend/data/leaves.json` instead of MongoDB. This keeps the assignment easy to run while still demonstrating a real frontend-backend API flow.


## Leave day calculation

Leave balances are tracked in **leave days**, not number of applications.

* Casual Leave: 10 working days
* Sick Leave: 10 working days
* Annual Leave: 15 working days
* The selected date range is counted inclusively.
* Saturday and Sunday are not counted.
* Only approved leave days reduce the employee's balance.
* The selected working-day count is shown before submission and stored with each request.
