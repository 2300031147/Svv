# System Performance Observer

A full-stack web application for manually recording and analyzing system performance metrics during application testing. Built with React (frontend) and Node.js + Express + MySQL (backend).

## 🚀 Features

### Home Dashboard
- Overview of all recorded tests with key metrics
- Filter and sort tests by date, device, or status
- Export test data to CSV
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
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MySQL** - Database
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

# Edit .env and update with your MySQL credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=performance_observer
# PORT=5000

# Start the backend server
npm start
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

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tests` | Get all performance tests |
| GET | `/api/tests/:id` | Get a specific test by ID |
| POST | `/api/tests` | Create a new test record |
| DELETE | `/api/tests/:id` | Delete a test record |
| GET | `/api/tests/statistics` | Get aggregated statistics |
| GET | `/health` | Health check endpoint |

### Example API Request

```javascript
// Create a new test
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

### Recording a Performance Test

1. Click **"New Test"** in the navigation bar
2. Fill in all required fields:
   - Test Name (e.g., "Homepage Load Test")
   - Device (e.g., "Desktop", "Mobile")
   - Browser/OS (e.g., "Chrome / Windows 11")
   - Response Time in milliseconds
   - CPU Usage percentage (0-100)
   - Memory Usage in MB
   - Status (Stable/Lag/Crash)
   - Optional notes
3. Click **"Save Test"**

### Viewing Dashboard

1. Navigate to **"Dashboard"** (home page)
2. View all recorded tests in a table
3. Use filters to:
   - Search by test name or notes
   - Filter by status
   - Filter by device
4. Sort by clicking column headers
5. Export filtered data to CSV
6. Delete tests using the Delete button

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
│   ├── config/
│   │   └── database.js          # MySQL connection configuration
│   ├── controllers/
│   │   └── testController.js    # Business logic for tests
│   ├── routes/
│   │   └── testRoutes.js        # API route definitions
│   ├── database_schema.sql      # Database schema
│   ├── server.js                # Express server entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DarkModeToggle.js
│   │   │   └── Navigation.js
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── NewTest.js
│   │   │   └── Analytics.js
│   │   ├── services/
│   │   │   └── api.js           # API service functions
│   │   ├── utils/
│   │   │   └── helpers.js       # Utility functions
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

[Screenshots would be added here showing the Dashboard, New Test form, and Analytics page]

## 🔐 Security Notes

- The current implementation uses basic MySQL connection without advanced security
- For production use, implement:
  - JWT-based authentication
  - Input sanitization
  - SQL injection prevention (currently using parameterized queries)
  - HTTPS
  - Environment variable protection

## 🚀 Future Enhancements

- [ ] JWT-based authentication and user management
- [ ] Manual test checklist feature
- [ ] Real-time monitoring using browser Performance API
- [ ] PDF report generation
- [ ] Excel export functionality
- [ ] Test comparison feature
- [ ] Historical data trends
- [ ] Email notifications for test failures
- [ ] Multi-user support with roles

## 🐛 Troubleshooting

### Backend won't start
- Check if MySQL is running: `mysql --version`
- Verify database credentials in `.env`
- Ensure port 5000 is not in use

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check browser console for CORS errors
- Ensure `.env` has correct API URL

### Charts not displaying
- Check if test data exists in the database
- Open browser console for any JavaScript errors
- Verify Chart.js is installed: `npm list chart.js`

## 📝 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For support, please open an issue in the repository.

