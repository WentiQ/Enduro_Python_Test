// Test Management

let currentTest = null;
let currentQuestionIndex = 0;
let answers = {};
let testAttemptId = null;
let mediaStream = null;
let cameraActive = false;

// Initialize test
function initTest() {
    // Check authentication
    const user = getCurrentUser();
    if (!user || user.role === 'admin') {
        window.location.href = 'login.html';
        return;
    }
    
    // Get test ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const testId = urlParams.get('testId');
    
    if (!testId) {
        alert('Invalid test ID');
        window.location.href = 'student-dashboard.html';
        return;
    }
    
    // Load test
    currentTest = loadTest(testId);
    if (!currentTest) {
        alert('Test not found');
        window.location.href = 'student-dashboard.html';
        return;
    }
    
    // Check if test is available (within time range)
    const now = new Date();
    const startDateTime = currentTest.startDateTime || (currentTest.startDate + 'T00:00');
    const endDateTime = currentTest.endDateTime || (currentTest.endDate + 'T23:59');
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    
    if (now < start) {
        alert('This test is not yet available. It will start on ' + start.toLocaleString());
        window.location.href = 'student-dashboard.html';
        return;
    }
    
    if (now > end) {
        alert('This test has ended. It was available until ' + end.toLocaleString());
        window.location.href = 'student-dashboard.html';
        return;
    }
    
    // Check if already attempted
    const attempts = JSON.parse(localStorage.getItem('testAttempts') || '[]');
    const alreadyAttempted = attempts.some(a => a.userEmail === user.email && a.testId === testId);
    
    if (alreadyAttempted) {
        alert('You have already attempted this test.');
        window.location.href = 'student-dashboard.html';
        return;
    }
    
    // Show camera recording warning
    showCameraRecordingWarning();
    
    // Initialize answers object
    currentTest.questions.forEach((q, index) => {
        answers[index] = {
            code: q.type === 'code' ? (q.starterCode || '') : '',
            output: '',
            score: 0,
            attempted: false
        };
    });
    
    // Set test title
    document.getElementById('test-title').textContent = currentTest.title;
    
    // Timer will be initialized after camera permission is granted
    // initTimer will be called from activateCameraAndStart()
    
    // Generate question navigation
    generateQuestionNav();
    
    // Show first question
    showQuestion(0);
    
    // Disable copy-paste
    enableCopyPasteProtection();
    
    // Warn before leaving
    window.addEventListener('beforeunload', confirmLeave);
    
    // Create test attempt record
    testAttemptId = Date.now().toString();
}

// Load test from storage
function loadTest(testId) {
    const tests = JSON.parse(localStorage.getItem('tests') || '[]');
    let test = tests.find(t => t.id === testId);
    
    // If no tests found, use default test
    if (!test) {
        test = {
            id: testId,
            title: 'Python Basics Test',
            description: 'Test your Python knowledge',
            duration: 60,
            questions: getDefaultQuestions()
        };
    }
    
    return test;
}

// Generate question navigation buttons
function generateQuestionNav() {
    const container = document.getElementById('question-buttons');
    container.innerHTML = '';
    
    currentTest.questions.forEach((q, index) => {
        const btn = document.createElement('button');
        btn.className = 'question-btn';
        btn.textContent = `Q${index + 1}`;
        btn.onclick = () => showQuestion(index);
        container.appendChild(btn);
    });
    
    updateQuestionNavStatus();
}

// Update question navigation button status
function updateQuestionNavStatus() {
    const buttons = document.querySelectorAll('.question-btn');
    buttons.forEach((btn, index) => {
        btn.classList.remove('active', 'answered', 'attempted');
        
        if (index === currentQuestionIndex) {
            btn.classList.add('active');
        } else if (answers[index].attempted) {
            btn.classList.add('attempted');
        }
    });
}

// Show specific question
function showQuestion(index) {
    // Save current answer before switching
    saveCurrentAnswer();
    
    currentQuestionIndex = index;
    const question = currentTest.questions[index];
    
    const display = document.getElementById('question-display');
    display.innerHTML = `
        <div class="question-content">
            <div class="question-header">
                <span class="question-number">Question ${index + 1} of ${currentTest.questions.length}</span>
                <span class="question-marks">${question.marks} Marks</span>
            </div>
            
            <div class="question-text">${formatQuestionText(question.text)}</div>
            
            ${question.type === 'code' ? `
                <div class="code-editor-container">
                    <label class="code-editor-label">Write your code here:</label>
                    <textarea id="code-editor" placeholder="Write your Python code here...">${answers[index].code}</textarea>
                    <div class="editor-actions">
                        <button class="run-code-btn" onclick="runCode()">
                            Run Code
                        </button>
                        <button class="clear-btn" onclick="clearCode()">Clear</button>
                    </div>
                </div>
                
                <div class="output-container">
                    <label class="output-label">Output:</label>
                    <div id="output-display">${answers[index].output || 'Click "Run Code" to test your solution'}</div>
                </div>
            ` : ''}
        </div>
    `;
    
    // Update navigation buttons
    updateQuestionNavStatus();
    updateNavigationButtons();
    
    // Set user watermark
    setUserWatermark();
    
    // Disable copy-paste on code editor and add auto-resize
    setTimeout(() => {
        const editor = document.getElementById('code-editor');
        if (editor) {
            disableCopyPaste(editor);
            enableAutoResize(editor);
        }
    }, 100);
}

// Enable auto-resize for textarea (VSCode-like behavior)
function enableAutoResize(textarea) {
    // Auto-resize on input
    textarea.addEventListener('input', function() {
        autoResizeTextarea(this);
    });
    
    // Initial resize
    autoResizeTextarea(textarea);
}

function autoResizeTextarea(textarea) {
    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';
    // Set height to scrollHeight to fit content
    textarea.style.height = textarea.scrollHeight + 'px';
}

// Format question text removed - now using anti-OCR version below

// Save current answer
function saveCurrentAnswer() {
    const editor = document.getElementById('code-editor');
    if (editor) {
        answers[currentQuestionIndex].code = editor.value;
        answers[currentQuestionIndex].attempted = editor.value.trim() !== '';
    }
}

// Previous question
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        showQuestion(currentQuestionIndex - 1);
    }
}

// Next question
function nextQuestion() {
    if (currentQuestionIndex < currentTest.questions.length - 1) {
        showQuestion(currentQuestionIndex + 1);
    }
}

// Update navigation buttons
function updateNavigationButtons() {
    document.getElementById('prev-btn').disabled = currentQuestionIndex === 0;
    document.getElementById('next-btn').style.display = 
        currentQuestionIndex === currentTest.questions.length - 1 ? 'none' : 'inline-block';
    document.getElementById('submit-btn').style.display = 
        currentQuestionIndex === currentTest.questions.length - 1 ? 'inline-block' : 'none';
}

// Clear code
function clearCode() {
    const editor = document.getElementById('code-editor');
    if (editor && confirm('Are you sure you want to clear your code?')) {
        editor.value = currentTest.questions[currentQuestionIndex].starterCode || '';
        answers[currentQuestionIndex].code = editor.value;
    }
}

// Submit test
function submitTest() {
    // Final warning about recording
    const finalWarning = confirm(
        '⚠️ FINAL CONFIRMATION\n\n' +
        'Your test session has been recorded and monitored.\n' +
        'The recording will be evaluated after submission.\n' +
        'Any malpractice detected may lead to test cancellation.\n\n' +
        'Are you sure you want to submit the test?\n' +
        'You cannot change your answers after submission.'
    );
    
    if (!finalWarning) {
        return;
    }
    
    saveCurrentAnswer();
    stopTimer();
    
    // Stop camera and recording indicator
    stopCamera();
    stopRecordingIndicator();
    
    // Calculate scores
    calculateScores(false);
}

// Auto-submit test when time is up
function autoSubmitTest() {
    saveCurrentAnswer();
    
    // Stop camera and recording indicator
    stopCamera();
    stopRecordingIndicator();
    
    alert('Time is up! Your test will be submitted automatically.\n\nYour session recording will be evaluated.');
    calculateScores(true);
}

// Confirm before leaving page
function confirmLeave(e) {
    e.preventDefault();
    e.returnValue = '';
    return '';
}

// Enable copy-paste protection
function enableCopyPasteProtection() {
    document.addEventListener('copy', preventCopyPaste);
    document.addEventListener('cut', preventCopyPaste);
    document.addEventListener('paste', preventCopyPaste);
    document.addEventListener('contextmenu', preventCopyPaste);
}

// Prevent copy-paste
function preventCopyPaste(e) {
    e.preventDefault();
    showCopyPasteWarning();
    return false;
}

// Disable copy-paste on specific element
function disableCopyPaste(element) {
    element.addEventListener('copy', preventCopyPaste);
    element.addEventListener('cut', preventCopyPaste);
    element.addEventListener('paste', preventCopyPaste);
    element.addEventListener('contextmenu', preventCopyPaste);
}

// Show copy-paste warning
function showCopyPasteWarning() {
    const warning = document.createElement('div');
    warning.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #dc3545;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        font-weight: 600;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    warning.textContent = '⚠️ Copy/Paste is disabled during the test!';
    document.body.appendChild(warning);
    
    setTimeout(() => {
        warning.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => warning.remove(), 300);
    }, 2000);
}

// Get default questions if none exist
function getDefaultQuestions() {
    return window.defaultQuestions || [];
}

// ============================================
// SIDEBAR FUNCTIONS (JEE Style)
// ============================================

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('question-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Confirm submit with dialog
function confirmSubmit() {
    const unansweredCount = Object.keys(answers).filter(key => !answers[key].attempted).length;
    const totalQuestions = currentTest.questions.length;
    const answeredCount = totalQuestions - unansweredCount;
    
    let message = `Are you sure you want to submit the test?\n\n`;
    message += `Answered: ${answeredCount}/${totalQuestions}\n`;
    message += `Unanswered: ${unansweredCount}`;
    
    if (unansweredCount > 0) {
        message += `\n\n⚠️ You have ${unansweredCount} unanswered question(s)!`;
    }
    
    if (confirm(message)) {
        submitTest();
    }
}

// ============================================
// ANTI-OCR TEXT PROCESSING
// ============================================

// Add anti-OCR protection to text
function applyAntiOCR(text) {
    if (!text) return text;
    
    // Add invisible zero-width characters between words
    const words = text.split(' ');
    const protectedWords = words.map(word => {
        // Insert zero-width characters randomly in words
        const chars = word.split('');
        return chars.map((char, i) => {
            // Add invisible characters after each character (randomly)
            if (Math.random() > 0.7 && i < chars.length - 1) {
                return char + '\u200B'; // Zero-width space
            }
            return char;
        }).join('');
    });
    
    return protectedWords.join(' ');
}

// Format question text with anti-OCR
function formatQuestionText(text) {
    // Replace code blocks with pre tags
    text = text.replace(/```python\n([\s\S]*?)```/g, '<pre class="anti-ocr-text">$1</pre>');
    text = text.replace(/```\n([\s\S]*?)```/g, '<pre class="anti-ocr-text">$1</pre>');
    
    // Replace inline code
    text = text.replace(/`([^`]+)`/g, '<code class="anti-ocr-text">$1</code>');
    
    // Convert newlines to <br>
    text = text.replace(/\n/g, '<br>');
    
    // Apply anti-OCR protection to plain text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    
    // Process text nodes to add anti-OCR
    processTextNodes(tempDiv);
    
    return tempDiv.innerHTML;
}

// Process text nodes to add anti-OCR characters
function processTextNodes(element) {
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
        if (node.nodeValue.trim().length > 0) {
            textNodes.push(node);
        }
    }
    
    textNodes.forEach(textNode => {
        // Don't process code blocks
        if (textNode.parentElement && 
            (textNode.parentElement.tagName === 'PRE' || 
             textNode.parentElement.tagName === 'CODE')) {
            return;
        }
        
        const text = textNode.nodeValue;
        const protectedText = applyAntiOCR(text);
        textNode.nodeValue = protectedText;
    });
}

// Set user watermark
function setUserWatermark() {
    const user = getCurrentUser();
    const container = document.getElementById('question-display');
    if (container && user) {
        container.setAttribute('data-user', user.email);
    }
}

// Call watermark on question display
window.addEventListener('load', setUserWatermark);

// ============================================
// CAMERA RECORDING SYSTEM (No Live Feed Display)
// ============================================

// Show camera recording warning
function showCameraRecordingWarning() {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.style.zIndex = '9999';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <h2 style="color: #dc3545;">📹 Camera Recording Required</h2>
            <div style="text-align: left; padding: 20px; background: #fff3cd; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #856404;">Important Notice:</h3>
                <ul style="line-height: 1.8; color: #856404;">
                    <li><strong>Your camera will be turned ON during this test</strong></li>
                    <li>You will see the camera light indicator on your device</li>
                    <li>Camera recording is mandatory for test validity</li>
                    <li><strong>Recording will be evaluated after submission</strong></li>
                    <li>Any suspicious activity detected may result in test cancellation</li>
                    <li>Ensure proper lighting and stay in front of camera</li>
                    <li>Do not cover, disable, or disconnect the camera</li>
                </ul>
            </div>
            <div style="background: #f8d7da; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <p style="color: #721c24; margin: 0; font-weight: 600;">
                    ⚠️ CRITICAL WARNING: Test will NOT be considered valid if:<br>
                    • Camera is not enabled<br>
                    • Camera is disconnected during test<br>
                    • Recording shows any malpractice or violations
                </p>
            </div>
            <p style="color: #666; font-size: 0.95rem; margin: 15px 0;">
                By clicking "Turn On Camera & Start", you grant permission to use your camera for test monitoring.
            </p>
            <button onclick="activateCameraAndStart()" class="btn btn-success" style="width: 100%; padding: 15px; font-size: 1.1rem;">
                Turn On Camera & Start Test
            </button>
        </div>
    `;
    
    // Prevent closing
    modal.onclick = (e) => {
        if (e.target === modal) {
            alert('Camera access is mandatory. You must enable camera to take this test.');
        }
    };
    
    document.body.appendChild(modal);
}

// Activate camera and start test
async function activateCameraAndStart() {
    try {
        // Request camera permission and access
        mediaStream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'user'
            }, 
            audio: false 
        });
        
        // Remove warning modal
        const modal = document.querySelector('.modal');
        if (modal) modal.remove();
        
        // Camera is now ON (camera light will be visible on device)
        // But we don't show the video feed to student
        cameraActive = true;
        
        // Start recording indicator
        startRecordingIndicator();
        
        // Monitor camera status
        startCameraMonitoring();
        
        // NOW START THE TIMER - only after camera is active
        initTimer(currentTest.duration);
        
        // Show success notification
        showNotification('✓ Camera Active - Test timer started', 'success');
        
    } catch (error) {
        console.error('Camera access error:', error);
        
        let errorMessage = 'Camera access is required for this test.\n\n';
        
        if (error.name === 'NotAllowedError') {
            errorMessage += 'You denied camera permission. Please allow camera access.\n\n';
        } else if (error.name === 'NotFoundError') {
            errorMessage += 'No camera found on your device.\n\n';
        } else {
            errorMessage += 'Error: ' + error.message + '\n\n';
        }
        
        const retry = confirm(
            errorMessage +
            'Click OK to retry or Cancel to exit.'
        );
        
        if (retry) {
            activateCameraAndStart();
        } else {
            alert('Cannot proceed without camera. Redirecting to dashboard.');
            window.location.href = 'student-dashboard.html';
        }
    }
}

// Start recording indicator display
function startRecordingIndicator() {
    // Create recording indicator
    const indicator = document.createElement('div');
    indicator.id = 'recording-indicator';
    indicator.innerHTML = `
        <div class="recording-badge">
            <span class="rec-dot">●</span>
            <span class="rec-text">RECORDING</span>
        </div>
        <div class="recording-tooltip">
            Camera is active - Test is being recorded
        </div>
    `;
    
    document.body.appendChild(indicator);
}

// Monitor camera status
function startCameraMonitoring() {
    // Check camera status every 5 seconds
    setInterval(() => {
        if (mediaStream) {
            const videoTracks = mediaStream.getVideoTracks();
            
            if (videoTracks.length === 0 || !videoTracks[0].enabled) {
                // Camera disconnected
                showCameraDisconnectedAlert();
            } else if (videoTracks[0].readyState === 'ended') {
                // Camera stopped
                showCameraDisconnectedAlert();
            }
        } else {
            // Media stream lost
            showCameraDisconnectedAlert();
        }
    }, 5000);
}

// Show alert when camera is disconnected
function showCameraDisconnectedAlert() {
    if (!cameraActive) return; // Already handled
    
    cameraActive = false;
    
    // Show critical alert
    alert(
        '⚠️ CAMERA DISCONNECTED!\n\n' +
        'Your camera has been disconnected during the test.\n' +
        'This is a violation of test rules.\n\n' +
        'Your test may be invalidated upon review.\n\n' +
        'Please reconnect your camera immediately.'
    );
    
    showNotification('🔴 Camera Disconnected - Test may be invalidated!', 'error');
    
    // Try to reconnect
    setTimeout(() => {
        if (!cameraActive) {
            const reconnect = confirm('Camera is still disconnected. Do you want to reconnect?');
            if (reconnect) {
                activateCameraAndStart();
            }
        }
    }, 3000);
}

// Stop camera
function stopCamera() {
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }
    cameraActive = false;
}

// Stop recording indicator
function stopRecordingIndicator() {
    const indicator = document.getElementById('recording-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const bgColors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#667eea'
    };
    
    const textColors = {
        warning: '#000',
        default: '#fff'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 9998;
        animation: slideInRight 0.3s ease;
        color: ${textColors[type] || textColors.default};
        background: ${bgColors[type] || bgColors.info};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopCamera();
});
