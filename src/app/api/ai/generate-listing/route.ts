import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { message: 'Product listing AI text generation feature has been removed as per application requirements.' },
    { status: 410 }
  );
}
