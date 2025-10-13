import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface SimpleChartProps {
  title: string;
  data: ChartData[];
  height?: number;
  mode?: 'bar' | 'line-area';
}

export function SimpleChart({ title, data, height = 200, mode = 'bar' }: SimpleChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const chartHeight = height - 40; // Account for padding

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full" style={{ height: `${height}px` }}>
          <svg width="100%" height={chartHeight} className="overflow-visible">
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 20" fill="none" stroke="hsl(var(--muted))" strokeWidth="0.5" opacity="0.3"/>
              </pattern>
              <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect width="100%" height={chartHeight} fill="url(#grid)" />

            {mode === 'bar' ? (
              // Bars
              <g>
                {data.map((item, index) => {
                  const barWidth = 100 / data.length;
                  const barHeight = (item.value / maxValue) * (chartHeight - 60);
                  const x = (index * barWidth) + (barWidth * 0.1);
                  const y = chartHeight - barHeight - 30;
                  return (
                    <g key={item.name}>
                      <rect x={`${x}%`} y={y} width={`${barWidth * 0.8}%`} height={barHeight} fill={item.color} rx="4" className="transition-all duration-300 hover:opacity-80" />
                      <text x={`${x + (barWidth * 0.4)}%`} y={y - 5} textAnchor="middle" className="text-xs font-medium fill-foreground">{item.value}</text>
                      <text x={`${x + (barWidth * 0.4)}%`} y={chartHeight - 10} textAnchor="middle" className="text-xs fill-muted-foreground">{item.name}</text>
                    </g>
                  );
                })}
              </g>
            ) : (
              // Smooth line + area (for uptime)
              <g>
                {(() => {
                  const points = data.map((d, i) => {
                    const x = (i / Math.max(1, data.length - 1)) * 100;
                    const y = chartHeight - ((d.value / maxValue) * (chartHeight - 60)) - 30;
                    return { x, y };
                  });
                  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                  const areaPath = `${path} L 100 ${chartHeight - 30} L 0 ${chartHeight - 30} Z`;
                  return (
                    <g>
                      <path d={areaPath} fill="url(#area)" opacity={0.8} />
                      <path d={path} fill="none" stroke="hsl(var(--primary))" strokeWidth={2} />
                      {points.map((p, i) => (
                        <circle key={i} cx={`${p.x}%`} cy={p.y} r={2.5} fill="hsl(var(--primary))" />
                      ))}
                    </g>
                  );
                })()}
              </g>
            )}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}