import { NextRequest, NextResponse } from 'next/server';
import AnalyticsService from '@/services/AnalyticsService';

export async function GET() {
  try {
    const metrics = await AnalyticsService.getOverviewMetrics();
    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
