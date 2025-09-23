import { useThemeColor } from '@hooks/useThemeColor';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Chip, Menu, TextInput, useTheme } from 'react-native-paper';
import { ThemedText } from '../ThemedText';
import { SelectOption } from './SelectController';

interface ThemedSelectProps {
  label: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  options: SelectOption[];
  placeholder: string;
  multiple: boolean;
  error: boolean;
  errorMessage?: string;
  lightColor?: string;
  darkColor?: string;
  mode?: 'outlined' | 'flat';
}

export function ThemedSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  multiple,
  error,
  errorMessage,
  lightColor,
  darkColor,
  mode = 'outlined',
}: ThemedSelectProps) {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();

  // Cores baseadas no tema (igual ao ThemedInput)
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'surface');
  const textColor = useThemeColor({}, 'onSurface');
  const primaryColor = useThemeColor({}, 'primary');
  const borderColor = useThemeColor({}, 'outline');
  const labelColor = useThemeColor({}, 'onSurfaceVariant');
  const surfaceColor = useThemeColor({}, 'surface');

  // ===== HANDLERS SIMPLIFICADOS =====
  const handleSingleSelect = (optionValue: string) => {
    onChange(optionValue);
    setVisible(false);
  };

  const handleMultipleSelect = (optionValue: string) => {
    const currentValues = Array.isArray(value) ? value : [];

    if (currentValues.includes(optionValue)) {
      // Remove se já selecionado
      onChange(currentValues.filter((v) => v !== optionValue));
    } else {
      // Adiciona se não selecionado
      onChange([...currentValues, optionValue]);
    }
  };

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      handleMultipleSelect(optionValue);
    } else {
      handleSingleSelect(optionValue);
    }
  };

  // ===== HELPERS SIMPLIFICADOS =====
  const isSelected = (optionValue: string): boolean => {
    if (multiple) {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return value === optionValue;
  };

  const getDisplayText = (): string => {
    if (multiple && Array.isArray(value)) {
      return value.length > 0 ? `${value.length} selecionado(s)` : placeholder;
    }

    const selectedOption = options.find((opt) => opt.value === value);
    return selectedOption?.label || placeholder;
  };

  const getSelectedOptions = () => {
    if (!multiple || !Array.isArray(value)) return [];
    return options.filter((opt) => value.includes(opt.value));
  };

  const removeChip = (valueToRemove: string) => {
    if (Array.isArray(value)) {
      onChange(value.filter((v) => v !== valueToRemove));
    }
  };

  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <TouchableOpacity onPress={() => setVisible(true)}>
            <TextInput
              label={label}
              value={getDisplayText()}
              editable={false}
              right={<TextInput.Icon icon={visible ? 'chevron-up' : 'chevron-down'} />}
              error={error}
              mode={mode}
              underlineColor={borderColor}
              activeUnderlineColor={primaryColor}
              activeOutlineColor={primaryColor}
              outlineColor={borderColor}
              textColor={textColor}
              style={[
                styles.input,
                {
                  backgroundColor,
                },
              ]}
              theme={{
                roundness: 50,
                colors: {
                  ...theme.colors,
                  background: backgroundColor,
                  onSurfaceVariant: labelColor,
                },
              }}
              outlineStyle={{ borderRadius: 999 }}
            />
          </TouchableOpacity>
        }
        contentStyle={[styles.menuContent, { backgroundColor: surfaceColor }]}
      >
        {options.map((option) => (
          <Menu.Item
            key={option.value}
            title={option.label}
            onPress={() => handleSelect(option.value)}
            leadingIcon={isSelected(option.value) ? 'check' : undefined}
            style={[styles.menuItem, isSelected(option.value) && styles.selectedMenuItem]}
          />
        ))}
      </Menu>

      {/* Chips para múltipla seleção */}
      {multiple && getSelectedOptions().length > 0 && (
        <View style={styles.chipsContainer}>
          {getSelectedOptions().map((option) => (
            <Chip
              key={option.value}
              mode="outlined"
              onClose={() => removeChip(option.value)}
              style={styles.chip}
            >
              {option.label}
            </Chip>
          ))}
        </View>
      )}

      {/* Mensagem de erro */}
      {error && errorMessage && <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  input: {
    marginVertical: 8,
    borderRadius: 999,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
  menuContent: {
    maxHeight: 200,
    borderRadius: 12,
  },
  menuItem: {
    paddingVertical: 8,
  },
  selectedMenuItem: {
    backgroundColor: '#f0f8ff',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 4,
  },
  chip: {
    marginRight: 4,
    marginBottom: 4,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 4,
  },
});
