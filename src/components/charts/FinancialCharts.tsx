import { useThemeColor } from '@hooks/useThemeColor';
import { Transaction } from '@src/models/transactions';
import { getCategoryLabel } from '@src/utils/transactions';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryLegend,
  VictoryLine,
  VictoryPie,
} from 'victory-native';

const screenWidth = Dimensions.get('window').width;

interface FinancialChartsProps {
  transactions: Transaction[];
}

function AnimatedSection({ delay = 0, children }: { delay?: number; children: React.ReactNode }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, delay]);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
      {children}
    </Animated.View>
  );
}

export function FinancialCharts({ transactions }: FinancialChartsProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const tertiaryColor = useThemeColor({}, 'onSurfaceVariant');
  const surfaceColor = useThemeColor({}, 'surface');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const errorColor = useThemeColor({}, 'error');

  const getCategoryColor = (categoryId: string): string => {
  const colorMap: Record<string, string> = {
    food: primaryColor,
    transport: secondaryColor,
    health: '#53e3ebff',
    education: errorColor,
    entertainment: '#9C27B0', 
    shopping: '#FF9800', 
    bills: '#795548', 
    salary: primaryColor,
    freelance: secondaryColor,
    investment: '#4CAF50', 
    other: '#607D8B', 
  };
  return colorMap[categoryId] || primaryColor;
};

  const formatValue = (value: number) =>
    `R$ ${value.toFixed(2).replace('.', ',')}`;

const expensesByCategory = useMemo(() => {
  const expenses = transactions.filter((t) => t.type === 'expense');
  const categoryMap: Record<string, number> = {};

  expenses.forEach((t) => {
    const category = t.categoryId || 'other';
    categoryMap[category] = (categoryMap[category] || 0) + t.value;
  });

  const result = Object.entries(categoryMap)
    .map(([category, value]) => ({
      name: getCategoryLabel(category),
      value: value / 100,
      color: getCategoryColor(category), // USA A COR FIXA DA CATEGORIA!
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return result;
}, [transactions]);

  // 2. Evolução últimos 6 meses
  const monthlyTrend = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return {
        label: date.toLocaleDateString('pt-BR', { month: 'short' }),
        year: date.getFullYear(),
        monthIndex: date.getMonth(),
      };
    });

    const incomeData = last6Months.map(({ year, monthIndex }) => {
      const value = transactions
        .filter(
          (t) =>
            t.type === 'income' &&
            new Date(t.date).getFullYear() === year &&
            new Date(t.date).getMonth() === monthIndex
        )
        .reduce((sum, t) => sum + t.value, 0) / 100;
      return value;
    });

    const expenseData = last6Months.map(({ year, monthIndex }) => {
      const value = transactions
        .filter(
          (t) =>
            t.type === 'expense' &&
            new Date(t.date).getFullYear() === year &&
            new Date(t.date).getMonth() === monthIndex
        )
        .reduce((sum, t) => sum + t.value, 0) / 100;
      return value;
    });

    return {
      labels: last6Months.map((m) => m.label),
      incomeData,
      expenseData,
    };
  }, [transactions]);

  // 3. Comparativo Mensal
  const monthlyComparison = useMemo(() => {
    const current = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(current.getMonth() - 1);

    const sumByMonth = (month: Date, type: 'income' | 'expense') => {
      const value = transactions
        .filter(
          (t) =>
            t.type === type &&
            new Date(t.date).getFullYear() === month.getFullYear() &&
            new Date(t.date).getMonth() === month.getMonth()
        )
        .reduce((sum, t) => sum + t.value, 0) / 100;
      return value;
    };

    const result = [
      {
        month: 'Mês Passado',
        income: sumByMonth(lastMonth, 'income'),
        expense: sumByMonth(lastMonth, 'expense')
      },
      {
        month: 'Mês Atual',
        income: sumByMonth(current, 'income'),
        expense: sumByMonth(current, 'expense')
      },
    ];

    return result;
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <Card style={[styles.card, { backgroundColor: surfaceColor }]}>
        <Card.Content style={styles.emptyContent}>
          <Text variant="bodyLarge" style={{ color: onSurfaceColor, textAlign: 'center' }}>
            Adicione transações para visualizar os gráficos
          </Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      {expensesByCategory.length > 0 && (
        <AnimatedSection delay={100}>
          <Card style={[styles.card, { backgroundColor: surfaceColor }]}>
            <Card.Content>
              <Text variant="titleLarge" style={[styles.chartTitle, { color: onSurfaceColor }]}>
                Despesas por Categoria
              </Text>
              <VictoryPie
                animate={{ duration: 800, easing: 'bounce' }}
                data={expensesByCategory}
                x="name"
                y="value"
                colorScale={expensesByCategory.map((d) => d.color)}
                labels={() => ''}
                innerRadius={50}
                labelRadius={70}
                width={screenWidth * 0.85}
              />

              <View style={{ marginTop: 16 }}>
                {expensesByCategory.map((d) => (
                  <View
                    key={d.name}
                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
                  >
                    <View
                      style={{
                        width: 16,
                        height: 16,
                        backgroundColor: d.color,
                        borderRadius: 8,
                        marginRight: 8,
                      }}
                    />
                    <Text style={{ color: onSurfaceColor }}>
                      {d.name}: {formatValue(d.value)}
                    </Text>
                  </View>
                ))}
              </View>
            </Card.Content>
          </Card>
        </AnimatedSection>
      )}

      <AnimatedSection delay={300}>
        <Card style={[styles.card, { backgroundColor: surfaceColor }]}>
          <Card.Content>
            <Text variant="titleLarge" style={[styles.chartTitle, { color: onSurfaceColor }]}>
              Evolução (Últimos 6 Meses)
            </Text>
            <View style={{ width: screenWidth * 0.85, alignSelf: 'center' }}>
              <VictoryChart domainPadding={20} padding={{ left: 70, right: 45, top: 40, bottom: 40 }} width={screenWidth * 0.85}>
                <VictoryAxis
                  tickValues={monthlyTrend.labels}
                  style={{ tickLabels: { fill: onSurfaceColor }, axis: { stroke: onSurfaceColor } }}
                />
                <VictoryAxis
                  dependentAxis
                  tickFormat={(x) => {
                    if (x >= 1000000) return `R$ ${(x / 1000000).toFixed(1)}M`;
                    if (x >= 1000) return `R$ ${(x / 1000).toFixed(0)}k`;
                    return `R$ ${x}`;
                  }}
                  style={{ tickLabels: { fill: onSurfaceColor }, axis: { stroke: onSurfaceColor } }}
                />
                <VictoryLine
                  data={monthlyTrend.incomeData.map((v, i) => ({ x: monthlyTrend.labels[i], y: v }))}
                  style={{ data: { stroke: primaryColor, strokeWidth: 2 } }}
                />
                <VictoryLine
                  data={monthlyTrend.expenseData.map((v, i) => ({ x: monthlyTrend.labels[i], y: v }))}
                  style={{ data: { stroke: errorColor, strokeWidth: 2 } }}
                />
                <VictoryLegend
                  x={50}
                  y={0}
                  orientation="horizontal"
                  gutter={20}
                  style={{ labels: { fill: onSurfaceColor } }}
                  data={[
                    { name: 'Receitas', symbol: { fill: primaryColor } },
                    { name: 'Despesas', symbol: { fill: errorColor } },
                  ]}
                />
              </VictoryChart>
            </View>
          </Card.Content>
        </Card>
      </AnimatedSection>

      <AnimatedSection delay={500}>
        <Card style={[styles.card, { backgroundColor: surfaceColor }]}>
          <Card.Content>
            <Text variant="titleLarge" style={[styles.chartTitle, { color: onSurfaceColor }]}>
              Comparativo Mensal
            </Text>
            <View style={{ width: screenWidth * 0.85, alignSelf: 'center' }}>
              <VictoryChart domainPadding={20} padding={{ left: 70, right: 30, top: 40, bottom: 40 }} width={screenWidth * 0.85}>
                <VictoryAxis
                  tickValues={monthlyComparison.map((m) => m.month)}
                  style={{
                    tickLabels: { fill: onSurfaceColor },
                    axis: { stroke: onSurfaceColor },
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  tickFormat={(x) => {
                    if (x >= 1000000) return `R$ ${(x / 1000000).toFixed(1)}M`;
                    if (x >= 1000) return `R$ ${(x / 1000).toFixed(0)}k`;
                    return `R$ ${x}`;
                  }}
                  style={{
                    tickLabels: { fill: onSurfaceColor },
                    axis: { stroke: onSurfaceColor },
                  }}
                />

                <VictoryGroup offset={20} colorScale={[primaryColor, errorColor]}>
                  <VictoryBar
                    animate={{ duration: 800, easing: 'quadInOut' }}
                    data={monthlyComparison.map((m) => ({ x: m.month, y: m.income }))}
                    barWidth={16}
                  />
                  <VictoryBar
                    animate={{ duration: 800, easing: 'quadInOut' }}
                    data={monthlyComparison.map((m) => ({ x: m.month, y: m.expense }))}
                    barWidth={16}
                  />
                </VictoryGroup>

                <VictoryLegend
                  x={80}
                  y={0}
                  orientation="horizontal"
                  gutter={40}
                  style={{ labels: { fill: onSurfaceColor } }}
                  data={[
                    { name: 'Receitas', symbol: { fill: primaryColor } },
                    { name: 'Despesas', symbol: { fill: errorColor } },
                  ]}
                />
              </VictoryChart>
            </View>
          </Card.Content>
        </Card>
      </AnimatedSection>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16, marginLeft: 16, marginRight: 16 },
  card: { borderRadius: 16, elevation: 2, alignSelf: 'center' },
  chartTitle: { fontWeight: 'bold', marginBottom: 16, alignSelf: 'center' },
  emptyContent: { paddingVertical: 40 },
});