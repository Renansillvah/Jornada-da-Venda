-- Tabela para gerenciar acessos vitalícios (lifetime access)
CREATE TABLE IF NOT EXISTS user_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  has_lifetime_access BOOLEAN DEFAULT false,
  payment_id TEXT,
  payment_amount DECIMAL(10, 2) DEFAULT 9.99,
  payment_status TEXT DEFAULT 'pending', -- pending, paid, free_trial, admin_granted
  granted_by TEXT, -- 'mercadopago', 'admin', 'auto'
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  trial_analyses_used INTEGER DEFAULT 0,
  trial_analyses_limit INTEGER DEFAULT 2,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_access_email ON user_access(email);
CREATE INDEX IF NOT EXISTS idx_user_access_has_lifetime ON user_access(has_lifetime_access);
CREATE INDEX IF NOT EXISTS idx_user_access_payment_status ON user_access(payment_status);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_access_updated_at
  BEFORE UPDATE ON user_access
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para conceder acesso vitalício (admin)
CREATE OR REPLACE FUNCTION grant_lifetime_access(
  user_email TEXT,
  payment_identifier TEXT DEFAULT NULL,
  granted_by_source TEXT DEFAULT 'admin'
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  user_record user_access%ROWTYPE;
BEGIN
  -- Inserir ou atualizar registro
  INSERT INTO user_access (
    email,
    has_lifetime_access,
    payment_id,
    payment_status,
    granted_by,
    granted_at
  )
  VALUES (
    user_email,
    true,
    COALESCE(payment_identifier, 'admin_' || extract(epoch from now())::text),
    'paid',
    granted_by_source,
    NOW()
  )
  ON CONFLICT (email) DO UPDATE SET
    has_lifetime_access = true,
    payment_status = 'paid',
    granted_by = granted_by_source,
    granted_at = NOW(),
    updated_at = NOW();

  -- Buscar registro atualizado
  SELECT * INTO user_record FROM user_access WHERE email = user_email;

  -- Retornar resultado
  result := jsonb_build_object(
    'success', true,
    'email', user_record.email,
    'has_lifetime_access', user_record.has_lifetime_access,
    'granted_at', user_record.granted_at
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Função para verificar se usuário tem acesso
CREATE OR REPLACE FUNCTION check_user_access(user_email TEXT)
RETURNS JSONB AS $$
DECLARE
  user_record user_access%ROWTYPE;
  can_analyze BOOLEAN;
  remaining_trial INTEGER;
BEGIN
  -- Buscar usuário
  SELECT * INTO user_record FROM user_access WHERE email = user_email;

  -- Se não existe, criar com trial
  IF NOT FOUND THEN
    INSERT INTO user_access (
      email,
      has_lifetime_access,
      payment_status,
      granted_by
    )
    VALUES (
      user_email,
      false,
      'free_trial',
      'auto'
    )
    RETURNING * INTO user_record;
  END IF;

  -- Calcular se pode analisar
  remaining_trial := user_record.trial_analyses_limit - user_record.trial_analyses_used;
  can_analyze := user_record.has_lifetime_access OR remaining_trial > 0;

  -- Retornar status
  RETURN jsonb_build_object(
    'email', user_record.email,
    'has_lifetime_access', user_record.has_lifetime_access,
    'can_analyze', can_analyze,
    'trial_remaining', remaining_trial,
    'payment_status', user_record.payment_status,
    'granted_by', user_record.granted_by
  );
END;
$$ LANGUAGE plpgsql;

-- Função para consumir análise do trial
CREATE OR REPLACE FUNCTION use_trial_analysis(user_email TEXT)
RETURNS JSONB AS $$
DECLARE
  user_record user_access%ROWTYPE;
  remaining_trial INTEGER;
BEGIN
  -- Buscar usuário
  SELECT * INTO user_record FROM user_access WHERE email = user_email;

  -- Se não existe, retornar erro
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not found');
  END IF;

  -- Se tem acesso vitalício, não consumir trial
  IF user_record.has_lifetime_access THEN
    RETURN jsonb_build_object(
      'success', true,
      'message', 'Lifetime access - no trial consumed',
      'trial_remaining', user_record.trial_analyses_limit - user_record.trial_analyses_used
    );
  END IF;

  -- Calcular trial restante
  remaining_trial := user_record.trial_analyses_limit - user_record.trial_analyses_used;

  -- Se não tem trial, retornar erro
  IF remaining_trial <= 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Trial expired',
      'trial_remaining', 0
    );
  END IF;

  -- Consumir trial
  UPDATE user_access
  SET trial_analyses_used = trial_analyses_used + 1
  WHERE email = user_email;

  RETURN jsonb_build_object(
    'success', true,
    'trial_remaining', remaining_trial - 1
  );
END;
$$ LANGUAGE plpgsql;

-- RLS (Row Level Security) - permitir acesso público para leitura/escrita
ALTER TABLE user_access ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública (necessário para verificar acesso)
CREATE POLICY "Allow public read access" ON user_access
  FOR SELECT
  USING (true);

-- Política para permitir insert/update público (necessário para criar usuários e atualizar)
CREATE POLICY "Allow public insert" ON user_access
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update" ON user_access
  FOR UPDATE
  USING (true);

-- Comentários
COMMENT ON TABLE user_access IS 'Gerenciamento centralizado de acessos vitalícios e trials';
COMMENT ON FUNCTION grant_lifetime_access IS 'Concede acesso vitalício para um usuário (admin)';
COMMENT ON FUNCTION check_user_access IS 'Verifica se usuário tem acesso para fazer análise';
COMMENT ON FUNCTION use_trial_analysis IS 'Consome uma análise do trial do usuário';
