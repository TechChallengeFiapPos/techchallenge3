# 💰 Tech Challenge 4 - Gestão Financeira

Aplicação de **Gerenciamento Financeiro** desenvolvida em **React Native (Expo)** aplicando **Clean Architecture**, **State Management avançado** e **otimizações de performance**.

---

## 🏗️ Arquitetura

### Clean Architecture (3 Camadas)
```
src/
├── domain/              # Camada de Domínio
│   ├── entities/        # Entidades (Transaction, Card, User)
│   └── useCases/        # Casos de uso (CreateTransaction, UpdateCard)
│
├── data/                # Camada de Dados
│   └── repositories/    # Implementação de acesso aos dados
│
└── presentation/        # Camada de Apresentação
    ├── components/      # Componentes React
    ├── hooks/           # Hooks customizados (React Query)
    └── contexts/        # Contextos React
```

**Padrões aplicados:**
- Repository Pattern
- Dependency Injection
- Single Responsibility Principle
- Separation of Concerns

---

## ⚡ Performance e Otimizações

### State Management

**React Query** gerencia todo o estado da aplicação:
- Cache inteligente (5min stale time)
- Invalidação automática após mutations
- Refetch otimizado
- Background updates
```typescript
// Configuração do cache
staleTime: 1000 * 60 * 5,    // 5 minutos
cacheTime: 1000 * 60 * 10,   // 10 minutos
```

### Resultados Mensurados

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| Cache Hit Rate | 0% | ~67% | +67% |
| API Calls (30s) | 15 | 9 | -40% |
| Dashboard Load | 2.5s | 1.2s | -52% |

### Otimizações Implementadas

**Lazy Loading + Suspense:**

Componentes pesados como gráficos são carregados sob demanda usando React.lazy + Suspense:
```typescript
const LazyCharts = lazy(() => import('./FinancialCharts'));

<Suspense fallback={<ActivityIndicator />}>
  <LazyCharts transactions={transactions} />
</Suspense>
```

**Benefícios:**
- Bundle inicial reduzido
- Carregamento progressivo
- Melhor Time to Interactive
- Loading localizado (não bloqueia tela inteira)

**FlatList:**
- `removeClippedSubviews` para melhor performance
- `maxToRenderPerBatch: 10` para renderização em lote
- `windowSize: 10` para otimização de memória
- Paginação infinita

**React:**
- `useMemo` para cálculos complexos
- `useCallback` para funções em callbacks
- Componentes memoizados

**UX:**
- Loading skeletons animados
- Transições suaves (fade in/out)
- Feedback visual em todas ações

### Sistema de Métricas

Monitoramento em tempo real:
- Tempo de carregamento por tela
- Total de requests Firebase
- Cache hits/misses
- Taxa de cache hit
- Tempo de sessão

Ver console do app para relatório completo ao sair. Para resetar e gerar novo relatório, acessar página de dados do usuário.

---

## 🛠️ Tecnologias

- **Framework:** React Native + Expo Router
- **Linguagem:** TypeScript
- **State Management:** React Query
- **Backend:** Firebase (Auth + Firestore + Storage)
- **UI:** React Native Paper
- **Gráficos:** Victory Native
- **Formulários:** React Hook Form
- **Cache:** React Query + AsyncStorage

---

## 📋 Funcionalidades

- Dashboard financeiro com métricas e gráficos
- CRUD completo de transações com filtros avançados
- CRUD completo de cartões de crédito/débito
- Upload de recibos/comprovantes
- Autenticação segura (Firebase Auth)
- Tema claro/escuro
- Paginação infinita
- Loading skeletons
- Animações suaves
- Lazy loading de componentes pesados

---

## 📦 Instalação

### 1️⃣ Pré-requisitos

- Node.js (v18+)
- npm ou yarn
- Android Studio (emulador)
- Expo CLI
- Conta Firebase
- Expo GO

### 2️⃣ Clone o repositório
```bash
git clone git@github.com:TechChallengeFiapPos/techchallenge3.git
cd techchallenge3
```

### 3️⃣ Instale as dependências
```bash
npm install
# ou
yarn install
```

### 4️⃣ Configure variáveis de ambiente

Crie `.env` na raiz baseado em `.env.example`:
```bash
EXPO_PUBLIC_FIREBASE_API_KEY=sua_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

### 5️⃣ Configure Firebase

**Firestore Rules** (`firestore.rules`):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isSignedIn() {
      return request.auth != null;
    }
    
    match /users/{userId} {
      allow read, create, update: if isSignedIn() && request.auth.uid == userId;
      allow delete: if false;
    }
    
    match /users/{userId}/transactions/{transactionId} {
      allow read, list: if isSignedIn() && request.auth.uid == userId;
      allow create: if isSignedIn() 
                    && request.auth.uid == userId
                    && request.resource.data.type in ['income', 'expense']
                    && request.resource.data.value > 0;
      allow update, delete: if isSignedIn() && request.auth.uid == userId;
    }
    
    match /users/{userId}/cards/{cardId} {
      allow read, list, create, update, delete: if isSignedIn() && request.auth.uid == userId;
    }
    
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Storage Rules**:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /transactions/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 6️⃣ Inicie o projeto
```bash
npx expo start -c
```

- Pressione `a` para abrir no emulador Android
- Configure device: 1080 x 2400 (padrão)
- Crie um usuário e faça login

---

## 📊 Gráficos e Análises

### Dashboard

1. **Despesas por Categoria** (Pizza)
   - Top 5 categorias com maior valor

2. **Evolução Mensal** (Linha)
   - Receitas e despesas dos últimos 6 meses

3. **Comparativo Mensal** (Barras)
   - Mês passado vs mês atual

4. **Cards Resumo**
   - Total de receitas
   - Total de despesas
   - Saldo atual

---

## 🔒 Segurança

- Autenticação Firebase obrigatória
- Firestore Security Rules com isolamento por usuário
- Validações de tipo e valor
- Credenciais em variáveis de ambiente
- API Key com restrições

---

## 📱 Estrutura de Telas

1. **Welcome** - Tela inicial
2. **Login/Registro** - Autenticação
3. **Dashboard** - Resumo financeiro + gráficos
4. **Transações** - Lista com filtros e CRUD
5. **Cartões** - Gerenciamento de cartões
6. **Perfil** - Dados do usuário

---

## 🧪 Validações

- **Transações:** Valor obrigatório, data válida, campos obrigatórios
- **Cartões:** Número válido (16 dígitos), data de expiração, CVV
- **Auth:** Email válido, senha mínima 6 caracteres
- **Upload:** Tamanho e tipo de arquivo

---

## 👥 Autora

Eloisa Fagundes  
GitHub: [@EloisaFagundes](https://github.com/EloisaFagundes)

---

## 📄 Licença

Projeto desenvolvido para fins acadêmicos - Tech Challenge Fase 4 (Pós-Graduação FIAP).
