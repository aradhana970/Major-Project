import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { message: 'Product image vision scan feature has been removed as per application requirements.' },
    { status: 410 }
  );
}
