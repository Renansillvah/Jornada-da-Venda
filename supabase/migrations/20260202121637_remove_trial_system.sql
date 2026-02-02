-- Remover sistema de trial - Agora apenas acesso vitalício pago

-- Atualizar função check_user_access para remover lógica de trial
CREATE OR REPLACE FUNCTION check_user_access(user_email TEXT)
RETURNS JSONB AS $$
DECLARE
  user_record user_access%ROWTYPE;
  can_analyze BOOLEAN;
BEGIN
  -- Buscar usuário
  SELECT * INTO user_record FROM user_access WHERE email = user_email;

  -- Se não existe, criar registro SEM acesso (sem trial gratuito)
  IF NOT FOUND THEN
    INSERT INTO user_access (
      email,
      has_lifetime_access,
      payment_status,
      granted_by
    )
    VALUES (
      user_email,
      false, -- SEM acesso vitalício
      'pending', -- Aguardando pagamento
      'auto'
    )
    RETURNING * INTO user_record;
  END IF;

  -- ✅ IMPORTANTE: Apenas quem tem acesso vitalício pode analisar (SEM TRIAL)
  can_analyze := user_record.has_lifetime_access;

  -- Retornar status (trial_remaining sempre 0)
  RETURN jsonb_build_object(
    'email', user_record.email,
    'has_lifetime_access', user_record.has_lifetime_access,
    'can_analyze', can_analyze,
    'trial_remaining', 0, -- Sempre 0 - sem trial gratuito
    'payment_status', user_record.payment_status,
    'granted_by', user_record.granted_by
  );
END;
$$ LANGUAGE plpgsql;

-- Atualizar função use_trial_analysis para não permitir uso de trial
CREATE OR REPLACE FUNCTION use_trial_analysis(user_email TEXT)
RETURNS JSONB AS $$
DECLARE
  user_record user_access%ROWTYPE;
BEGIN
  -- Buscar usuário
  SELECT * INTO user_record FROM user_access WHERE email = user_email;

  -- Se não existe, retornar erro
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not found');
  END IF;

  -- Se tem acesso vitalício, permitir (sem consumir nada)
  IF user_record.has_lifetime_access THEN
    RETURN jsonb_build_object(
      'success', true,
      'message', 'Lifetime access - unlimited analyses',
      'trial_remaining', 0
    );
  END IF;

  -- ✅ IMPORTANTE: Sem acesso vitalício = BLOQUEADO (sem trial gratuito)
  RETURN jsonb_build_object(
    'success', false,
    'error', 'Lifetime access required - No free trial available',
    'trial_remaining', 0
  );
END;
$$ LANGUAGE plpgsql;

-- Comentários atualizados
COMMENT ON FUNCTION check_user_access IS 'Verifica se usuário tem acesso vitalício (SEM trial gratuito)';
COMMENT ON FUNCTION use_trial_analysis IS 'Verifica acesso vitalício - Trial gratuito removido do sistema';
