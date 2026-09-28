import { NextRequest, NextResponse } from 'next/server';
import { verifyIdentityCardAI } from '@/lib/groq/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64OrUrl, userFullName, userCollegeName } = body;

    if (!imageBase64OrUrl) {
      return NextResponse.json(
        { error: 'Identity card image is required for Groq AI verification.' },
        { status: 400 }
      );
    }

    const result = await verifyIdentityCardAI({
      imageBase64OrUrl,
      userFullName,
      userCollegeName,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API /api/ai/verify-id error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process identity card with Groq AI' },
      { status: 500 }
    );
  }
}
