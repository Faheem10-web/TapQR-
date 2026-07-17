import React, { useState } from 'react';
import { getMockAnalytics } from '../utils/mockData';
import { Eye, MousePointerClick, Percent, TrendingUp, Compass, Monitor } from 'lucide-react';

export default function AnalyticsChart({ profileId }) {
  const data = getMockAnalytics(profileId);
  const { totalViews, totalClicks, ctr, dailyData, linkStats, referrers, devices } = data;
  const [hoveredDay, setHoveredDay] = useState(null);

  // SVG dimensions for our line chart
  const width = 500;
  const height = 180;
  const padding = 30;

  // Max value to scale the Y-axis
  const maxVal = Math.max(...dailyData.map(d => Math.max(d.views, d.clicks))) || 10;
  
  // Calculate SVG line path string
  const getCoordinates = (type) => {
    const pointsCount = dailyData.length;
    const xStep = (width - padding * 2) / (pointsCount - 1);
    
    return dailyData.map((d, index) => {
      const val = type === 'views' ? d.views : d.clicks;
      const x = padding + index * xStep;
      // Invert Y coordinate since SVG (0,0) is top-left
      const y = height - padding - (val / maxVal) * (height - padding * 2);
      return { x, y, val, day: d.name };
    });
  };

  const viewsPoints = getCoordinates('views');
  const clicksPoints = getCoordinates('clicks');

  const buildPathString = (points) => {
    if (points.length === 0) return '';
    return points.reduce((path, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
    }, '');
  };

  const buildAreaPathString = (points) => {
    if (points.length === 0) return '';
    const first = points[0];
    const last = points[points.length - 1];
    const linePath = buildPathString(points);
    // Draw area by linking to the bottom-right and bottom-left bounds
    return `${linePath} L ${last.x} ${height - padding} L ${first.x} ${height - padding} Z`;
  };

  return (
    <div className="space-y-6 w-full" style={{ color: '#111827' }}>
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1 — Views */}
        <div className="glass-card p-5 rounded-[24px] flex items-center justify-between hover-lift relative overflow-hidden group">
          <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full blur-2xl transition-all duration-300 group-hover:opacity-70" style={{ background: 'rgba(16,185,129,0.12)' }}></div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: '#6B7280' }}>Total Page Views</span>
            <span className="text-2xl font-black text-neutral-800 font-outfit">{totalViews.toLocaleString()}</span>
          </div>
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.20)', color: '#059669' }}>
            <Eye className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2 — Clicks */}
        <div className="glass-card p-5 rounded-[24px] flex items-center justify-between hover-lift relative overflow-hidden group">
          <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full blur-2xl transition-all duration-300 group-hover:opacity-70" style={{ background: 'rgba(125,211,252,0.15)' }}></div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: '#6B7280' }}>Total Link Clicks</span>
            <span className="text-2xl font-black text-neutral-800 font-outfit">{totalClicks.toLocaleString()}</span>
          </div>
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(125,211,252,0.12)', border: '1px solid rgba(125,211,252,0.25)', color: '#0284c7' }}>
            <MousePointerClick className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3 — CTR */}
        <div className="glass-card p-5 rounded-[24px] flex items-center justify-between hover-lift relative overflow-hidden group">
          <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full blur-2xl transition-all duration-300 group-hover:opacity-70" style={{ background: 'rgba(244,213,141,0.20)' }}></div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: '#6B7280' }}>Average CTR</span>
            <span className="text-2xl font-black text-neutral-800 font-outfit">{ctr}</span>
          </div>
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(244,213,141,0.18)', border: '1px solid rgba(244,213,141,0.40)', color: '#b45309' }}>
            <Percent className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* SVG Interactive Line Chart */}
      <div className="glass-card p-5 md:p-6 rounded-[24px] text-left hover-lift">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-2" style={{ color: '#6B7280' }}>
            <TrendingUp className="w-4 h-4" style={{ color: '#10B981' }} /> Weekly Traffic Performance
          </h3>
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-semibold" style={{ color: '#6B7280' }}>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#10B981' }}></span> Views
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#7DD3FC' }}></span> Clicks
            </div>
          </div>
        </div>

        {/* SVG Wrapper */}
        <div className="relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
            {/* Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = padding + ratio * (height - padding * 2);
              return (
                <line
                  key={idx}
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="rgba(229,231,235,0.80)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Gradient Fills */}
            <defs>
              <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#7DD3FC" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Area Fills */}
            <path d={buildAreaPathString(viewsPoints)} fill="url(#viewsGrad)" />
            <path d={buildAreaPathString(clicksPoints)} fill="url(#clicksGrad)" />

            {/* Line Paths */}
            <path
              d={buildPathString(viewsPoints)}
              fill="none"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={buildPathString(clicksPoints)}
              fill="none"
              stroke="#7DD3FC"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Circles / Hover Zones */}
            {viewsPoints.map((pt, idx) => (
              <g key={idx}>
                {/* Vertical hover guide */}
                {hoveredDay === pt.day && (
                  <line
                    x1={pt.x}
                    y1={padding}
                    x2={pt.x}
                    y2={height - padding}
                    stroke="rgba(16,185,129,0.20)"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}
                {/* Views Node */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredDay === pt.day ? 6 : 4}
                  fill="#ffffff"
                  stroke="#10B981"
                  strokeWidth="2"
                  className="transition-all duration-150"
                />
                {/* Clicks Node */}
                <circle
                  cx={clicksPoints[idx].x}
                  cy={clicksPoints[idx].y}
                  r={hoveredDay === clicksPoints[idx].day ? 6 : 4}
                  fill="#ffffff"
                  stroke="#7DD3FC"
                  strokeWidth="2"
                  className="transition-all duration-150"
                />
                {/* Invisible Hover Area per column */}
                <rect
                  x={pt.x - 20}
                  y={0}
                  width={40}
                  height={height}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredDay(pt.day)}
                  onMouseLeave={() => setHoveredDay(null)}
                />
              </g>
            ))}

            {/* X-axis Labels */}
            {viewsPoints.map((pt, idx) => (
              <text
                key={idx}
                x={pt.x}
                y={height - 8}
                textAnchor="middle"
                fill="#9CA3AF"
                fontSize="10"
                fontWeight="600"
              >
                {pt.day}
              </text>
            ))}
          </svg>

          {/* Floating Tooltip details */}
          {hoveredDay && (() => {
            const dayData = dailyData.find(d => d.name === hoveredDay);
            if (!dayData) return null;
            return (
              <div className="absolute top-2 right-2 glass-card rounded-xl p-2.5 text-[10px] space-y-1 font-semibold pointer-events-none" style={{ color: '#111827' }}>
                <p className="font-bold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>{hoveredDay}</p>
                <p style={{ color: '#059669' }}>Views: <span className="text-neutral-900 font-mono">{dayData.views}</span></p>
                <p style={{ color: '#0284c7' }}>Clicks: <span className="text-neutral-900 font-mono">{dayData.clicks}</span></p>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Distribution Splits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
        {/* Referrers */}
        <div className="glass-card p-5 rounded-[24px] space-y-4 hover-lift">
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-2" style={{ color: '#6B7280' }}>
            <Compass className="w-4 h-4" style={{ color: '#10B981' }} /> Top Referral Channels
          </h3>
          <div className="space-y-3">
            {referrers.map((ref) => (
              <div key={ref.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-neutral-700">{ref.name}</span>
                  <span style={{ color: '#6B7280' }}>{ref.value}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(229,231,235,0.80)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${ref.value}%`, backgroundColor: ref.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Devices */}
        <div className="glass-card p-5 rounded-[24px] space-y-4 hover-lift">
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-2" style={{ color: '#6B7280' }}>
            <Monitor className="w-4 h-4" style={{ color: '#7DD3FC' }} /> Device Distribution
          </h3>
          <div className="space-y-3">
            {devices.map((dev) => (
              <div key={dev.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-neutral-700">{dev.name}</span>
                  <span style={{ color: '#6B7280' }}>{dev.value}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(229,231,235,0.80)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${dev.value}%`, backgroundColor: dev.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Link Click Stats Table */}
      <div className="glass-card p-5 md:p-6 rounded-[24px] text-left space-y-4 hover-lift">
        <h3 className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: '#6B7280' }}>
          Interaction Breakdown by Link
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-semibold" style={{ color: '#6B7280' }}>
            <thead>
              <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.60)' }}>
                <th className="py-2.5 text-left" style={{ color: '#9CA3AF' }}>Link Label</th>
                <th className="py-2.5 text-right" style={{ color: '#9CA3AF' }}>Unique Clicks</th>
                <th className="py-2.5 text-right" style={{ color: '#9CA3AF' }}>Click Through (CTR)</th>
              </tr>
            </thead>
            <tbody>
              {linkStats.map((link) => (
                <tr key={link.name} className="border-b transition-colors hover:bg-white/40" style={{ borderColor: 'rgba(255,255,255,0.40)' }}>
                  <td className="py-3 font-bold text-neutral-800">{link.name}</td>
                  <td className="py-3 text-right text-neutral-700 font-mono">{link.clicks}</td>
                  <td className="py-3 text-right font-mono font-bold" style={{ color: '#059669' }}>{link.ctr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
