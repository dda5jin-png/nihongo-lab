import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import path from 'path';

// 서비스 계정 키 파일 경로 (프로젝트 루트에 위치)
const KEY_PATH = path.join(process.cwd(), 'google-key.json');

// 클라이언트 설정
const client = new TextToSpeechClient({
  keyFilename: KEY_PATH,
});

export async function synthesizeSpeech(text: string) {
  try {
    const request = {
      input: { text },
      // 시니어 사용자를 위한 명확하고 자연스러운 일본어 여성 음성 (ja-JP-Neural2-A)
      voice: { 
        languageCode: 'ja-JP', 
        name: 'ja-JP-Wavenet-A',
        ssmlGender: 'FEMALE' as const 
      },
      audioConfig: { 
        audioEncoding: 'MP3' as const,
        pitch: 0, // 기본 피치
        speakingRate: 0.9, // 시니어를 위해 살짝 천천히 재생 (0.9 ~ 1.0 추천)
      },
    };

    // 음성 합성 요청
    const [response] = await client.synthesizeSpeech(request);
    
    // Uint8Array 또는 Buffer 형태로 반환
    return response.audioContent;
  } catch (error) {
    console.error('Google TTS Error:', error);
    throw new Error('음성 합성에 실패했습니다.');
  }
}
