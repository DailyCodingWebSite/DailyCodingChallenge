// Faculty dashboard functionality

// Load required scripts
const scripts = ['database.js', 'auth.js'];
scripts.forEach(src => {
    const script = document.createElement('script');
    script.src = src;
    document.head.appendChild(script);
});

let currentUser = null;
let allStudents = [];
let allAttempts = [];

// Initialize faculty dashboard
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeFacultyDashboard();
    }, 200);
});

function initializeFacultyDashboard() {
    // Check authentication
    currentUser = requireAuth('faculty');
    if (!currentUser) return;

    // Display faculty name
    document.getElementById('facultyName').textContent = `Welcome, ${currentUser.fullName}!`;

    // Load data
    loadStudentData();
    updateDashboard();
}

function loadStudentData() {
    // Get all students
    const users = db.getUsers();
    allStudents = users.filter(user => user.role === 'student');
    
    // Get all quiz attempts
    allAttempts = db.getQuizAttempts();
}

function filterData() {
    const classFilter = document.getElementById('classFilter').value;
    const weekFilter = document.getElementById('weekFilter').value;
    
    updateDashboard(classFilter, weekFilter);
}

function updateDashboard(classFilter = '', weekFilter = 'current') {
    // Filter students by class
    let filteredStudents = allStudents;
    if (classFilter) {
        filteredStudents = allStudents.filter(student => student.class === classFilter);
    }
    
    // Get date range based on week filter
    const dateRange = getDateRange(weekFilter);
    
    // Filter attempts by date range
    const filteredAttempts = allAttempts.filter(attempt => {
        const attemptDate = new Date(attempt.date);
        return attemptDate >= dateRange.start && attemptDate <= dateRange.end;
    });
    
    // Update statistics
    updateStatistics(filteredStudents, filteredAttempts);
    
    // Update performance table
    updatePerformanceTable(filteredStudents, filteredAttempts, dateRange);
}

function getDateRange(weekFilter) {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    let start, end;
    
    switch (weekFilter) {
        case 'current':
            // Current week (Monday to Sunday)
            start = new Date(today);
            start.setDate(today.getDate() - currentDay + 1);
            end = new Date(today);
            end.setDate(start.getDate() + 6);
            break;
            
        case 'last':
            // Last week
            start = new Date(today);
            start.setDate(today.getDate() - currentDay - 6);
            end = new Date(today);
            end.setDate(today.getDate() - currentDay);
            break;
            
        case 'all':
        default:
            // All time
            start = new Date('2020-01-01');
            end = new Date();
            break;
    }
    
    return { start, end };
}

function updateStatistics(students, attempts) {
    const today = new Date().toISOString().split('T')[0];
    const todayAttempts = attempts.filter(attempt => attempt.date === today);
    
    // Calculate statistics
    const totalStudents = students.length;
    const completedToday = todayAttempts.length;
    const missedToday = totalStudents - completedToday;
    
    // Calculate average score
    let averageScore = 0;
    if (attempts.length > 0) {
        const totalScore = attempts.reduce((sum, attempt) => sum + attempt.percentage, 0);
        averageScore = Math.round(totalScore / attempts.length);
    }
    
    // Update DOM
    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('completedToday').textContent = completedToday;
    document.getElementById('missedToday').textContent = missedToday;
    document.getElementById('averageScore').textContent = `${averageScore}%`;
}

function updatePerformanceTable(students, attempts, dateRange) {
    const tableBody = document.getElementById('performanceTableBody');
    tableBody.innerHTML = '';
    
    // Create a map of student attempts
    const studentAttempts = new Map();
    attempts.forEach(attempt => {
        if (!studentAttempts.has(attempt.userId)) {
            studentAttempts.set(attempt.userId, []);
        }
        studentAttempts.get(attempt.userId).push(attempt);
    });
    
    // Generate table rows
    students.forEach(student => {
        const userAttempts = studentAttempts.get(student.id) || [];
        
        if (userAttempts.length === 0) {
            // Student has no attempts in the date range
            const dates = generateDateRange(dateRange.start, dateRange.end);
            dates.forEach(date => {
                const row = createTableRow(student, null, date);
                tableBody.appendChild(row);
            });
        } else {
            // Student has attempts
            userAttempts.forEach(attempt => {
                const row = createTableRow(student, attempt, attempt.date);
                tableBody.appendChild(row);
            });
            
            // Add missed days
            const attemptDates = userAttempts.map(a => a.date);
            const allDates = generateDateRange(dateRange.start, dateRange.end);
            const missedDates = allDates.filter(date => !attemptDates.includes(date));
            
            missedDates.forEach(date => {
                const row = createTableRow(student, null, date);
                tableBody.appendChild(row);
            });
        }
    });
}

function createTableRow(student, attempt, date) {
    const row = document.createElement('tr');
    
    const status = attempt ? 'Completed' : 'Missed';
    const score = attempt ? `${attempt.score}/2 (${attempt.percentage}%)` : '-';
    const timeTaken = attempt ? `${Math.floor(attempt.timeTaken / 60)}:${(attempt.timeTaken % 60).toString().padStart(2, '0')}` : '-';
    
    row.innerHTML = `
        <td>${student.fullName}</td>
        <td>${student.class}</td>
        <td>${new Date(date).toLocaleDateString()}</td>
        <td><span class="status-${status.toLowerCase()}">${status}</span></td>
        <td>${score}</td>
        <td>${timeTaken}</td>
    `;
    
    return row;
}

function generateDateRange(start, end) {
    const dates = [];
    const current = new Date(start);
    
    while (current <= end) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
    }
    
    return dates;
}
