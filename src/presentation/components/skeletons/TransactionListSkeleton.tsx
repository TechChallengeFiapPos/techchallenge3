import { useThemeColor } from '@hooks/useThemeColor';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Surface } from 'react-native-paper';

interface TransactionListSkeletonProps {
  count?: number;
}

export function TransactionListSkeleton({ count = 8 }: TransactionListSkeletonProps) {
  const surfaceColor = useThemeColor({}, 'surface');
  const shimmerColor = useThemeColor({}, 'onSurfaceVariant');

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200, // 200ms
      useNativeDriver: true,
    }).start();
    
    return () => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150, // 150ms 
        useNativeDriver: true,
      }).start();
    };
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {Array.from({ length: count }).map((_, index) => (
        <Surface key={index} style={[styles.item, { backgroundColor: surfaceColor }]}>
          {/* Icon circle */}
          <View style={[styles.icon, { backgroundColor: shimmerColor }]} />
          
          {/* Content */}
          <View style={styles.content}>
            <View style={[styles.title, { backgroundColor: shimmerColor }]} />
            <View style={[styles.subtitle, { backgroundColor: shimmerColor }]} />
          </View>
          
          {/* Value */}
          <View style={[styles.value, { backgroundColor: shimmerColor }]} />
        </Surface>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    elevation: 1,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  content: {
    flex: 1,
    gap: 8,
  },
  title: {
    height: 18,
    width: '70%',
    borderRadius: 4,
  },
  subtitle: {
    height: 14,
    width: '50%',
    borderRadius: 4,
  },
  value: {
    height: 24,
    width: 100,
    borderRadius: 4,
  },
});