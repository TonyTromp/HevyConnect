import { NextRequest, NextResponse } from 'next/server';
import { parseHevyCSV } from '@/lib/csvParser';
import { extractLastActivity } from '@/lib/workoutProcessor';
import { convertActivityToFIT } from '@/lib/fitConverter';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const includeSetsParam = formData.get('includeSets');
    const includeSets = includeSetsParam === null || includeSetsParam === 'true';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a CSV file.' },
        { status: 400 }
      );
    }

    // Read file content
    const fileContent = await file.text();

    // Parse CSV
    const rows = parseHevyCSV(fileContent);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'CSV file is empty or invalid' },
        { status: 400 }
      );
    }

    // Extract last activity
    const lastActivity = extractLastActivity(rows);

    if (!lastActivity) {
      return NextResponse.json(
        { error: 'No activity found in CSV file' },
        { status: 400 }
      );
    }

    // Convert to FIT format
    const fitData = await convertActivityToFIT(lastActivity, includeSets);

    // Return FIT file (convert Uint8Array to Buffer for NextResponse)
    return new NextResponse(Buffer.from(fitData), {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${file.name.replace('.csv', '.fit')}"`,
      },
    });
  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'An error occurred during conversion',
      },
      { status: 500 }
    );
  }
}

