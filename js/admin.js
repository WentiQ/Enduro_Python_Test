// Admin Dashboard Management

function initAdminDashboard() {
    // Check authentication
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
    
    document.getElementById('admin-name').textContent = user.name;
    
    // Load default tab
    showTab('students');
    
    // Initialize test questions from questions.js if available
    if (typeof initializeTestQuestions === 'function') {
        initializeTestQuestions();
    }
}

// Remove old initialization - now handled by questions.js
// function initializeDefaultTest() { ... }

// Show specific tab
function showTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Load tab data
    switch(tabName) {
        case 'students':
            loadStudents();
            break;
        case 'attempts':
            loadAttempts();
            break;
        case 'tests':
            loadTests();
            break;
    }
}

// Load students
function loadStudents() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const students = users.filter(u => u.role === 'student');
    
    const container = document.getElementById('students-list');
    
    if (students.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">👥</div>
                <div class="empty-state-text">No students registered yet</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <table class="students-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>WhatsApp</th>
                    <th>Registered Date</th>
                    <th>Tests Taken</th>
                </tr>
            </thead>
            <tbody>
                ${students.map(student => {
                    const attempts = getStudentAttempts(student.email);
                    return `
                        <tr>
                            <td>${student.name}</td>
                            <td>${student.email}</td>
                            <td>${student.department || 'N/A'}</td>
                            <td>${student.whatsapp || 'N/A'}</td>
                            <td>${new Date(student.createdAt).toLocaleDateString()}</td>
                            <td>${attempts.length}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

// Filter students
function filterStudents() {
    const searchTerm = document.getElementById('student-search').value.toLowerCase();
    const deptFilter = document.getElementById('dept-filter').value;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    let students = users.filter(u => u.role === 'student');
    
    // Apply filters
    if (searchTerm) {
        students = students.filter(s => 
            s.name.toLowerCase().includes(searchTerm) || 
            s.email.toLowerCase().includes(searchTerm)
        );
    }
    
    if (deptFilter) {
        students = students.filter(s => s.department === deptFilter);
    }
    
    // Display filtered results
    const container = document.getElementById('students-list');
    
    if (students.length === 0) {
        container.innerHTML = '<p class="no-data">No students found matching your criteria.</p>';
        return;
    }
    
    container.innerHTML = `
        <table class="students-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>WhatsApp</th>
                    <th>Registered Date</th>
                    <th>Tests Taken</th>
                </tr>
            </thead>
            <tbody>
                ${students.map(student => {
                    const attempts = getStudentAttempts(student.email);
                    return `
                        <tr>
                            <td>${student.name}</td>
                            <td>${student.email}</td>
                            <td>${student.department || 'N/A'}</td>
                            <td>${student.whatsapp || 'N/A'}</td>
                            <td>${new Date(student.createdAt).toLocaleDateString()}</td>
                            <td>${attempts.length}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

// Get student attempts
function getStudentAttempts(email) {
    const attempts = JSON.parse(localStorage.getItem('testAttempts') || '[]');
    return attempts.filter(a => a.userEmail === email);
}

// Load test attempts
function loadAttempts() {
    const attempts = JSON.parse(localStorage.getItem('testAttempts') || '[]');
    const container = document.getElementById('attempts-list');
    
    // Populate test filter
    const tests = JSON.parse(localStorage.getItem('tests') || '[]');
    const testFilter = document.getElementById('test-filter');
    testFilter.innerHTML = '<option value="">All Tests</option>' + 
        tests.map(t => `<option value="${t.id}">${t.title}</option>`).join('');
    
    if (attempts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <div class="empty-state-text">No test attempts yet</div>
            </div>
        `;
        return;
    }
    
    displayAttempts(attempts);
}

// Display attempts
function displayAttempts(attempts) {
    const container = document.getElementById('attempts-list');
    
    // Sort by submit time (newest first)
    attempts.sort((a, b) => b.submitTime - a.submitTime);
    
    container.innerHTML = `
        <button class="export-btn" onclick="exportAttempts()">📥 Export to CSV</button>
        <table class="attempts-table">
            <thead>
                <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>WhatsApp</th>
                    <th>Test</th>
                    <th>Start Time</th>
                    <th>Submit Time</th>
                    <th>Duration</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                ${attempts.map(attempt => {
                    const scoreClass = attempt.percentage >= 70 ? 'score-good' : 
                                      attempt.percentage >= 40 ? 'score-medium' : 'score-poor';
                    const statusClass = attempt.autoSubmitted ? 'status-auto' : 'status-submitted';
                    
                    return `
                        <tr>
                            <td>${attempt.userName}</td>
                            <td>${attempt.userEmail}</td>
                            <td>${attempt.department || 'N/A'}</td>
                            <td>${attempt.whatsapp || 'N/A'}</td>
                            <td>${attempt.testTitle}</td>
                            <td>${new Date(attempt.startTime).toLocaleString()}</td>
                            <td>${new Date(attempt.submitTime).toLocaleString()}</td>
                            <td>${attempt.elapsedMinutes} min</td>
                            <td class="${scoreClass}">
                                ${attempt.totalScore}/${attempt.maxScore}
                                <br><small>(${attempt.percentage}%)</small>
                            </td>
                            <td>
                                <span class="status-badge ${statusClass}">
                                    ${attempt.autoSubmitted ? 'Auto-Submitted' : 'Submitted'}
                                </span>
                            </td>
                            <td>
                                <button class="btn btn-small" onclick='showAttemptDetails(${JSON.stringify(attempt).replace(/'/g, "&apos;")})'>
                                    View Details
                                </button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

// Filter attempts
function filterAttempts() {
    const searchTerm = document.getElementById('attempt-search').value.toLowerCase();
    const testFilter = document.getElementById('test-filter').value;
    
    let attempts = JSON.parse(localStorage.getItem('testAttempts') || '[]');
    
    // Apply filters
    if (searchTerm) {
        attempts = attempts.filter(a => 
            a.userEmail.toLowerCase().includes(searchTerm) ||
            a.userName.toLowerCase().includes(searchTerm)
        );
    }
    
    if (testFilter) {
        attempts = attempts.filter(a => a.testId === testFilter);
    }
    
    displayAttempts(attempts);
}

// Show attempt details
function showAttemptDetails(attempt) {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px; max-height: 80vh; overflow-y: auto;">
            <h2>Test Attempt Details</h2>
            
            <div class="results-breakdown">
                <h3>Student Information</h3>
                <p><strong>Name:</strong> ${attempt.userName}</p>
                <p><strong>Email:</strong> ${attempt.userEmail}</p>
                <p><strong>Department:</strong> ${attempt.department || 'N/A'}</p>
                <p><strong>WhatsApp:</strong> ${attempt.whatsapp || 'N/A'}</p>
            </div>
            
            <div class="results-breakdown">
                <h3>Test Information</h3>
                <p><strong>Test:</strong> ${attempt.testTitle}</p>
                <p><strong>Start Time:</strong> ${new Date(attempt.startTime).toLocaleString()}</p>
                <p><strong>Submit Time:</strong> ${new Date(attempt.submitTime).toLocaleString()}</p>
                <p><strong>Duration:</strong> ${attempt.elapsedMinutes} minutes</p>
                <p><strong>Status:</strong> ${attempt.autoSubmitted ? 'Auto-Submitted (Time Up)' : 'Manually Submitted'}</p>
            </div>
            
            <div class="results-breakdown">
                <h3>Score Summary</h3>
                <p><strong>Total Score:</strong> ${attempt.totalScore}/${attempt.maxScore} (${attempt.percentage}%)</p>
                
                <h4>Question-wise Scores:</h4>
                ${attempt.questionScores.map(q => `
                    <div class="question-score">
                        <strong>Question ${q.questionNumber}:</strong> ${q.score}/${q.maxScore} marks
                        <br><small>${q.questionText}</small>
                    </div>
                `).join('')}
            </div>
            
            <button onclick="this.parentElement.parentElement.remove()" class="btn btn-primary">
                Close
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

// Export attempts to CSV
function exportAttempts() {
    const attempts = JSON.parse(localStorage.getItem('testAttempts') || '[]');
    
    if (attempts.length === 0) {
        alert('No data to export');
        return;
    }
    
    // Create CSV content
    const headers = ['Student Name', 'Email', 'Department', 'WhatsApp', 'Test', 'Start Time', 'Submit Time', 'Duration (min)', 'Score', 'Max Score', 'Percentage', 'Status'];
    const rows = attempts.map(a => [
        a.userName,
        a.userEmail,
        a.department || 'N/A',
        a.whatsapp || 'N/A',
        a.testTitle,
        new Date(a.startTime).toLocaleString(),
        new Date(a.submitTime).toLocaleString(),
        a.elapsedMinutes,
        a.totalScore,
        a.maxScore,
        a.percentage + '%',
        a.autoSubmitted ? 'Auto-Submitted' : 'Submitted'
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    
    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-attempts-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Load tests
function loadTests() {
    const tests = JSON.parse(localStorage.getItem('tests') || '[]');
    const container = document.getElementById('tests-list');
    
    if (tests.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <div class="empty-state-text">No tests created yet</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="tests-grid">
            ${tests.map(test => `
                <div class="test-card-admin">
                    <h3>${test.title}</h3>
                    <p>${test.description}</p>
                    <p><strong>Duration:</strong> ${test.duration} minutes</p>
                    <p><strong>Available:</strong> ${test.startDate} to ${test.endDate}</p>
                    <div class="test-meta">
                        <span>${test.questions ? test.questions.length : 0} questions</span>
                        <span>Created: ${new Date(test.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div class="test-actions">
                        <button class="btn-edit" onclick="editTest('${test.id}')">Edit</button>
                        <button class="btn-delete" onclick="deleteTest('${test.id}')">Delete</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Show add test form
function showAddTestForm() {
    document.getElementById('add-test-form').style.display = 'block';
}

// Hide add test form
function hideAddTestForm() {
    document.getElementById('add-test-form').style.display = 'none';
    document.getElementById('test-title').value = '';
    document.getElementById('test-desc').value = '';
    document.getElementById('test-duration').value = '60';
    document.getElementById('test-start').value = '';
    document.getElementById('test-end').value = '';
}

// Save test
function saveTest(event) {
    event.preventDefault();
    
    const title = document.getElementById('test-title').value;
    const description = document.getElementById('test-desc').value;
    const duration = parseInt(document.getElementById('test-duration').value);
    const startDate = document.getElementById('test-start').value;
    const endDate = document.getElementById('test-end').value;
    
    const newTest = {
        id: 'test' + Date.now(),
        title: title,
        description: description,
        duration: duration,
        startDate: startDate,
        endDate: endDate,
        questions: [],
        createdAt: new Date().toISOString()
    };
    
    const tests = JSON.parse(localStorage.getItem('tests') || '[]');
    tests.push(newTest);
    localStorage.setItem('tests', JSON.stringify(tests));
    
    hideAddTestForm();
    loadTests();
    
    alert('Test created successfully! You can add questions by editing the test.');
}

// Edit test
function editTest(testId) {
    alert('Test editing feature: In a full implementation, this would open a form to edit test details and manage questions.');
}

// Delete test
function deleteTest(testId) {
    if (!confirm('Are you sure you want to delete this test? This action cannot be undone.')) {
        return;
    }
    
    let tests = JSON.parse(localStorage.getItem('tests') || '[]');
    tests = tests.filter(t => t.id !== testId);
    localStorage.setItem('tests', JSON.stringify(tests));
    
    loadTests();
}

// Reinitialize tests - force reload Enduro Python Test
function reinitializeTests() {
    if (!confirm('This will reload the Enduro Python Test with all questions. Continue?')) {
        return;
    }
    
    // Call the initialization function from questions.js
    if (typeof initializeTestQuestions === 'function') {
        initializeTestQuestions();
        loadTests();
        alert('Enduro Python Test has been reinitialized successfully!');
    } else {
        alert('Error: questions.js not loaded properly. Please refresh the page.');
    }
}
