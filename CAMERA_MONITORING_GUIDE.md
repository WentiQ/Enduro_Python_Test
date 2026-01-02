# Camera Monitoring System - Implementation Guide

## 📹 Features Implemented

### 1. **Initial Camera Warning Modal**
When a student starts the test, they see a mandatory warning modal with:
- ⚠️ Camera monitoring requirements
- Recording evaluation notice
- List of monitoring rules:
  - Camera will be monitored throughout
  - Live video feed displayed
  - **Recording will be evaluated after submission**
  - Suspicious activity may result in cancellation
  - Proper lighting and positioning required
  - Must stay in frame

### 2. **Live Camera Feed Display**
- **Position:** Fixed bottom-right corner
- **Size:** 280x210px (responsive on mobile: 200x150px)
- **Features:**
  - Live video preview
  - "REC" indicator (blinking red)
  - Recording status display
  - Professional camera frame with red border

### 3. **Camera Status Monitoring**
- Checks camera status every 5 seconds
- Alerts if camera is disconnected
- Shows notification warnings
- Prevents test without camera

### 4. **Submission Warnings**
- Final warning before submission about recording evaluation
- Reminder that malpractice in recording leads to cancellation
- Auto-submission also includes recording notice

### 5. **Camera Permissions**
- Requests camera access at test start
- Cannot proceed without camera access
- Retry mechanism if permission denied
- Redirects to dashboard if camera refused

## 🎨 Visual Elements

### Camera Monitor Display
```
┌──────────────────────────┐
│ 📹 Live Monitoring  ● REC │  ← Red header with blinking indicator
├──────────────────────────┤
│                          │
│    [Live Video Feed]     │  ← 280x210px video
│                          │
├──────────────────────────┤
│   Recording Active       │  ← Green status text
└──────────────────────────┘
```

### Warning Modal Structure
```
⚠️ Camera Monitoring Required

Important Notice:
• Your camera will be monitored throughout this test
• Live video feed will be displayed to you during the test
• The recording will be evaluated after submission
• Any suspicious activity detected may result in test cancellation
• Ensure proper lighting and camera positioning
• Stay in frame throughout the test duration

⚠️ WARNING: Test will not be considered valid if recording shows malpractice

[I Understand - Start Camera & Begin Test]
```

## 🔧 Technical Implementation

### JavaScript Functions
1. **`showCameraWarning()`** - Displays initial warning modal
2. **`acceptCameraMonitoring()`** - Requests camera permission & starts
3. **`startCameraMonitoring()`** - Creates camera display element
4. **`monitorCameraStatus()`** - Checks camera every 5 seconds
5. **`stopCameraMonitoring()`** - Stops camera on submission
6. **`showNotification()`** - Shows status notifications

### CSS Classes
- `.camera-monitor` - Main camera container
- `.camera-header` - Header with title and REC indicator
- `.recording-indicator` - Blinking red dot
- `.camera-feed` - Video element
- `.camera-footer` - Status footer

### Browser Compatibility
- Uses `navigator.mediaDevices.getUserMedia()`
- Works on: Chrome, Firefox, Edge, Safari (iOS/macOS)
- Requires HTTPS or localhost
- Mobile responsive design

## 📱 User Experience Flow

1. **Student starts test** → Warning modal appears
2. **Student clicks accept** → Camera permission requested
3. **Permission granted** → Camera starts, feed appears bottom-right
4. **During test** → Camera monitors continuously
5. **Camera disconnects** → Warning notification shown
6. **Student submits** → Final warning about recording evaluation
7. **After submission** → Camera stops, test submitted

## ⚠️ Important Notices

### For Students
- Camera monitoring is **mandatory**
- Recording will be **evaluated after submission**
- Any **malpractice detected** may result in **test cancellation**
- Ensure **good lighting** and stay **in frame**
- Do not **cover or disable** camera during test

### For Administrators
- Recording data is captured via getUserMedia
- Currently shows live preview only
- To implement recording storage, add MediaRecorder API
- Consider server-side storage for recordings
- Set up evaluation process for recordings

## 🚀 Future Enhancements (Optional)

1. **Recording Storage**
   - Use MediaRecorder API to record video
   - Store recordings on server
   - Link recordings to test attempts

2. **AI Detection**
   - Face detection to ensure student presence
   - Multiple faces detection
   - Phone/device detection
   - Eye tracking for attention monitoring

3. **Admin Dashboard**
   - View recorded sessions
   - Flag suspicious behavior
   - Playback controls
   - Timestamp markers for incidents

4. **Analytics**
   - Track camera disconnections
   - Monitor attention metrics
   - Generate integrity reports

## 🔒 Privacy & Compliance

- Clearly state recording purpose (proctoring)
- Obtain explicit consent before recording
- Store recordings securely
- Delete recordings after evaluation period
- Comply with GDPR/local privacy laws

## 📝 Code Files Modified

1. **js/test.js** - Added camera functions and monitoring logic
2. **css/test.css** - Added camera display styles and animations
3. Functions added:
   - Camera warning and permission
   - Live feed display
   - Status monitoring
   - Notification system

---

**Status:** ✅ Fully Implemented
**Last Updated:** January 2, 2026
