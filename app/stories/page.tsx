'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Film, Plus, Loader2, Trash2 } from 'lucide-react';
import { DashboardLayout } from '@/components/shared/dashboard-layout';
import { useApi } from '@/hooks/use-api';
import { API_STORIES } from '@/lib/constants/api';
import { Story } from '@/lib/types';

const SOURCE_LABELS: Record<string, string> = {
  'asmr': 'ASMR',
  'remix': 'Remix',
  'talking-things': 'Talking Things',
  'dancing-animals': 'Dancing Animals',
  'long-form': 'Long Form',
};

const STATUS_STYLES: Record<string, string> = {
  completed:  'bg-green-500/15 text-green-400',
  generating: 'bg-blue-500/15 text-blue-400',
  failed:     'bg-red-500/15 text-red-400',
  draft:      'bg-zinc-700/50 text-zinc-400',
};

const CREATE_OPTIONS = [
  { label: 'ASMR Creator',    href: '/stories/asmr',    desc: 'Generate satisfying ASMR videos' },
  { label: 'Remix',           href: '/stories/remix',   desc: 'Remix videos with new visuals' },
];

export default function StoriesPage() {
  const { apiFetch } = useApi();
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    try {
      const data = await apiFetch<Story[]>(API_STORIES.LIST);
      setStories(data);
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const deleteStory = async (id: string) => {
    if (!confirm('Delete this story?')) return;
    try {
      await apiFetch(API_STORIES.DELETE(id), { method: 'DELETE' });
      setStories((prev) => prev.filter((s) => s.id !== id));
    } catch {
      //
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Stories</h1>
            <p className="text-zinc-400 text-sm mt-1">
              AI-generated video stories from your prompts
            </p>
          </div>
        </div>

        {/* Create shortcuts */}
        <div className="grid grid-cols-2 gap-4">
          {CREATE_OPTIONS.map((o) => (
            <Link
              key={o.href}
              href={o.href}
              className="flex items-center gap-4 p-4 border border-dashed border-zinc-700 rounded-xl hover:border-zinc-500 hover:bg-zinc-900/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-zinc-700">
                <Plus className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <p className="font-medium text-sm">{o.label}</p>
                <p className="text-xs text-zinc-500">{o.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Story grid */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
            <Film className="w-10 h-10 text-zinc-700 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No stories yet</h3>
            <p className="text-zinc-500 text-sm mb-6">Create your first story above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {stories.map((story) => (
              <div
                key={story.id}
                className="group border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-colors"
              >
                {/* Thumbnail */}
                <div className="aspect-[9/16] bg-zinc-900 relative overflow-hidden">
                  {story.thumbnailUrl ? (
                    <img
                      src={story.thumbnailUrl}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Film className="w-8 h-8 text-zinc-700" />
                    </div>
                  )}

                  {/* Status */}
                  <div className="absolute top-2 left-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium capitalize ${STATUS_STYLES[story.status] ?? STATUS_STYLES.draft}`}>
                      {story.status}
                    </span>
                  </div>

                  {/* Progress */}
                  {story.status === 'generating' && (
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-zinc-800">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${(story.completedShots / Math.max(story.shotCount, 1)) * 100}%` }}
                      />
                    </div>
                  )}

                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {story.videoUrl && (
                      <a
                        href={story.videoUrl}
                        download
                        className="px-3 py-1.5 bg-white text-black text-xs font-medium rounded-lg"
                      >
                        Download
                      </a>
                    )}
                    <button
                      onClick={() => deleteStory(story.id)}
                      className="p-1.5 bg-red-900/80 rounded-lg hover:bg-red-800"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-300" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-sm font-medium truncate">{story.title}</p>
                  <p className="text-[10px] text-zinc-500">
                    {SOURCE_LABELS[story.source] ?? story.source} · {story.completedShots}/{story.shotCount} shots
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
