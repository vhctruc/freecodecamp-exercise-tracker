# 💪 Exercise Tracker Microservice

FreeCodeCamp Back End Development and APIs Project - Exercise Tracker

## 📋 Project Description

A full-stack exercise tracking application that allows users to create accounts, log workouts, and view their exercise history with filtering capabilities. Built with Express.js backend and vanilla JavaScript frontend.

## 🚀 Live Demo

- **Frontend Interface**: [Your deployed URL here]
- **API Base URL**: [Your deployed URL]/api/

## 📋 API Documentation

### 1. Create User
```
POST /api/users
```

**Request Body (form data):**
```
username=johndoe
```

**Response:**
```json
{
  "username": "johndoe",
  "_id": "507f1f77bcf86cd799439011"
}
```

### 2. Get All Users
```
GET /api/users
```

**Response:**
```json
[
  {
    "username": "johndoe", 
    "_id": "507f1f77bcf86cd799439011"
  },
  {
    "username": "janedoe",
    "_id": "507f1f77bcf86cd799439012"
  }
]
```

### 3. Add Exercise
```
POST /api/users/:_id/exercises
```

**Request Body (form data):**
```
description=Running
duration=30
date=1990-01-01
```

**Response:**
```json
{
  "username": "johndoe",
  "description": "Running",
  "duration": 30,
  "date": "Mon Jan 01 1990",
  "_id": "507f1f77bcf86cd799439011"
}
```

### 4. Get Exercise Log
```
GET /api/users/:_id/logs?from=1990-01-01&to=1990-12-31&limit=10
```

**Query Parameters:**
- `from` (optional): Start date in YYYY-MM-DD format
- `to` (optional): End date in YYYY-MM-DD format  
- `limit` (optional): Maximum number of exercises to return

**Response:**
```json
{
  "username": "johndoe",
  "count": 2,
  "_id": "507f1f77bcf86cd799439011",
  "log": [
    {
      "description": "Running",
      "duration": 30,
      "date": "Mon Jan 01 1990"
    },
    {
      "description": "Swimming", 
      "duration": 45,
      "date": "Tue Jan 02 1990"
    }
  ]
}
```

## 🧪 Test Cases

### 1. Create User
```bash
curl -X POST https://your-app.railway.app/api/users \
  -d "username=testuser"
```

### 2. Get All Users
```bash
curl https://your-app.railway.app/api/users
```

### 3. Add Exercise
```bash
curl -X POST https://your-app.railway.app/api/users/507f1f77bcf86cd799439011/exercises \
  -d "description=Push-ups&duration=15&date=2024-01-15"
```

### 4. Get Exercise Log
```bash
# Get all exercises
curl https://your-app.railway.app/api/users/507f1f77bcf86cd799439011/logs

# Get exercises with filters
curl "https://your-app.railway.app/api/users/507f1f77bcf86cd799439011/logs?from=2024-01-01&to=2024-12-31&limit=5"
```

## 🛠️ Local Development

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/exercise-tracker-microservice-fcc.git
   cd exercise-tracker-microservice-fcc
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Development mode (with auto-reload):**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   ```
   http://localhost:3000
   ```

### Project Structure
```
exercise-tracker-microservice-fcc/
├── index.html          # Frontend interface
├── server.js           # Express.js backend
├── package.json        # Project configuration
└── README.md          # Documentation
```

## 🔧 Technical Implementation

### Data Structures

**User Object:**
```javascript
{
  username: "johndoe",
  _id: "507f1f77bcf86cd799439011"
}
```

**Exercise Object (Internal):**
```javascript
{
  userId: "507f1f77bcf86cd799439011",
  description: "Running",
  duration: 30,
  date: Date object
}
```

**Exercise Response Format:**
```javascript
{
  username: "johndoe",
  description: "Running", 
  duration: 30,
  date: "Mon Jan 01 1990",
  _id: "507f1f77bcf86cd799439011"
}
```

### Key Features

1. **User Management**: Create and retrieve user accounts
2. **Exercise Logging**: Add workouts with description, duration, and optional date
3. **Exercise History**: View complete workout logs with filtering
4. **Date Filtering**: Filter exercises by date range
5. **Limit Results**: Control number of returned exercises
6. **Data Validation**: Ensure required fields and proper data types

### Date Handling
- Uses JavaScript `Date.toDateString()` for consistent formatting
- Accepts dates in YYYY-MM-DD format
- Defaults to current date if no date provided
- Returns dates in format: "Mon Jan 01 1990"

### Storage
Currently uses **in-memory storage** with arrays:
- `users[]`: Stores user objects
- `exercises[]`: Stores exercise objects linked to users by ID

## 🚀 Deployment

### Railway (Recommended)
1. Push code to GitHub repository
2. Connect Railway to GitHub repo
3. Railway auto-detects Node.js and deploys
4. Generate domain in Settings → Networking

### Other Platforms
- **Vercel**: Supports Node.js APIs
- **Render**: Full-stack deployment
- **Heroku**: Traditional cloud platform

## 📦 Dependencies

### Production
- **Express.js**: Web framework and API server
- **CORS**: Cross-origin resource sharing

### Development
- **Nodemon**: Auto-reload during development

## ✅ FreeCodeCamp Requirements

- [x] **Test 1**: Provide own project URL
- [x] **Test 2**: POST to `/api/users` with form data username
- [x] **Test 3**: Response has `username` and `_id` properties
- [x] **Test 4**: GET `/api/users` returns list of all users
- [x] **Test 5**: GET `/api/users` returns an array
- [x] **Test 6**: Each user object has `username` and `_id`
- [x] **Test 7**: POST to `/api/users/:_id/exercises` with form data
- [x] **Test 8**: Exercise response includes user object with exercise fields
- [x] **Test 9**: GET `/api/users/:_id/logs` retrieves exercise log
- [x] **Test 10**: Log response has `count` property
- [x] **Test 11**: Log response has `log` array of exercises
- [x] **Test 12**: Each log item has `description`, `duration`, `date`
- [x] **Test 13**: `description` is a string
- [x] **Test 14**: `duration` is a number
- [x] **Test 15**: `date` is a string using `dateString` format
- [x] **Test 16**: Supports `from`, `to`, `limit` query parameters

## 🧪 Testing Scenarios

### Frontend Testing
1. **Create User**: Enter username and submit
2. **Add Exercise**: Select user, enter exercise details
3. **View Users**: See all created users
4. **View Logs**: Check exercise history with filters

### API Testing
```bash
# Complete test workflow
USER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/users -d "username=testuser")
USER_ID=$(echo $USER_RESPONSE | jq -r '._id')

curl -X POST http://localhost:3000/api/users/$USER_ID/exercises \
  -d "description=Running&duration=30"

curl http://localhost:3000/api/users/$USER_ID/logs
```

### Error Handling Tests
```bash
# Missing username
curl -X POST http://localhost:3000/api/users -d ""

# Invalid user ID
curl http://localhost:3000/api/users/invalid-id/logs

# Missing exercise description
curl -X POST http://localhost:3000/api/users/valid-id/exercises -d "duration=30"
```

## 💾 Data Persistence

**Current**: In-memory storage (data lost on restart)

**Production Upgrades**:
- **MongoDB**: Document-based storage for users and exercises
- **PostgreSQL**: Relational database with proper foreign keys
- **Redis**: Fast caching layer for frequent queries

## 🔍 Query Parameters

### Exercise Log Filtering

**Date Range:**
```
?from=2024-01-01&to=2024-12-31
```

**Limit Results:**
```
?limit=10
```

**Combined Filters:**
```
?from=2024-01-01&to=2024-06-30&limit=5
```

## 📈 Features

- ✅ **User Registration**: Simple username-based accounts
- ✅ **Exercise Logging**: Track workouts with details
- ✅ **History Viewing**: Complete exercise logs
- ✅ **Date Filtering**: Filter by date ranges
- ✅ **Result Limiting**: Control response size
- ✅ **Form Data Support**: URL-encoded form submissions
- ✅ **JSON Responses**: Structured API responses
- ✅ **Error Handling**: Graceful error messages
- ✅ **Interactive UI**: Beautiful frontend for testing

## 🐛 Common Issues

**Date Format**: Ensure dates are in YYYY-MM-DD format
**Form Data**: Use `Content-Type: application/x-www-form-urlencoded`
**User ID**: Verify user exists before adding exercises
**Duration**: Must be a positive number
**Case Sensitivity**: User IDs are case-sensitive

## 📝 Author

Created for FreeCodeCamp Back End Development and APIs Certification

## 📄 License

MIT License
