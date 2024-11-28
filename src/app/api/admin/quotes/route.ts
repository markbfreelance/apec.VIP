import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// Handle GET request
export async function GET() {
  try {
    const [rows] = await db.execute(`
      SELECT 
        id, 
        user_id, 
        name, 
        description, 
        start_date, 
        end_date, 
        status 
      FROM quotes
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Handle POST request
export async function POST(req: NextRequest) {
  try {
    // Parse JSON from the request body
    const { user_id, name, description, start_date, end_date, status } = await req.json();

    // Validate required fields
    if (!user_id || !name) {
      return NextResponse.json(
        { message: 'Validation error: user_id and name are required.' },
        { status: 400 }
      );
    }

    // Insert into the database
    const [result]: any = await db.execute(
      `
      INSERT INTO quotes (user_id, name, description, start_date, end_date, status) 
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        user_id,                   // Required
        name,                      // Required
        description || null,       // Optional
        start_date || null,        // Optional
        end_date || null,          // Optional
        status || 'active',        // Default to 'active' if not provided
      ]
    );

    // Respond with the created quote details
    return NextResponse.json(
      {
        id: result.insertId,       // Return the newly created quote's ID
        user_id,
        name,
        description,
        start_date,
        end_date,
        status: status || 'active',
      },
      { status: 201 } // HTTP Created
    );
  } catch (error) {
    // Log error for debugging purposes
    console.error('Error adding quote:', error);

    // Return an error response
    return NextResponse.json(
      { message: 'An unexpected error occurred while adding the quote.' },
      { status: 500 } // HTTP Internal Server Error
    );
  }
}

// Handle PUT request (update quote)
export async function PUT(req: NextRequest) {
  try {
    const { id, user_id, name, description, start_date, end_date, status } = await req.json();

    if (!id) {
      return NextResponse.json({ message: 'Quote ID is required' }, { status: 400 });
    }

    await db.execute(
      `
      UPDATE quotes
      SET user_id = ?, name = ?, description = ?, start_date = ?, end_date = ?, status = ? 
      WHERE id = ?
      `,
      [user_id, name, description, start_date, end_date, status, id]
    );

    return NextResponse.json({ message: 'Quote Record updated successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Handle DELETE request
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Quote ID is required' }, { status: 400 });
    }

    await db.execute('DELETE FROM quotes WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Quote Record deleted successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
