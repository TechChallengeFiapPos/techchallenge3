import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@hooks/useThemeColor';
import { ThemedText } from '@src/components/ThemedText';
import { ThemedView } from '@src/components/ThemedView';
import React from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

const { width: screenWidth } = Dimensions.get('window');

interface BaseListItemProps {
  title: string;
  subtitle: string;
  centerText?: string; // Data
  rightText: string;
  iconName: string;
  iconColor?: string;
  iconBackgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  centerTextColor?: string;
  rightTextColor?: string;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
}

const isTablet = screenWidth > 768;
const isLandscape = screenWidth > 600;

const dynamicStyles = {
  container: {
    paddingHorizontal: isTablet ? 24 : 16,
    paddingVertical: isTablet ? 12 : 8,
  },
  content: {
    minHeight: isTablet ? 80 : isLandscape ? 70 : 64,
  },
  iconContainer: {
    width: isTablet ? 56 : 48,
    height: isTablet ? 56 : 48,
    borderRadius: isTablet ? 28 : 24,
    marginRight: isTablet ? 16 : 12,
  },
  iconSize: isTablet ? 28 : 24,
  mainInfo: {
    flex: 1,
    paddingRight: 8,
  },
  centerSection: {
    minWidth: 60,
    paddingRight: 8,
    justifyContent: 'center' as const,
  },
  separator: {
    height: isTablet ? 50 : 40,
    marginHorizontal: isTablet ? 12 : 8,
  },
};

export const BaseTransactionListItem = React.memo<BaseListItemProps>(
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
    const backgroundColor = useThemeColor({}, 'surface');
    const defaultTitleColor = useThemeColor({}, 'onSurface');
    const defaultSubtitleColor = useThemeColor({}, 'onSurfaceVariant');
    const separatorColor = useThemeColor({}, 'outline');
    const primaryColor = useThemeColor({}, 'primary');
    const errorColor = useThemeColor({}, 'error');

    const getDefaultIconBackgroundColor = (): string => {
      if (iconBackgroundColor) return iconBackgroundColor;
      return primaryColor;
    };

    return (
      <Pressable onPress={onPress} disabled={!onPress}>
        <ThemedView style={[styles.container, dynamicStyles.container, { backgroundColor }]}>
          <View style={[styles.content, dynamicStyles.content]}>
            <View
              style={[
                styles.iconContainer,
                dynamicStyles.iconContainer,
                { backgroundColor: getDefaultIconBackgroundColor() },
              ]}
            >
              <Ionicons name={iconName as any} size={dynamicStyles.iconSize} color={iconColor} />
            </View>

            <View style={[styles.mainInfo, dynamicStyles.mainInfo]}>
              <ThemedText
                textType={isTablet ? 'titleMedium' : 'bodyLarge'}
                style={[styles.title, { color: titleColor || defaultTitleColor }]}
                numberOfLines={1}
              >
                {title}
              </ThemedText>
              <Text
                variant={isTablet ? 'bodyMedium' : 'bodyLarge'}
                style={[styles.subtitle, { color: subtitleColor || defaultSubtitleColor }]}
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            </View>

            {centerText && (
              <View style={[styles.centerSection, dynamicStyles.centerSection]}>
                <ThemedText
                  textType="bodySmall"
                  style={[styles.centerText, { color: centerTextColor || defaultSubtitleColor }]}
                  numberOfLines={1}
                >
                  {centerText}
                </ThemedText>
              </View>
            )}

            <View
              style={[styles.separator, dynamicStyles.separator, { backgroundColor: separatorColor }]}
            />

            {(onEdit || onDelete) && (
              <View style={styles.actionsContainer}>
                {onEdit && (
                  <IconButton
                    icon="pencil"
                    size={18}
                    onPress={onEdit}
                    iconColor={primaryColor}
                    style={styles.actionButton}
                  />
                )}
                {onDelete && (
                  <IconButton
                    icon="delete"
                    size={18}
                    onPress={onDelete}
                    iconColor={errorColor}
                    style={styles.actionButton}
                  />
                )}
              </View>
            )}
          </View>
        </ThemedView>
      </Pressable>
    );
  },
);

BaseTransactionListItem.displayName = 'ThemedList';

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainInfo: {
    justifyContent: 'center',
  },
  title: {
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontWeight: '600',
  },
  centerSection: {
    alignItems: 'flex-end',
  },
  centerText: {
    fontSize: 12,
  },
  separator: {
    width: 1,
    opacity: 0.3,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginLeft: 4,
  },
  actionButton: {
    margin: 0,
    width: 36,
    height: 36,
  },
});