# Python Test Platform

A comprehensive web-based platform for conducting timed Python programming tests with automatic code evaluation and test case validation.

## Features

### For Students
- **Google OAuth Authentication**: Secure login with Google account
- **Timed Tests**: 1-hour tests with automatic submission when time expires
- **Live Code Editor**: Write and test Python code directly in the browser
- **Instant Feedback**: Run code against hidden test cases in real-time
- **Copy-Paste Protection**: Prevents copying/pasting to ensure authentic work
- **Test History**: View past test attempts and scores
- **Window Time Restriction**: Tests available only during specified date ranges

### For Administrators
- **Student Management**: View all registered students with their details
- **Test Management**: Create, edit, and delete tests
- **Detailed Analytics**: View test attempts with comprehensive details
  - Student information (Name, Email, Department, WhatsApp)
  - Test timing (Start time, Submit time, Duration)
  - Scores (Individual question scores and overall marks)
  - Status (Manually submitted or Auto-submitted)
- **Export Functionality**: Download test results as CSV
- **Question Bank**: Pre-built Python questions with test cases

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Python Execution**: Pyodide (Python running in browser via WebAssembly)
- **Storage**: LocalStorage (client-side data persistence)
- **Authentication**: Google OAuth 2.0

## File Structure

```
Python Test/
├── index.html              # Landing page
├── login.html              # Login page with Google OAuth
├── student-dashboard.html  # Student dashboard
├── test.html              # Test interface
├── admin-dashboard.html   # Admin dashboard
├── css/
│   ├── styles.css         # Global styles
│   ├── test.css           # Test interface styles
│   └── admin.css          # Admin dashboard styles
├── js/
│   ├── auth.js            # Authentication & user management
│   ├── test.js            # Test interface logic
│   ├── timer.js           # Timer and countdown management
│   ├── code-runner.js     # Python code execution with Pyodide
│   └── admin.js           # Admin dashboard functionality
├── data/
│   └── questions.js       # Question bank with test cases
└── README.md              # This file
```

## Setup Instructions

### 1. Google OAuth Setup (Optional but Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized JavaScript origins (e.g., `http://localhost`, your domain)
6. Copy the Client ID
7. Replace `YOUR_GOOGLE_CLIENT_ID` in `login.html` with your actual Client ID

### 2. Local Development

1. **Using Python HTTP Server**:
   ```bash
   # Navigate to project directory
   cd "Python Test"
   
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   Then open: `http://localhost:8000`

2. **Using Node.js HTTP Server**:
   ```bash
   # Install http-server globally (one time)
   npm install -g http-server
   
   # Run server
   http-server -p 8000
   ```
   Then open: `http://localhost:8000`

3. **Using VS Code Live Server**:
   - Install "Live Server" extension in VS Code
   - Right-click on `index.html`
   - Select "Open with Live Server"

### 3. Demo Login (For Testing Without Google OAuth)

The platform includes demo login buttons for quick testing:

- **Student Demo**: Creates/uses demo student account
- **Admin Demo**: Creates/uses demo admin account

These are automatically added to the login page for development purposes.

## Usage Guide

### For Students

1. **Login**:
   - Visit the website
   - Click "Get Started"
   - Sign in with Google or use Demo Login
   - Provide department and WhatsApp number (first time only)

2. **Taking a Test**:
   - View available tests on your dashboard
   - Click "Start Test" on an available test
   - Read questions carefully
   - Write code in the provided editor
   - Click "Run Code" to test against sample test cases
   - Navigate between questions using navigation buttons
   - Submit test before time expires (auto-submits after 1 hour)

3. **Viewing Results**:
   - After submission, view your score immediately
   - Check detailed question-wise scores
   - View test history in your dashboard

### For Administrators

1. **Login**:
   - Click "Admin Login" on homepage
   - Sign in with admin credentials or use Admin Demo

2. **Managing Students**:
   - View all registered students
   - Filter by department or search by name/email
   - See number of tests taken by each student

3. **Managing Tests**:
   - Create new tests with title, description, duration, and date range
   - View existing tests
   - Edit or delete tests

4. **Viewing Test Attempts**:
   - See all test submissions
   - Filter by student or test
   - View detailed attempt information
   - Export results to CSV for further analysis

## Key Features Explained

### 1. Timer & Auto-Submit
- 1-hour countdown timer displayed prominently
- Warnings at 10 min, 5 min, and 1 min remaining
- Automatic submission when time expires
- Elapsed time tracked for admin review

### 2. Copy-Paste Protection
- Right-click context menu disabled during test
- Copy (Ctrl+C/Cmd+C) blocked
- Cut (Ctrl+X/Cmd+X) blocked
- Paste (Ctrl+V/Cmd+V) blocked
- Visual warning when attempted

### 3. Code Execution & Validation
- Python code runs entirely in browser (no server needed)
- Uses Pyodide for WebAssembly-based Python
- Multiple test cases per question (some hidden)
- Partial marks based on test cases passed
- Real-time output display

### 4. Scoring System
- Each question has a maximum marks value
- Score = (Test cases passed / Total test cases) × Maximum marks
- Overall score is sum of all question scores
- Percentage automatically calculated

## Sample Questions Included

1. **Sum of List** (10 marks): Calculate sum of numbers in a list
2. **Palindrome Check** (15 marks): Check if string is palindrome
3. **Fibonacci Sequence** (20 marks): Generate Fibonacci numbers
4. **Count Vowels** (15 marks): Count vowels in a string
5. **Find Max/Min** (10 marks): Find maximum and minimum in list
6. **Reverse Words** (10 marks): Reverse word order in sentence
7. **Prime Number Check** (20 marks): Check if number is prime

## Data Storage

All data is stored in browser's LocalStorage:

- **users**: Array of user objects (students and admin)
- **tests**: Array of test configurations
- **testAttempts**: Array of test submission records

### Clear Data (Reset)
To clear all data and start fresh:
```javascript
localStorage.clear();
```
Then refresh the page.

## Browser Compatibility

- **Chrome**: ✅ Recommended
- **Firefox**: ✅ Fully supported
- **Safari**: ✅ Supported
- **Edge**: ✅ Supported
- **Mobile Browsers**: ⚠️ Limited (desktop recommended)

## Important Notes

### Security Considerations
1. **Client-side storage**: Data stored in LocalStorage is not encrypted
2. **Production use**: For production, implement:
   - Backend server for data storage
   - Server-side code execution validation
   - Database for persistent storage
   - Proper authentication and authorization
   - HTTPS encryption

### Limitations
1. **No server**: All processing happens in browser
2. **Storage limit**: LocalStorage has ~5-10MB limit
3. **Data persistence**: Clearing browser data removes all records
4. **Scalability**: Not suitable for large-scale deployments without backend

## Customization

### Adding New Questions

Edit `data/questions.js` and add new question objects:

```javascript
{
    id: 'q_unique_id',
    type: 'code',
    text: 'Your question text with examples',
    marks: 15,
    starterCode: 'def function_name():\n    # Write code here\n    pass',
    testCases: [
        {
            input: 'optional input',
            output: 'expected output',
            hidden: false  // visible to students
        },
        {
            input: '',
            output: 'expected output',
            hidden: true   // hidden from students
        }
    ]
}
```

### Customizing Time Duration

Change test duration in admin dashboard when creating tests, or modify default in code:
- File: `student-dashboard.html` or `admin.js`
- Change `duration: 60` to desired minutes

### Styling Customization

- **Colors**: Edit CSS variables in `css/styles.css`
- **Layout**: Modify grid layouts in respective CSS files
- **Fonts**: Change font-family in `css/styles.css`

## Troubleshooting

### Pyodide Loading Issues
- **Problem**: "Python runtime not available"
- **Solution**: Check internet connection (Pyodide loads from CDN)
- **Alternative**: Download Pyodide and serve locally

### Google OAuth Not Working
- **Problem**: Login button doesn't appear or doesn't work
- **Solution**: Use demo login buttons for testing
- **Fix**: Verify Client ID and authorized origins in Google Console

### Timer Not Working
- **Problem**: Timer doesn't countdown
- **Solution**: Check browser console for errors
- **Check**: Ensure `timer.js` is loaded properly

### Data Not Persisting
- **Problem**: Data disappears after refresh
- **Solution**: Check if LocalStorage is enabled
- **Check**: Don't use incognito/private browsing mode

## Future Enhancements

Potential improvements for production version:

1. **Backend Integration**
   - Node.js/Express or Python/Flask server
   - MongoDB or PostgreSQL database
   - JWT authentication

2. **Advanced Features**
   - Video proctoring
   - Screen recording
   - Tab switching detection
   - Multiple question types (MCQ, fill blanks)

3. **Analytics**
   - Performance graphs
   - Question difficulty analysis
   - Time spent per question
   - Pass/fail statistics

4. **Security**
   - Server-side code execution
   - Anti-cheating mechanisms
   - Encrypted data storage
   - IP tracking

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify all files are in correct directories
3. Ensure running on a proper HTTP server (not file://)
4. Clear browser cache and LocalStorage if needed

## License

This project is open-source and available for educational purposes.

## Credits

- **Pyodide**: Python in the browser
- **Google OAuth**: Authentication
- Built with vanilla JavaScript (no frameworks)

---

**Note**: This is a demonstration platform. For production use with real students, implement proper backend infrastructure, database, and security measures.
#   E n d u r o _ P y t h o n _ T e s t  
 