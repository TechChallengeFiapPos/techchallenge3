import { useThemeColor } from '@hooks/useThemeColor';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Surface } from 'react-native-paper';

export function DashboardSkeleton() {
  const surfaceColor = useThemeColor({}, 'surface');
  const shimmerColor = useThemeColor({}, 'onSurfaceVariant');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    
    return () => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    };
  }, [fadeAnim]);

  return (
    <View style={styles.wrapper}>
      <Animated.View style={{ opacity: fadeAnim }}>
        {/* card */}
        <Surface style={[styles.mainCard, { backgroundColor: surfaceColor }]}>
          <View style={styles.balanceSection}>
            <View style={[styles.label, { backgroundColor: shimmerColor }]} />
            <View style={[styles.balance, { backgroundColor: shimmerColor }]} />
          </View>
          
          <View style={[styles.separator, { backgroundColor: shimmerColor }]} />
          
          <View style={styles.expenseSection}>
            <View style={[styles.label, { backgroundColor: shimmerColor }]} />
            <View style={[styles.expense, { backgroundColor: shimmerColor }]} />
          </View>
        </Surface>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {/* Income */}
          <Surface style={[styles.statCard, { backgroundColor: surfaceColor }]}>
            <View style={[styles.statIcon, { backgroundColor: shimmerColor }]} />
            <View style={styles.statInfo}>
              <View style={[styles.statLabel, { backgroundColor: shimmerColor }]} />
              <View style={[styles.statValue, { backgroundColor: shimmerColor }]} />
            </View>
          </Surface>

          {/* Expense */}
          <Surface style={[styles.statCard, { backgroundColor: surfaceColor }]}>
            <View style={[styles.statIcon, { backgroundColor: shimmerColor }]} />
            <View style={styles.statInfo}>
              <View style={[styles.statLabel, { backgroundColor: shimmerColor }]} />
              <View style={[styles.statValue, { backgroundColor: shimmerColor }]} />
            </View>
          </Surface>

          {/* Progress bar */}
          <View style={[styles.progressBar, { backgroundColor: shimmerColor }]} />
          
          {/* Status */}
          <View style={[styles.status, { backgroundColor: shimmerColor }]} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1, // !flex para ocupar espaço
  },
  mainCard: {
    borderRadius: 20,
    padding: 20,
    margin: 16,
    gap: 16,
    elevation: 2,
  },
  balanceSection: {
    gap: 12,
  },
  label: {
    height: 14,
    width: '30%',
    borderRadius: 4,
  },
  balance: {
    height: 40,
    width: '60%',
    borderRadius: 4,
  },
  separator: {
    height: 1,
    width: '100%',
  },
  expenseSection: {
    gap: 12,
  },
  expense: {
    height: 32,
    width: '50%',
    borderRadius: 4,
  },
  statsContainer: {
    gap: 12,
    paddingHorizontal: 16,
  },
  statCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    gap: 16,
    elevation: 1,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  statInfo: {
    flex: 1,
    gap: 8,
  },
  statLabel: {
    height: 12,
    width: '40%',
    borderRadius: 4,
  },
  statValue: {
    height: 24,
    width: '60%',
    borderRadius: 4,
  },
  progressBar: {
    height: 8,
    width: '100%',
    borderRadius: 4,
    marginTop: 4,
  },
  status: {
    height: 14,
    width: '70%',
    borderRadius: 4,
  },
});