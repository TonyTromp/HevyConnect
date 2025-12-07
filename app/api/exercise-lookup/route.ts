import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the exercise lookup table from public folder
    const filePath = path.join(process.cwd(), 'public', 'exercise-lookup-table.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    return NextResponse.json(data, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error reading exercise lookup table:', error);
    return NextResponse.json(
      { error: 'Failed to load exercise lookup table' },
      { status: 500 }
    );
  }
}

