// Global Copy-Paste Protection Script
// This file provides comprehensive protection against copy-paste operations

(function() {
    'use strict';
    
    // Check if we're on a test page
    const isTestPage = window.location.pathname.includes('test.html');
    
    // List of events to block
    const blockedEvents = [
        'copy',
        'cut',
        'paste',
        'contextmenu',  // Right-click menu
        'selectstart',   // Text selection (optional)
        'dragstart'      // Drag and drop
    ];
    
    // Warning message
    let warningTimeout = null;
    
    function showWarning(message) {
        // Clear existing warning timeout
        if (warningTimeout) {
            clearTimeout(warningTimeout);
        }
        
        // Remove existing warnings
        const existingWarnings = document.querySelectorAll('.copy-paste-warning');
        existingWarnings.forEach(w => w.remove());
        
        // Create warning element
        const warning = document.createElement('div');
        warning.className = 'copy-paste-warning';
        warning.innerHTML = `
            <span class="warning-icon">⚠️</span>
            <span class="warning-text">${message}</span>
        `;
        
        // Add styles
        warning.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff6b6b 0%, #dc3545 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            font-weight: 600;
            box-shadow: 0 5px 20px rgba(220, 53, 69, 0.4);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideInWarning 0.3s ease-out;
            font-size: 14px;
            max-width: 300px;
        `;
        
        document.body.appendChild(warning);
        
        // Auto-remove after 3 seconds
        warningTimeout = setTimeout(() => {
            warning.style.animation = 'slideOutWarning 0.3s ease-out';
            setTimeout(() => warning.remove(), 300);
        }, 3000);
    }
    
    // Prevention function
    function preventAction(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Determine action type
        let action = 'This action';
        switch(e.type) {
            case 'copy':
                action = 'Copying';
                break;
            case 'cut':
                action = 'Cutting';
                break;
            case 'paste':
                action = 'Pasting';
                break;
            case 'contextmenu':
                action = 'Right-click menu';
                break;
            case 'dragstart':
                action = 'Dragging';
                break;
        }
        
        showWarning(`${action} is disabled during the test!`);
        return false;
    }
    
    // Apply protection when page loads
    function applyProtection() {
        if (!isTestPage) return;
        
        // Add event listeners to document
        blockedEvents.forEach(event => {
            document.addEventListener(event, preventAction, true);
        });
        
        // Disable text selection on specific elements
        const style = document.createElement('style');
        style.textContent = `
            .question-text,
            .test-header,
            .question-number,
            .question-marks {
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            
            /* Allow selection in code editor */
            #code-editor {
                -webkit-user-select: text;
                -moz-user-select: text;
                -ms-user-select: text;
                user-select: text;
            }
        `;
        document.head.appendChild(style);
        
        console.log('Copy-paste protection activated');
    }
    
    // Keyboard shortcut detection
    function detectKeyboardShortcuts(e) {
        if (!isTestPage) return;
        
        const key = e.key.toLowerCase();
        const ctrl = e.ctrlKey || e.metaKey; // Ctrl on Windows/Linux, Cmd on Mac
        
        // Block common shortcuts
        const blockedShortcuts = [
            { key: 'c', ctrl: true, name: 'Copy' },
            { key: 'x', ctrl: true, name: 'Cut' },
            { key: 'v', ctrl: true, name: 'Paste' },
            { key: 'a', ctrl: true, name: 'Select All', allow: true }, // Allow in editor
            { key: 's', ctrl: true, name: 'Save' },
            { key: 'p', ctrl: true, name: 'Print' },
            { key: 'f', ctrl: true, name: 'Find', allow: true }, // Allow find
            { key: 'f12', ctrl: false, name: 'DevTools' },
            { key: 'i', ctrl: true, shift: true, name: 'DevTools' }
        ];
        
        for (let shortcut of blockedShortcuts) {
            if (key === shortcut.key && 
                (shortcut.ctrl === undefined || ctrl === shortcut.ctrl) &&
                (shortcut.shift === undefined || e.shiftKey === shortcut.shift)) {
                
                // Check if we should allow it
                if (shortcut.allow) {
                    // Only allow in code editor
                    if (e.target.id === 'code-editor') {
                        return;
                    }
                }
                
                e.preventDefault();
                e.stopPropagation();
                showWarning(`Keyboard shortcut (${shortcut.name}) is disabled!`);
                return false;
            }
        }
    }
    
    // Monitor DevTools (basic detection)
    function detectDevTools() {
        if (!isTestPage) return;
        
        const threshold = 160;
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold) {
            console.log('Developer tools may be open');
            // You can add additional warning here if needed
        }
    }
    
    // Tab visibility change detection
    function handleVisibilityChange() {
        if (!isTestPage) return;
        
        if (document.hidden) {
            console.log('User switched tab/window');
            // Log this event for admin review
            const user = getCurrentUser ? getCurrentUser() : null;
            if (user && testAttemptId) {
                const violations = JSON.parse(localStorage.getItem('testViolations') || '[]');
                violations.push({
                    attemptId: testAttemptId,
                    userEmail: user.email,
                    type: 'tab_switch',
                    timestamp: Date.now()
                });
                localStorage.setItem('testViolations', JSON.stringify(violations));
            }
        }
    }
    
    // Add CSS animations
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        @keyframes slideInWarning {
            from {
                transform: translateX(120%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutWarning {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(120%);
                opacity: 0;
            }
        }
        
        .copy-paste-warning {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .warning-icon {
            font-size: 20px;
            animation: pulse 1s infinite;
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.1);
            }
        }
    `;
    document.head.appendChild(animationStyle);
    
    // Initialize protection when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyProtection);
    } else {
        applyProtection();
    }
    
    // Add keyboard monitoring
    document.addEventListener('keydown', detectKeyboardShortcuts, true);
    
    // Add visibility change monitoring
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Periodic DevTools check
    setInterval(detectDevTools, 1000);
    
    // Prevent inspect element on right-click
    document.addEventListener('contextmenu', function(e) {
        if (isTestPage) {
            e.preventDefault();
            showWarning('Right-click is disabled during the test!');
            return false;
        }
    });
    
    // Additional protection for code editor
    window.addEventListener('load', function() {
        if (!isTestPage) return;
        
        // Monitor code editor specifically
        const observeEditor = setInterval(function() {
            const editor = document.getElementById('code-editor');
            if (editor) {
                // Block paste in editor
                editor.addEventListener('paste', function(e) {
                    e.preventDefault();
                    showWarning('Pasting code is not allowed!');
                    return false;
                });
                
                clearInterval(observeEditor);
            }
        }, 500);
    });
    
    console.log('Protection script loaded');
    
})();
