'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface TopProductsChartProps {
  data: {
    name: string;
    quantity: number;
    revenue: number;
  }[];
  className?: string;
}

const COLORS = [
  'hsl(160, 60%, 45%)', // Emerald
  'hsl(200, 60%, 50%)', // Blue
  'hsl(40, 80%, 50%)',  // Amber
  'hsl(280, 50%, 55%)', // Purple
  'hsl(10, 70%, 55%)',  // Coral
];

export function TopProductsChart({ data, className }: TopProductsChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Produk Terlaris</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="fill-muted-foreground"
              />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="fill-muted-foreground"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-md">
                        <p className="text-sm font-medium">{payload[0].payload.name}</p>
                        <p className="text-sm text-primary font-semibold">
                          {payload[0].value} terjual
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(payload[0].payload.revenue)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="quantity" radius={[0, 4, 4, 0]}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
