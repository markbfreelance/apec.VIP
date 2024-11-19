import db from '@/lib/db'; // Adjust the import based on your folder structure
import { NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2';

// Define the type for the row structure returned by the query
interface ConfigRow extends RowDataPacket {
  master_code: string;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const master_code = url.searchParams.get('master_code');

  if (!master_code) {
    return NextResponse.json(
      { message: 'Invalid request parameters' },
      { status: 400 }
    );
  }

  try {
    // Query the config table for the master_code
    const [configRows]: [ConfigRow[], unknown] = await db.query(
      'SELECT master_code FROM config WHERE id = 1'
    );

    if (configRows.length === 0) {
      return NextResponse.json(
        { message: 'Config not found' },
        { status: 404 }
      );
    }

    const dbMasterCode = configRows[0].master_code;

    // Check if the entered master_code matches
    if (master_code === dbMasterCode) {
      return NextResponse.json(
        { message: 'Master code is valid' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'Invalid master code' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
