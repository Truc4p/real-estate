import { NextRequest, NextResponse } from 'next/server';
import { runAlertChecks, sendDigests } from '@/lib/alert-service';

// POST /api/alerts/check - Manually trigger alert checks (for cron jobs)
export async function POST(request: NextRequest) {
  try {
    // Verify the request is from a trusted source (e.g., cron secret)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type = 'all' } = body;

    switch (type) {
      case 'all':
        await runAlertChecks();
        break;
      case 'daily':
        await sendDigests('DAILY');
        break;
      case 'weekly':
        await sendDigests('WEEKLY');
        break;
      default:
        return NextResponse.json({ error: 'Invalid check type' }, { status: 400 });
    }

    return NextResponse.json({ 
      message: 'Alert checks completed successfully',
      type,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error running alert checks:', error);
    return NextResponse.json(
      { error: 'Failed to run alert checks' },
      { status: 500 }
    );
  }
}

// GET /api/alerts/check - Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Alert check endpoint is ready',
  });
}
