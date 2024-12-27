import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request, { params }: { params: { collection_id: string } }) {
  const { collection_id } = params;

  const cookieStore = cookies();
  const token = (await cookieStore).get('Token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized, token missing' }, { status: 401 });
  }

  return NextResponse.json({ token, collection_id });
}
