'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ImageIcon,
  Music,
  Mic,
  Film,
  Zap,
  Wand2,
  Video,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { DashboardLayout } from '@/components/shared/dashboard-layout';
import { useAuth } from '@/contexts/auth-context';
import { useApi } from '@/hooks/use-api';
import { API_STORIES, API_PROJECTS } from '@/lib/constants/api';
import { Story, ProjectItem } from '@/lib/types';

const QUICK_ACTIONS = [
  { label: 'AI Studio',      description: 'Generate images & videos', href: '/ai-studio',       icon: ImageIcon, color: 'from-violet-500/20' },
  { label: 'AI Music',       description: 'Create tracks with Suno',  href: '/ai-music',        icon: Music,     color: 'from-blue-500/20' },
  { label: 'AI Voice',       description: 'TTS, SFX & voice clone',   href: '/ai-voice',        icon: Mic,       color: 'from-green-500/20' },
  { label: 'Video Editor',   description: 'Edit with timeline',        href: '/editor',          icon: Video,     color: 'from-orange-500/20' },
  { label: 'ASMR Creator',  description: 'Generate ASMR videos',     href: '/stories/asmr',    icon: Sparkles,  color: 'from-pink-500/20' },
  { label: 'AI Upscaler',    description: 'Enhance video quality',    href: '/tools/upscaler',  icon: Wand2,     color: 'from-yellow-500/20' },
];

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const { apiFetch } = useApi();

  const [recentStories, setRecentStories] = useState<Story[]>([]);
  const [recentProjects, setRecentProjects] = useState<ProjectItem[]>([]);

  useEffect(() => {
    Promise.all([
      apiFetch<Story[]>(API_STORIES.LIST).catch(() => []),
      apiFetch<{ items: ProjectItem[] }>(API_PROJECTS.LIST).catch(() => ({ items: [] })),
    ]).then(([stories, projects]) => {
      setRecentStories((stories as Story[]).slice(0, 4));
      setRecentProjects(((projects as any).items ?? []).slice(0, 4));
    });
  }, [apiFetch]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {user?.name?.split(' ')[0] ?? 'Creator'}
          </h1>
          <p className="text-zinc-400 mt-1">What are you creating today?</p>
        </div>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group relative p-5 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all"
              >
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${action.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative">
                  <action.icon className="w-5 h-5 mb-3 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                  <p className="font-semibold text-sm mb-0.5">{action.label}</p>
                  <p className="text-xs text-zinc-500">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Stories */}
        {recentStories.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Recent Stories
              </h2>
              <Link href="/stories" className="text-xs text-zinc-500 hover:text-white flex items-center gap-1 transition-colors">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentStories.map((story) => (
                <Link
                  key={story.id}
                  href={`/stories/${story.id}`}
                  className="group rounded-xl border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-colors"
                >
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
                    <div className="absolute bottom-2 left-2 right-2">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium capitalize
                        ${story.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          story.status === 'generating' ? 'bg-blue-500/20 text-blue-400' :
                          story.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                          'bg-zinc-700 text-zinc-400'}`}>
                        {story.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-medium truncate">{story.title}</p>
                    <p className="text-[10px] text-zinc-500 capitalize">{story.source}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recent Generations */}
        {recentProjects.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Recent Generations
              </h2>
              <Link href="/projects" className="text-xs text-zinc-500 hover:text-white flex items-center gap-1 transition-colors">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentProjects.map((item) => (
                <div key={item.id} className="rounded-xl border border-zinc-800 overflow-hidden">
                  <div className="aspect-square bg-zinc-900 relative">
                    {item.thumbnailUrl ? (
                      <img src={item.thumbnailUrl} alt={item.prompt} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-zinc-700" />
                      </div>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="text-[10px] text-zinc-500 truncate">{item.prompt}</p>
                    <p className="text-[10px] text-zinc-600">{item.model}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {recentStories.length === 0 && recentProjects.length === 0 && (
          <section className="text-center py-16 border border-dashed border-zinc-800 rounded-2xl">
            <Zap className="w-10 h-10 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Start creating</h3>
            <p className="text-zinc-500 text-sm mb-6">
              Choose a tool above to generate your first AI creation.
            </p>
            <Link
              href="/ai-studio"
              className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Open AI Studio
            </Link>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}
