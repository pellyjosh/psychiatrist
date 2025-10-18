<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Appointment status updated</title>
  <style>body{font-family:Arial, sans-serif;color:#333}.container{max-width:600px;margin:0 auto;padding:16px}.button{display:inline-block;padding:10px 16px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px}</style>
</head>
<body>
  <div class="container">
    <h2>Appointment status updated</h2>
    <p>Your appointment for <strong>{{ $appointment->first_name }} {{ $appointment->last_name }}</strong> has changed status.</p>
    <p>From: <strong>{{ $old }}</strong><br>To: <strong>{{ $new }}</strong></p>
    <p><a class="button" href="{{ url('/appointments/'.$appointment->id) }}">View Appointment</a></p>
    <p>If you have questions, please contact the clinic.</p>
    <p>Thanks,<br>The Clinic</p>
  </div>
</body>
</html>
