// Authentication and login functionality

// Load database
const script = document.createElement('script');
script.src = 'database.js';
document.head.appendChild(script);

// Wait for database to load
setTimeout(() => {
    initializeAuth();
}, 100);

function initializeAuth() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        // Clear previous error messages
        errorMessage.textContent = '';

        // Validate inputs
        if (!username || !password || !role) {
            showError('Please fill in all fields');
            return;
        }

        // Authenticate user
        const user = db.getUserByCredentials(username, password, role);
        
        if (user) {
            // Store user session
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            // Redirect based on role
            switch (role) {
                case 'student':
                    window.location.href = 'student.html';
                    break;
                case 'faculty':
                    window.location.href = 'faculty.html';
                    break;
                case 'admin':
                    window.location.href = 'admin.html';
                    break;
                default:
                    showError('Invalid role selected');
            }
        } else {
            showError('Invalid username, password, or role');
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
}

// Check if user is already logged in
function checkAuth() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        const currentPage = window.location.pathname.split('/').pop();
        
        // Redirect to appropriate page if on wrong page
        if (currentPage === 'index.html' || currentPage === '') {
            switch (user.role) {
                case 'student':
                    window.location.href = 'student.html';
                    break;
                case 'faculty':
                    window.location.href = 'faculty.html';
                    break;
                case 'admin':
                    window.location.href = 'admin.html';
                    break;
            }
        }
    }
}

// Logout function
function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Protect pages - redirect to login if not authenticated
function requireAuth(requiredRole = null) {
    const currentUser = sessionStorage.getItem('currentUser');
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return null;
    }
    
    const user = JSON.parse(currentUser);
    
    if (requiredRole && user.role !== requiredRole) {
        window.location.href = 'index.html';
        return null;
    }
    
    return user;
}

// Get current user
function getCurrentUser() {
    const currentUser = sessionStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Only check auth on login page
    if (currentPage === 'index.html' || currentPage === '') {
        checkAuth();
    }
});
