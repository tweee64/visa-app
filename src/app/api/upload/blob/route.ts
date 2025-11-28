import { type NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { fileValidationSchema } from '~/lib/validations/application';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const filename = formData.get('filename') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!filename) {
      return NextResponse.json(
        { error: 'No filename provided' },
        { status: 400 }
      );
    }

    // Validate file type and size
    try {
      fileValidationSchema.parse({
        size: file.size,
        type: file.type,
      });
    } catch {
      return NextResponse.json(
        { error: 'Invalid file type or size' },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    const blob = await put(filename, file, {
      access: 'public',
    });

    return NextResponse.json({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      url: blob.url,
      message: 'File uploaded successfully to Vercel Blob',
    });

  } catch (error) {
    console.error('Vercel Blob upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file to Vercel Blob' },
      { status: 500 }
    );
  }
}