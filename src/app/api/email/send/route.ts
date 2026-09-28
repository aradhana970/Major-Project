import { NextRequest, NextResponse } from 'next/server';
import { sendTransactionalEmail } from '@/lib/resend/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, subject, html } = body;

    if (!to || !subject || !html) {
      return NextResponse.json({ error: 'Missing required parameters: to, subject, html' }, { status: 400 });
    }

    const result = await sendTransactionalEmail({ to, subject, html });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API /api/email/send error:', error);
    return NextResponse.json({ error: error.message || 'Failed to dispatch email' }, { status: 500 });
  }
}
