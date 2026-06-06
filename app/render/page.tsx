'use client';

import { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/shared/dashboard-layout';
import { useApi } from '@/hooks/use-api';
import { API_RENDER } from '@/lib/constants/api';
import { RenderJob, RenderJobStatus } from '@/lib/types';
import {
  PlaySquare,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Download,
  RefreshCw,
  Ban,
  Film,
} from 'lucide-react';

const STATUS_CONFIG: Record<
  RenderJobStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  queued:    { label: 'Queued',     color: 'text-yellow-400',  icon: Clock },
  rendering: { label: 'Rendering',  color: 'text-blue-400',    icon: Loader2 },
  done:      { label: 'Done',       color: 'text-green-400',   icon: CheckCircle },
  failed:    { label: 'Failed',     color: 'text-red-400',     icon: XCircle },
  cancelled: { label: 'Cancelled',  color: 'text-zinc-500',    icon: Ban },
};

function RenderJobCard({ job, onCancel }: { job: RenderJob; onCancel: (id: string) => void }) {
  const cfg = STATUS_CONFIG[job.status];
  const Icon = cfg.icon;
  const isActive = job.status === 'queued' || job.status === 'rendering';

  return (
    <div className="border border-zinc-800 rounded-xl p-5 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors">
      <div className="flex items-start gap-4">
        {/* Thumbnail / placeholder */}
        <div className="w-20 h-14 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
          {job.thumbnailUrl ? (
            <img src={job.thumbnailUrl} alt="thumbnail" className="w-full h-full object-cover" />
          ) : (
            <Film className="w-6 h-6 text-zinc-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium truncate">{job.templateId}</span>
            <span className={`flex items-center gap-1 text-xs ${cfg.color}`}>
              <Icon className={`w-3 h-3 ${job.status === 'rendering' ? 'animate-spin' : ''}`} />
              {cfg.label}
            </span>
          </div>

          {/* Progress bar (rendering only) */}
          {job.status === 'rendering' && (
            <div className="h-1 bg-zinc-800 rounded-full mb-2 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${job.progress}%` }}
              />
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span>{job.creditsCharged} cr charged</span>
            {job.estimatedDurationS && <span>~{job.estimatedDurationS}s</span>}
            <span>{new Date(job.createdAt).toLocaleString()}</span>
          </div>

          {job.errorMessage && (
            <p className="text-xs text-red-400 mt-1 truncate">{job.errorMessage}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {job.status === 'done' && job.outputUrl && (
            <a
              href={job.outputUrl}
              download
              className="p-2 rounded-lg border border-zinc-700 hover:border-zinc-500 transition-colors"
            >
              <Download className="w-4 h-4" />
            </a>
          )}
          {isActive && (
            <button
              onClick={() => onCancel(job.id)}
              className="p-2 rounded-lg border border-zinc-800 hover:border-red-800 hover:text-red-400 transition-colors"
              title="Cancel job"
            >
              <Ban className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RenderPage() {
  const { apiFetch } = useApi();
  const [jobs, setJobs] = useState<RenderJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<RenderJobStatus | 'all'>('all');

  const loadJobs = useCallback(async () => {
    try {
      const data = await apiFetch<RenderJob[]>(API_RENDER.LIST);
      setJobs(data ?? []);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    loadJobs();
    // Poll for active jobs every 5s
    const interval = setInterval(() => {
      setJobs((prev) =>
        prev.some((j) => j.status === 'queued' || j.status === 'rendering')
          ? prev // trigger a fresh fetch
          : prev,
      );
      loadJobs();
    }, 5000);
    return () => clearInterval(interval);
  }, [loadJobs]);

  const handleCancel = async (id: string) => {
    try {
      await apiFetch(API_RENDER.CANCEL(id), { method: 'DELETE' });
      setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: 'cancelled' } : j)));
    } catch (err: any) {
      alert(err.message ?? 'Failed to cancel job');
    }
  };

  const filtered = filter === 'all' ? jobs : jobs.filter((j) => j.status === filter);

  const counts = jobs.reduce<Record<string, number>>((acc, j) => {
    acc[j.status] = (acc[j.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PlaySquare className="w-5 h-5 text-zinc-400" />
              <h1 className="text-xl font-bold">Render Jobs</h1>
            </div>
            <p className="text-zinc-400 text-sm">
              Track all your video render jobs in real-time.
            </p>
          </div>
          <button
            onClick={loadJobs}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-zinc-700 rounded-lg hover:border-zinc-500 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['all', 'queued', 'rendering', 'done', 'failed', 'cancelled'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === s
                  ? 'bg-white text-black'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {s === 'all' ? `All (${jobs.length})` : `${s.charAt(0).toUpperCase() + s.slice(1)} (${counts[s] ?? 0})`}
            </button>
          ))}
        </div>

        {/* Jobs list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-zinc-800 rounded-2xl">
            <PlaySquare className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">
              {filter === 'all' ? 'No render jobs yet.' : `No ${filter} jobs.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((job) => (
              <RenderJobCard key={job.id} job={job} onCancel={handleCancel} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
