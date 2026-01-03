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
        <div class="table-container">
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
        </div>
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
        <div class="table-container">
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
        </div>
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
    
    // Determine max questions across all attempts for dynamic columns
    const maxQuestions = Math.max(...attempts.map(a => a.questionScores?.length || 0), 12);
    
    // Generate question column headers
    const questionHeaders = Array.from({length: maxQuestions}, (_, i) => 
        `<th>Q${i+1}</th>`
    ).join('');
    
    container.innerHTML = `
        <button class="export-btn" onclick="exportAttempts()">📥 Export to CSV</button>
        <div class="table-container">
            <table class="attempts-table">
            <thead>
                <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Group</th>
                    <th>WhatsApp</th>
                    <th>Test</th>
                    <th>Start Time</th>
                    <th>Submit Time</th>
                    <th>Duration</th>
                    ${questionHeaders}
                    <th>Score</th>
                    <th>Status</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                ${attempts.map(attempt => {
                    const scoreClass = attempt.percentage >= 70 ? 'score-good' : 
                                      attempt.percentage >= 40 ? 'score-medium' : 'score-poor';
                    const statusClass = attempt.leftInMiddle ? 'status-left' : (attempt.autoSubmitted ? 'status-auto' : 'status-submitted');
                    
                    // Sort questions by original index for display
                    const sortedQuestionScores = attempt.questionScores 
                        ? [...attempt.questionScores].sort((a, b) => {
                            const aIdx = a.originalIndex !== undefined ? a.originalIndex : a.questionNumber - 1;
                            const bIdx = b.originalIndex !== undefined ? b.originalIndex : b.questionNumber - 1;
                            return aIdx - bIdx;
                        })
                        : [];
                    
                    // Generate individual question marks cells in original order
                    const questionCells = Array.from({length: maxQuestions}, (_, i) => {
                        const qs = sortedQuestionScores[i];
                        if (qs) {
                            console.log(`Original Q${i+1}: passedTestCases=${qs.passedTestCases}, totalTestCases=${qs.totalTestCases}`);
                            const qScoreClass = qs.score === qs.maxScore ? 'score-good' : 
                                               qs.score >= qs.maxScore * 0.5 ? 'score-medium' : 'score-poor';
                            // Handle both old and new format
                            const testCaseInfo = (qs.totalTestCases !== undefined && qs.totalTestCases > 0) 
                                ? `<br><small style="font-size:0.75em">(${qs.passedTestCases || 0}/${qs.totalTestCases} TC)</small>` 
                                : '';
                            return `<td class="${qScoreClass}" style="text-align: center;">${qs.score}/${qs.maxScore}${testCaseInfo}</td>`;
                        }
                        return `<td style="text-align: center;">-</td>`;
                    }).join('');
                    
                    return `
                        <tr>
                            <td>${attempt.userName}</td>
                            <td>${attempt.userEmail}</td>
                            <td>${attempt.department || 'N/A'}</td>
                            <td>${attempt.group || 'N/A'}</td>
                            <td>${attempt.whatsapp || 'N/A'}</td>
                            <td>${attempt.testTitle}</td>
                            <td>${new Date(attempt.startTime).toLocaleString()}</td>
                            <td>${new Date(attempt.submitTime).toLocaleString()}</td>
                            <td>${attempt.elapsedMinutes} min</td>
                            ${questionCells}
                            <td class="${scoreClass}">
                                ${attempt.totalScore}/${attempt.maxScore}
                                <br><small>(${attempt.percentage}%)</small>
                            </td>
                            <td>
                                <span class="status-badge ${statusClass}">
                                    ${attempt.leftInMiddle ? '⚠️ Left in Middle' : (attempt.autoSubmitted ? 'Auto-Submitted' : 'Submitted')}
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
        </div>
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
                <p><strong>Status:</strong> ${attempt.leftInMiddle ? '⚠️ Left in Middle (Back Button)' : (attempt.autoSubmitted ? 'Auto-Submitted (Time Up)' : 'Manually Submitted')}</p>
                ${attempt.leftInMiddle ? '<p style="color: #dc3545; font-weight: 600;">⚠️ Student attempted to leave the test before submitting</p>' : ''}
            </div>
            
            <div class="results-breakdown">
                <h3>Score Summary</h3>
                <p><strong>Total Score:</strong> ${attempt.totalScore}/${attempt.maxScore} (${attempt.percentage}%)</p>
                
                <h4>Question-wise Scores (Original Order):</h4>
                ${attempt.questionScores
                    .sort((a, b) => (a.originalIndex !== undefined ? a.originalIndex : a.questionNumber - 1) - (b.originalIndex !== undefined ? b.originalIndex : b.questionNumber - 1))
                    .map((q, idx) => {
                        const displayNum = q.originalIndex !== undefined ? q.originalIndex + 1 : q.questionNumber;
                        const testCaseInfo = (q.totalTestCases !== undefined && q.totalTestCases > 0) 
                            ? `<br><small style="color: #666;">Test Cases Passed: ${q.passedTestCases || 0}/${q.totalTestCases}</small>` 
                            : '';
                        return `
                            <div class="question-score">
                                <strong>Question ${displayNum}:</strong> ${q.score}/${q.maxScore} marks${testCaseInfo}
                                <br><small>${q.questionText}</small>
                            </div>
                        `;
                    }).join('')}
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
    
    // Determine max questions across all attempts
    const maxQuestions = Math.max(...attempts.map(a => a.questionScores?.length || 0), 12);
    
    // Create CSV headers with individual question columns
    const questionHeaders = Array.from({length: maxQuestions}, (_, i) => `Q${i+1} Score`);
    const headers = ['Student Name', 'Email', 'Department', 'Group', 'WhatsApp', 'Test', 'Start Time', 'Submit Time', 'Duration (min)', ...questionHeaders, 'Total Score', 'Max Score', 'Percentage', 'Status'];
    
    const rows = attempts.map(a => {
        // Create question scores array
        const questionScores = Array.from({length: maxQuestions}, (_, i) => {
            if (a.questionScores && a.questionScores[i]) {
                return `${a.questionScores[i].score}/${a.questionScores[i].maxScore}`;
            }
            return '-';
        });
        
        return [
            a.userName,
            a.userEmail,
            a.department || 'N/A',
            a.group || 'N/A',
            a.whatsapp || 'N/A',
            a.testTitle,
            new Date(a.startTime).toLocaleString(),
            new Date(a.submitTime).toLocaleString(),
            a.elapsedMinutes,
            ...questionScores,
            a.totalScore,
            a.maxScore,
            a.percentage + '%',
            a.leftInMiddle ? 'Left in Middle' : (a.autoSubmitted ? 'Auto-Submitted' : 'Submitted')
        ];
    });
    
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
            ${tests.map(test => {
                const topics = test.questions && test.questions.length > 0 ? 
                    Array.from(new Set(window.testMetadata?.topics || ['Python Basics'])) : ['Python Basics'];
                return `
                <div class="test-card-admin">
                    <h3>${test.title}</h3>
                    <p><strong>Duration:</strong> ${test.duration} minutes</p>
                    <p><strong>Total Marks:</strong> ${test.totalMarks || 'N/A'}</p>
                    <p><strong>Topics:</strong> ${topics.join(', ')}</p>
                    <p><strong>Start:</strong> ${test.startDateTime ? new Date(test.startDateTime).toLocaleString() : test.startDate}</p>
                    <p><strong>End:</strong> ${test.endDateTime ? new Date(test.endDateTime).toLocaleString() : test.endDate}</p>
                    <div class="test-meta">
                        <span>${test.questions ? test.questions.length : 0} questions</span>
                        <span>Created: ${new Date(test.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div class="test-actions">
                        <button class="btn-edit" onclick="editTest('${test.id}')">✏️ Edit</button>
                        <button class="btn-delete" onclick="deleteTest('${test.id}')">🗑️ Delete</button>
                    </div>
                </div>
            `}).join('')}
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
    
    // Convert dates to datetime for proper comparison
    const startDateTime = startDate + 'T00:00';
    const endDateTime = endDate + 'T23:59';
    
    // Validate dates
    if (new Date(endDateTime) <= new Date(startDateTime)) {
        alert('End date must be after start date');
        return;
    }
    
    const newTest = {
        id: 'test' + Date.now(),
        title: title,
        description: description,
        duration: duration,
        startDate: startDate,
        endDate: endDate,
        startDateTime: startDateTime,
        endDateTime: endDateTime,
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
    const tests = JSON.parse(localStorage.getItem('tests') || '[]');
    const test = tests.find(t => t.id === testId);
    
    if (!test) {
        alert('Test not found');
        return;
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <h2>Edit Test</h2>
            
            <form id="edit-test-form" style="margin-top: 2rem;">
                <div class="form-group">
                    <label>Test Title:</label>
                    <input type="text" id="edit-title" value="${test.title}" required>
                </div>
                
                <div class="form-group">
                    <label>Description:</label>
                    <textarea id="edit-desc" required>${test.description || ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label>Duration (minutes):</label>
                    <input type="number" id="edit-duration" value="${test.duration}" min="1" required>
                </div>
                
                <div class="form-group">
                    <label>Start Date & Time:</label>
                    <input type="datetime-local" id="edit-start" value="${test.startDateTime || test.startDate + 'T00:00'}" required>
                    <small style="color: var(--text-secondary); display: block; margin-top: 0.25rem;">Students can start the test from this date and time</small>
                </div>
                
                <div class="form-group">
                    <label>End Date & Time:</label>
                    <input type="datetime-local" id="edit-end" value="${test.endDateTime || test.endDate + 'T23:59'}" required>
                    <small style="color: var(--text-secondary); display: block; margin-top: 0.25rem;">Students cannot start the test after this date and time</small>
                </div>
                
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('edit-test-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const updatedTest = {
            ...test,
            title: document.getElementById('edit-title').value,
            description: document.getElementById('edit-desc').value,
            duration: parseInt(document.getElementById('edit-duration').value),
            startDateTime: document.getElementById('edit-start').value,
            endDateTime: document.getElementById('edit-end').value,
            startDate: document.getElementById('edit-start').value.split('T')[0],
            endDate: document.getElementById('edit-end').value.split('T')[0],
            updatedAt: new Date().toISOString()
        };
        
        // Validate dates
        const start = new Date(updatedTest.startDateTime);
        const end = new Date(updatedTest.endDateTime);
        
        if (end <= start) {
            alert('End date must be after start date');
            return;
        }
        
        // Update test in storage
        const allTests = JSON.parse(localStorage.getItem('tests') || '[]');
        const index = allTests.findIndex(t => t.id === testId);
        if (index !== -1) {
            allTests[index] = updatedTest;
            localStorage.setItem('tests', JSON.stringify(allTests));
            
            modal.remove();
            loadTests();
            alert('Test updated successfully!');
        }
    });
    
    // Close modal on backdrop click
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
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
