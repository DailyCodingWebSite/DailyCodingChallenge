const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend'))); // Serve frontend
app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: true
}));

// Helper function to read/write JSON
const readJSON = (file) => JSON.parse(fs.readFileSync(path.join(__dirname, 'data', file)));
const writeJSON = (file, data) => fs.writeFileSync(path.join(__dirname, 'data', file), JSON.stringify(data, null, 2));

// ------------------- ROUTES ------------------- //

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = readJSON('users.json');
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.user = user;
        res.json({ success: true, role: user.role });
    } else {
        res.json({ success: false, message: 'Invalid credentials' });
    }
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Middleware: Check login
function requireLogin(req, res, next) {
    if (req.session.user) next();
    else res.status(401).json({ message: 'Unauthorized' });
}

// Middleware: Role-based access
function requireRole(role) {
    return (req, res, next) => {
        if (req.session.user && req.session.user.role === role) next();
        else res.status(403).json({ message: 'Forbidden' });
    };
}

// Get today's quiz for student
app.get('/get-today-quiz', requireLogin, requireRole('student'), (req, res) => {
    const today = new Date().toISOString().slice(0,10);
    const quizzes = readJSON('quizzes.json');
    const questions = readJSON('questions.json');
    const quiz = quizzes.find(q => q.date === today);
    if (!quiz) return res.json({ available: false });
    
    const quizQuestions = questions.filter(q => quiz.questionIds.includes(q.id))
                                   .map(q => ({ id: q.id, text: q.text, options: q.options }));
    res.json({ available: true, questions: quizQuestions });
});

// Submit quiz answers
app.post('/submit-quiz', requireLogin, requireRole('student'), (req, res) => {
    const { answers } = req.body; // [{id:1, answer:'4'}, ...]
    const today = new Date().toISOString().slice(0,10);
    const quizzes = readJSON('quizzes.json');
    const questions = readJSON('questions.json');
    const attempts = readJSON('attempts.json');

    const quiz = quizzes.find(q => q.date === today);
    if (!quiz) return res.json({ success: false, message: 'No quiz today' });

    const existingAttempt = attempts.find(a => a.userId === req.session.user.id && a.date === today);
    if (existingAttempt) return res.json({ success: false, message: 'Already attempted' });

    let score = 0;
    answers.forEach(a => {
        const question = questions.find(q => q.id === a.id);
        if (question && question.answer === a.answer) score++;
    });

    attempts.push({
        userId: req.session.user.id,
        date: today,
        answers,
        score,
        timeTaken: 0 // You can calculate later
    });

    writeJSON('attempts.json', attempts);
    res.json({ success: true, score });
});

// Get student performance for faculty
app.get('/get-student-performance', requireLogin, requireRole('faculty'), (req, res) => {
    const attempts = readJSON('attempts.json');
    const users = readJSON('users.json');
    const students = users.filter(u => u.role === 'student');
    const result = students.map(s => {
        const studentAttempts = attempts.filter(a => a.userId === s.id);
        return { student: s.fullName, class: s.class, attempts: studentAttempts };
    });
    res.json(result);
});

// Admin routes: add question
app.post('/add-question', requireLogin, requireRole('admin'), (req, res) => {
    const { text, options, answer, difficulty } = req.body;
    const questions = readJSON('questions.json');
    const id = questions.length ? questions[questions.length -1].id + 1 : 1;
    questions.push({ id, text, options, answer, difficulty });
    writeJSON('questions.json', questions);
    res.json({ success: true });
});

// Admin route: schedule quiz
app.post('/schedule-quiz', requireLogin, requireRole('admin'), (req, res) => {
    const { date, startTime, endTime, questionIds } = req.body;
    const quizzes = readJSON('quizzes.json');
    quizzes.push({ date, startTime, endTime, questionIds });
    writeJSON('quizzes.json', quizzes);
    res.json({ success: true });
});

// Admin route: add user
app.post('/add-user', requireLogin, requireRole('admin'), (req, res) => {
    const { username, password, role, fullName, className } = req.body;
    const users = readJSON('users.json');
    const id = users.length ? users[users.length -1].id + 1 : 1;
    users.push({ id, username, password, role, fullName, class: className });
    writeJSON('users.json', users);
    res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
