<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>New appointment request</title>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 16px; }
    .button { display:inline-block; padding:10px 16px; background:#2563eb; color:#fff; text-decoration:none; border-radius:6px }
  </style>
</head>
<body>
  <div class="container">
    <h2>New appointment request</h2>
    <p>A new appointment has been requested for <strong>{{ $appointment->first_name }} {{ $appointment->last_name }}</strong>.</p>
    <p>Date: {{ $appointment->appointment_date ?? $appointment->preferred_date }}<br>
    Time: {{ $appointment->appointment_time ?? $appointment->preferred_time }}</p>

    <p><a class="button" href="{{ url('/admin/appointments/'.$appointment->id) }}">View Appointment</a></p>

    <p>Thanks,<br>The Clinic</p>
  </div>
</body>
</html>
