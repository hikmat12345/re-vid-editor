'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/shared/dashboard-layout';
import { useApi } from '@/hooks/use-api';
import { API_FINANCE, API_RENDER } from '@/lib/constants/api';
import {
  FinanceChartType,
  OhlcDataPoint,
  LineDataPoint,
  NumberRevealData,
  MarketSummaryItem,
  RenderJob,
} from '@/lib/types';
import {
  TrendingUp,
  Loader2,
  Zap,
  Plus,
  Trash2,
  CheckCircle,
  Download,
} from 'lucide-react';

const CHART_TYPES: { id: FinanceChartType; label: string; description: string }[] = [
  { id: 'candlestick',    label: 'Candlestick',      description: 'OHLC price action chart' },
  { id: 'line-chart',     label: 'Line Chart',        description: 'Clean price / metric line' },
  { id: 'ohlc',           label: 'OHLC Bar Chart',    description: 'Open-High-Low-Close bars' },
  { id: 'number-reveal',  label: 'Number Reveal',     description: 'Animated counter with label' },
  { id: 'market-summary', label: 'Market Summary',    description: 'Multi-ticker price card' },
];

const THEMES = ['dark', 'light', 'bloomberg'];

export default function FinanceVideoPage() {
  const { apiFetch } = useApi();
  const [chartType, setChartType] = useState<FinanceChartType>('candlestick');
  const [title, setTitle] = useState('');
  const [ticker, setTicker] = useState('');
  const [theme, setTheme] = useState('dark');

  // OHLC / candlestick data
  const [ohlcData, setOhlcData] = useState<OhlcDataPoint[]>([
    { date: Date.now() - 4 * 86400000, open: 150, high: 158, low: 148, close: 155, volume: 1200000 },
    { date: Date.now() - 3 * 86400000, open: 155, high: 162, low: 153, close: 160, volume: 1500000 },
    { date: Date.now() - 2 * 86400000, open: 160, high: 165, low: 155, close: 157, volume: 1100000 },
    { date: Date.now() - 1 * 86400000, open: 157, high: 170, low: 156, close: 168, volume: 1800000 },
    { date: Date.now(),                open: 168, high: 175, low: 165, close: 172, volume: 2000000 },
  ]);

  // Line data
  const [lineData, setLineData] = useState<LineDataPoint[]>([
    { date: Date.now() - 4 * 86400000, value: 100 },
    { date: Date.now() - 3 * 86400000, value: 112 },
    { date: Date.now() - 2 * 86400000, value: 108 },
    { date: Date.now() - 1 * 86400000, value: 125 },
    { date: Date.now(),                value: 140 },
  ]);

  // Number reveal
  const [numberReveal, setNumberReveal] = useState<NumberRevealData>({
    from: 0,
    to: 1000000,
    prefix: '$',
    suffix: '',
    label: 'Revenue',
  });

  // Market summary
  const [marketItems, setMarketItems] = useState<MarketSummaryItem[]>([
    { ticker: 'AAPL', price: 189.5,  change: 2.4,   changePercent: 1.28 },
    { ticker: 'TSLA', price: 248.1,  change: -5.2,  changePercent: -2.05 },
    { ticker: 'NVDA', price: 875.3,  change: 18.7,  changePercent: 2.18 },
    { ticker: 'BTC',  price: 67200,  change: 1500,  changePercent: 2.28 },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [job, setJob] = useState<RenderJob | null>(null);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    setError('');
    setIsSubmitting(true);
    setJob(null);
    try {
      const data = await apiFetch<RenderJob>(API_FINANCE.CREATE, {
        method: 'POST',
        body: JSON.stringify({
          chartType,
          title: title || undefined,
          ticker: ticker || undefined,
          theme,
          ohlcData: ['candlestick', 'ohlc'].includes(chartType) ? ohlcData : undefined,
          lineData: chartType === 'line-chart' ? lineData : undefined,
          numberReveal: chartType === 'number-reveal' ? numberReveal : undefined,
          marketItems: chartType === 'market-summary' ? marketItems : undefined,
        }),
      });
      setJob(data);

      const poll = setInterval(async () => {
        const updated = await apiFetch<RenderJob>(API_RENDER.GET(data.id));
        setJob(updated);
        if (updated.status === 'done' || updated.status === 'failed') {
          clearInterval(poll);
        }
      }, 3000);
    } catch (err: any) {
      setError(err.message ?? 'Failed to create finance video');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-zinc-400" />
          <h1 className="text-xl font-bold">Finance Video Generator</h1>
        </div>
        <p className="text-zinc-400 text-sm mb-8">
          Create animated financial data videos — candlestick charts, price reveals, market summaries and more.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: Config */}
          <div className="md:col-span-2 space-y-6">
            {/* Chart type */}
            <div className="border border-zinc-800 rounded-2xl p-5">
              <h3 className="font-semibold mb-3">Chart Type</h3>
              <div className="grid grid-cols-2 gap-2">
                {CHART_TYPES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setChartType(c.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${chartType === c.id ? 'border-white bg-white/5' : 'border-zinc-800 hover:border-zinc-600'}`}
                  >
                    <p className="text-sm font-medium">{c.label}</p>
                    <p className="text-xs text-zinc-500">{c.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* General settings */}
            <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
              <h3 className="font-semibold">Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="AAPL Stock Update"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Ticker Symbol</label>
                  <input
                    type="text"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                    placeholder="AAPL"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-zinc-600"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Theme</label>
                <div className="flex gap-2">
                  {THEMES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`px-4 py-2 rounded-lg text-sm capitalize border transition-colors ${theme === t ? 'border-white text-white bg-white/5' : 'border-zinc-800 text-zinc-400 hover:text-white'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Data entry: Number Reveal */}
            {chartType === 'number-reveal' && (
              <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
                <h3 className="font-semibold">Number Reveal Data</h3>
                <div className="grid grid-cols-2 gap-4">
                  {(['from', 'to', 'prefix', 'suffix', 'label'] as const).map((field) => (
                    <div key={field} className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{field}</label>
                      <input
                        type={field === 'from' || field === 'to' ? 'number' : 'text'}
                        value={String(numberReveal[field] ?? '')}
                        onChange={(e) => setNumberReveal({ ...numberReveal, [field]: field === 'from' || field === 'to' ? Number(e.target.value) : e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Data entry: Market Summary */}
            {chartType === 'market-summary' && (
              <div className="border border-zinc-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Market Items</h3>
                  <button
                    onClick={() => setMarketItems([...marketItems, { ticker: '', price: 0, change: 0, changePercent: 0 }])}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Row
                  </button>
                </div>
                <div className="space-y-2">
                  {marketItems.map((item, i) => (
                    <div key={i} className="grid grid-cols-5 gap-2 items-center">
                      <input value={item.ticker} onChange={(e) => { const d = [...marketItems]; d[i] = { ...d[i], ticker: e.target.value }; setMarketItems(d); }} placeholder="AAPL" className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none" />
                      <input type="number" value={item.price} onChange={(e) => { const d = [...marketItems]; d[i] = { ...d[i], price: Number(e.target.value) }; setMarketItems(d); }} placeholder="Price" className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none" />
                      <input type="number" value={item.change} onChange={(e) => { const d = [...marketItems]; d[i] = { ...d[i], change: Number(e.target.value) }; setMarketItems(d); }} placeholder="Chg" className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none" />
                      <input type="number" value={item.changePercent} onChange={(e) => { const d = [...marketItems]; d[i] = { ...d[i], changePercent: Number(e.target.value) }; setMarketItems(d); }} placeholder="%" className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none" />
                      <button onClick={() => setMarketItems(marketItems.filter((_, j) => j !== i))} className="p-2 text-zinc-600 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Summary + actions */}
          <div className="space-y-4">
            <div className="border border-zinc-800 rounded-2xl p-5 sticky top-6">
              <h3 className="font-semibold mb-4">Preview & Render</h3>
              <div className="aspect-video bg-zinc-900 rounded-xl mb-4 flex items-center justify-center border border-zinc-800">
                <TrendingUp className="w-10 h-10 text-zinc-700" />
              </div>

              <div className="space-y-2 mb-4 text-xs text-zinc-500">
                <div className="flex justify-between">
                  <span>Type</span>
                  <span className="text-zinc-300 capitalize">{chartType.replace(/-/g, ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Theme</span>
                  <span className="text-zinc-300 capitalize">{theme}</span>
                </div>
                <div className="flex justify-between">
                  <span>Credits</span>
                  <span className="text-zinc-300">20 cr</span>
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-400 mb-3 bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                onClick={handleCreate}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-zinc-200 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Rendering...</> : <><Zap className="w-4 h-4" /> Create Video</>}
              </button>

              {/* Job status */}
              {job && (
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <div className="flex items-center gap-2 mb-2">
                    {job.status === 'done' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : job.status === 'failed' ? (
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                    ) : (
                      <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                    )}
                    <span className="text-xs capitalize text-zinc-400">{job.status}</span>
                  </div>
                  {job.status === 'rendering' && (
                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${job.progress}%` }} />
                    </div>
                  )}
                  {job.status === 'done' && job.outputUrl && (
                    <a
                      href={job.outputUrl}
                      download
                      className="mt-2 flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white"
                    >
                      <Download className="w-3.5 h-3.5" /> Download video
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
