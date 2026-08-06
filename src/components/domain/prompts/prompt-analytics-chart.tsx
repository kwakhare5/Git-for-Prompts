'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', passRate: 92, versions: 4 },
  { day: 'Tue', passRate: 95, versions: 8 },
  { day: 'Wed', passRate: 88, versions: 5 },
  { day: 'Thu', passRate: 98, versions: 12 },
  { day: 'Fri', passRate: 100, versions: 9 },
  { day: 'Sat', passRate: 100, versions: 3 },
  { day: 'Sun', passRate: 100, versions: 6 },
];

export function PromptAnalyticsChart() {
  return (
    <Card className="border-border bg-card shadow-xl font-sans">
      <CardHeader className="p-5 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-foreground font-sans tracking-tight">
              Evaluation Pass Rate &amp; Commit Velocity
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground font-sans">
              7-day aggregate assertion score &amp; version commit activity
            </CardDescription>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-semibold">
            100% Target
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-3 h-[200px] font-mono text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="passRateGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#a1a1aa" fontSize={11} domain={[80, 100]} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#161616',
                borderColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                color: '#f5f0eb',
                fontSize: '12px',
                fontFamily: 'var(--font-jetbrains-mono)',
              }}
            />
            <Area
              type="monotone"
              dataKey="passRate"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#passRateGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
