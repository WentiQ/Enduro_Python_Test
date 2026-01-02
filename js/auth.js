// Authentication and User Management

// Initialize default admin if not exists
function initializeDefaultUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
        // Create default admin
        users.push({
            email: 'admin@test.com',
            name: 'Admin',
            role: 'admin',
            department: 'Administration',
            whatsapp: '+1234567890',
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Google Sign-In callback
function handleCredentialResponse(response) {
    try {
        // Decode JWT token
        const payload = parseJwt(response.credential);
        
        // Check if user exists
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        let user = users.find(u => u.email === payload.email);
        
        // Check if this is admin login
        const urlParams = new URLSearchParams(window.location.search);
        const isAdminLogin = urlParams.get('admin') === 'true';
        
        if (!user) {
            // New user - need additional info
            if (isAdminLogin) {
                alert('Admin account not found. Please use student login to register.');
                return;
            }
            
            // Store temp user data
            sessionStorage.setItem('tempUser', JSON.stringify({
                email: payload.email,
                name: payload.name,
                picture: payload.picture
            }));
            
            // Show additional info form
            document.getElementById('additional-info').style.display = 'block';
            document.getElementById('login-message').textContent = 'Please provide additional information';
        } else {
            // Existing user
            if (isAdminLogin && user.role !== 'admin') {
                alert('Access denied. Admin credentials required.');
                return;
            }
            
            if (!isAdminLogin && user.role === 'admin') {
                alert('Please use admin login for administrator access.');
                return;
            }
            
            // Set current user and redirect
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            if (user.role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'student-dashboard.html';
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
}

// Handle additional info form submission
document.addEventListener('DOMContentLoaded', function() {
    initializeDefaultUsers();
    
    const form = document.getElementById('user-info-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const tempUser = JSON.parse(sessionStorage.getItem('tempUser'));
            const department = document.getElementById('department').value;
            const whatsapp = document.getElementById('whatsapp').value;
            
            // Create new user
            const newUser = {
                email: tempUser.email,
                name: tempUser.name,
                picture: tempUser.picture,
                department: department,
                whatsapp: whatsapp,
                role: 'student',
                createdAt: new Date().toISOString()
            };
            
            // Save user
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Set as current user
            sessionStorage.setItem('currentUser', JSON.stringify(newUser));
            sessionStorage.removeItem('tempUser');
            
            // Redirect to dashboard
            window.location.href = 'student-dashboard.html';
        });
    }
});

// Parse JWT token
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error parsing JWT:', error);
        return null;
    }
}

// Get current logged-in user
function getCurrentUser() {
    const userJson = sessionStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

// Logout function
function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Check authentication
function requireAuth(requiredRole = null) {
    const user = getCurrentUser();
    
    if (!user) {
        window.location.href = 'login.html';
        return false;
    }
    
    if (requiredRole && user.role !== requiredRole) {
        alert('Access denied. Insufficient permissions.');
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

// Demo login function (for testing without Google OAuth)
function demoLogin(role = 'student') {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (role === 'admin') {
        let admin = users.find(u => u.role === 'admin');
        if (!admin) {
            admin = {
                email: 'admin@test.com',
                name: 'Admin User',
                role: 'admin',
                department: 'Administration',
                whatsapp: '+1234567890',
                createdAt: new Date().toISOString()
            };
            users.push(admin);
            localStorage.setItem('users', JSON.stringify(users));
        }
        sessionStorage.setItem('currentUser', JSON.stringify(admin));
        window.location.href = 'admin-dashboard.html';
    } else {
        let student = users.find(u => u.role === 'student');
        if (!student) {
            student = {
                email: 'student@test.com',
                name: 'Demo Student',
                role: 'student',
                department: 'Computer Science',
                whatsapp: '+9876543210',
                createdAt: new Date().toISOString()
            };
            users.push(student);
            localStorage.setItem('users', JSON.stringify(users));
        }
        sessionStorage.setItem('currentUser', JSON.stringify(student));
        window.location.href = 'student-dashboard.html';
    }
}

// Add demo login buttons (for testing)
window.addEventListener('DOMContentLoaded', function() {
    const loginBox = document.querySelector('.login-box');
    if (loginBox && !document.getElementById('demo-logins')) {
        const demoDiv = document.createElement('div');
        demoDiv.id = 'demo-logins';
        demoDiv.style.marginTop = '30px';
        demoDiv.style.padding = '20px';
        demoDiv.style.background = '#f8f9fa';
        demoDiv.style.borderRadius = '10px';
        demoDiv.innerHTML = `
            <p style="font-weight: 600; margin-bottom: 10px; color: #666;">Demo Access (for testing):</p>
            <button onclick="demoLogin('student')" class="btn btn-primary" style="margin-right: 10px;">Student Demo</button>
            <button onclick="demoLogin('admin')" class="btn btn-secondary">Admin Demo</button>
        `;
        loginBox.appendChild(demoDiv);
    }
});
