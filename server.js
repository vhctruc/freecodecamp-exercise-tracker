const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data
app.use(express.static(path.join(__dirname)));

// In-memory storage
let users = [];
let exercises = [];

// Helper function to generate unique ID
function generateId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// Helper function to find user by ID
function findUserById(id) {
  return users.find(user => user._id === id);
}

// Helper function to format date to dateString format
function formatDate(date) {
  if (!date) {
    return new Date().toDateString();
  }
  
  // If date is already a Date object
  if (date instanceof Date) {
    return date.toDateString();
  }
  
  // If date is a string, parse it
  const parsedDate = new Date(date);
  
  // Check if the date is valid
  if (isNaN(parsedDate.getTime())) {
    return new Date().toDateString();
  }
  
  return parsedDate.toDateString();
}

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// POST /api/users - Create a new user
app.post('/api/users', (req, res) => {
  try {
    const { username } = req.body;
    
    // Validate username
    if (!username || username.trim() === '') {
      return res.status(400).json({ error: 'Username is required' });
    }
    
    // Check if username already exists
    const existingUser = users.find(user => user.username === username.trim());
    if (existingUser) {
      return res.json({
        username: existingUser.username,
        _id: existingUser._id
      });
    }
    
    // Create new user
    const newUser = {
      username: username.trim(),
      _id: generateId()
    };
    
    // Add to users array
    users.push(newUser);
    
    // Return user object
    res.json({
      username: newUser.username,
      _id: newUser._id
    });
    
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/users - Get all users
app.get('/api/users', (req, res) => {
  try {
    // Return array of all users
    const userList = users.map(user => ({
      username: user.username,
      _id: user._id
    }));
    
    res.json(userList);
    
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/users/:_id/exercises - Add exercise for a user
app.post('/api/users/:_id/exercises', (req, res) => {
  try {
    const userId = req.params._id;
    const { description, duration, date } = req.body;
    
    // Find the user
    const user = findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Validate required fields
    if (!description || description.trim() === '') {
      return res.status(400).json({ error: 'Description is required' });
    }
    
    if (!duration || isNaN(Number(duration)) || Number(duration) <= 0) {
      return res.status(400).json({ error: 'Duration must be a positive number' });
    }
    
    // Create new exercise
    const exerciseDate = date ? new Date(date) : new Date();
    const newExercise = {
      userId: userId,
      description: description.trim(),
      duration: Number(duration),
      date: exerciseDate
    };
    
    // Add to exercises array
    exercises.push(newExercise);
    
    // Return response in the required format
    res.json({
      username: user.username,
      description: newExercise.description,
      duration: newExercise.duration,
      date: formatDate(newExercise.date),
      _id: user._id
    });
    
  } catch (error) {
    console.error('Error adding exercise:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/users/:_id/logs - Get exercise log for a user
app.get('/api/users/:_id/logs', (req, res) => {
  try {
    const userId = req.params._id;
    const { from, to, limit } = req.query;
    
    // Find the user
    const user = findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get all exercises for this user
    let userExercises = exercises.filter(exercise => exercise.userId === userId);
    
    // Apply date filters
    if (from) {
      const fromDate = new Date(from);
      if (!isNaN(fromDate.getTime())) {
        userExercises = userExercises.filter(exercise => 
          new Date(exercise.date) >= fromDate
        );
      }
    }
    
    if (to) {
      const toDate = new Date(to);
      if (!isNaN(toDate.getTime())) {
        // Add one day to include the 'to' date
        toDate.setDate(toDate.getDate() + 1);
        userExercises = userExercises.filter(exercise => 
          new Date(exercise.date) < toDate
        );
      }
    }
    
    // Sort by date (most recent first)
    userExercises.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Apply limit
    if (limit && !isNaN(Number(limit)) && Number(limit) > 0) {
      userExercises = userExercises.slice(0, Number(limit));
    }
    
    // Format exercises for response
    const log = userExercises.map(exercise => ({
      description: exercise.description,
      duration: exercise.duration,
      date: formatDate(exercise.date)
    }));
    
    // Return log response
    res.json({
      username: user.username,
      count: log.length,
      _id: user._id,
      log: log
    });
    
  } catch (error) {
    console.error('Error getting exercise log:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Exercise Tracker Microservice',
    users_count: users.length,
    exercises_count: exercises.length
  });
});

// Get all data (for debugging)
app.get('/api/data', (req, res) => {
  res.json({
    users: users,
    exercises: exercises,
    stats: {
      total_users: users.length,
      total_exercises: exercises.length
    }
  });
});

// Handle 404 for API routes
app.get('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    available: [
      'POST /api/users',
      'GET /api/users',
      'POST /api/users/:_id/exercises',
      'GET /api/users/:_id/logs',
      'GET /api/health',
      'GET /api/data'
    ]
  });
});

// Start the server
app.listen(PORT, () => {
  console.log('🚀 Exercise Tracker Microservice running on port', PORT);
  console.log('📡 API endpoints available:');
  console.log('   POST /api/users');
  console.log('   GET /api/users');
  console.log('   POST /api/users/:_id/exercises');
  console.log('   GET /api/users/:_id/logs');
  console.log('🌐 Frontend available at: http://localhost:' + PORT);
  console.log('💾 Using in-memory storage');
});
