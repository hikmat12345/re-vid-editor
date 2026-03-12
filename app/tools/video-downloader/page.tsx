'use client';

import { useState } from 'react';
import { Download, Loader2, Link2, Info } from 'lucide-react';
import { DashboardLayout } from '@/components/shared/dashboard-layout';
import { useApi } from '@/hooks/use-api';
import { API_TOOLS } from '@/lib/constants/api';

interface VideoPreview {
  title: string;
  thumbnail: string;
  duration?: number;
  formats: Array<{ quality: string; filesize?: number }>;
}

const SUPPORTED = ['YouTube', 'Instagram', 'TikTok', 'Twitter/X', 'Vimeo', 'Facebook'];

export default function VideoDownloaderPage() {
  const { apiFetch } = useApi();
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState<'1080p' | '720p' | '480p' | '360p'>('720p');
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [preview, setPreview] = useState<VideoPreview | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPreview = async () => {
    if (!url.trim() || isLoadingPreview) return;
    setError(null);
    setPreview(null);
    setIsLoadingPreview(true);

    try {
      const data = await apiFetch<VideoPreview>(API_TOOLS.DOWNLOADER_PREVIEW, {
        method: 'POST',
        body: JSON.stringify({ url }),
      });
      setPreview(data);
    } catch (err: any) {
      setError(err.message ?? 'Could not load video info');
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const download = async () => {
    if (!url.trim() || isDownloading) return;
    setIsDownloading(true);
    setError(null);

    try {
      const data = await apiFetch<{ downloadUrl: string; filename: string }>(
        API_TOOLS.DOWNLOADER_DOWNLOAD,
        { method: 'POST', body: JSON.stringify({ url, quality }) },
      );

      // Trigger browser download
      const a = document.createElement('a');
      a.href = data.downloadUrl;
      a.download = data.filename;
      a.click();
    } catch (err: any) {
      setError(err.message ?? 'Download failed');
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDuration = (secs?: number) => {
    if (!secs) return '';
    return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Download className="w-6 h-6" /> Video Downloader
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Download videos from popular platforms
          </p>
        </div>

        {/* Supported platforms */}
        <div className="flex flex-wrap gap-2">
          {SUPPORTED.map((p) => (
            <span key={p} className="text-xs px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400">
              {p}
            </span>
          ))}
        </div>

        {/* Input */}
        <div className="border border-zinc-800 rounded-2xl p-6 space-y-5 bg-zinc-900/30">
          <div>
            <label className="text-xs text-zinc-400 mb-1.5 block">Video URL</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link2 className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); setPreview(null); }}
                  onKeyDown={(e) => e.key === 'Enter' && fetchPreview()}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600"
                />
              </div>
              <button
                onClick={fetchPreview}
                disabled={!url.trim() || isLoadingPreview}
                className="px-4 py-2 bg-zinc-800 text-zinc-200 text-sm rounded-lg hover:bg-zinc-700 disabled:opacity-50 transition-colors shrink-0"
              >
                {isLoadingPreview ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load'}
              </button>
            </div>
          </div>

          {/* Preview */}
          {preview && (
            <div className="flex gap-4 p-3 bg-zinc-900 rounded-xl border border-zinc-800">
              {preview.thumbnail && (
                <img src={preview.thumbnail} alt={preview.title} className="w-24 h-16 object-cover rounded-lg shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{preview.title}</p>
                {preview.duration && (
                  <p className="text-xs text-zinc-500">{formatDuration(preview.duration)}</p>
                )}
              </div>
            </div>
          )}

          {/* Quality */}
          {preview && (
            <div>
              <label className="text-xs text-zinc-400 mb-2 block">Quality</label>
              <div className="flex gap-2 flex-wrap">
                {preview.formats.map((f) => (
                  <button
                    key={f.quality}
                    onClick={() => setQuality(f.quality as any)}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                      quality === f.quality
                        ? 'border-white bg-white text-black font-medium'
                        : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                    }`}
                  >
                    {f.quality}
                    {f.filesize && <span className="ml-1 opacity-60">{Math.round(f.filesize / 1024 / 1024)}MB</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={download}
            disabled={!url.trim() || isDownloading}
            className="w-full py-2.5 bg-white text-black text-sm font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isDownloading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Downloading…</>
            ) : (
              <><Download className="w-4 h-4" /> Download Video</>
            )}
          </button>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg p-3">
              {error}
            </p>
          )}

          <div className="flex gap-2 text-xs text-zinc-600">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>Only download content you have permission to use. Respect copyright laws.</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
