-- Tabela de análises de jornada de venda
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  date TIMESTAMPTZ NOT NULL,
  context TEXT[] NOT NULL,
  description TEXT NOT NULL,
  pillars JSONB NOT NULL,
  average_score NUMERIC(3,1) NOT NULL,
  strongest_pillar TEXT NOT NULL,
  weakest_pillar TEXT NOT NULL,
  trend TEXT CHECK (trend IN ('up', 'stable', 'down')),
  changes TEXT,
  type TEXT NOT NULL CHECK (type IN ('single', 'update')) DEFAULT 'single',
  parent_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  tags TEXT[],
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_analyses_date ON analyses(date DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_is_active ON analyses(is_active);
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_parent_id ON analyses(parent_id);
CREATE INDEX IF NOT EXISTS idx_analyses_tags ON analyses USING GIN(tags);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_analyses_updated_at
  BEFORE UPDATE ON analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança: usuários só podem ver/modificar suas próprias análises
CREATE POLICY "Users can view their own analyses"
  ON analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses"
  ON analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyses"
  ON analyses FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses"
  ON analyses FOR DELETE
  USING (auth.uid() = user_id);

-- Comentários para documentação
COMMENT ON TABLE analyses IS 'Armazena análises de jornada de venda por pilares';
COMMENT ON COLUMN analyses.pillars IS 'Array JSON com os 10 pilares e suas notas (score, observation, action)';
COMMENT ON COLUMN analyses.type IS 'Tipo: single (nova análise) ou update (atualização de análise existente)';
COMMENT ON COLUMN analyses.parent_id IS 'ID da análise que está sendo atualizada (se type=update)';
COMMENT ON COLUMN analyses.is_active IS 'Se true, esta análise conta no cálculo de saúde da empresa';
COMMENT ON COLUMN analyses.tags IS 'Tags para agrupar análises relacionadas (ex: cliente-X, proposta-Y)';
