// Database simulation using localStorage
// In a real application, this would be replaced with actual database operations

class Database {
    constructor() {
        this.initializeDatabase();
    }

    initializeDatabase() {
        // Initialize default data if not exists
        if (!localStorage.getItem('users')) {
            const defaultUsers = [
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
                },
                {
                    id: 4,
                    username: 'student2',
                    password: 'student123',
                    role: 'student',
                    fullName: 'Bob Wilson',
                    class: 'CSE-A'
                },
                {
                    id: 5,
                    username: 'student3',
                    password: 'student123',
                    role: 'student',
                    fullName: 'Carol Davis',
                    class: 'CSE-B'
                }
            ];
            localStorage.setItem('users', JSON.stringify(defaultUsers));
        }

        if (!localStorage.getItem('questions')) {
            const defaultQuestions = [
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
                },
                {
                    id: 3,
                    questionText: 'What does SQL stand for?',
                    optionA: 'Structured Query Language',
                    optionB: 'Simple Query Language',
                    optionC: 'Standard Query Language',
                    optionD: 'Sequential Query Language',
                    correctAnswer: 'A',
                    difficulty: 'easy'
                },
                {
                    id: 4,
                    questionText: 'Which sorting algorithm has the best average case time complexity?',
                    optionA: 'Bubble Sort',
                    optionB: 'Selection Sort',
                    optionC: 'Quick Sort',
                    optionD: 'Insertion Sort',
                    correctAnswer: 'C',
                    difficulty: 'medium'
                }
            ];
            localStorage.setItem('questions', JSON.stringify(defaultQuestions));
        }

        if (!localStorage.getItem('quizSchedules')) {
            localStorage.setItem('quizSchedules', JSON.stringify([]));
        }

        if (!localStorage.getItem('quizAttempts')) {
            localStorage.setItem('quizAttempts', JSON.stringify([]));
        }
    }

    // User operations
    getUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    }

    getUserById(id) {
        const users = this.getUsers();
        return users.find(user => user.id === id);
    }

    getUserByCredentials(username, password, role) {
        const users = this.getUsers();
        return users.find(user => 
            user.username === username && 
            user.password === password && 
            user.role === role
        );
    }

    addUser(userData) {
        const users = this.getUsers();
        const newUser = {
            id: Math.max(...users.map(u => u.id), 0) + 1,
            ...userData
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        return newUser;
    }

    // Question operations
    getQuestions() {
        return JSON.parse(localStorage.getItem('questions') || '[]');
    }

    getQuestionById(id) {
        const questions = this.getQuestions();
        return questions.find(q => q.id === id);
    }

    addQuestion(questionData) {
        const questions = this.getQuestions();
        const newQuestion = {
            id: Math.max(...questions.map(q => q.id), 0) + 1,
            ...questionData
        };
        questions.push(newQuestion);
        localStorage.setItem('questions', JSON.stringify(questions));
        return newQuestion;
    }

    deleteQuestion(id) {
        const questions = this.getQuestions();
        const filteredQuestions = questions.filter(q => q.id !== id);
        localStorage.setItem('questions', JSON.stringify(filteredQuestions));
    }

    // Quiz schedule operations
    getQuizSchedules() {
        return JSON.parse(localStorage.getItem('quizSchedules') || '[]');
    }

    addQuizSchedule(scheduleData) {
        const schedules = this.getQuizSchedules();
        const newSchedule = {
            id: Math.max(...schedules.map(s => s.id), 0) + 1,
            ...scheduleData
        };
        schedules.push(newSchedule);
        localStorage.setItem('quizSchedules', JSON.stringify(schedules));
        return newSchedule;
    }

    getTodayQuiz() {
        const schedules = this.getQuizSchedules();
        const today = new Date().toISOString().split('T')[0];
        return schedules.find(schedule => schedule.quizDate === today);
    }

    // Quiz attempt operations
    getQuizAttempts() {
        return JSON.parse(localStorage.getItem('quizAttempts') || '[]');
    }

    addQuizAttempt(attemptData) {
        const attempts = this.getQuizAttempts();
        const newAttempt = {
            id: Math.max(...attempts.map(a => a.id), 0) + 1,
            timestamp: new Date().toISOString(),
            ...attemptData
        };
        attempts.push(newAttempt);
        localStorage.setItem('quizAttempts', JSON.stringify(attempts));
        return newAttempt;
    }

    getUserQuizAttempt(userId, date) {
        const attempts = this.getQuizAttempts();
        return attempts.find(attempt => 
            attempt.userId === userId && 
            attempt.date === date
        );
    }

    getQuizAttemptsByDate(date) {
        const attempts = this.getQuizAttempts();
        return attempts.filter(attempt => attempt.date === date);
    }
}

// Create global database instance
const db = new Database();
