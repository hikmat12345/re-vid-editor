// app/api/transcribe/route.ts
import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import fs from 'fs';
import { transcribe, convertToCaptions } from '@remotion/install-whisper-cpp';
import path from 'path';

const WHISPER_DIR = path.join(process.cwd(), 'whisper', 'Release');
const MODEL = 'base.en';
const VERSION = '1.5.5';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const audioFile = formData.get('audio') as File;

        if (!audioFile) {
            return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
        }

        // Save uploaded file temporarily
        const uploadsDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

        const filePath = path.join(uploadsDir, `transcribe-${Date.now()}-${audioFile.name}`);
        const buffer = await audioFile.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(buffer));

        // Transcribe audio
        const text = await transcribeAudio(filePath);

        // Clean up temporary file
        fs.unlinkSync(filePath);
        const fps = 30; // or your video framerate

        return NextResponse.json({
            success: true,
            audioToText: text
                .map((i: any) => i.text)
        });

    } catch (error: any) {
        console.error('Transcription error:', error);
        return NextResponse.json({ error: error.message || 'Transcription failed' }, { status: 500 });
    }
}

export async function GET() {
    const isReady = isWhisperReady();
    return NextResponse.json({
        ready: isReady,
        message: isReady ? 'Whisper.cpp is ready' : 'Whisper.cpp is not ready',
    });
}

async function transcribeAudio(filePath: string): Promise<any[]> {
    const wavPath = await convertAudioToWav(filePath);

    const { transcription } = await transcribe({
        model: MODEL,
        whisperPath: WHISPER_DIR,
        modelFolder: WHISPER_DIR,
        whisperCppVersion: VERSION,
        inputPath: wavPath,
        tokenLevelTimestamps: true,
        printOutput: true,
        onProgress: (progress: number) => console.log(`Transcription progress: ${Math.round(progress * 100)}%`)
    });

    const { captions } = convertToCaptions({ transcription, combineTokensWithinMilliseconds: 200 });

    if (wavPath !== filePath) fs.unlinkSync(wavPath);

    return captions;
}

async function convertAudioToWav(inputPath: string): Promise<string> {
    if (inputPath.toLowerCase().endsWith('.wav')) return inputPath;

    const outputPath = inputPath.replace(/\.[^/.]+$/, '_converted.wav');

    try {
        execSync('ffmpeg -version', { stdio: 'pipe' });
        execSync(`ffmpeg -i "${inputPath}" -ar 16000 -ac 1 -c:a pcm_s16le "${outputPath}" -y -hide_banner -loglevel error`);
        return outputPath;
    } catch {
        throw new Error('FFmpeg is not installed or not in PATH. Please install FFmpeg.');
    }
}

function getWhisperExecutablePath(): string {
    if (process.platform === 'win32') return path.join(WHISPER_DIR, 'whisper-cli.exe');
    return path.join(WHISPER_DIR, 'whisper');
}

function isWhisperReady(): boolean {
    const modelPath = path.join(WHISPER_DIR, `ggml-${MODEL}.bin`);
    const executablePath = getWhisperExecutablePath();
    return fs.existsSync(modelPath) && fs.existsSync(executablePath);
}

