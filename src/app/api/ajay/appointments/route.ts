'use server';

import { NextResponse } from 'next/server';

const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, '');

const getBackendBaseUrl = () => {
  const directUrl =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.BACKEND_URL;

  return directUrl ? normalizeBaseUrl(directUrl) : null;
};

export async function POST(request: Request) {
  const backendBaseUrl = getBackendBaseUrl();

  if (!backendBaseUrl) {
    return NextResponse.json(
      { error: 'Backend booking service is not configured.' },
      { status: 500 }
    );
  }

  try {
    const payload = await request.json();
    const response = await fetch(`${backendBaseUrl}/api/ajay/appointments/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data?.error ||
            data?.message ||
            `Booking request failed with status ${response.status}`,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data ?? { success: true });
  } catch (error) {
    console.error('Booking proxy error:', error);
    return NextResponse.json(
      { error: 'Unable to reach booking service. Please try again later.' },
      { status: 502 }
    );
  }
}

