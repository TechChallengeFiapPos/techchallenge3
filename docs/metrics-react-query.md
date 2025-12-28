Métricas de Performance - ANTES do React Query:
- Total de requisições Firebase: 25
- Taxa de acerto de cache: 0%
- Duração da sessão: 16.6 minutos (uso real)

Problemas Críticos Identificados:
- getUserCards: 10 chamadas (40% do total - duplicação massiva)
- getByUser: 7 chamadas (28% - sem cache na navegação)
- getAllByUser: 5 chamadas (20% - Dashboard refaz fetch toda vez)
- Zero cache = todas navegações causam novas requisições

Detalhamento:
1. getUserCards: 10x (formulários carregam cards toda vez)
2. TransactionRepository.getByUser: 7x (navegação na lista)
3. TransactionRepository.getAllByUser: 5x (dashboard)
4. Mutations: 4x (criar/atualizar transações + cartões)
5. Storage: 2x (upload/delete anexos)


````
 LOG  📊 RELATÓRIO DE MÉTRICAS - ANTES REACT QUERY
 LOG   ==========================================
 LOG  ⏱️  Duração da Sessão: 1188.2s
 LOG  🔥 Total de Requests Firebase: 25
 LOG  💾 Cache Hits: 0
 LOG  ❌ Cache Misses: 25
 LOG  📈 Taxa de Cache Hit: 0%
 LOG  
⏱️  TEMPOS DE CARREGAMENTO:
 LOG     - Total de telas carregadas: 5
 LOG     - Tempo médio: 778804ms
 LOG     - Tempo mínimo: 187317ms
 LOG     - Tempo máximo: 1182126ms
 LOG  
📋 EVENTOS (últimos 10):
 LOG     1. [1:44:23 PM] LOAD: Dashboard (671226ms)
 LOG     2. [1:44:23 PM] NAVIGATION: App → Dashboard
 LOG     3. [1:44:23 PM] NAVIGATION: App → Dashboard
 LOG     4. [1:44:30 PM] NAVIGATION: App → Dashboard
 LOG     5. [1:47:37 PM] LOAD: Dashboard (1182126ms)
 LOG     6. [1:47:37 PM] LOAD: Dashboard (865157ms)
 LOG     7. [1:47:37 PM] LOAD: Dashboard (187317ms)
 LOG     8. [1:47:37 PM] NAVIGATION: App → Dashboard
 LOG     9. [1:47:37 PM] NAVIGATION: App → Dashboard
 LOG     10. [1:47:37 PM] NAVIGATION: App → Dashboard
 ```