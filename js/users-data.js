// Users Data Dashboard JavaScript

import { getAllUsers } from './firebase-database.js';

// DOM Elements
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const tableContainer = document.getElementById('tableContainer');
const tableBody = document.getElementById('tableBody');
const refreshBtn = document.getElementById('refreshBtn');
const exportBtn = document.getElementById('exportBtn');

// Stats elements
const totalUsersEl = document.getElementById('totalUsers');
const totalTestsEl = document.getElementById('totalTests');
const avgScoreEl = document.getElementById('avgScore');
const highestScoreEl = document.getElementById('highestScore');

let usersData = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load data directly without authentication check
    loadUsersData();
    
    refreshBtn.addEventListener('click', () => {
        loadUsersData();
    });
    
    exportBtn.addEventListener('click', () => {
        exportToCSV();
    });
});

async function loadUsersData() {
    try {
        // Show loading
        loadingIndicator.style.display = 'block';
        errorMessage.style.display = 'none';
        tableContainer.style.display = 'none';
        
        console.log('Fetching users data from Firebase...');
        
        // Fetch all users from Firebase
        const allUsers = await getAllUsers();
        console.log('Fetched users:', allUsers.length);
        
        if (!allUsers || allUsers.length === 0) {
            // Show empty state instead of error
            loadingIndicator.style.display = 'none';
            tableContainer.style.display = 'block';
            usersData = [];
            displayUsersData();
            updateStats();
            return;
        }
        
        // Filter only students and those with test attempts
        usersData = allUsers
            .filter(user => user.role === 'student' && user.testAttempts && user.testAttempts.length > 0)
            .map(user => processUserData(user));
        
        console.log('Processed users with test attempts:', usersData.length);
        
        // Sort by total score (highest to lowest)
        usersData.sort((a, b) => b.totalScore - a.totalScore);
        
        // Display data
        displayUsersData();
        updateStats();
        
        // Hide loading, show table
        loadingIndicator.style.display = 'none';
        tableContainer.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading users data:', error);
        loadingIndicator.style.display = 'none';
        errorMessage.style.display = 'block';
        errorText.textContent = error.message || 'Failed to load data from Firebase. Please make sure you are logged in and try again.';
    }
        // More helpful error message
        if (error.message && error.message.includes('permissions')) {
            errorText.innerHTML = `
                <strong>Permission Error</strong><br>
                Firebase security rules are blocking access. To fix this:<br><br>
                1. Go to Firebase Console → Firestore Database → Rules<br>
                2. Update the rules to allow public read access:<br>
                <code style="display: block; background: #f8fafc; padding: 1rem; margin-top: 0.5rem; border-radius: 4px; text-align: left;">
                match /users/{userId} {<br>
                &nbsp;&nbsp;allow read: if true;<br>
                &nbsp;&nbsp;allow write: if isAuthenticated();<br>
                }
                </code>
            `;
        } else {
            errorText.textContent = error.message || 'Failed to load data from Firebase. Please try again.';
        }
}

function processUserData(user) {
    const testAttempts = user.testAttempts || [];
    
    // Calculate total score across all test attempts
    let totalScore = 0;
    let totalMaxScore = 0;
    let earliestStart = null;
    let latestSubmission = null;
    
    // Process all test attempts
    testAttempts.forEach(attempt => {
        totalScore += attempt.totalScore || 0;
        totalMaxScore += attempt.maxScore || 0;
        
        // Track earliest start time
        if (attempt.attemptDate) {
            const attemptDate = new Date(attempt.attemptDate);
            if (!earliestStart || attemptDate < earliestStart) {
                earliestStart = attemptDate;
            }
            if (!latestSubmission || attemptDate > latestSubmission) {
                latestSubmission = attemptDate;
            }
        }
    });
    
    return {
        uid: user.uid,
        name: user.name || 'N/A',
        group: user.department || user.group || 'N/A',
        email: user.email || 'N/A',
        whatsapp: user.whatsapp || user.phone || 'N/A',
        totalScore: totalScore,
        totalMaxScore: totalMaxScore,
        scorePercentage: totalMaxScore > 0 ? ((totalScore / totalMaxScore) * 100).toFixed(2) : 0,
        testAttempts: testAttempts,
        numTests: testAttempts.length,
        startTime: earliestStart,
        submissionTime: latestSubmission
    };
}

function displayUsersData() {
    tableBody.innerHTML = '';
    const tableHead = document.getElementById('tableHead');
    
    if (usersData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="no-data">
                    <h3>No user data available</h3>
                    <p>There are no users with test attempts in the database.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // Find max number of questions across all users
    let maxQuestions = 0;
    usersData.forEach(user => {
        user.testAttempts.forEach(attempt => {
            const qCount = (attempt.questionScores || []).length;
            if (qCount > maxQuestions) maxQuestions = qCount;
        });
    });
    
    // Build table header with question columns
    const headerRow = tableHead.querySelector('tr');
    // Remove old question headers if any
    const existingQHeaders = headerRow.querySelectorAll('.question-header');
    existingQHeaders.forEach(h => h.remove());
    
    // Add question columns to header
    for (let i = 1; i <= maxQuestions; i++) {
        const th = document.createElement('th');
        th.className = 'question-header';
        th.innerHTML = `Q${i}<br><span style="font-size: 0.7em; font-weight: normal;">Score | Cases</span>`;
        headerRow.appendChild(th);
    }
    
    // Build table rows
    usersData.forEach((user, index) => {
        const rank = index + 1;
        const row = document.createElement('tr');
        
        // Add special class for top 3
        if (rank === 1) row.classList.add('rank-1');
        else if (rank === 2) row.classList.add('rank-2');
        else if (rank === 3) row.classList.add('rank-3');
        
        // Rank column with badge
        let rankBadge = '';
        if (rank === 1) {
            rankBadge = `<div class="rank-badge gold">🥇</div>`;
        } else if (rank === 2) {
            rankBadge = `<div class="rank-badge silver">🥈</div>`;
        } else if (rank === 3) {
            rankBadge = `<div class="rank-badge bronze">🥉</div>`;
        } else {
            rankBadge = `<div class="rank-badge normal">${rank}</div>`;
        }
        
        // Format timestamps
        const startTime = user.startTime ? formatDate(user.startTime) : 'N/A';
        const submissionTime = user.submissionTime ? formatDate(user.submissionTime) : 'N/A';
        
        // Collect all questions from all test attempts
        const allQuestions = [];
        user.testAttempts.forEach(attempt => {
            (attempt.questionScores || []).forEach(qs => {
                allQuestions.push(qs);
            });
        });
        
        // Build row HTML
        let rowHTML = `
            <td class="rank-col sticky-col">${rankBadge}</td>
            <td class="sticky-col">
                <div class="user-name">${escapeHtml(user.name)}</div>
            </td>
            <td>${escapeHtml(user.group)}</td>
            <td>
                <div class="user-email">${escapeHtml(user.email)}</div>
            </td>
            <td>${escapeHtml(user.whatsapp)}</td>
            <td>
                <div class="total-score">${user.totalScore}/${user.totalMaxScore}</div>
                <div style="font-size: 0.875rem; color: #64748b;">(${user.scorePercentage}%)</div>
            </td>
            <td><div class="timestamp">${startTime}</div></td>
            <td><div class="timestamp">${submissionTime}</div></td>
        `;
        
        // Add question columns
        for (let i = 0; i < maxQuestions; i++) {
            if (i < allQuestions.length) {
                const qs = allQuestions[i];
                const score = qs.score || 0;
                const maxScore = qs.maxScore || 0;
                const passed = qs.passedTestCases || 0;
                const total = qs.totalTestCases || 0;
                const percentage = maxScore > 0 ? ((score / maxScore) * 100).toFixed(0) : 0;
                
                let scoreColor = '#ef4444'; // red
                if (percentage >= 80) scoreColor = '#10b981'; // green
                else if (percentage >= 50) scoreColor = '#f59e0b'; // orange
                
                rowHTML += `
                    <td class="question-cell">
                        <div class="question-score" style="color: ${scoreColor}; font-weight: 700;">${score}/${maxScore}</div>
                        <div class="question-cases">${passed}/${total}</div>
                    </td>
                `;
            } else {
                rowHTML += `<td class="question-cell">-</td>`;
            }
        }
        
        row.innerHTML = rowHTML;
        tableBody.appendChild(row);
    });
}

function updateStats() {
    if (usersData.length === 0) {
        totalUsersEl.textContent = '0';
        totalTestsEl.textContent = '0';
        avgScoreEl.textContent = '0%';
        highestScoreEl.textContent = '0%';
        return;
    }
    
    const totalUsers = usersData.length;
    const totalTests = usersData.reduce((sum, user) => sum + user.numTests, 0);
    const totalScore = usersData.reduce((sum, user) => sum + user.totalScore, 0);
    const totalMaxScore = usersData.reduce((sum, user) => sum + user.totalMaxScore, 0);
    const avgScore = totalMaxScore > 0 ? ((totalScore / totalMaxScore) * 100).toFixed(2) : 0;
    const highestScore = usersData.length > 0 ? usersData[0].scorePercentage : 0;
    
    totalUsersEl.textContent = totalUsers;
    totalTestsEl.textContent = totalTests;
    avgScoreEl.textContent = `${avgScore}%`;
    highestScoreEl.textContent = `${highestScore}%`;
}

function exportToCSV() {
    if (usersData.length === 0) {
        alert('No data to export');
        return;
    }
    
    // CSV Headers
    let csv = 'Rank,Name,Group,Email,WhatsApp,Total Score,Max Score,Percentage,Number of Tests,';
    
    // Add question columns dynamically based on max questions
    let maxQuestions = 0;
    usersData.forEach(user => {
        user.testAttempts.forEach(attempt => {
            const qCount = (attempt.questionScores || []).length;
            if (qCount > maxQuestions) maxQuestions = qCount;
        });
    });
    
    for (let i = 1; i <= maxQuestions; i++) {
        csv += `Q${i} Score,Q${i} Max,Q${i} Cases Passed,Q${i} Total Cases,`;
    }
    
    csv += 'Start Time,Submission Time\n';
    
    // Data rows
    usersData.forEach((user, index) => {
        const rank = index + 1;
        csv += `${rank},"${escapeCSV(user.name)}","${escapeCSV(user.group)}","${escapeCSV(user.email)}","${escapeCSV(user.whatsapp)}",`;
        csv += `${user.totalScore},${user.totalMaxScore},${user.scorePercentage}%,${user.numTests},`;
        
        // Flatten all questions from all test attempts
        const allQuestions = [];
        user.testAttempts.forEach(attempt => {
            (attempt.questionScores || []).forEach(qs => {
                allQuestions.push(qs);
            });
        });
        
        // Add question data
        for (let i = 0; i < maxQuestions; i++) {
            if (i < allQuestions.length) {
                const qs = allQuestions[i];
                csv += `${qs.score || 0},${qs.maxScore || 0},${qs.passedTestCases || 0},${qs.totalTestCases || 0},`;
            } else {
                csv += '0,0,0,0,';
            }
        }
        
        const startTime = user.startTime ? formatDate(user.startTime) : 'N/A';
        const submissionTime = user.submissionTime ? formatDate(user.submissionTime) : 'N/A';
        csv += `"${startTime}","${submissionTime}"\n`;
    });
    
    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `users-data-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

// Utility functions
function formatDate(date) {
    if (!date) return 'N/A';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';
    
    return d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function escapeCSV(text) {
    if (text === null || text === undefined) return '';
    return String(text).replace(/"/g, '""');
}
