// Demo data setup script
// Run this to populate the database with sample data

// Load database
const script = document.createElement('script');
script.src = 'database.js';
document.head.appendChild(script);

setTimeout(() => {
    setupDemoData();
}, 100);

function setupDemoData() {
    console.log('Setting up demo data...');
    
    // Add more sample questions
    const additionalQuestions = [
        {
            questionText: 'What is the space complexity of merge sort?',
            optionA: 'O(1)',
            optionB: 'O(log n)',
            optionC: 'O(n)',
            optionD: 'O(n²)',
            correctAnswer: 'C',
            difficulty: 'medium'
        },
        {
            questionText: 'Which of the following is NOT a programming paradigm?',
            optionA: 'Object-Oriented',
            optionB: 'Functional',
            optionC: 'Procedural',
            optionD: 'Algorithmic',
            correctAnswer: 'D',
            difficulty: 'easy'
        },
        {
            questionText: 'What does the "Big O" notation describe?',
            optionA: 'Memory usage',
            optionB: 'Code readability',
            optionC: 'Algorithm efficiency',
            optionD: 'Program size',
            correctAnswer: 'C',
            difficulty: 'medium'
        },
        {
            questionText: 'In which data structure is insertion and deletion performed at the same end?',
            optionA: 'Queue',
            optionB: 'Stack',
            optionC: 'Array',
            optionD: 'Tree',
            correctAnswer: 'B',
            difficulty: 'easy'
        },
        {
            questionText: 'What is the worst-case time complexity of quicksort?',
            optionA: 'O(n log n)',
            optionB: 'O(n)',
            optionC: 'O(n²)',
            optionD: 'O(log n)',
            correctAnswer: 'C',
            difficulty: 'hard'
        },
        {
            questionText: 'Which sorting algorithm is stable?',
            optionA: 'Quick Sort',
            optionB: 'Heap Sort',
            optionC: 'Merge Sort',
            optionD: 'Selection Sort',
            correctAnswer: 'C',
            difficulty: 'medium'
        }
    ];
    
    // Add questions to database
    additionalQuestions.forEach(question => {
        db.addQuestion(question);
    });
    
    // Add more sample users
    const additionalUsers = [
        {
            username: 'student4',
            password: 'student123',
            role: 'student',
            fullName: 'David Brown',
            class: 'IT-A'
        },
        {
            username: 'student5',
            password: 'student123',
            role: 'student',
            fullName: 'Emma Wilson',
            class: 'IT-A'
        },
        {
            username: 'student6',
            password: 'student123',
            role: 'student',
            fullName: 'Frank Miller',
            class: 'IT-B'
        },
        {
            username: 'student7',
            password: 'student123',
            role: 'student',
            fullName: 'Grace Taylor',
            class: 'IT-B'
        },
        {
            username: 'faculty2',
            password: 'faculty123',
            role: 'faculty',
            fullName: 'Prof. Sarah Johnson',
            class: null
        }
    ];
    
    // Add users to database
    additionalUsers.forEach(user => {
        db.addUser(user);
    });
    
    // Schedule a sample quiz for today
    const today = new Date().toISOString().split('T')[0];
    const sampleSchedule = {
        quizDate: today,
        startTime: '09:00',
        endTime: '23:59',
        question1: '1',
        question2: '2'
    };
    
    // Check if today's quiz already exists
    const existingQuiz = db.getTodayQuiz();
    if (!existingQuiz) {
        db.addQuizSchedule(sampleSchedule);
        console.log('Added sample quiz for today');
    }
    
    // Add some sample quiz attempts for demonstration
    const sampleAttempts = [
        {
            userId: 3, // Alice Johnson
            date: today,
            question1Id: 1,
            question2Id: 2,
            q1Answer: 'B',
            q2Answer: 'C',
            score: 2,
            percentage: 100,
            timeTaken: 180
        },
        {
            userId: 4, // Bob Wilson
            date: today,
            question1Id: 1,
            question2Id: 2,
            q1Answer: 'B',
            q2Answer: 'A',
            score: 1,
            percentage: 50,
            timeTaken: 240
        }
    ];
    
    // Add sample attempts (only if they don't exist)
    sampleAttempts.forEach(attempt => {
        const existing = db.getUserQuizAttempt(attempt.userId, attempt.date);
        if (!existing) {
            db.addQuizAttempt(attempt);
        }
    });
    
    console.log('Demo data setup complete!');
    console.log('You can now:');
    console.log('1. Login as admin (admin/admin123) to manage questions and schedules');
    console.log('2. Login as faculty (faculty1/faculty123) to view student performance');
    console.log('3. Login as student (student1/student123) to take the quiz');
    
    // Show success message
    if (document.body) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <h3>Demo Data Setup Complete!</h3>
            <p>Sample questions, users, and quiz schedule have been added.</p>
            <p>You can now test all features of the application.</p>
        `;
        document.body.appendChild(successDiv);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
}

// Auto-run if this script is loaded directly
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        // Only run if we're on the main page and database is available
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
            setTimeout(setupDemoData, 500);
        }
    });
}
