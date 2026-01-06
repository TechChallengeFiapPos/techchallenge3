import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@hooks/useThemeColor';
import { ThemedText } from '@src/presentation/components/ThemedText';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

interface BaseListItemProps {
  title: string;
  subtitle: string;
  centerText?: string;
  rightText?: string;
  iconName: string;
  iconColor?: string;
  iconBackgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  centerTextColor?: string;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
}

export const ThemedListItem = React.memo<BaseListItemProps>(
  ({
    title,
    subtitle,
    centerText,
    iconName,
    iconColor = 'white',
    iconBackgroundColor,
    titleColor,
    subtitleColor,
    centerTextColor,
    onPress,
    onEdit,
    onDelete,
  }) => {
    const defaultTitleColor = useThemeColor({}, 'onSurface');
    const defaultSubtitleColor = useThemeColor({}, 'onSurfaceVariant');
    const separatorColor = useThemeColor({}, 'outline');
    const primaryColor = useThemeColor({}, 'primary');
    const errorColor = useThemeColor({}, 'error');

    const getDefaultIconBackgroundColor = (): string => {
      return iconBackgroundColor || primaryColor;
    };

    return (
      <Pressable onPress={onPress} disabled={!onPress}>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={[styles.iconContainer, { backgroundColor: getDefaultIconBackgroundColor() }]}>
              <Ionicons name={iconName as any} size={24} color={iconColor} />
            </View>

            <View style={styles.mainInfo}>
              <ThemedText textType="bodyLarge" style={{ color: titleColor || defaultTitleColor }} numberOfLines={1}>
                {title}
              </ThemedText>
              <Text variant="bodySmall" style={{ color: subtitleColor || defaultSubtitleColor }} numberOfLines={2}>
                {subtitle}
              </Text>
            </View>

            {centerText && (
              <View style={styles.centerSection}>
                <ThemedText textType="bodySmall" style={{ color: centerTextColor || defaultSubtitleColor }} numberOfLines={1}>
                  {centerText}
                </ThemedText>
              </View>
            )}

            <View style={[styles.separator, { backgroundColor: separatorColor }]} />

            {(onEdit || onDelete) && (
              <View style={styles.actionsContainer}>
                {onEdit && <IconButton icon="pencil" size={18} onPress={onEdit} iconColor={primaryColor} style={styles.actionButton} />}
                {onDelete && <IconButton icon="delete" size={18} onPress={onDelete} iconColor={errorColor} style={styles.actionButton} />}
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  }
);

ThemedListItem.displayName = 'ThemedList';

const styles = StyleSheet.create({
  container: { marginVertical: 4, paddingHorizontal: 16, paddingVertical: 12 },
  content: { flexDirection: 'row', alignItems: 'center', minHeight: 70 },
  iconContainer: { width: 48, height: 48, borderRadius: 24, marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  mainInfo: { flex: 1, justifyContent: 'center', paddingRight: 8 },
  centerSection: { minWidth: 60, paddingRight: 8, justifyContent: 'center', alignItems: 'flex-end' },
  separator: { width: 1, opacity: 0.3, height: 40, marginHorizontal: 8 },
  actionsContainer: { flexDirection: 'row', marginLeft: 4 },
  actionButton: { margin: 0, width: 36, height: 36 },
});
