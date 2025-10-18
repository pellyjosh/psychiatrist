Notifications and queued mail

What I changed

- Converted appointment and newsletter Notifications to implement ShouldQueue so mail delivery is dispatched to the queue.
- Replaced MailMessage-based simple mail output with Mailables and Blade templates (HTML) in `resources/views/emails/*`.
- Added Mail classes under `app/Mail/*`.
- Updated the `appointments:send-reminders` console command to use a robust datetime-range match.

How to run (local development)

1. Ensure your `.env` MAIL settings are configured (MAIL_MAILER, MAIL_HOST, MAIL_USERNAME, MAIL_PASSWORD etc.).

2. Start a queue worker to process queued notifications:

```bash
# single-run, useful for testing
php artisan queue:work --once

# continuous worker (development)
php artisan queue:work
```

3. Send a newsletter (this will queue notifications because Notifications are queued):

```bash
php artisan newsletter:send "Subject here" --content="<p>Hello users...</p>"
```

4. Run reminders manually (also queues mails):

```bash
php artisan appointments:send-reminders 24h
php artisan appointments:send-reminders 1h
```

Notes and next steps

- For production, configure a persistent queue driver (Redis, database) and run `php artisan queue:work` in a process supervisor (systemd, supervisord, etc.).
- For very large newsletters consider batching via jobs and throttling or using a third-party provider with bulk APIs.
- If your DB is not using a concatenation operator of `||` (SQLite/Postgres use `||`, MySQL uses `CONCAT`) the reminder query may need small adjustment; test on your production DB engine and adjust the raw where accordingly.
