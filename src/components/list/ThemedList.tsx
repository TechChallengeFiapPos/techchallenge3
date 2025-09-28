// src/components/ui/BaseListItem.tsx
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@hooks/useThemeColor';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

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

  // Cores customizáveis (opcional - usa tema se não fornecido)
  titleColor?: string;
  subtitleColor?: string;
  rightTextColor?: string;
  centerTextColor?: string;

  // Comportamento
  onPress?: () => void;
  disabled?: boolean;
}

// Responsividade baseada na largura da tela
const isTablet = screenWidth > 768;
const isLandscape = screenWidth > 600;

// Estilos dinâmicos baseados no tamanho da tela
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
  centerSection: {
    flex: isLandscape ? 1.5 : 1,
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
  }) => {
    // Usar cores do tema
    const backgroundColor = useThemeColor({}, 'surface');
    const defaultTitleColor = useThemeColor({}, 'onSurface');
    const defaultSubtitleColor = useThemeColor({}, 'onSurfaceVariant');
    const defaultRightColor = useThemeColor({}, 'onSurface');
    const separatorColor = useThemeColor({}, 'outline');
    const primaryColor = useThemeColor({}, 'primary');

    // Cor padrão do ícone se não fornecida
    const getDefaultIconBackgroundColor = (): string => {
      if (iconBackgroundColor) return iconBackgroundColor;
      return primaryColor; // Usar cor primária do tema
    };

    return (
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
          </View>
        </View>
      </View>
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
  mainInfo: {
    // Flex dinâmico aplicado via dynamicStyles
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    // Cor dinâmica aplicada via tema
  },
  separator: {
    width: 1,
    opacity: 0.3,
  },
  centerSection: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  centerText: {
    textAlign: 'center',
  },
  rightSection: {
    alignItems: 'flex-end',
    paddingLeft: 8,
  },
  rightText: {
    fontWeight: 'bold',
  },
});
