'use client';

import { useState } from 'react';
import { Wand2, Loader2, Download, Upload } from 'lucide-react';
import { DashboardLayout } from '@/components/shared/dashboard-layout';
import { useApi, pollStatus } from '@/hooks/use-api';
import { API_TOOLS } from '@/lib/constants/api';

export default function UpscalerPage() {
  const { apiFetch } = useApi();
  const [mediaUrl, setMediaUrl] = useState('');
  const [scale, setScale] = useState<'2x' | '4x'>('2x');
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const upscale = async () => {
    if (!mediaUrl.trim() || isProcessing) return;
    setError(null);
    setOutputUrl(null);
    setIsProcessing(true);

    try {
      const { taskId } = await apiFetch<{ taskId: string }>(API_TOOLS.UPSCALE, {
        method: 'POST',
        body: JSON.stringify({ mediaUrl, scale }),
      });

      const result = await pollStatus(
        () => apiFetch<{ status: string; outputUrl?: string }>(`${API_TOOLS.UPSCALE_STATUS}?taskId=${taskId}`),
        { interval: 4000, maxAttempts: 90 },
      );

      if (result.status === 'completed' && result.outputUrl) {
        setOutputUrl(result.outputUrl);
      } else {
        setError('Upscaling failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wand2 className="w-6 h-6" /> AI Upscaler
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Enhance video and image quality by 2x or 4x using AI
          </p>
        </div>

        <div className="border border-zinc-800 rounded-2xl p-6 space-y-5 bg-zinc-900/30">
          <div>
            <label className="text-xs text-zinc-400 mb-1.5 block">Media URL (image or video)</label>
            <input
              type="url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400 mb-2 block">Upscale factor</label>
            <div className="flex gap-3">
              {(['2x', '4x'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setScale(s)}
                  className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    scale === s
                      ? 'border-white bg-white text-black'
                      : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                  }`}
                >
                  {s}
                  <span className="text-[10px] ml-1 opacity-60">
                    {s === '2x' ? '~30 cr' : '~60 cr'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={upscale}
            disabled={!mediaUrl.trim() || isProcessing}
            className="w-full py-2.5 bg-white text-black text-sm font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Upscaling…</>
            ) : (
              <><Wand2 className="w-4 h-4" /> Upscale</>
            )}
          </button>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg p-3">
              {error}
            </p>
          )}
        </div>

        {/* Output preview */}
        {outputUrl && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-400">Result</h3>
            <div className="relative rounded-xl overflow-hidden border border-zinc-700">
              <img src={outputUrl} alt="Upscaled" className="w-full" />
              <a
                href={outputUrl}
                download
                className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/70 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-black"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </a>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
