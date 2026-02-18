# Smart Alerts & Notifications System

A comprehensive real-time notification system for property searches with email alerts, saved searches, and change tracking.

## Features

### 1. Email Alerts
- Instant notifications for new property matches
- Price drop alerts with savings calculation
- Status change notifications (sold, rented, back on market)
- Daily and weekly digest options

### 2. Saved Searches
- Save search criteria with custom names
- Configure alert preferences per search
- Track number of alerts received
- Easy management interface

### 3. Alert Types
- **NEW_MATCH**: When new properties match your saved search
- **PRICE_DROP**: When property prices are reduced
- **STATUS_CHANGE**: When property status changes
- **BACK_ON_MARKET**: When a sold/rented property becomes active again

### 4. Alert Preferences
- **Alert Frequency**: Instant, Daily Digest, or Weekly Digest
- **Notification Types**: Choose which events to be notified about
- **Email Preferences**: Toggle email notifications on/off

## Setup

### 1. Environment Variables

Add these variables to your `.env.local` file:

```bash
# Email Configuration (Choose one provider)

# Option 1: Nodemailer (SMTP)
EMAIL_PROVIDER=nodemailer
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM="Real Estate Alerts <noreply@yourdomain.com>"

# Option 2: Resend (Recommended for production)
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM="Real Estate Alerts <noreply@yourdomain.com>"

# Cron Job Secret (for scheduled checks)
CRON_SECRET=your-random-secret-key-here

# App URL (for email links)
NEXTAUTH_URL=http://localhost:3000
```

### 2. Database Migration

Run Prisma migration to add the new tables:

```bash
npx prisma db push
# or
npx prisma migrate dev --name add-alerts-system
```

### 3. Email Provider Setup

#### Using Gmail (Development)
1. Enable 2-factor authentication on your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password in `SMTP_PASSWORD`

#### Using Resend (Production)
1. Sign up at https://resend.com
2. Get your API key from the dashboard
3. Verify your sending domain
4. Add `RESEND_API_KEY` to your environment variables

## Usage

### For Users

#### Saving a Search
1. Go to the Properties page
2. Apply filters (location, price, bedrooms, etc.)
3. Click the "Save Search" button
4. Configure alert preferences
5. Name your search and save

#### Managing Alerts
- View all alerts at `/alerts`
- Mark alerts as read
- Delete unwanted alerts
- Filter by unread alerts

#### Managing Saved Searches
- View saved searches at `/saved-searches`
- Edit alert preferences
- Enable/disable email notifications
- Delete saved searches

### For Administrators

#### Setting Up Cron Jobs

The alert system needs periodic checks to send notifications. Set up these cron jobs:

**Option 1: Using Vercel Cron (Recommended for Vercel deployments)**

Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/alerts/check",
      "schedule": "*/5 * * * *"
    },
    {
      "path": "/api/alerts/check?type=daily",
      "schedule": "0 8 * * *"
    },
    {
      "path": "/api/alerts/check?type=weekly",
      "schedule": "0 8 * * 1"
    }
  ]
}
```

**Option 2: Using External Cron Service (e.g., cron-job.org)**

1. Sign up for a cron service
2. Create jobs:
   - Instant alerts: Every 5 minutes
     - URL: `https://yourdomain.com/api/alerts/check`
     - Method: POST
     - Header: `Authorization: Bearer YOUR_CRON_SECRET`
   
   - Daily digest: Every day at 8 AM
     - URL: `https://yourdomain.com/api/alerts/check`
     - Method: POST
     - Body: `{"type": "daily"}`
     - Header: `Authorization: Bearer YOUR_CRON_SECRET`
   
   - Weekly digest: Every Monday at 8 AM
     - URL: `https://yourdomain.com/api/alerts/check`
     - Method: POST
     - Body: `{"type": "weekly"}`
     - Header: `Authorization: Bearer YOUR_CRON_SECRET`

**Option 3: Manual Trigger (Development)**

```bash
curl -X POST http://localhost:3000/api/alerts/check \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -d '{"type": "all"}'
```

## API Endpoints

### Saved Searches
- `GET /api/saved-searches` - List all saved searches
- `POST /api/saved-searches` - Create new saved search
- `GET /api/saved-searches/[id]` - Get specific search
- `PATCH /api/saved-searches/[id]` - Update search
- `DELETE /api/saved-searches/[id]` - Delete search

### Alerts
- `GET /api/alerts` - List all alerts
- `GET /api/alerts?unreadOnly=true` - List unread alerts
- `PATCH /api/alerts/[id]` - Mark alert as read
- `DELETE /api/alerts/[id]` - Delete alert
- `POST /api/alerts/mark-all-read` - Mark all alerts as read
- `POST /api/alerts/check` - Trigger alert checks (cron)

## Database Schema

### SavedSearch
```prisma
model SavedSearch {
  id                  String
  name                String
  filters             Json
  emailAlerts         Boolean
  alertFrequency      AlertFrequency
  notifyNewMatches    Boolean
  notifyPriceDrops    Boolean
  notifyStatusChanges Boolean
  userId              String
  lastChecked         DateTime
}
```

### Alert
```prisma
model Alert {
  id            String
  type          AlertType
  propertyId    String
  savedSearchId String
  title         String
  message       String
  metadata      Json
  sent          Boolean
  sentAt        DateTime
  read          Boolean
  readAt        DateTime
}
```

### PriceHistory
```prisma
model PriceHistory {
  id         String
  propertyId String
  oldPrice   Float
  newPrice   Float
  changedAt  DateTime
}
```

### StatusHistory
```prisma
model StatusHistory {
  id         String
  propertyId String
  oldStatus  PropertyStatus
  newStatus  PropertyStatus
  changedAt  DateTime
}
```

## Email Templates

The system includes professionally designed email templates:

1. **New Match Alert**: Notifies about new properties matching search criteria
2. **Price Drop Alert**: Shows old/new prices with savings percentage
3. **Status Change Alert**: Informs about property status updates
4. **Daily/Weekly Digest**: Summarizes multiple alerts in one email

All templates are mobile-responsive and include:
- Property details
- Direct links to property pages
- Alert management links
- Unsubscribe options

## Monitoring

### Check Alert System Health
```bash
curl http://localhost:3000/api/alerts/check
```

### View Recent Alerts in Database
```sql
SELECT * FROM alerts 
ORDER BY created_at DESC 
LIMIT 10;
```

### Check Unsent Alerts
```sql
SELECT COUNT(*) FROM alerts WHERE sent = false;
```

## Troubleshooting

### Emails Not Sending
1. Check email provider credentials
2. Verify environment variables are loaded
3. Check email service logs in API route
4. Test email connectivity:
   ```bash
   curl -X POST http://localhost:3000/api/alerts/check \
     -H "Authorization: Bearer YOUR_CRON_SECRET"
   ```

### Alerts Not Being Created
1. Verify cron jobs are running
2. Check database for price/status history records
3. Ensure properties have status="ACTIVE"
4. Check saved search `lastChecked` timestamp

### Performance Issues
1. Add database indexes (already included in schema)
2. Limit alert frequency for high-volume searches
3. Archive old alerts periodically
4. Use background jobs for digest emails

## Best Practices

1. **Rate Limiting**: Implement rate limiting on alert endpoints
2. **Email Throttling**: Don't send more than 100 emails per batch
3. **Data Cleanup**: Archive alerts older than 90 days
4. **User Preferences**: Allow users to unsubscribe from specific alert types
5. **Testing**: Test emails in development before deploying

## Future Enhancements

- [ ] SMS notifications via Twilio
- [ ] Push notifications for mobile app
- [ ] In-app notification center
- [ ] Alert scheduling (quiet hours)
- [ ] Advanced filtering (price per sqft, walk score, etc.)
- [ ] Machine learning for personalized recommendations
- [ ] Alert analytics dashboard
- [ ] Bulk alert management

## License

Part of the Real Estate Website project.
