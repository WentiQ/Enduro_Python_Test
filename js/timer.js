// Timer Management for Test

let timerInterval = null;
let remainingSeconds = 0;
let testStartTime = null;

// Initialize timer
function initTimer(durationMinutes) {
    remainingSeconds = durationMinutes * 60;
    testStartTime = Date.now();
    updateTimerDisplay();
    startTimer();
}

// Start timer countdown
function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
        remainingSeconds--;
        updateTimerDisplay();
        
        // Warning at 10 minutes
        if (remainingSeconds === 600) {
            showTimerWarning('10 minutes remaining!');
        }
        
        // Warning at 5 minutes
        if (remainingSeconds === 300) {
            showTimerWarning('5 minutes remaining!');
        }
        
        // Warning at 1 minute
        if (remainingSeconds === 60) {
            showTimerWarning('1 minute remaining!');
        }
        
        // Auto-submit when time is up
        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            autoSubmitTest();
        }
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    
    const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const timerElement = document.getElementById('timer');
    
    if (timerElement) {
        timerElement.textContent = display;
        
        // Add warning class when less than 10 minutes
        if (remainingSeconds <= 600 && remainingSeconds > 300) {
            timerElement.className = 'timer warning';
        } else if (remainingSeconds <= 300) {
            timerElement.className = 'timer danger';
        } else {
            timerElement.className = 'timer';
        }
    }
}

// Show timer warning
function showTimerWarning(message) {
    // Create warning notification
    const warning = document.createElement('div');
    warning.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #ffc107;
        color: #000;
        padding: 15px 25px;
        border-radius: 5px;
        font-weight: 600;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    warning.textContent = message;
    document.body.appendChild(warning);
    
    // Remove after 3 seconds
    setTimeout(() => {
        warning.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => warning.remove(), 300);
    }, 3000);
}

// Stop timer
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Get elapsed time in minutes
function getElapsedTime() {
    if (!testStartTime) return 0;
    return Math.floor((Date.now() - testStartTime) / 1000 / 60);
}

// Pause timer (for emergencies)
function pauseTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
}

// Resume timer
function resumeTimer() {
    startTimer();
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
