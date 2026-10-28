# 🎬 IMovies - Movie Ticket Booking Made Simple
### Built with Inspiration from District (Zomato District) & BookMyShow

A production-grade, full-stack **MERN** (MongoDB, Express.js, React.js, Node.js) cinema ticket booking and theater management platform with real-time seat availability tracking via Socket.io, JWT role-based security, seamless F&B snack add-ons, printable digital e-tickets, and an intuitive Admin Console.

---

## 🌟 Key Features

### 1. 🎨 Premium Cinema Noir Aesthetic (District & BookMyShow Vibe)
- **District Spotlight**: Atmospheric banner hero carousel with high-res backdrops, official YouTube trailers, and ratings breakdown.
- **Location Selector**: Seamless city selector (Mumbai, Delhi-NCR, Bengaluru, Hyderabad, Chennai, Pune, Kolkata).
- **Multi-Criteria Filtering**: Filter blockbusters by Genre (*Action, Sci-Fi, Adventure, Comedy, Horror*), Language (*English, Hindi, Telugu, Tamil*), and Format (*IMAX 3D, 2D, 3D, 4DX*).

### 2. 🪑 Real-Time Seat Selection & Live Sync
- **Interactive Cinema Hall Visualization**:
  - 🟣 **VIP Recliner** (₹450)
  - 🔵 **Prime / Executive** (₹280)
  - 🟢 **Classic** (₹180)
- **Live Seat Locking via Socket.io**: Temporarily holds seats for 10 minutes during selection with a live countdown timer and broadcasts locks across all viewers in real-time.
- **Curved Projection Beam**: Visual screen indicator with realistic cinema atmosphere.

### 3. 🍿 Grab A Bite (Concessions & Snacks)
- District / BookMyShow inspired F&B ordering modal with Jumbo Butter Popcorn, Gourmet Caramel Duo, Crispy Mexican Nachos, and Coca-Cola.

### 4. 💳 Checkout & Instant Mock Payment
- Itemized billing breakdown (Base Ticket + F&B + Internet handling convenience fees + 18% GST).
- Encrypted payment methods: **UPI** (Google Pay, PhonePe, Paytm, QR scan), **Credit/Debit Cards**, and **Netbanking**.

### 5. 🎟️ Digital E-Ticket & Celebratory Confetti
- Instant e-ticket issued with booking reference code (`IMV-XXXXXX`), scannable digital QR code, cinema entry instructions, and one-click **Print / Download**.

### 6. 🕒 Booking History & Cancellation Flow
- Separate tabs for **Upcoming** and **Past / Cancelled** tickets.
- Instant ticket cancellation with automatic seat release back to the show's live inventory and refund calculation.

### 7. 🛡️ Admin Cinema Management Panel
- **Live Metrics**: Total Revenue, Total Bookings, Active Movies, Registered Theatres.
- **Full CRUD for Movies**: Add new release, update poster/synopsis, delete movie.
- **Full CRUD for Theatres**: Register new screens, amenities, and locations.
- **Show Scheduling**: Schedule shows across dates, showtimes, formats, and price tiers.
- **Live Booking Logs**: Searchable, paginated audit table of all customer bookings.

---

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin User** | `admin@imovies.com` | `admin123` |
| **Demo User** | `user@imovies.com` | `user123` |

*(Note: The Sign In modal features one-click demo login buttons for instant evaluation without typing)*

---

## 🚀 Running the Application

### Prerequisites
- Node.js (v16+)
- npm

### 1. Start Backend Server
```bash
cd backend
npm install
npm start
```
*The backend runs on `http://localhost:5000`. If a local MongoDB instance is not detected, it automatically starts an embedded zero-setup in-memory MongoDB database and seeds 6 blockbusters, 5 theatres, and 120 shows across dates!*

### 2. Start Frontend App
```bash
cd frontend
npm install
npm run dev
```
*The frontend runs on `http://localhost:5173`.*

---

## 📁 Project Architecture

```
movieii/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection & seed data
│   │   ├── controllers/     # Auth, Movie, Theatre, Show, Booking, Admin controllers
│   │   ├── middleware/      # Auth (JWT), Admin, Rate Limiting, Error handling
│   │   ├── models/          # User, Movie, Theatre, Show, Booking, Payment, Notification
│   │   ├── routes/          # Express REST API endpoints
│   │   ├── sockets/         # Real-time Socket.io seat lock synchronization
│   │   └── server.js        # Express & Socket.io server entry
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, Footer, MovieCard, HeroBanner, FilterBar, Modals
│   │   ├── context/         # AuthContext & CityContext
│   │   ├── pages/           # Home, MovieDetails, SeatBooking, Payment, Confirmation, Profile, Admin
│   │   ├── services/        # Axios API client & Socket.io client
│   │   ├── index.css        # District & BMS dark cinema design tokens
│   │   ├── App.jsx          # Route configurations
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```
