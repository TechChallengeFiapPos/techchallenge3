// src/components/ui/BaseListItem.tsx - Versão corrigida

import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@hooks/useThemeColor';
import React from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

const { width: screenWidth } = Dimensions.get('window');

interface BaseListItemProps {
  // Dados principais
  title: string;
  subtitle: string;
  rightText: string;

  // Configuração do ícone
  iconName: string;
  iconColor?: string;
  iconBackgroundColor?: string;

  // Cores customizáveis
  titleColor?: string;
  subtitleColor?: string;
  rightTextColor?: string;

  // Ações (ADICIONE)
  onEdit?: () => void;
  onDelete?: () => void;
  onPress?: () => void;

  // Comportamento
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
    marginRight: isTablet ? 20 : 16,
  },
  iconSize: isTablet ? 28 : 24,
  mainInfo: {
    flex: isLandscape ? 3 : 2,
    paddingRight: isTablet ? 20 : 16,
  },
  separator: {
    height: isTablet ? 50 : 40,
    marginHorizontal: isTablet ? 20 : 16,
  },
  rightSection: {
    flex: isLandscape ? 1.5 : 1.2,
  },
};

export const ThemedList = React.memo<BaseListItemProps>(
  ({
    title,
    subtitle,
    rightText,
    iconName,
    iconColor = 'white',
    iconBackgroundColor,
    titleColor,
    subtitleColor,
    rightTextColor,
    onEdit, // ADICIONE
    onDelete, // ADICIONE
  }) => {
    const backgroundColor = useThemeColor({}, 'surface');
    const defaultTitleColor = useThemeColor({}, 'onSurface');
    const defaultSubtitleColor = useThemeColor({}, 'onSurfaceVariant');
    const defaultRightColor = useThemeColor({}, 'onSurface');
    const separatorColor = useThemeColor({}, 'outline');
    const primaryColor = useThemeColor({}, 'primary');
    const errorColor = useThemeColor({}, 'error');

    const getDefaultIconBackgroundColor = (): string => {
      if (iconBackgroundColor) return iconBackgroundColor;
      return primaryColor;
    };

    return (
      <Pressable>
        <View style={[styles.container, dynamicStyles.container, { backgroundColor }]}>
          <View style={[styles.content, dynamicStyles.content]}>
            {/* Ícone */}
            <View
              style={[
                styles.iconContainer,
                dynamicStyles.iconContainer,
                { backgroundColor: getDefaultIconBackgroundColor() },
              ]}
            >
              <Ionicons name={iconName as any} size={dynamicStyles.iconSize} color={iconColor} />
            </View>

            {/* Informações principais */}
            <View style={[styles.mainInfo, dynamicStyles.mainInfo]}>
              <Text
                variant={isTablet ? 'titleMedium' : 'bodyLarge'}
                style={[styles.title, { color: titleColor || defaultTitleColor }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {title}
              </Text>
              <Text
                variant={isTablet ? 'bodyMedium' : 'bodySmall'}
                style={[styles.subtitle, { color: subtitleColor || defaultSubtitleColor }]}
              >
                {subtitle}
              </Text>
            </View>

            {/* Separador */}
            <View
              style={[styles.separator, dynamicStyles.separator, { backgroundColor: separatorColor }]}
            />

            {/* Seção direita */}
            <View style={[styles.rightSection, dynamicStyles.rightSection]}>
              <Text
                variant={isTablet ? 'titleMedium' : 'bodyLarge'}
                style={[styles.rightText, { color: rightTextColor || defaultRightColor }]}
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                minimumFontScale={0.8}
              >
                {rightText}
              </Text>

              {/* BOTÕES DE AÇÃO - CRÍTICO */}
              {(onEdit || onDelete) && (
                <View style={styles.actions}>
                  {onEdit && (
                    <IconButton icon="pencil" size={20} onPress={onEdit} iconColor={primaryColor} />
                  )}
                  {onDelete && (
                    <IconButton icon="delete" size={20} onPress={onDelete} iconColor={errorColor} />
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    );
  },
);

ThemedList.displayName = 'ThemedList';

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
  mainInfo: {},
  title: {
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {},
  separator: {
    width: 1,
    opacity: 0.3,
  },
  rightSection: {
    alignItems: 'flex-end',
    paddingLeft: 8,
  },
  rightText: {
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    marginTop: -8,
  },
});