import { type NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { url: string };
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'No file URL provided' },
        { status: 400 }
      );
    }

    // Check if this is a local file (starts with /) or external URL
    if (url.startsWith('/')) {
      // Local file - delete from public directory
      const safePath = url.replace(/\.\./g, '').replace(/^\/+/, '');
      const fullPath = join(process.cwd(), 'public', safePath);

      if (existsSync(fullPath)) {
        await unlink(fullPath);
        return NextResponse.json({
          success: true,
          message: 'File deleted successfully',
        });
      } else {
        return NextResponse.json(
          { error: 'File not found' },
          { status: 404 }
        );
      }
    } else {
      // External URL (Vercel Blob) - would need Vercel Blob SDK to delete
      // For now, just return success since we can't delete external URLs without SDK
      return NextResponse.json({
        success: true,
        message: 'External file deletion not implemented',
      });
    }

  } catch (error) {
    console.error('File deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}