import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PILLARS_CONFIG } from '@/types/analysis';

interface PillarScore {
  id: string;
  name: string;
  score: number;
}

interface PillarComparisonChartProps {
  pillarScores: PillarScore[];
  title?: string;
}

export default function PillarComparisonChart({ pillarScores, title = 'Comparação de Pilares' }: PillarComparisonChartProps) {
  if (!pillarScores || pillarScores.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Nenhum pilar avaliado
        </CardContent>
      </Card>
    );
  }

  // Validar dados
  const validScores = pillarScores.filter(p => p && typeof p.score === 'number' && p.name);

  if (validScores.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Dados inválidos para comparação
        </CardContent>
      </Card>
    );
  }

  const getBarColor = (score: number) => {
    if (score >= 8) return 'hsl(var(--success))';
    if (score >= 6) return 'hsl(var(--info))';
    if (score >= 4) return 'hsl(var(--warning))';
    return 'hsl(var(--destructive))';
  };

  const chartData = validScores.map(p => ({
    name: p.name.length > 20 ? p.name.substring(0, 18) + '...' : p.name,
    fullName: p.name,
    score: p.score,
    layer: PILLARS_CONFIG.find(config => config.id === p.id)?.layer || 'unknown'
  }));

  return (
    <Card className="border-2">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-lg flex items-center gap-2">
          📊 {title}
        </CardTitle>
        <div className="flex gap-2 mt-2 flex-wrap">
          <Badge variant="outline" className="bg-success/10 text-success-foreground border-success/30">
            8-10: Excelente
          </Badge>
          <Badge variant="outline" className="bg-info/10 text-info-foreground border-info/30">
            6-8: Adequado
          </Badge>
          <Badge variant="outline" className="bg-warning/10 text-warning-foreground border-warning/30">
            4-6: Atenção
          </Badge>
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
            0-4: Crítico
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 90 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.5}
            />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              tick={{
                fill: 'hsl(var(--foreground))',
                fontSize: 11,
                fontWeight: 500
              }}
              stroke="hsl(var(--border))"
            />
            <YAxis
              domain={[0, 10]}
              tick={{
                fill: 'hsl(var(--foreground))',
                fontSize: 12,
                fontWeight: 500
              }}
              stroke="hsl(var(--border))"
              label={{
                value: 'Nota',
                angle: -90,
                position: 'insideLeft',
                style: {
                  fill: 'hsl(var(--foreground))',
                  fontWeight: 600
                }
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '2px solid hsl(var(--primary))',
                borderRadius: '12px',
                color: 'hsl(var(--popover-foreground))',
                fontWeight: 600,
                padding: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
              formatter={(value: number, _name: string, props: any) => [
                `${value}/10`,
                props.payload.fullName
              ]}
              labelStyle={{
                fontWeight: 700,
                color: 'hsl(var(--primary))',
                marginBottom: '4px'
              }}
            />
            <Bar
              dataKey="score"
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.score)}
                  stroke={getBarColor(entry.score)}
                  strokeWidth={2}
                  opacity={0.9}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
