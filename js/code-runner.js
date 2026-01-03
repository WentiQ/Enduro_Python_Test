// Python Code Runner using Pyodide

let pyodide = null;
let pyodideReady = false;

// Initialize Pyodide
async function initPyodide() {
    if (pyodideReady) return;
    
    try {
        pyodide = await loadPyodide();
        pyodideReady = true;
        console.log('Pyodide loaded successfully');
    } catch (error) {
        console.error('Failed to load Pyodide:', error);
    }
}

// Run Python code
async function runCode() {
    const editor = document.getElementById('code-editor');
    const output = document.getElementById('output-display');
    const runButton = document.querySelector('.run-code-btn');
    
    if (!editor || !output) return;
    
    const code = editor.value.trim();
    
    if (!code) {
        output.textContent = 'Please write some code first.';
        output.className = '';
        return;
    }
    
    // Disable run button and show loading
    runButton.disabled = true;
    runButton.innerHTML = '<span class="spinner"></span> Running...';
    output.textContent = 'Running code...';
    output.className = '';
    
    try {
        // Initialize Pyodide if not ready
        if (!pyodideReady) {
            await initPyodide();
        }
        
        if (!pyodideReady) {
            throw new Error('Python runtime not available');
        }
        
        // Capture stdout
        await pyodide.runPythonAsync(`
            import sys
            from io import StringIO
            sys.stdout = StringIO()
        `);
        
        // Run user code
        await pyodide.runPythonAsync(code);
        
        // Get output
        const result = await pyodide.runPythonAsync('sys.stdout.getvalue()');
        
        // Run test cases
        const question = currentTest.questions[currentQuestionIndex];
        if (question.testCases && question.testCases.length > 0) {
            const testResults = await runTestCases(code, question.testCases);
            displayTestResults(testResults, result);
            
            // Mark as answered if at least 1 test case passed
            const passedCount = testResults.filter(r => r.passed).length;
            const totalCount = testResults.length;
            answers[currentQuestionIndex].answered = passedCount > 0;
            answers[currentQuestionIndex].score = Math.round((passedCount / totalCount) * 100);
        } else {
            output.textContent = result || 'Code executed successfully (no output)';
            output.className = 'output-success';
            
            // Mark as answered for questions without test cases if code is written
            const starterCode = question.starterCode || '';
            answers[currentQuestionIndex].answered = code.trim() !== '' && code.trim() !== starterCode.trim();
        }
        
        updateQuestionNavStatus();
        
    } catch (error) {
        output.textContent = `Error: ${error.message}`;
        output.className = 'output-error';
    } finally {
        runButton.disabled = false;
        runButton.textContent = 'Run Code';
    }
}

// Run test cases
async function runTestCases(code, testCases) {
    const results = [];
    
    console.log(`Running ${testCases.length} test cases...`);
    
    // Extract only function definitions (remove print statements and test code)
    const functionCode = extractFunctionDefinitions(code);
    console.log('Extracted function code:', functionCode);
    
    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`\nTest Case ${i + 1}:`, testCase);
        
        try {
            // Create fresh Python environment for each test case
            await pyodide.runPythonAsync(`
                import sys
                from io import StringIO
                sys.stdout = StringIO()
                sys.stderr = StringIO()
            `);
            
            // Load the user's function definitions only
            await pyodide.runPythonAsync(functionCode);
            
            // Execute the test case and capture result
            let actualOutput = '';
            if (testCase.input && testCase.input.trim()) {
                // Execute the function call and get the result
                const result = await pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
result = ${testCase.input}
print(result)
sys.stdout.getvalue().strip()
                `);
                actualOutput = result.trim();
            } else {
                // No specific test input, run the code
                await pyodide.runPythonAsync(functionCode);
                const output = await pyodide.runPythonAsync('sys.stdout.getvalue()');
                actualOutput = output.trim();
            }
            
            const expectedOutput = testCase.output.trim();
            
            console.log(`  Input: ${testCase.input}`);
            console.log(`  Expected: "${expectedOutput}"`);
            console.log(`  Actual: "${actualOutput}"`);
            
            // Compare outputs (handle different Python representations)
            const passed = compareOutputs(actualOutput, expectedOutput);
            console.log(`  Passed: ${passed}`);
            
            results.push({
                passed: passed,
                input: testCase.input,
                expected: expectedOutput,
                actual: actualOutput,
                hidden: testCase.hidden || false
            });
            
        } catch (error) {
            console.error(`  Error in test case ${i + 1}:`, error);
            results.push({
                passed: false,
                input: testCase.input,
                expected: testCase.output,
                actual: `Error: ${error.message}`,
                hidden: testCase.hidden || false
            });
        }
    }
    
    console.log(`\nTest Results: ${results.filter(r => r.passed).length}/${results.length} passed`);
    return results;
}

// Extract function definitions from code (remove test/print statements)
function extractFunctionDefinitions(code) {
    const lines = code.split('\n');
    const functionLines = [];
    let inFunction = false;
    let functionIndent = 0;
    
    for (let line of lines) {
        const trimmedLine = line.trim();
        
        // Skip empty lines and comments outside functions
        if (!inFunction && (trimmedLine === '' || trimmedLine.startsWith('#'))) {
            continue;
        }
        
        // Check if line starts a function definition
        if (trimmedLine.startsWith('def ')) {
            inFunction = true;
            functionIndent = line.length - line.trimStart().length;
            functionLines.push(line);
            continue;
        }
        
        // If we're in a function
        if (inFunction) {
            const currentIndent = line.length - line.trimStart().length;
            
            // If line has content and is indented more than function def, it's part of function
            if (trimmedLine !== '' && currentIndent > functionIndent) {
                functionLines.push(line);
            } 
            // If we hit a non-indented line or less indented, function ended
            else if (trimmedLine !== '' && currentIndent <= functionIndent) {
                inFunction = false;
                // Don't include this line (it's likely a test/print statement)
            }
        }
    }
    
    return functionLines.join('\n');
}

// Compare outputs intelligently
function compareOutputs(actual, expected) {
    // Direct string match
    if (actual === expected) {
        return true;
    }
    
    // Try to evaluate as Python literals and compare
    try {
        // Remove quotes if both are quoted strings
        const actualUnquoted = actual.replace(/^["']|["']$/g, '');
        const expectedUnquoted = expected.replace(/^["']|["']$/g, '');
        if (actualUnquoted === expectedUnquoted) {
            return true;
        }
        
        // For numbers, lists, tuples - compare as JSON after normalization
        const normalizedActual = actual.replace(/\(/g, '[').replace(/\)/g, ']').replace(/'/g, '"');
        const normalizedExpected = expected.replace(/\(/g, '[').replace(/\)/g, ']').replace(/'/g, '"');
        
        try {
            const actualParsed = JSON.parse(normalizedActual);
            const expectedParsed = JSON.parse(normalizedExpected);
            return JSON.stringify(actualParsed) === JSON.stringify(expectedParsed);
        } catch (e) {
            // Not valid JSON, continue with string comparison
        }
        
        // Handle boolean values
        if ((actual === 'True' && expected === 'True') || 
            (actual === 'False' && expected === 'False')) {
            return true;
        }
        
        // Handle None
        if (actual === 'None' && expected === 'None') {
            return true;
        }
        
    } catch (e) {
        // If any error in comparison, fall back to string comparison
    }
    
    return false;
}

// Display test results
function displayTestResults(testResults, userOutput) {
    const output = document.getElementById('output-display');
    const passedCount = testResults.filter(r => r.passed).length;
    const totalCount = testResults.length;
    const allPassed = passedCount === totalCount;
    
    let html = '';
    
    // Show user output first
    if (userOutput) {
        html += `<div class="output-section"><strong>Your Output:</strong><pre>${escapeHtml(userOutput)}</pre></div>`;
    }
    
    html += `<div class="test-results-summary">
        <strong>Test Results: ${passedCount}/${totalCount} passed</strong>
    </div>`;
    
    // Show ALL test cases (both visible and hidden during development/testing)
    // In production, you might want to filter only non-hidden ones
    
    html += '<div class="test-cases">';
    testResults.forEach((result, index) => {
        // Skip truly hidden tests in display but count them
        if (result.hidden) {
            return;
        }
        
        const status = result.passed ? '✓' : '✗';
        const statusClass = result.passed ? 'test-pass' : 'test-fail';
        const testNumber = index + 1;
        
        html += `
            <div class="test-case ${statusClass}">
                <div class="test-case-header">${status} Test Case ${testNumber} ${result.hidden ? '(Hidden)' : ''}</div>
                ${result.input ? `<div><strong>Input:</strong> <code>${escapeHtml(result.input)}</code></div>` : ''}
                <div><strong>Expected:</strong> <code>${escapeHtml(result.expected)}</code></div>
                <div><strong>Got:</strong> <code>${escapeHtml(result.actual)}</code></div>
            </div>
        `;
    });
    html += '</div>';
    
    const hiddenCount = testResults.filter(r => r.hidden).length;
    if (hiddenCount > 0) {
        const hiddenPassed = testResults.filter(r => r.hidden && r.passed).length;
        html += `<div class="hidden-tests">
            ${hiddenPassed}/${hiddenCount} hidden test cases passed
        </div>`;
    }
    
    if (allPassed) {
        html += '<div class="success-message">🎉 All test cases passed! Great job!</div>';
    } else {
        html += '<div class="fail-message">⚠️ Some test cases failed. Keep trying!</div>';
    }
    
    output.innerHTML = html;
    output.className = allPassed ? 'output-success' : 'output-error';
    
    // Calculate and save score
    const question = currentTest.questions[currentQuestionIndex];
    const score = (passedCount / totalCount) * question.marks;
    answers[currentQuestionIndex].score = score;
    answers[currentQuestionIndex].output = html;
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Calculate final scores
async function calculateScores(autoSubmitted, leftInMiddle = false) {
    const user = getCurrentUser();
    
    // Run all test cases one final time and store results
    const questionResults = [];
    
    for (let i = 0; i < currentTest.questions.length; i++) {
        const question = currentTest.questions[i];
        const answer = answers[i];
        let passedCount = 0;
        let totalCount = 0;
        
        if (question.type === 'code' && answer.code.trim() && question.testCases) {
            try {
                if (!pyodideReady) {
                    await initPyodide();
                }
                
                if (pyodideReady) {
                    const testResults = await runTestCases(answer.code, question.testCases);
                    passedCount = testResults.filter(r => r.passed).length;
                    totalCount = testResults.length;
                    answer.score = (passedCount / totalCount) * question.marks;
                }
            } catch (error) {
                console.error(`Error evaluating question ${i + 1}:`, error);
                answer.score = 0;
                totalCount = question.testCases?.length || 0;
            }
        }
        
        questionResults.push({
            originalIndex: question.originalIndex !== undefined ? question.originalIndex : i,
            passedTestCases: passedCount,
            totalTestCases: totalCount
        });
    }
    
    // Calculate total score
    let totalScore = 0;
    let maxScore = 0;
    
    const questionScores = [];
    currentTest.questions.forEach((q, index) => {
        const score = answers[index].score || 0;
        totalScore += score;
        maxScore += q.marks;
        
        const result = questionResults[index];
        
        questionScores.push({
            questionNumber: index + 1,
            originalIndex: q.originalIndex !== undefined ? q.originalIndex : index,
            questionText: q.text.substring(0, 100) + '...',
            score: Math.round(score * 100) / 100,
            maxScore: q.marks,
            passedTestCases: result.passedTestCases,
            totalTestCases: result.totalTestCases
        });
    });
    
    console.log('Question Scores with Test Cases:', questionScores);
    
    // Save test attempt
    const attempt = {
        id: testAttemptId,
        testId: currentTest.id,
        testTitle: currentTest.title,
        userEmail: user.email,
        userName: user.name,
        department: user.department,
        group: user.group || 'N/A',
        whatsapp: user.whatsapp,
        startTime: testStartTime,
        submitTime: Date.now(),
        duration: currentTest.duration,
        elapsedMinutes: getElapsedTime(),
        autoSubmitted: autoSubmitted,
        leftInMiddle: leftInMiddle,
        totalScore: Math.round(totalScore * 100) / 100,
        maxScore: maxScore,
        percentage: Math.round((totalScore / maxScore) * 100),
        questionScores: questionScores,
        answers: answers
    };
    
    // Save to localStorage
    const attempts = JSON.parse(localStorage.getItem('testAttempts') || '[]');
    attempts.push(attempt);
    localStorage.setItem('testAttempts', JSON.stringify(attempts));
    
    // Show results
    showResults(attempt);
}

// Show results modal
function showResults(attempt) {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>✅ Test Submitted Successfully</h2>
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
                <p style="font-size: 1.3rem; color: #10b981; font-weight: 600; margin-bottom: 1rem;">
                    Your test has been submitted!
                </p>
                <p style="font-size: 1.1rem; color: #666; margin-bottom: 2rem;">
                    ${attempt.autoSubmitted ? 'Your test was automatically submitted when time expired.' : 'Thank you for completing the test.'}
                </p>
                <p style="font-size: 0.95rem; color: #888;">
                    Your responses have been recorded and will be evaluated by the administrator.
                    Results will be available after evaluation.
                </p>
            </div>
            
            <button onclick="window.location.href='index.html'" class="btn btn-primary">
                Back to Home
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Remove beforeunload warning
    window.removeEventListener('beforeunload', confirmLeave);
}

// Add CSS for test results
const testResultsStyle = document.createElement('style');
testResultsStyle.textContent = `
    .output-section {
        margin-bottom: 15px;
        padding-bottom: 15px;
        border-bottom: 1px solid #e1e8ed;
    }
    
    .test-results-summary {
        padding: 10px;
        background: #f8f9fa;
        border-radius: 5px;
        margin: 10px 0;
        font-size: 1.1rem;
    }
    
    .test-cases {
        margin: 15px 0;
    }
    
    .test-case {
        padding: 10px;
        margin: 10px 0;
        border-radius: 5px;
        border-left: 4px solid;
    }
    
    .test-pass {
        background: #d4edda;
        border-color: #28a745;
    }
    
    .test-fail {
        background: #f8d7da;
        border-color: #dc3545;
    }
    
    .test-case-header {
        font-weight: 600;
        margin-bottom: 5px;
    }
    
    .hidden-tests {
        padding: 10px;
        background: #e9ecef;
        border-radius: 5px;
        margin: 10px 0;
        font-style: italic;
    }
    
    .success-message {
        padding: 15px;
        background: #d4edda;
        color: #155724;
        border-radius: 5px;
        margin-top: 15px;
        font-weight: 600;
        text-align: center;
    }
    
    .fail-message {
        padding: 15px;
        background: #fff3cd;
        color: #856404;
        border-radius: 5px;
        margin-top: 15px;
        font-weight: 600;
        text-align: center;
    }
`;
document.head.appendChild(testResultsStyle);

// Initialize Pyodide on page load
if (typeof loadPyodide !== 'undefined') {
    initPyodide().catch(console.error);
}
