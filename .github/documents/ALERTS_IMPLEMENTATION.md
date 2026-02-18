# Smart Alerts & Notifications - Implementation Summary

## ✅ Completed Features

### 1. Database Schema ✓
- **SavedSearch Model**: Stores user search criteria with alert preferences
  - Alert frequency options (Instant, Daily, Weekly)
  - Toggles for different notification types
  - Tracks last check timestamp
  
- **Alert Model**: Stores individual notifications
  - Multiple alert types (NEW_MATCH, PRICE_DROP, STATUS_CHANGE, BACK_ON_MARKET)
  - Read/unread status tracking
  - Sent status for email delivery
  - Metadata for detailed information

- **PriceHistory Model**: Tracks property price changes over time
- **StatusHistory Model**: Tracks property status changes

### 2. Email Service ✓
**File**: `/lib/email.ts`

- Support for two email providers:
  - **Nodemailer** (SMTP) - Good for development
  - **Resend** - Recommended for production
  
- Beautiful HTML email templates:
  - New Match Alert
  - Price Drop Alert (with savings calculation)
  - Status Change Alert
  - Daily/Weekly Digest

### 3. API Routes ✓

**Saved Searches**:
- `GET /api/saved-searches` - List all saved searches
- `POST /api/saved-searches` - Create new saved search
- `GET /api/saved-searches/[id]` - Get specific search
- `PATCH /api/saved-searches/[id]` - Update search settings
- `DELETE /api/saved-searches/[id]` - Delete search

**Alerts**:
- `GET /api/alerts` - List alerts with filters
- `GET /api/alerts?unreadOnly=true` - Get unread alerts
- `PATCH /api/alerts/[id]` - Mark as read
- `DELETE /api/alerts/[id]` - Delete alert
- `POST /api/alerts/mark-all-read` - Mark all as read
- `POST /api/alerts/check` - Trigger alert checks (for cron)

### 4. Alert Checking Service ✓
**File**: `/lib/alert-service.ts`

Automated monitoring for:
- **New Matches**: Checks for newly listed properties matching saved searches
- **Price Drops**: Detects price reductions and calculates savings
- **Status Changes**: Monitors property status updates (sold, rented, active)
- **Digest Emails**: Compiles multiple alerts into daily/weekly summaries

### 5. UI Components ✓

**AlertsList Component**: `/components/alerts/AlertsList.tsx`
- View all alerts in organized list
- Filter by read/unread
- Mark individual or all alerts as read
- Delete alerts
- Visual indicators for different alert types

**SavedSearchesList Component**: `/components/alerts/SavedSearchesList.tsx`
- Manage all saved searches
- Edit alert preferences inline
- Enable/disable email notifications
- Configure alert frequency
- Choose notification types
- Delete saved searches

**SaveSearchModal Component**: `/components/alerts/SaveSearchModal.tsx`
- Save current search with custom name
- Configure alert preferences
- Set email notification settings
- Choose alert frequency

**PropertyListWithAlerts Component**: `/components/properties/PropertyListWithAlerts.tsx`
- Displays save search button when filters are active
- Shows success message after saving
- Integrates seamlessly with property listing

### 6. Pages ✓
- `/alerts` - View and manage alerts
- `/saved-searches` - Manage saved searches

### 7. Navigation ✓
Updated navbar with:
- Bell icon for Alerts page
- Save icon for Saved Searches page
- Added to both desktop and mobile navigation

### 8. Property Update Tracking ✓
Enhanced `/api/properties/[id]/route.ts` to:
- Automatically create price history records on price changes
- Automatically create status history records on status changes
- Enables alert system to detect changes

## 📋 Setup Instructions

### 1. Install Dependencies
```bash
npm install nodemailer @types/nodemailer resend
```

### 2. Configure Environment Variables
Add to `.env.local`:

```bash
# Email Provider (choose one)
EMAIL_PROVIDER=nodemailer  # or 'resend'

# For Nodemailer (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM="Real Estate Alerts <noreply@yourdomain.com>"

# For Resend (Alternative)
# RESEND_API_KEY=re_xxxxxxxxxxxx

# Cron Secret
CRON_SECRET=your-random-secret-here

# App URL
NEXTAUTH_URL=http://localhost:3000
```

### 3. Run Database Migration
```bash
npx prisma generate
npx prisma db push
```

### 4. Set Up Cron Jobs

**Option A: Vercel Cron** (create `vercel.json`):
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

**Option B: External Cron Service** (e.g., cron-job.org):
- Set up jobs to POST to `/api/alerts/check` endpoint
- Include `Authorization: Bearer YOUR_CRON_SECRET` header

### 5. Test the System

**Manual trigger** (for testing):
```bash
curl -X POST http://localhost:3000/api/alerts/check \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -d '{"type": "all"}'
```

## 🎯 How It Works

### User Flow

1. **User searches for properties** with specific filters (location, price, etc.)
2. **Clicks "Save Search"** button when satisfied with filters
3. **Configures alert preferences**:
   - Names the search
   - Enables email alerts
   - Chooses frequency (Instant/Daily/Weekly)
   - Selects notification types
4. **Receives notifications** when:
   - New properties match their criteria
   - Prices drop on matching properties
   - Property statuses change

### Backend Flow

1. **Cron job triggers** alert check endpoint periodically
2. **Alert service runs**:
   - Checks for new properties since last check
   - Compares with all saved search filters
   - Detects price changes from history table
   - Detects status changes from history table
3. **Creates alert records** in database
4. **Sends emails** based on user preferences
5. **Updates timestamps** for next check

### Property Updates

1. **Property price updated** via API
   - System creates PriceHistory record
   - Alert service picks it up on next check
   
2. **Property status changed** via API
   - System creates StatusHistory record
   - Alert service detects and notifies users

## 📊 Database Tables

### SavedSearch
- Stores search criteria and preferences
- Links to User via userId
- Has many Alerts

### Alert
- Individual notification records
- Links to SavedSearch and Property
- Tracks sent/read status

### PriceHistory
- Records all price changes
- Indexed for fast queries

### StatusHistory
- Records all status changes
- Indexed for fast queries

## 🔔 Alert Types

1. **NEW_MATCH** 🏡
   - Triggers: New property matches saved search
   - Email: Shows property details and direct link

2. **PRICE_DROP** 💰
   - Triggers: Property price decreases
   - Email: Shows old/new price with savings percentage

3. **STATUS_CHANGE** 📢
   - Triggers: Property status changes
   - Email: Shows old and new status

4. **BACK_ON_MARKET** 🔄
   - Triggers: Previously sold/rented property becomes active
   - Email: Highlights the opportunity

## 📧 Email Configuration

### Gmail Setup (Development)
1. Enable 2-factor authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use app password in SMTP_PASSWORD

### Resend Setup (Production)
1. Sign up at https://resend.com
2. Verify your sending domain
3. Get API key from dashboard
4. Add to RESEND_API_KEY

## 🚀 Deployment Checklist

- [ ] Set all environment variables
- [ ] Configure email provider (Gmail or Resend)
- [ ] Run database migrations
- [ ] Set up cron jobs
- [ ] Test email delivery
- [ ] Test alert creation
- [ ] Monitor first few alert cycles

## 📁 Files Created

### Core Files
- `/lib/email.ts` - Email service and templates
- `/lib/alert-service.ts` - Alert checking logic

### API Routes
- `/app/api/saved-searches/route.ts`
- `/app/api/saved-searches/[id]/route.ts`
- `/app/api/alerts/route.ts`
- `/app/api/alerts/[id]/route.ts`
- `/app/api/alerts/mark-all-read/route.ts`
- `/app/api/alerts/check/route.ts`

### Components
- `/components/alerts/AlertsList.tsx`
- `/components/alerts/SavedSearchesList.tsx`
- `/components/alerts/SaveSearchModal.tsx`
- `/components/properties/PropertyListWithAlerts.tsx`

### Pages
- `/app/alerts/page.tsx`
- `/app/saved-searches/page.tsx`

### Documentation
- `/ALERTS_GUIDE.md` - Comprehensive guide
- `.env.example` - Updated with new variables

## 🎨 UI Features

- Clean, modern design with Tailwind CSS
- Responsive mobile layout
- Color-coded alert types
- Visual indicators for unread alerts
- Smooth animations and transitions
- Loading states
- Error handling
- Success messages

## 🔒 Security

- Authentication required for all alert operations
- User can only access their own searches and alerts
- Cron endpoint protected with secret key
- Email rate limiting recommended
- Input validation on all endpoints

## 📈 Performance

- Database indexes on frequently queried fields
- Batch email sending
- Efficient filter matching
- Pagination support for large alert lists
- Lazy loading of properties

## 🐛 Troubleshooting

**Emails not sending?**
- Check email provider credentials
- Verify environment variables
- Test SMTP connection
- Check API logs

**Alerts not created?**
- Verify cron jobs are running
- Check lastChecked timestamp
- Ensure properties are ACTIVE status
- Verify filter matching logic

**Performance issues?**
- Add more database indexes
- Implement email queuing
- Reduce alert check frequency
- Archive old alerts

## 🎉 Success!

You now have a fully functional smart alerts and notifications system with:
- ✅ Email alerts for new matches
- ✅ Price drop notifications  
- ✅ Status change alerts
- ✅ Saved searches with custom alerts
- ✅ Beautiful email templates
- ✅ User-friendly management interface
- ✅ Automated background processing

The system is production-ready and scalable!
