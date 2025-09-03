// Student dashboard functionality

// Load required scripts
const scripts = ['database.js', 'auth.js'];
scripts.forEach(src => {
    const script = document.createElement('script');
    script.src = src;
    document.head.appendChild(script);
});

let currentUser = null;
let currentQuiz = null;
let quizStartTime = null;

// Initialize student dashboard
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeStudentDashboard();
    }, 200);
});

function initializeStudentDashboard() {
    // Check authentication
    currentUser = requireAuth('student');
    if (!currentUser) return;

    // Display student name
    document.getElementById('studentName').textContent = `Welcome, ${currentUser.fullName}!`;

    // Load today's quiz
    loadTodayQuiz();
}

function loadTodayQuiz() {
    const today = new Date().toISOString().split('T')[0];
    const todayQuiz = db.getTodayQuiz();
    
    // Check if student has already attempted today's quiz
    const existingAttempt = db.getUserQuizAttempt(currentUser.id, today);
    
    if (existingAttempt) {
        showQuizCompleted(existingAttempt);
        return;
    }
    
    if (!todayQuiz) {
        showQuizUnavailable();
        return;
    }
    
    // Check if quiz is currently active
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                       now.getMinutes().toString().padStart(2, '0');
    
    if (currentTime < todayQuiz.startTime || currentTime > todayQuiz.endTime) {
        showQuizUnavailable(`Quiz is available from ${todayQuiz.startTime} to ${todayQuiz.endTime}`);
        return;
    }
    
    // Load and display the quiz
    currentQuiz = todayQuiz;
    displayQuiz(todayQuiz);
}

function displayQuiz(quiz) {
    const question1 = db.getQuestionById(parseInt(quiz.question1));
    const question2 = db.getQuestionById(parseInt(quiz.question2));
    
    if (!question1 || !question2) {
        showQuizUnavailable('Quiz questions are not available');
        return;
    }
    
    // Show quiz section
    document.getElementById('quizAvailable').style.display = 'block';
    document.getElementById('quizCompleted').style.display = 'none';
    document.getElementById('quizUnavailable').style.display = 'none';
    
    // Populate question 1
    document.getElementById('q1Text').textContent = question1.questionText;
    document.getElementById('q1optA').textContent = question1.optionA;
    document.getElementById('q1optB').textContent = question1.optionB;
    document.getElementById('q1optC').textContent = question1.optionC;
    document.getElementById('q1optD').textContent = question1.optionD;
    
    // Populate question 2
    document.getElementById('q2Text').textContent = question2.questionText;
    document.getElementById('q2optA').textContent = question2.optionA;
    document.getElementById('q2optB').textContent = question2.optionB;
    document.getElementById('q2optC').textContent = question2.optionC;
    document.getElementById('q2optD').textContent = question2.optionD;
    
    // Start timer
    quizStartTime = new Date();
    startQuizTimer(quiz.endTime);
}

function startQuizTimer(endTime) {
    const timerElement = document.getElementById('quizTimer');
    
    function updateTimer() {
        const now = new Date();
        const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                           now.getMinutes().toString().padStart(2, '0');
        
        if (currentTime >= endTime) {
            timerElement.textContent = 'Quiz time has expired!';
            timerElement.style.color = '#dc3545';
            document.getElementById('submitQuiz').disabled = true;
            return;
        }
        
        // Calculate remaining time
        const endDateTime = new Date();
        const [endHour, endMinute] = endTime.split(':');
        endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);
        
        const remainingMs = endDateTime - now;
        const remainingMinutes = Math.floor(remainingMs / 60000);
        const remainingSeconds = Math.floor((remainingMs % 60000) / 1000);
        
        timerElement.textContent = `Time remaining: ${remainingMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        
        if (remainingMinutes < 5) {
            timerElement.style.color = '#dc3545';
        } else if (remainingMinutes < 10) {
            timerElement.style.color = '#ffc107';
        } else {
            timerElement.style.color = '#28a745';
        }
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

function submitQuiz() {
    if (!currentQuiz) return;
    
    // Get selected answers
    const q1Answer = document.querySelector('input[name="q1"]:checked');
    const q2Answer = document.querySelector('input[name="q2"]:checked');
    
    if (!q1Answer || !q2Answer) {
        alert('Please answer both questions before submitting.');
        return;
    }
    
    // Calculate score
    const question1 = db.getQuestionById(parseInt(currentQuiz.question1));
    const question2 = db.getQuestionById(parseInt(currentQuiz.question2));
    
    let score = 0;
    if (q1Answer.value === question1.correctAnswer) score++;
    if (q2Answer.value === question2.correctAnswer) score++;
    
    const percentage = (score / 2) * 100;
    
    // Calculate time taken
    const endTime = new Date();
    const timeTaken = Math.round((endTime - quizStartTime) / 1000); // in seconds
    
    // Save quiz attempt
    const attempt = {
        userId: currentUser.id,
        date: new Date().toISOString().split('T')[0],
        question1Id: parseInt(currentQuiz.question1),
        question2Id: parseInt(currentQuiz.question2),
        q1Answer: q1Answer.value,
        q2Answer: q2Answer.value,
        score: score,
        percentage: percentage,
        timeTaken: timeTaken
    };
    
    db.addQuizAttempt(attempt);
    
    // Show results
    showQuizCompleted(attempt);
}

function showQuizCompleted(attempt) {
    document.getElementById('quizAvailable').style.display = 'none';
    document.getElementById('quizCompleted').style.display = 'block';
    document.getElementById('quizUnavailable').style.display = 'none';
    
    const resultsDiv = document.getElementById('quizResults');
    resultsDiv.innerHTML = `
        <div class="quiz-results">
            <h3>Your Results:</h3>
            <p><strong>Score:</strong> ${attempt.score}/2 (${attempt.percentage}%)</p>
            <p><strong>Time Taken:</strong> ${Math.floor(attempt.timeTaken / 60)}:${(attempt.timeTaken % 60).toString().padStart(2, '0')}</p>
            <p><strong>Date:</strong> ${new Date(attempt.timestamp || attempt.date).toLocaleDateString()}</p>
        </div>
    `;
}

function showQuizUnavailable(message = null) {
    document.getElementById('quizAvailable').style.display = 'none';
    document.getElementById('quizCompleted').style.display = 'none';
    document.getElementById('quizUnavailable').style.display = 'block';
    
    if (message) {
        const unavailableDiv = document.getElementById('quizUnavailable');
        const messageP = unavailableDiv.querySelector('p:last-child');
        messageP.textContent = message;
    }
}
