import { Colors } from '@constants/Colors';
import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

interface ThemedCardProps {
  children?: ReactNode;
  align?: 'center' | 'left' | 'right';
  style?: ViewStyle;
  colorName?: keyof typeof Colors.light;
}

export const ThemedCard: React.FC<ThemedCardProps> = ({
  children,
  align = 'center',
  style,
  colorName,
}) => {
  const theme = useTheme();

  const alignment: ViewStyle['alignItems'] =
    align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';

  return (
    <Card
      style={[
        styles.card,
        {
          borderRadius: theme.roundness * 20,
          backgroundColor: colorName ? Colors.light[colorName] : theme.colors.surface,
        },
        style,
      ]}
      elevation={2}
    >
      <View style={{ alignItems: alignment, alignContent: alignment }}>{children}</View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
  },
});
