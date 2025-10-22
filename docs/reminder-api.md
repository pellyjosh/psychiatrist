# Reminder API Endpoints

Simple HTTP endpoints to trigger appointment reminders without authentication (uses secret key for security).

## Setup

1. **Set your secret key in `.env`:**

```bash
REMINDER_SECRET=your-secret-key-here-change-this
```

2. **Make sure queue worker is running:**

```bash
php artisan queue:work
```

## Endpoints

### 24 Hour Reminder

Sends reminders for appointments happening in 24 hours.

```
GET http://127.0.0.1:8000/api/reminders/24h?secret=your-secret-key-here-change-this
```

**Response:**

```json
{
    "success": true,
    "message": "Sent reminders for 2 appointments (24 hours)",
    "count": 2
}
```

### 30 Minute Reminder

Sends reminders for appointments happening in 30 minutes.

```
GET http://127.0.0.1:8000/api/reminders/30m?secret=your-secret-key-here-change-this
```

**Response:**

```json
{
    "success": true,
    "message": "Sent reminders for 1 appointments (30 minutes)",
    "count": 1
}
```

## Chrome Extension Setup

You can create a simple Chrome extension to call these endpoints:

### manifest.json

```json
{
    "manifest_version": 3,
    "name": "Appointment Reminder Trigger",
    "version": "1.0",
    "description": "Triggers appointment reminders",
    "permissions": ["alarms", "notifications"],
    "background": {
        "service_worker": "background.js"
    },
    "action": {
        "default_popup": "popup.html"
    }
}
```

### background.js

```javascript
// Run 24h reminder daily at 9 AM
chrome.alarms.create('reminder24h', { periodInMinutes: 1440, when: Date.now() + 60000 });

// Run 30m reminder every 30 minutes
chrome.alarms.create('reminder30m', { periodInMinutes: 30 });

chrome.alarms.onAlarm.addListener((alarm) => {
    const secret = 'your-secret-key-here-change-this'; // Store securely
    const baseUrl = 'http://127.0.0.1:8000'; // Or your production URL

    if (alarm.name === 'reminder24h') {
        fetch(`${baseUrl}/api/reminders/24h?secret=${secret}`)
            .then((res) => res.json())
            .then((data) => console.log('24h reminder sent:', data))
            .catch((err) => console.error('Error:', err));
    }

    if (alarm.name === 'reminder30m') {
        fetch(`${baseUrl}/api/reminders/30m?secret=${secret}`)
            .then((res) => res.json())
            .then((data) => console.log('30m reminder sent:', data))
            .catch((err) => console.error('Error:', err));
    }
});
```

### popup.html

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Appointment Reminders</title>
        <style>
            body {
                width: 300px;
                padding: 16px;
                font-family: Arial;
            }
            button {
                width: 100%;
                padding: 10px;
                margin: 5px 0;
                cursor: pointer;
            }
        </style>
    </head>
    <body>
        <h3>Trigger Reminders</h3>
        <button id="trigger24h">Send 24h Reminders</button>
        <button id="trigger30m">Send 30m Reminders</button>
        <div id="result" style="margin-top: 10px; color: green;"></div>

        <script src="popup.js"></script>
    </body>
</html>
```

### popup.js

```javascript
const secret = 'your-secret-key-here-change-this';
const baseUrl = 'http://127.0.0.1:8000'; // Or your production URL

document.getElementById('trigger24h').addEventListener('click', () => {
    fetch(`${baseUrl}/api/reminders/24h?secret=${secret}`)
        .then((res) => res.json())
        .then((data) => {
            document.getElementById('result').textContent = data.message;
        })
        .catch((err) => {
            document.getElementById('result').textContent = 'Error: ' + err;
            document.getElementById('result').style.color = 'red';
        });
});

document.getElementById('trigger30m').addEventListener('click', () => {
    fetch(`${baseUrl}/api/reminders/30m?secret=${secret}`)
        .then((res) => res.json())
        .then((data) => {
            document.getElementById('result').textContent = data.message;
        })
        .catch((err) => {
            document.getElementById('result').textContent = 'Error: ' + err;
            document.getElementById('result').style.color = 'red';
        });
});
```

## Alternative: Cron Jobs (Linux/Mac)

You can also use cron jobs instead of a Chrome extension:

```bash
# Edit crontab
crontab -e

# Add these lines (adjust secret and URL):
# Run 24h reminder daily at 9 AM
0 9 * * * curl "http://127.0.0.1:8000/api/reminders/24h?secret=your-secret-key-here-change-this"

# Run 30m reminder every 30 minutes
*/30 * * * * curl "http://127.0.0.1:8000/api/reminders/30m?secret=your-secret-key-here-change-this"
```

## Security Notes

- **Change the secret key** in `.env` to something strong and unique
- For production, use HTTPS URLs
- Keep the secret key private and secure
- Consider IP whitelisting in production if possible
- Monitor the endpoint for unusual activity

## Testing

Test the endpoints using curl:

```bash
# Test 24h reminder
curl "http://127.0.0.1:8000/api/reminders/24h?secret=your-secret-key-here-change-this"

# Test 30m reminder
curl "http://127.0.0.1:8000/api/reminders/30m?secret=your-secret-key-here-change-this"

# Test without secret (should return 401)
curl "http://127.0.0.1:8000/api/reminders/24h"
```
