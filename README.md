<<<<<<< HEAD
# Daily Coding Challenge Website

A comprehensive web application for conducting daily coding challenges for students, with management interfaces for faculty and administrators.

## Features

### 🎓 Student Features
- **Daily Quiz Access**: Students can attempt one technical quiz per day
- **Timed Quizzes**: Each quiz has 2 questions with 4 multiple-choice options
- **Real-time Timer**: Shows remaining time for quiz completion
- **Instant Results**: View score and time taken immediately after submission
- **Quiz History**: Track previous quiz attempts and scores

### 👨‍🏫 Faculty Features
- **Student Performance Dashboard**: View comprehensive student performance data
- **Class-wise Filtering**: Filter results by specific classes (CSE-A, CSE-B, IT-A, IT-B)
- **Weekly Reports**: View current week, last week, or all-time performance
- **Completion Tracking**: See which students completed or missed daily quizzes
- **Statistics Overview**: Total students, completion rates, and average scores

### 🔧 Admin Features
- **Question Management**: Add, view, and delete quiz questions
- **Quiz Scheduling**: Schedule daily quizzes with specific time slots
- **User Management**: Add new students, faculty, and admin users
- **Time Control**: Set start and end times for daily quizzes

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js with Express.js
- **Data Storage**: LocalStorage (for demo) / JSON files
- **Styling**: Custom CSS with responsive design

## Installation & Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation Steps

1. **Clone or download the project files**
   ```bash
   # If using git
   git clone <repository-url>
   cd daily-coding-challenge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

4. **Access the application**
   Open your web browser and navigate to:
   ```
   http://localhost:3000
   ```

## Default Login Credentials

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: Admin

### Faculty Account
- **Username**: `faculty1`
- **Password**: `faculty123`
- **Role**: Faculty

### Student Accounts
- **Username**: `student1`
- **Password**: `student123`
- **Role**: Student
- **Class**: CSE-A

## Usage Guide

### For Students
1. Login with student credentials
2. Check if today's quiz is available
3. Complete the quiz within the time limit
4. View your results and performance history

### For Faculty
1. Login with faculty credentials
2. Use filters to view specific classes or time periods
3. Monitor student completion rates and performance
4. Export or analyze student data

### For Administrators
1. Login with admin credentials
2. **Manage Questions**: Add new coding questions with multiple-choice answers
3. **Schedule Quizzes**: Set up daily quizzes with specific questions and time slots
4. **Manage Users**: Add new students, faculty members, or administrators

## File Structure

```
daily-coding-challenge/
├── index.html          # Login page
├── student.html        # Student dashboard
├── faculty.html        # Faculty dashboard
├── admin.html          # Admin dashboard
├── styles.css          # Main stylesheet
├── auth.js            # Authentication logic
├── student.js         # Student functionality
├── faculty.js         # Faculty functionality
├── admin.js           # Admin functionality
├── database.js        # Database simulation
├── server.js          # Node.js server
├── package.json       # Node.js dependencies
└── README.md          # This file
```

## Features in Detail

### Quiz System
- **Time-based Access**: Quizzes are only available during scheduled hours
- **Single Attempt**: Students can only attempt each daily quiz once
- **Automatic Scoring**: Immediate feedback with percentage scores
- **Performance Tracking**: Historical data for analysis

### Security Features
- **Role-based Access**: Different interfaces for students, faculty, and admin
- **Session Management**: Secure login sessions
- **Input Validation**: Form validation and error handling

### Responsive Design
- **Mobile-friendly**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface
- **Accessibility**: Keyboard navigation and screen reader support

## Customization

### Adding New Classes
Edit the class options in the HTML files:
- `admin.html` (user management)
- `faculty.html` (filtering options)

### Modifying Quiz Duration
Update the timer logic in `student.js` and scheduling in `admin.js`.

### Database Integration
Replace the localStorage implementation in `database.js` with actual database connections (MySQL, PostgreSQL, MongoDB, etc.).

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Change port in server.js or kill existing process
   lsof -ti:3000 | xargs kill -9
   ```

2. **Dependencies Not Installing**
   ```bash
   # Clear npm cache and reinstall
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```

3. **Login Issues**
   - Verify credentials match the default accounts
   - Check browser console for JavaScript errors
   - Clear browser cache and localStorage

## Future Enhancements

- [ ] Real database integration
- [ ] Email notifications for quiz reminders
- [ ] Advanced analytics and reporting
- [ ] Question categories and difficulty levels
- [ ] Bulk user import/export
- [ ] API documentation
- [ ] Unit tests and integration tests

## Support

For issues or questions, please check the troubleshooting section or contact the development team.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
=======
# DCD
>>>>>>> a5f45c2ce2ec79e5d289ca4d0eb0944c6d889f57
