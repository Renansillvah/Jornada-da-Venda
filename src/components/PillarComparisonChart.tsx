import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              domain={[0, 10]}
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--card-foreground))',
              }}
              formatter={(value: number, _name: string, props: any) => [
                `Nota: ${value}`,
                props.payload.fullName
              ]}
            />
            <Bar dataKey="score" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
