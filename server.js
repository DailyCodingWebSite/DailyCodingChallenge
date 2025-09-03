// Simple Node.js server for the Daily Coding Challenge website
// This is a basic implementation using Express.js

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// In-memory database (in production, use a real database)
let database = {
    users: [
        {
            id: 1,
            username: 'admin',
            password: 'admin123',
            role: 'admin',
            fullName: 'System Administrator',
            class: null
        },
        {
            id: 2,
            username: 'faculty1',
            password: 'faculty123',
            role: 'faculty',
            fullName: 'Dr. John Smith',
            class: null
        },
        {
            id: 3,
            username: 'student1',
            password: 'student123',
            role: 'student',
            fullName: 'Alice Johnson',
            class: 'CSE-A'
        }
    ],
    questions: [
        {
            id: 1,
            questionText: 'What is the time complexity of binary search?',
            optionA: 'O(n)',
            optionB: 'O(log n)',
            optionC: 'O(n²)',
            optionD: 'O(1)',
            correctAnswer: 'B',
            difficulty: 'medium'
        },
        {
            id: 2,
            questionText: 'Which data structure uses LIFO principle?',
            optionA: 'Queue',
            optionB: 'Array',
            optionC: 'Stack',
            optionD: 'Linked List',
            correctAnswer: 'C',
            difficulty: 'easy'
        }
    ],
    quizSchedules: [],
    quizAttempts: []
};

// Routes

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Authentication endpoint
app.post('/api/login', (req, res) => {
    const { username, password, role } = req.body;
    
    const user = database.users.find(u => 
        u.username === username && 
        u.password === password && 
        u.role === role
    );
    
    if (user) {
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        res.json({ success: true, user: userWithoutPassword });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Get current user's quiz
app.get('/api/quiz/today/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const today = new Date().toISOString().split('T')[0];
    
    // Check if user already attempted today's quiz
    const existingAttempt = database.quizAttempts.find(attempt => 
        attempt.userId === userId && attempt.date === today
    );
    
    if (existingAttempt) {
        return res.json({ 
            success: false, 
            message: 'Quiz already completed',
            attempt: existingAttempt 
        });
    }
    
    // Get today's scheduled quiz
    const todayQuiz = database.quizSchedules.find(schedule => 
        schedule.quizDate === today
    );
    
    if (!todayQuiz) {
        return res.json({ success: false, message: 'No quiz scheduled for today' });
    }
    
    // Check if quiz is currently active
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                       now.getMinutes().toString().padStart(2, '0');
    
    if (currentTime < todayQuiz.startTime || currentTime > todayQuiz.endTime) {
        return res.json({ 
            success: false, 
            message: `Quiz is available from ${todayQuiz.startTime} to ${todayQuiz.endTime}` 
        });
    }
    
    // Get questions
    const question1 = database.questions.find(q => q.id === parseInt(todayQuiz.question1));
    const question2 = database.questions.find(q => q.id === parseInt(todayQuiz.question2));
    
    if (!question1 || !question2) {
        return res.json({ success: false, message: 'Quiz questions not found' });
    }
    
    res.json({
        success: true,
        quiz: {
            ...todayQuiz,
            questions: [question1, question2]
        }
    });
});

// Submit quiz attempt
app.post('/api/quiz/submit', (req, res) => {
    const { userId, q1Answer, q2Answer, timeTaken, quizId } = req.body;
    const today = new Date().toISOString().split('T')[0];
    
    // Get quiz details
    const quiz = database.quizSchedules.find(s => s.id === quizId);
    if (!quiz) {
        return res.status(400).json({ success: false, message: 'Quiz not found' });
    }
    
    // Get questions and calculate score
    const question1 = database.questions.find(q => q.id === parseInt(quiz.question1));
    const question2 = database.questions.find(q => q.id === parseInt(quiz.question2));
    
    let score = 0;
    if (q1Answer === question1.correctAnswer) score++;
    if (q2Answer === question2.correctAnswer) score++;
    
    const percentage = (score / 2) * 100;
    
    // Save attempt
    const attempt = {
        id: database.quizAttempts.length + 1,
        userId: parseInt(userId),
        date: today,
        question1Id: parseInt(quiz.question1),
        question2Id: parseInt(quiz.question2),
        q1Answer,
        q2Answer,
        score,
        percentage,
        timeTaken: parseInt(timeTaken),
        timestamp: new Date().toISOString()
    };
    
    database.quizAttempts.push(attempt);
    
    res.json({ success: true, attempt });
});

// Get questions (admin only)
app.get('/api/questions', (req, res) => {
    res.json({ success: true, questions: database.questions });
});

// Add question (admin only)
app.post('/api/questions', (req, res) => {
    const newQuestion = {
        id: Math.max(...database.questions.map(q => q.id), 0) + 1,
        ...req.body
    };
    
    database.questions.push(newQuestion);
    res.json({ success: true, question: newQuestion });
});

// Get quiz schedules (admin only)
app.get('/api/schedules', (req, res) => {
    res.json({ success: true, schedules: database.quizSchedules });
});

// Add quiz schedule (admin only)
app.post('/api/schedules', (req, res) => {
    const newSchedule = {
        id: Math.max(...database.quizSchedules.map(s => s.id), 0) + 1,
        ...req.body
    };
    
    database.quizSchedules.push(newSchedule);
    res.json({ success: true, schedule: newSchedule });
});

// Get users (admin only)
app.get('/api/users', (req, res) => {
    const usersWithoutPasswords = database.users.map(({ password, ...user }) => user);
    res.json({ success: true, users: usersWithoutPasswords });
});

// Add user (admin only)
app.post('/api/users', (req, res) => {
    const newUser = {
        id: Math.max(...database.users.map(u => u.id), 0) + 1,
        ...req.body
    };
    
    database.users.push(newUser);
    const { password, ...userWithoutPassword } = newUser;
    res.json({ success: true, user: userWithoutPassword });
});

// Get quiz attempts (faculty only)
app.get('/api/attempts', (req, res) => {
    res.json({ success: true, attempts: database.quizAttempts });
});

// Get students (faculty only)
app.get('/api/students', (req, res) => {
    const students = database.users
        .filter(user => user.role === 'student')
        .map(({ password, ...user }) => user);
    res.json({ success: true, students });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Daily Coding Challenge server running on http://localhost:${PORT}`);
    console.log('Default login credentials:');
    console.log('Admin: admin/admin123');
    console.log('Faculty: faculty1/faculty123');
    console.log('Student: student1/student123');
});

module.exports = app;
