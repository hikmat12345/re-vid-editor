'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/shared/dashboard-layout';
import { useApi } from '@/hooks/use-api';
import { API_BRAND_KIT } from '@/lib/constants/api';
import { BrandKit, WatermarkPosition } from '@/lib/types';
import { Palette, Loader2, Save, CheckCircle } from 'lucide-react';

const FONTS = ['Inter', 'Roboto', 'Montserrat', 'Oswald', 'Poppins', 'Playfair Display', 'Impact'];
const WATERMARK_POSITIONS: { value: WatermarkPosition; label: string }[] = [
  { value: 'top-left', label: 'Top Left' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'center', label: 'Center' },
];

function ColorSwatch({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer border border-zinc-700 bg-transparent p-0.5"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={7}
          className="w-28 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-zinc-600"
        />
      </div>
    </div>
  );
}

export default function BrandKitPage() {
  const { apiFetch } = useApi();
  const [kit, setKit] = useState<Partial<BrandKit>>({
    primaryColor: '#ffffff',
    secondaryColor: '#000000',
    accentColor: '#6366f1',
    fontFamily: 'Inter',
    watermarkPosition: 'bottom-right',
    watermarkOpacity: 0.6,
    autoApply: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiFetch<BrandKit>(API_BRAND_KIT.GET)
      .then((data) => setKit(data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    try {
      const updated = await apiFetch<BrandKit>(API_BRAND_KIT.UPSERT, {
        method: 'PUT',
        body: JSON.stringify(kit),
      });
      setKit(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      alert(err.message ?? 'Failed to save brand kit');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Palette className="w-5 h-5 text-zinc-400" />
              <h1 className="text-xl font-bold">Brand Kit</h1>
            </div>
            <p className="text-zinc-400 text-sm">
              Your brand identity — applied automatically to every render.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-zinc-200 disabled:opacity-50 transition-colors"
          >
            {saved ? (
              <><CheckCircle className="w-4 h-4" /> Saved</>
            ) : isSaving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-4 h-4" /> Save Brand Kit</>
            )}
          </button>
        </div>

        <div className="space-y-8">
          {/* Logo */}
          <div className="border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Logo</h3>
            <div className="space-y-3">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Logo URL (S3 or CDN)</label>
              <input
                type="url"
                value={kit.logoUrl ?? ''}
                onChange={(e) => setKit({ ...kit, logoUrl: e.target.value || null })}
                placeholder="https://cdn.example.com/logo.png"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600"
              />
              {kit.logoUrl && (
                <div className="w-20 h-20 rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900 flex items-center justify-center">
                  <img src={kit.logoUrl} alt="logo preview" className="max-w-full max-h-full object-contain" />
                </div>
              )}
            </div>
          </div>

          {/* Colors */}
          <div className="border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Brand Colors</h3>
            <div className="grid grid-cols-3 gap-6">
              <ColorSwatch
                label="Primary"
                value={kit.primaryColor ?? '#ffffff'}
                onChange={(v) => setKit({ ...kit, primaryColor: v })}
              />
              <ColorSwatch
                label="Secondary"
                value={kit.secondaryColor ?? '#000000'}
                onChange={(v) => setKit({ ...kit, secondaryColor: v })}
              />
              <ColorSwatch
                label="Accent"
                value={kit.accentColor ?? '#6366f1'}
                onChange={(v) => setKit({ ...kit, accentColor: v })}
              />
            </div>
          </div>

          {/* Typography */}
          <div className="border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Typography</h3>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Font Family</label>
              <select
                value={kit.fontFamily ?? 'Inter'}
                onChange={(e) => setKit({ ...kit, fontFamily: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600 appearance-none"
              >
                {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>

          {/* Intro / Outro */}
          <div className="border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Intro & Outro Clips</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Intro URL</label>
                <input
                  type="url"
                  value={kit.introUrl ?? ''}
                  onChange={(e) => setKit({ ...kit, introUrl: e.target.value || null })}
                  placeholder="https://..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Outro URL</label>
                <input
                  type="url"
                  value={kit.outroUrl ?? ''}
                  onChange={(e) => setKit({ ...kit, outroUrl: e.target.value || null })}
                  placeholder="https://..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600"
                />
              </div>
            </div>
          </div>

          {/* Watermark */}
          <div className="border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Watermark</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Watermark URL</label>
                <input
                  type="url"
                  value={kit.watermarkUrl ?? ''}
                  onChange={(e) => setKit({ ...kit, watermarkUrl: e.target.value || null })}
                  placeholder="https://..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Position</label>
                  <select
                    value={kit.watermarkPosition ?? 'bottom-right'}
                    onChange={(e) => setKit({ ...kit, watermarkPosition: e.target.value as WatermarkPosition })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600 appearance-none"
                  >
                    {WATERMARK_POSITIONS.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex justify-between">
                    <span>Opacity</span>
                    <span className="text-zinc-600 normal-case font-normal">{Math.round((kit.watermarkOpacity ?? 0.6) * 100)}%</span>
                  </label>
                  <input
                    type="range"
                    min={0} max={1} step={0.05}
                    value={kit.watermarkOpacity ?? 0.6}
                    onChange={(e) => setKit({ ...kit, watermarkOpacity: parseFloat(e.target.value) })}
                    className="w-full accent-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Auto-apply */}
          <div className="border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Auto-apply to all renders</h3>
                <p className="text-sm text-zinc-400 mt-1">
                  Automatically merge your brand kit into every render job.
                </p>
              </div>
              <button
                onClick={() => setKit({ ...kit, autoApply: !kit.autoApply })}
                className={`relative w-12 h-6 rounded-full transition-colors ${kit.autoApply ? 'bg-white' : 'bg-zinc-700'}`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full transition-transform ${kit.autoApply ? 'translate-x-7 bg-black' : 'translate-x-1 bg-zinc-300'}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
