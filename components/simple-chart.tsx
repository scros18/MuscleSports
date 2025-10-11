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
}

export function SimpleChart({ title, data, height = 200 }: SimpleChartProps) {
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
            </defs>
            <rect width="100%" height={chartHeight} fill="url(#grid)" />

            {/* Bars */}
            {data.map((item, index) => {
              const barWidth = 100 / data.length;
              const barHeight = (item.value / maxValue) * (chartHeight - 60);
              const x = (index * barWidth) + (barWidth * 0.1);
              const y = chartHeight - barHeight - 30;

              return (
                <g key={item.name}>
                  {/* Bar */}
                  <rect
                    x={`${x}%`}
                    y={y}
                    width={`${barWidth * 0.8}%`}
                    height={barHeight}
                    fill={item.color}
                    rx="4"
                    className="transition-all duration-300 hover:opacity-80"
                  />
                  {/* Value label */}
                  <text
                    x={`${x + (barWidth * 0.4)}%`}
                    y={y - 5}
                    textAnchor="middle"
                    className="text-xs font-medium fill-foreground"
                  >
                    {item.value}
                  </text>
                  {/* Name label */}
                  <text
                    x={`${x + (barWidth * 0.4)}%`}
                    y={chartHeight - 10}
                    textAnchor="middle"
                    className="text-xs fill-muted-foreground"
                  >
                    {item.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}