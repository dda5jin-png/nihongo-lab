import { NextRequest, NextResponse } from 'next/server';
import { synthesizeSpeech } from '@/lib/google-tts';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text');

  if (!text) {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 });
  }

  try {
    const audioContent = await synthesizeSpeech(text);

    if (!audioContent) {
      return NextResponse.json({ error: 'Failed to generate audio' }, { status: 500 });
    }

    // MP3 바이너리 데이터를 Uint8Array로 변환하여 반환
    return new NextResponse(new Uint8Array(audioContent as Buffer), {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': (audioContent as Buffer).length.toString(),
      },
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
