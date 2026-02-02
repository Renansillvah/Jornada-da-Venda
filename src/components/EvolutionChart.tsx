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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {pillarName && <p className="text-sm text-muted-foreground">{pillarName}</p>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="dateFormatted"
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
              formatter={(value: number) => [`Nota: ${value}`, '']}
              labelFormatter={(label) => `Data: ${label}`}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
                color: 'hsl(var(--foreground))'
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              activeDot={{ r: 6 }}
              name="Nota"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
