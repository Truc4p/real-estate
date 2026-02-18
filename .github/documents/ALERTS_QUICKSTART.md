# Quick Start: Smart Alerts System

Get the alerts system running in 5 minutes!

## Step 1: Install Dependencies ✓
Already done - packages installed during setup

## Step 2: Configure Email (Choose One)

### Option A: Gmail (Quick Setup for Testing)

1. Go to your Google Account: https://myaccount.google.com/apppasswords
2. Generate an App Password
3. Add to `.env.local`:

```bash
EMAIL_PROVIDER=nodemailer
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your.email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
EMAIL_FROM="Real Estate <noreply@yourdomain.com>"
CRON_SECRET=any-random-string-here
NEXTAUTH_URL=http://localhost:3000
```

### Option B: Resend (Better for Production)

1. Sign up at https://resend.com (free tier available)
2. Get API key
3. Add to `.env.local`:

```bash
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM="Real Estate <noreply@yourdomain.com>"
CRON_SECRET=any-random-string-here
NEXTAUTH_URL=http://localhost:3000
```

## Step 3: Update Database

```bash
npx prisma generate
npx prisma db push
```

## Step 4: Test It!

### 4.1. Start the dev server
```bash
npm run dev
```

### 4.2. Test Saving a Search
1. Go to http://localhost:3000/properties
2. Apply some filters (city, price range, etc.)
3. Click "Save Search" button
4. Configure alert settings
5. Save

### 4.3. Test Creating an Alert Manually

Create a test script `test-alert.js`:
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  // Create a test property
  const user = await prisma.user.findFirst();
  
  const property = await prisma.property.create({
    data: {
      title: "Test Property for Alerts",
      description: "Testing alert system",
      price: 250000,
      address: "123 Test St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      latitude: 37.7749,
      longitude: -122.4194,
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1000,
      propertyType: "APARTMENT",
      listingType: "FOR_SALE",
      status: "ACTIVE",
      images: [],
      features: [],
      yearBuilt: 2020,
      userId: user.id,
    },
  });

  console.log("Created test property:", property.id);
}

test();
```

Run: `node test-alert.js`

### 4.4. Trigger Alert Check
```bash
curl -X POST http://localhost:3000/api/alerts/check \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer any-random-string-here" \
  -d '{"type": "all"}'
```

### 4.5. Check Your Email!
You should receive an email for the new property match.

### 4.6. View Alerts in UI
Go to: http://localhost:3000/alerts

## Step 5: Set Up Automated Checks

### For Development (Manual)
Create a simple script to run every few minutes while developing:

`scripts/check-alerts.sh`:
```bash
#!/bin/bash
while true; do
  curl -X POST http://localhost:3000/api/alerts/check \
    -H "Authorization: Bearer your-cron-secret" \
    -H "Content-Type: application/json" \
    -d '{"type": "all"}'
  sleep 300  # Wait 5 minutes
done
```

Make it executable and run:
```bash
chmod +x scripts/check-alerts.sh
./scripts/check-alerts.sh
```

### For Production

**Vercel**: Create `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/alerts/check",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

**Other platforms**: Use external cron service like:
- cron-job.org
- EasyCron
- GitHub Actions

## Quick Test Checklist

- [ ] Email provider configured
- [ ] Database migrated
- [ ] Dev server running
- [ ] Can save a search
- [ ] Can trigger alert check
- [ ] Received test email
- [ ] Can view alerts at /alerts
- [ ] Can manage searches at /saved-searches

## Common Issues

**"Email not sent"**
- Check email credentials in .env.local
- For Gmail: Enable 2FA and use App Password
- Check spam folder

**"No alerts created"**
- Make sure saved search matches test property
- Check that property status is "ACTIVE"
- Verify lastChecked timestamp is older than property creation

**"Can't save search"**
- Make sure you're logged in (user required)
- Check browser console for errors
- Verify API route is accessible

## What's Next?

1. Customize email templates in `/lib/email.ts`
2. Add more alert types
3. Implement SMS notifications
4. Add push notifications
5. Create analytics dashboard

## Need Help?

Check these files for reference:
- `ALERTS_GUIDE.md` - Complete documentation
- `ALERTS_IMPLEMENTATION.md` - Technical details
- `/lib/alert-service.ts` - Alert logic
- `/lib/email.ts` - Email templates

## Demo Flow

**For a complete demo:**

1. Register a user account
2. Save a search for "San Francisco, CA"
3. Add a new property in San Francisco
4. Run alert check manually
5. Check your email and /alerts page
6. Update property price
7. Run alert check again
8. See price drop notification

That's it! You're now ready to use the smart alerts system. 🎉
