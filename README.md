# System Performance Observer

A full-stack web application for manually recording and analyzing system performance metrics during application testing. Built with React (frontend) and Node.js + Express + MySQL (backend).

## 🚀 Features

### Authentication & Security
- **JWT-based Authentication** - Secure user registration and login
- **Password Hashing** - bcrypt encryption for user passwords
- **Protected Routes** - Optional authentication for test management
- **Token Management** - Automatic token storage and refresh

### Home Dashboard
- Overview of all recorded tests with key metrics
- Filter and sort tests by date, device, or status
- Export test data to CSV
- **Download PDF Reports** - Generate comprehensive PDF reports of test results
- Delete unwanted test records

### Test Recording Page
- Comprehensive form to capture:
  - Test Name
  - Device Used
  - Browser / OS
  - Response Time (ms)
  - CPU Usage (%)
  - Memory Usage (MB)
  - Notes / Observations
  - Status (Stable / Lag / Crash)
- **Auto-Capture System Metrics** - Fetch real-time CPU and memory usage with one click
- Form validation with error messages

### Performance Analytics
- Interactive charts using Chart.js:
  - Response Time trend (last 10 tests)
  - CPU vs Memory usage comparison
  - Status distribution (Stable/Lag/Crash)
- Statistical summary cards showing:
  - Total tests
  - Average response time
  - Average CPU usage
  - Average memory usage
  - Success rate percentage

### UI Features
- Dark/Light mode toggle
- Responsive design with Tailwind CSS
- Clean card-based layout
- Smooth transitions and hover effects

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Chart.js & react-chartjs-2** - Data visualization
- **Axios** - HTTP client with interceptors

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MySQL** - Database
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **PDFKit** - PDF report generation
- **systeminformation** - Real-time system metrics
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MySQL** (v5.7 or higher)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Svv
```

### 2. Database Setup

1. Install MySQL if you haven't already
2. Create the database and tables:

```bash
mysql -u root -p < backend/database_schema.sql
```

Or manually run the SQL commands:

```sql
CREATE DATABASE IF NOT EXISTS performance_observer;
USE performance_observer;

-- Run the commands from backend/database_schema.sql
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and update with your MySQL credentials and JWT secret
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=1108
# DB_NAME=performance_observer
# PORT=5000
# JWT_SECRET=your_secret_key_change_this_in_production

# Start the backend server
npm start

# Or use nodemon for development
npm run dev
```

The backend server will run on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# The frontend is already configured to connect to backend at localhost:5000
# If you need to change this, edit the .env file

# Start the frontend development server
npm start
```

The frontend will run on `http://localhost:3000` and automatically open in your browser.

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

### Performance Tests (Optional Authentication)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tests` | Get all performance tests |
| GET | `/api/tests/:id` | Get a specific test by ID |
| POST | `/api/tests` | Create a new test record |
| DELETE | `/api/tests/:id` | Delete a test record |
| GET | `/api/tests/statistics` | Get aggregated statistics |

### System Metrics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/metrics` | Get real-time CPU and memory usage |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/pdf` | Generate and download PDF report |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check endpoint |

### Example API Requests

#### Register User
```javascript
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### Login
```javascript
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### Create a new test
```javascript
POST http://localhost:5000/api/tests
Content-Type: application/json

{
  "test_name": "Login Test",
  "device_used": "Desktop",
  "browser_os": "Chrome / Windows 11",
  "response_time": 250,
  "cpu_usage": 45.5,
  "memory_usage": 512.3,
  "notes": "Login functionality test",
  "status": "Stable"
}
```

## 💡 Usage Guide

### User Registration & Login

1. Navigate to **"Login"** in the top navigation
2. Click **"Register here"** if you don't have an account
3. Enter your email and password
4. After registration/login, you'll be redirected to the dashboard
5. You can also continue without logging in (guest mode)

### Recording a Performance Test

1. Click **"New Test"** in the navigation bar
2. Fill in all required fields:
   - Test Name (e.g., "Homepage Load Test")
   - Device (e.g., "Desktop", "Mobile")
   - Browser/OS (e.g., "Chrome / Windows 11")
   - Response Time in milliseconds
3. **Auto-Capture Metrics** (Optional):
   - Click the **"🔄 Fetch Metrics"** button to automatically capture your device's current CPU and memory usage
   - Or manually enter CPU Usage percentage (0-100) and Memory Usage in MB
4. Select Status (Stable/Lag/Crash)
5. Add optional notes
6. Click **"Save Test"**

### Viewing Dashboard

1. Navigate to **"Dashboard"** (home page)
2. View all recorded tests in a table
3. Use filters to:
   - Search by test name or notes
   - Filter by status
   - Filter by device
4. Sort by clicking column headers
5. Export filtered data to CSV
6. **Download PDF Report** - Click the "Download PDF Report" button to generate a comprehensive PDF of all test results
7. Delete tests using the Delete button

### Analyzing Performance

1. Click **"Analytics"** in the navigation bar
2. View summary statistics at the top
3. Analyze charts:
   - Response time trends over time
   - CPU vs Memory usage patterns
   - Status distribution
   - Success rate percentage

### Dark Mode

Click the sun/moon icon in the top-right corner to toggle between light and dark modes.

## 📁 Project Structure

```
Svv/
├── backend/
│   ├── auth/
│   │   ├── authRoutes.js         # Authentication endpoints
│   │   └── authMiddleware.js     # JWT validation middleware
│   ├── config/
│   │   └── database.js           # MySQL connection configuration
│   ├── controllers/
│   │   └── testController.js     # Business logic for tests
│   ├── routes/
│   │   ├── testRoutes.js         # Test API routes
│   │   ├── metricsRoutes.js      # System metrics routes
│   │   └── reportRoutes.js       # PDF report routes
│   ├── database_schema.sql       # Database schema (with users table)
│   ├── reportGenerator.js        # PDF generation logic
│   ├── server.js                 # Express server entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DarkModeToggle.js
│   │   │   ├── Navigation.js     # Navigation with auth status
│   │   │   └── ReportButton.js   # PDF download button
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── NewTest.js        # With metrics fetch button
│   │   │   ├── Analytics.js
│   │   │   ├── Login.js          # Login page
│   │   │   └── Register.js       # Registration page
│   │   ├── services/
│   │   │   └── api.js            # API with auth, metrics & reports
│   │   ├── utils/
│   │   │   └── helpers.js        # Utility functions
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env
│
└── README.md
```

## 🎨 Screenshots

[Screenshots would be added here showing the Dashboard, New Test form, Analytics page, Login/Register pages]

## 🔐 Security Features

- **JWT-based authentication** - Secure token-based authentication system
- **Password hashing** - bcrypt encryption for user passwords
- **SQL injection prevention** - Parameterized queries throughout
- **CORS configuration** - Proper cross-origin resource sharing setup
- **Rate limiting** - API request rate limiting to prevent abuse

**For production deployment, also implement:**
- HTTPS/TLS encryption
- Environment variable protection (never commit .env files)
- Additional input validation and sanitization
- Session management and token refresh
- Role-based access control (RBAC)

## 🚀 Future Enhancements

- [x] JWT-based authentication and user management
- [x] PDF report generation
- [x] Real-time system metrics capture
- [ ] Manual test checklist feature
- [ ] Real-time monitoring using browser Performance API
- [ ] Excel export functionality
- [ ] Test comparison feature
- [ ] Historical data trends
- [ ] Email notifications for test failures
- [ ] Multi-user support with roles and permissions
- [ ] API rate limiting per user
- [ ] Test scheduling and automation

## 🐛 Troubleshooting

### Backend won't start
- Check if MySQL is running: `mysql --version`
- Verify database credentials in `.env`
- Ensure port 5000 is not in use
- Check if JWT_SECRET is set in `.env`
- Run `npm install` to ensure all dependencies are installed

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check browser console for CORS errors
- Ensure `.env` has correct API URL

### Charts not displaying
- Check if test data exists in the database
- Open browser console for any JavaScript errors
- Verify Chart.js is installed: `npm list chart.js`

### Authentication issues
- Clear browser localStorage if experiencing login issues
- Verify JWT_SECRET is the same in backend `.env`
- Check token expiration (tokens expire after 24 hours by default)

### PDF Report not generating
- Ensure all backend dependencies are installed
- Check backend console for PDFKit errors
- Verify sufficient permissions to write files

### System Metrics not fetching
- Ensure systeminformation package is installed
- Check if the metrics API endpoint is accessible
- Some metrics may require elevated permissions on certain systems

## 📝 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For support, please open an issue in the repository.

