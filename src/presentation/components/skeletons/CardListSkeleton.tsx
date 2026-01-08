import { useThemeColor } from '@hooks/useThemeColor';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Surface } from 'react-native-paper';

interface CardListSkeletonProps {
  count?: number;
}

export function CardListSkeleton({ count = 3 }: CardListSkeletonProps) {
  const surfaceColor = useThemeColor({}, 'surface');
  const shimmerColor = useThemeColor({}, 'onSurfaceVariant');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fadein
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    
    // Fadeout
    return () => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    };
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {Array.from({ length: count }).map((_, index) => (
        <Surface key={index} style={[styles.card, { backgroundColor: surfaceColor }]}>
          {/* header */}
          <View style={styles.header}>
            <View style={[styles.cardName, { backgroundColor: shimmerColor }]} />
            <View style={[styles.cardIcon, { backgroundColor: shimmerColor }]} />
          </View>
          
          {/* number */}
          <View style={[styles.cardNumber, { backgroundColor: shimmerColor }]} />
          
          {/* footer */}
          <View style={styles.footer}>
            <View style={[styles.cardType, { backgroundColor: shimmerColor }]} />
            <View style={[styles.cardLimit, { backgroundColor: shimmerColor }]} />
          </View>
        </Surface>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    gap: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardName: {
    height: 20,
    width: '50%',
    borderRadius: 4,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  cardNumber: {
    height: 16,
    width: '60%',
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardType: {
    height: 14,
    width: '30%',
    borderRadius: 4,
  },
  cardLimit: {
    height: 14,
    width: '35%',
    borderRadius: 4,
  },
});