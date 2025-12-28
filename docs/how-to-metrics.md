# Como Rodar Métricas de Performance

## Pré-requisitos

- App rodando no Expo
- Sistema de métricas implementado (`src/utils/metrics.ts`)
- Repositories instrumentados com `metrics.logRequest()`

---

##  Passo a Passo

### **1. Resetar Métricas**

Antes de começar novo teste:
```javascript
// No console do app (Chrome DevTools ou botão no app)
global.metrics.reset()
```

Isso limpa:
- Contador de requisições
- Lista de eventos
- Timer da sessão

---

### **2. Executar Cenário de Teste**

Execute navegações normais no app:
```
✅ Abrir app (Dashboard)
✅ Navegar para Transações
✅ Voltar para Dashboard
✅ Navegar para Transações novamente
✅ Criar nova transação
✅ Editar transação existente
✅ Criar cartão (se aplicável)
✅ Navegar entre telas múltiplas vezes
```

**Dica:** Use o app naturalmente por 5-15 minutos para resultados realistas.

---

### **3. Visualizar Logs em Tempo Real**

Durante o teste, você verá no console/terminal:
```
🔥 [REQUEST #1] TransactionRepository.getAllByUser
🔥 [REQUEST #2] CardRepository.getUserCards
🧭 [NAV] App → Dashboard
⏱️  [LOAD TIME] Dashboard: 1247ms
...
```

---

### **4. Gerar Relatório Completo**

Ao final do teste:
```javascript
// Gerar e exibir relatório formatado
global.metrics.printReport()
```

**Resultado:**
```
📊 ==========================================
📊 RELATÓRIO DE MÉTRICAS
📊 ==========================================

⏱️  Duração da Sessão: 52.3s
🔥 Total de Requisições Firebase: 18
💾 Acertos de Cache: 0
❌ Erros de Cache: 18
📈 Taxa de Acerto de Cache: 0%

⏱️  TEMPOS DE CARREGAMENTO:
   - Total de telas carregadas: 9
   - Tempo médio: 1047ms
   - Tempo mínimo: 623ms
   - Tempo máximo: 1340ms

📋 EVENTOS (últimos 10):
   1. [14:23:45] REQUEST: getAllTransactions
   2. [14:23:45] REQUEST: getUserCards
   3. [14:23:46] LOAD: Dashboard (1247ms)
   ...
```

---

### **5. Exportar JSON (Opcional)**

Para análise ou backup:
```javascript
global.metrics.exportJSON()
```

Copie o JSON exibido e salve em arquivo.

---

## 🎯 Cenários de Teste Recomendados

### **Teste Rápido (5 min):**
```
1. Dashboard → Transações (2x ida e volta)
2. Criar 1 transação
3. Editar 1 transação
4. Voltar pro Dashboard
```

### **Teste Completo (15 min):**
```
1. Todas navegações principais
2. Criar transação + anexo
3. Editar transação
4. Deletar anexo
5. Criar cartão
6. Editar cartão
7. Múltiplas navegações ida/volta
```

### **Teste de Stress (30 min):**
```
1. Uso contínuo do app
2. Todas as features
3. Navegação intensiva
4. Simular uso real prolongado
```

---

## 📊 Métricas Importantes

**Focar em:**
- ✅ Total de requisições Firebase
- ✅ Taxa de acerto de cache
- ✅ Requisições duplicadas (mesma operação múltiplas vezes)

**Menos importante (pode ignorar se bugado):**
- ⚠️ Tempos de carregamento (podem ter bugs de medição)

---

## 🔍 Análise dos Resultados

### **Requisições Duplicadas:**

Se ver algo como:
```
🔥 [REQUEST #1] getUserCards
🔥 [REQUEST #2] getUserCards
🔥 [REQUEST #3] getUserCards
```

**Isso é problema!** Mesma operação sendo chamada múltiplas vezes.

### **Taxa de Acerto de Cache:**

- **0%** = Sem cache (antes React Query)
- **60-70%** = Bom cache (meta com React Query)
- **80%+** = Excelente cache

### **Total de Requisições:**

Compare entre versões:
- **ANTES:** 20-30 requisições típicas
- **DEPOIS:** 5-10 requisições esperadas
- **Redução:** 60-80%

---

## 🐛 Resolução de Problemas

### **"global.metrics is undefined"**

Certifique-se que:
1. `src/utils/metrics.ts` foi criado
2. Tem `(global as any).metrics = metrics;` no final do arquivo
3. App foi recarregado após adicionar o código

### **"Logs não aparecem"**

Verifique:
1. Repositories estão instrumentados
2. `import { metrics } from '@/utils/metrics'` está no topo do arquivo
3. `metrics.logRequest('operação')` está sendo chamado

### **"Tempos de carregamento absurdos (horas/dias)"**

Isso é bug conhecido do timer. **Ignore tempos de carregamento, foque em requisições!**

### **Como acessar o console:**

**Opção 1 - Chrome DevTools:**
1. Sacudir celular (ou Ctrl+M no emulador Android / Cmd+D no iOS)
2. Selecionar "Open JS Debugger"
3. Abrir DevTools no Chrome (F12)
4. Ir na aba Console

**Opção 2 - Botão no App:**
```typescript
// Adicionar temporariamente em qualquer tela:
{__DEV__ && (
  <Button 
    title="📊 Ver Métricas" 
    onPress={() => (global as any).metrics.printReport()} 
  />
)}
```

**Opção 3 - Terminal Metro:**
Os logs já aparecem no terminal onde você rodou `expo start`

---

## 📝 Comandos Úteis
```javascript
// Resetar métricas
global.metrics.reset()

// Ver relatório completo
global.metrics.printReport()

// Exportar JSON
global.metrics.exportJSON()

// Ver objeto completo
global.metrics.getReport()
```

---

## 💡 Dicas

1. **Sempre resetar antes de novo teste** para dados limpos
2. **Usar app naturalmente** por alguns minutos (mais realista)
3. **Focar em requisições** (mais confiável que load times)
4. **Anotar números principais** para comparação
5. **Tirar screenshot** do relatório final

---