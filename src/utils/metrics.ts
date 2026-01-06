// src/utils/metrics.ts

type MetricEvent = {
  timestamp: number;
  type: 'request' | 'load' | 'navigation' | 'cache';
  operation: string;
  duration?: number;
  details?: any;
};

class MetricsCollector {
  private events: MetricEvent[] = [];
  private requestCount = 0;
  private cacheHits = 0;
  private cacheMisses = 0;
  private sessionStart = Date.now();

  // Firebase Requests
  logRequest(operation: string, details?: any) {
    this.requestCount++;
    this.cacheMisses++;
    
    const event: MetricEvent = {
      timestamp: Date.now(),
      type: 'request',
      operation,
      details,
    };
    
    this.events.push(event);
    
    console.log(
      `🔥 [REQUEST #${this.requestCount}] ${operation}`,
      details ? `- ${JSON.stringify(details)}` : ''
    );
  }

  // Cache Hit (para comparação depois)
  logCacheHit(operation: string) {
    this.cacheHits++;
    
    const event: MetricEvent = {
      timestamp: Date.now(),
      type: 'cache',
      operation,
    };
    
    this.events.push(event);
    console.log(`💾 [CACHE HIT] ${operation}`);
  }

  // Tempo de Loading
  logLoadTime(screen: string, timeMs: number) {
    const event: MetricEvent = {
      timestamp: Date.now(),
      type: 'load',
      operation: screen,
      duration: timeMs,
    };
    
    this.events.push(event);
    console.log(`⏱️  [LOAD TIME] ${screen}: ${timeMs}ms`);
  }

  // Navegação
  logNavigation(from: string, to: string) {
    const event: MetricEvent = {
      timestamp: Date.now(),
      type: 'navigation',
      operation: `${from} → ${to}`,
    };
    
    this.events.push(event);
    console.log(`🧭 [NAV] ${from} → ${to}`);
  }

  // Relatório Final
  getReport() {
    const sessionDuration = Date.now() - this.sessionStart;
    const loadEvents = this.events.filter((e) => e.type === 'load');
    const loadTimes = loadEvents.map((e) => e.duration || 0);

    const report = {
      sessionDuration: `${(sessionDuration / 1000).toFixed(1)}s`,
      totalRequests: this.requestCount,
      cacheHits: this.cacheHits,
      cacheMisses: this.cacheMisses,
      cacheHitRate: `${this.cacheHits > 0 ? ((this.cacheHits / (this.cacheHits + this.cacheMisses)) * 100).toFixed(1) : 0}%`,
      loadTimes: {
        count: loadTimes.length,
        avg: loadTimes.length > 0 ? `${(loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length).toFixed(0)}ms` : '0ms',
        min: loadTimes.length > 0 ? `${Math.min(...loadTimes)}ms` : '0ms',
        max: loadTimes.length > 0 ? `${Math.max(...loadTimes)}ms` : '0ms',
      },
      events: this.events,
    };

    return report;
  }

  // Imprimir Relatório
  printReport() {
    const report = this.getReport();
    
    console.log('\n\n📊 ==========================================');
    console.log('📊 RELATÓRIO DE MÉTRICAS - ANTES REACT QUERY');
    console.log('📊 ==========================================\n');
    
    console.log(`⏱️  Duração da Sessão: ${report.sessionDuration}`);
    console.log(`🔥 Total de Requests Firebase: ${report.totalRequests}`);
    console.log(`💾 Cache Hits: ${report.cacheHits}`);
    console.log(`❌ Cache Misses: ${report.cacheMisses}`);
    console.log(`📈 Taxa de Cache Hit: ${report.cacheHitRate}`);
    
    console.log('\n⏱️  TEMPOS DE CARREGAMENTO:');
    console.log(`   - Total de telas carregadas: ${report.loadTimes.count}`);
    console.log(`   - Tempo médio: ${report.loadTimes.avg}`);
    console.log(`   - Tempo mínimo: ${report.loadTimes.min}`);
    console.log(`   - Tempo máximo: ${report.loadTimes.max}`);
    
    console.log('\n📋 EVENTOS (últimos 10):');
    report.events.slice(-10).forEach((event, i) => {
      const time = new Date(event.timestamp).toLocaleTimeString();
      const duration = event.duration ? ` (${event.duration}ms)` : '';
      console.log(`   ${i + 1}. [${time}] ${event.type.toUpperCase()}: ${event.operation}${duration}`);
    });
    
    console.log('\n📊 ==========================================\n\n');
    
    return report;
  }

  // Reset para novo teste
  reset() {
    this.events = [];
    this.requestCount = 0;
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.sessionStart = Date.now();
    console.log('🔄 Métricas resetadas');
  }

  // Exportar JSON
  exportJSON() {
    const report = this.getReport();
    const json = JSON.stringify(report, null, 2);
    console.log('\n📄 JSON EXPORT:\n', json);
    return json;
  }
}

export const metrics = new MetricsCollector();

// Facilitar acesso global durante testes
if (__DEV__) {
  (global as any).metrics = metrics;
}