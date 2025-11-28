import { type NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { fileValidationSchema } from '~/lib/validations/application';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const path = formData.get('path') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!path) {
      return NextResponse.json(
        { error: 'No file path provided' },
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

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure the file path is safe and within public directory
    const safePath = path.replace(/\.\./g, '').replace(/^\/+/, '');
    const fullPath = join(process.cwd(), 'public', safePath);
    const directory = join(process.cwd(), 'public', safePath.split('/').slice(0, -1).join('/'));

    // Create directory if it doesn't exist
    if (!existsSync(directory)) {
      await mkdir(directory, { recursive: true });
    }

    // Write file to disk
    await writeFile(fullPath, buffer);

    // Return the public URL
    const publicUrl = safePath.startsWith('/') ? safePath : `/${safePath}`;

    return NextResponse.json({
      url: publicUrl,
      message: 'File uploaded successfully',
    });

  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}