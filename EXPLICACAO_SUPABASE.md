# 🔒 Como Funciona o Salvamento no Supabase

## 📊 Visão Geral

```
┌─────────────────────────────────────────────────────────┐
│                    SEU NAVEGADOR                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Aplicação "Jornada da Venda"                     │  │
│  │                                                    │  │
│  │  1. Você faz login                                │  │
│  │     Email: renan.wow.blizz@gmail.com              │  │
│  │     Senha: ••••••••••••                           │  │
│  │                                                    │  │
│  │  2. Cria uma análise                              │  │
│  │     - Preenche os dados dos pilares               │  │
│  │     - Clica em "Salvar"                           │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
                          ↓ (Enviado via HTTPS - Seguro)
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    SUPABASE (Nuvem)                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │  AUTENTICAÇÃO                                     │  │
│  │  - Verifica se você está logado                  │  │
│  │  - Identifica seu user_id:                       │  │
│  │    72f3dd99-190c-46f0-95e9-c4a5a0a0ba85         │  │
│  └──────────────────────────────────────────────────┘  │
│                          ↓                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │  BANCO DE DADOS PostgreSQL                       │  │
│  │                                                    │  │
│  │  Tabela: analyses                                 │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │ id        | user_id    | date     | ...    │  │  │
│  │  ├────────────────────────────────────────────┤  │  │
│  │  │ abc-123   | 72f3dd99   | hoje     | ...    │  │  │
│  │  │ def-456   | 72f3dd99   | ontem    | ...    │  │  │
│  │  │ ghi-789   | 72f3dd99   | semana   | ...    │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  │              ↑                                     │  │
│  │              Todas vinculadas ao SEU user_id      │  │
│  └──────────────────────────────────────────────────┘  │
│                          ↓                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │  RLS (Row Level Security)                        │  │
│  │                                                    │  │
│  │  Políticas de Segurança:                         │  │
│  │  ✅ SELECT: Você só vê suas análises             │  │
│  │  ✅ INSERT: Só salva com seu user_id             │  │
│  │  ✅ UPDATE: Só edita suas próprias análises      │  │
│  │  ✅ DELETE: Só deleta suas próprias análises     │  │
│  │                                                    │  │
│  │  ❌ Outras pessoas NÃO conseguem:                │  │
│  │     - Ver suas análises                          │  │
│  │     - Modificar seus dados                       │  │
│  │     - Deletar suas informações                   │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Fluxo Completo de Segurança

### 1️⃣ **Quando você FAZ LOGIN:**

```javascript
// O sistema faz isso automaticamente:
const { user, session } = await supabase.auth.signInWithPassword({
  email: 'renan.wow.blizz@gmail.com',
  password: 'Warcraft782r@'
})

// Supabase retorna:
user.id = '72f3dd99-190c-46f0-95e9-c4a5a0a0ba85'
session.access_token = 'token-seguro-criptografado'
```

**O que acontece:**
- ✅ Seu email e senha são verificados
- ✅ Supabase cria uma "sessão" (como um cartão de acesso)
- ✅ Essa sessão fica guardada no seu navegador
- ✅ Toda vez que você abre o app, ele verifica se a sessão ainda é válida

---

### 2️⃣ **Quando você CRIA UMA ANÁLISE:**

```javascript
// Você preenche os dados da análise e clica em "Salvar"
const analysis = {
  date: '2026-02-02',
  context: ['prospeccao'],
  description: 'Primeira reunião com cliente X',
  pillars: {
    discovery: { score: 8, notes: 'Excelente descoberta' },
    proposal: { score: 7, notes: 'Boa proposta' },
    negotiation: { score: 6, notes: 'Negociação adequada' },
    closing: { score: 9, notes: 'Fechamento muito bom' }
  },
  // ... outros dados
}

// O sistema AUTOMATICAMENTE adiciona seu user_id:
analysis.user_id = '72f3dd99-190c-46f0-95e9-c4a5a0a0ba85'

// E salva no Supabase:
await supabase.from('analyses').insert([analysis])
```

**O que acontece:**
- ✅ Seus dados são enviados para o Supabase (via HTTPS seguro)
- ✅ O RLS verifica se você está logado
- ✅ O banco salva a análise COM seu user_id
- ✅ Ninguém mais consegue ver essa análise

---

### 3️⃣ **Quando você ABRE O HISTÓRICO:**

```javascript
// O sistema busca APENAS suas análises:
const { data } = await supabase
  .from('analyses')
  .select('*')
  // O RLS AUTOMATICAMENTE adiciona:
  // WHERE user_id = '72f3dd99-190c-46f0-95e9-c4a5a0a0ba85'
```

**O que acontece:**
- ✅ Supabase verifica sua sessão
- ✅ RLS filtra APENAS análises com seu user_id
- ✅ Você vê só suas próprias análises
- ✅ Outras pessoas não aparecem na lista

---

### 4️⃣ **Se OUTRA PESSOA tentar acessar:**

```javascript
// Usuário sem login:
const { data } = await supabase.from('analyses').select('*')
// Resultado: [] (vazio)
// RLS bloqueia porque não tem user_id válido

// Outro usuário logado (user_id = 'xyz-999'):
const { data } = await supabase.from('analyses').select('*')
// Resultado: Apenas as análises DELE (user_id = 'xyz-999')
// RLS filtra automaticamente
```

**O que acontece:**
- ✅ Cada pessoa vê apenas seus próprios dados
- ✅ Impossível acessar dados de outros usuários
- ✅ Sistema totalmente isolado por conta

---

## 📋 Resumo do Salvamento

| Ação | Onde salva | Quem vê | Segurança |
|------|-----------|---------|-----------|
| **Login** | Supabase Auth | Só você | Email confirmado |
| **Criar análise** | Supabase DB (tabela `analyses`) | Só você | RLS ativo |
| **Abrir histórico** | Busca no Supabase | Só suas análises | Filtro automático por user_id |
| **Gráficos** | Busca no Supabase | Só seus dados | RLS garante privacidade |
| **Exportar dados** | Exporta do Supabase | Só suas análises | Dados já filtrados |

---

## 🛡️ Camadas de Proteção

```
┌────────────────────────────────────────────┐
│  1. HTTPS (Criptografia na transmissão)   │
│     - Dados viajam criptografados         │
│     - Ninguém intercepta na internet      │
└────────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────────┐
│  2. Autenticação (Sessão válida)          │
│     - Apenas usuários logados             │
│     - Token de acesso verificado          │
└────────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────────┐
│  3. RLS (Row Level Security)              │
│     - Filtra por user_id                  │
│     - Impossível ver dados de outros      │
└────────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────────┐
│  4. Banco de Dados PostgreSQL             │
│     - Dados persistidos com segurança     │
│     - Backup automático do Supabase       │
└────────────────────────────────────────────┘
```

---

## ✅ Garantias

### **O que ESTÁ garantido:**

✅ **Suas análises ficam salvas na nuvem** (não somem se você limpar cache)
✅ **Apenas você vê seus dados** (RLS impede acesso de outros)
✅ **Login seguro** (senha criptografada, sessão protegida)
✅ **Dados não se misturam** (cada user_id é isolado)
✅ **Acesso de qualquer lugar** (salvo na nuvem, não no computador)

### **O que NÃO pode acontecer:**

❌ Outra pessoa ver suas análises
❌ Dados serem acessados sem login
❌ Análises de outros usuários aparecerem no seu histórico
❌ Perda de dados (backup automático do Supabase)

---

## 🎯 Exemplo Prático

**Você:**
- Email: renan.wow.blizz@gmail.com
- user_id: `72f3dd99-190c-46f0-95e9-c4a5a0a0ba85`
- Cria 10 análises → Todas têm `user_id = 72f3dd99...`

**Outro usuário (João):**
- Email: joao@example.com
- user_id: `abc-123-def-456`
- Cria 5 análises → Todas têm `user_id = abc-123...`

**Resultado:**
- Você abre o histórico → Vê apenas suas 10 análises
- João abre o histórico → Vê apenas suas 5 análises
- Nenhum dos dois vê os dados do outro ✅

---

## 🚀 Próximos Passos

Agora você pode:

1. **Fazer login** na aplicação
2. **Criar suas análises** (serão salvas automaticamente na nuvem)
3. **Ver o histórico** (apenas suas análises aparecerão)
4. **Acessar de qualquer lugar** (dados na nuvem, não no computador local)

**Tudo está configurado e funcionando!** 🎉
