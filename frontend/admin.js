// Admin dashboard functionality

// Load required scripts
const scripts = ['database.js', 'auth.js'];
scripts.forEach(src => {
    const script = document.createElement('script');
    script.src = src;
    document.head.appendChild(script);
});

let currentUser = null;

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeAdminDashboard();
    }, 200);
});

function initializeAdminDashboard() {
    // Check authentication
    currentUser = requireAuth('admin');
    if (!currentUser) return;

    // Display admin name
    document.getElementById('adminName').textContent = `Welcome, ${currentUser.fullName}!`;

    // Initialize forms
    initializeForms();
    
    // Load existing data
    loadQuestions();
    loadScheduledQuizzes();
    loadUsers();
    populateQuestionDropdowns();
}

function initializeForms() {
    // Question form
    document.getElementById('questionForm').addEventListener('submit', handleQuestionSubmit);
    
    // Schedule form
    document.getElementById('scheduleForm').addEventListener('submit', handleScheduleSubmit);
    
    // User form
    document.getElementById('userForm').addEventListener('submit', handleUserSubmit);
    
    // User role change handler
    document.getElementById('userRole').addEventListener('change', function() {
        const classGroup = document.getElementById('classGroup');
        if (this.value === 'student') {
            classGroup.style.display = 'block';
            document.getElementById('userClass').required = true;
        } else {
            classGroup.style.display = 'none';
            document.getElementById('userClass').required = false;
        }
    });
}

function showTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => button.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

function handleQuestionSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const questionData = {
        questionText: formData.get('questionText'),
        optionA: formData.get('optionA'),
        optionB: formData.get('optionB'),
        optionC: formData.get('optionC'),
        optionD: formData.get('optionD'),
        correctAnswer: formData.get('correctAnswer'),
        difficulty: formData.get('difficulty')
    };
    
    // Add question to database
    db.addQuestion(questionData);
    
    // Reset form
    e.target.reset();
    
    // Reload questions list
    loadQuestions();
    populateQuestionDropdowns();
    
    alert('Question added successfully!');
}

function handleScheduleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const scheduleData = {
        quizDate: formData.get('quizDate'),
        startTime: formData.get('startTime'),
        endTime: formData.get('endTime'),
        question1: formData.get('question1'),
        question2: formData.get('question2')
    };
    
    // Validate that different questions are selected
    if (scheduleData.question1 === scheduleData.question2) {
        alert('Please select different questions for Question 1 and Question 2');
        return;
    }
    
    // Check if quiz already exists for this date
    const existingQuiz = db.getQuizSchedules().find(quiz => quiz.quizDate === scheduleData.quizDate);
    if (existingQuiz) {
        if (!confirm('A quiz is already scheduled for this date. Do you want to replace it?')) {
            return;
        }
        // In a real app, you would update the existing quiz
        // For now, we'll just add a new one
    }
    
    // Add schedule to database
    db.addQuizSchedule(scheduleData);
    
    // Reset form
    e.target.reset();
    
    // Reload scheduled quizzes
    loadScheduledQuizzes();
    
    alert('Quiz scheduled successfully!');
}

function handleUserSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = {
        username: formData.get('newUsername'),
        password: formData.get('newPassword'),
        fullName: formData.get('fullName'),
        role: formData.get('userRole'),
        class: formData.get('userClass') || null
    };
    
    // Check if username already exists
    const existingUser = db.getUsers().find(user => user.username === userData.username);
    if (existingUser) {
        alert('Username already exists. Please choose a different username.');
        return;
    }
    
    // Add user to database
    db.addUser(userData);
    
    // Reset form
    e.target.reset();
    
    // Reload users list
    loadUsers();
    
    alert('User added successfully!');
}

function loadQuestions() {
    const questions = db.getQuestions();
    const questionsList = document.getElementById('questionsList');
    
    questionsList.innerHTML = '';
    
    questions.forEach(question => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        questionDiv.innerHTML = `
            <div class="question-text">
                <strong>Q:</strong> ${question.questionText}<br>
                <small><strong>A:</strong> ${question.optionA} | <strong>B:</strong> ${question.optionB} | <strong>C:</strong> ${question.optionC} | <strong>D:</strong> ${question.optionD}</small><br>
                <small><strong>Correct:</strong> ${question.correctAnswer} | <strong>Difficulty:</strong> ${question.difficulty}</small>
            </div>
            <div class="actions">
                <button class="btn-delete" onclick="deleteQuestion(${question.id})">Delete</button>
            </div>
        `;
        questionsList.appendChild(questionDiv);
    });
}

function loadScheduledQuizzes() {
    const schedules = db.getQuizSchedules();
    const scheduledList = document.getElementById('scheduledList');
    
    scheduledList.innerHTML = '';
    
    schedules.forEach(schedule => {
        const question1 = db.getQuestionById(parseInt(schedule.question1));
        const question2 = db.getQuestionById(parseInt(schedule.question2));
        
        const scheduleDiv = document.createElement('div');
        scheduleDiv.className = 'schedule-item';
        scheduleDiv.innerHTML = `
            <div>
                <strong>Date:</strong> ${schedule.quizDate}<br>
                <strong>Time:</strong> ${schedule.startTime} - ${schedule.endTime}<br>
                <strong>Questions:</strong> ${question1?.questionText.substring(0, 50)}... | ${question2?.questionText.substring(0, 50)}...
            </div>
            <div class="actions">
                <button class="btn-delete" onclick="deleteSchedule(${schedule.id})">Delete</button>
            </div>
        `;
        scheduledList.appendChild(scheduleDiv);
    });
}

function loadUsers() {
    const users = db.getUsers();
    const usersList = document.getElementById('usersList');
    
    usersList.innerHTML = '';
    
    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-item';
        userDiv.innerHTML = `
            <div>
                <strong>${user.fullName}</strong> (${user.username})<br>
                <small>Role: ${user.role}${user.class ? ` | Class: ${user.class}` : ''}</small>
            </div>
            <div class="actions">
                <button class="btn-delete" onclick="deleteUser(${user.id})">Delete</button>
            </div>
        `;
        usersList.appendChild(userDiv);
    });
}

function populateQuestionDropdowns() {
    const questions = db.getQuestions();
    const question1Select = document.getElementById('question1');
    const question2Select = document.getElementById('question2');
    
    // Clear existing options (except first one)
    question1Select.innerHTML = '<option value="">Select Question</option>';
    question2Select.innerHTML = '<option value="">Select Question</option>';
    
    questions.forEach(question => {
        const option1 = document.createElement('option');
        option1.value = question.id;
        option1.textContent = `${question.questionText.substring(0, 50)}...`;
        question1Select.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = question.id;
        option2.textContent = `${question.questionText.substring(0, 50)}...`;
        question2Select.appendChild(option2);
    });
}

function deleteQuestion(id) {
    if (confirm('Are you sure you want to delete this question?')) {
        db.deleteQuestion(id);
        loadQuestions();
        populateQuestionDropdowns();
        alert('Question deleted successfully!');
    }
}

function deleteSchedule(id) {
    if (confirm('Are you sure you want to delete this scheduled quiz?')) {
        // In a real app, you would implement deleteSchedule in database.js
        const schedules = db.getQuizSchedules();
        const filteredSchedules = schedules.filter(s => s.id !== id);
        localStorage.setItem('quizSchedules', JSON.stringify(filteredSchedules));
        loadScheduledQuizzes();
        alert('Scheduled quiz deleted successfully!');
    }
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        // In a real app, you would implement deleteUser in database.js
        const users = db.getUsers();
        const filteredUsers = users.filter(u => u.id !== id);
        localStorage.setItem('users', JSON.stringify(filteredUsers));
        loadUsers();
        alert('User deleted successfully!');
    }
}
