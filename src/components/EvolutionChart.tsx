import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EvolutionDataPoint {
  date: string;
  score: number;
  context: string;
}

interface EvolutionChartProps {
  data: EvolutionDataPoint[];
  title?: string;
  pillarName?: string;
}

export default function EvolutionChart({ data, title = 'Evolução das Análises', pillarName }: EvolutionChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Sem dados suficientes para exibir gráfico de evolução
        </CardContent>
      </Card>
    );
  }

  // Validar e filtrar dados inválidos
  const validData = data.filter(item => item && item.date && typeof item.score === 'number');

  if (validData.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Dados inválidos para exibir gráfico
        </CardContent>
      </Card>
    );
  }

  const chartData = validData.map(item => ({
    ...item,
    dateFormatted: format(new Date(item.date), 'dd/MM', { locale: ptBR }),
  }));

  return (
    <Card className="border-2">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-lg flex items-center gap-2">
          📈 {title}
        </CardTitle>
        {pillarName && <p className="text-sm text-muted-foreground">{pillarName}</p>}
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.5}
            />
            <XAxis
              dataKey="dateFormatted"
              tick={{
                fill: 'hsl(var(--foreground))',
                fontSize: 12,
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
              formatter={(value: number) => [`${value}/10`, 'Nota']}
              labelFormatter={(label) => `📅 ${label}`}
              labelStyle={{
                fontWeight: 700,
                color: 'hsl(var(--primary))',
                marginBottom: '4px'
              }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
                fontWeight: 600
              }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{
                fill: 'hsl(var(--primary))',
                stroke: 'hsl(var(--background))',
                strokeWidth: 2,
                r: 6
              }}
              activeDot={{
                r: 8,
                fill: 'hsl(var(--primary))',
                stroke: 'hsl(var(--background))',
                strokeWidth: 3
              }}
              name="Nota da Análise"
              fill="url(#colorScore)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
