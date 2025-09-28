import { useThemeColor } from '@hooks/useThemeColor';
import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Chip, Divider, Text, TextInput, useTheme } from 'react-native-paper';
import { SelectOption } from './SelectController';

interface ThemedSelectProps {
  label: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  options: SelectOption[];
  placeholder: string;
  multiple: boolean;
  lightColor?: string;
  darkColor?: string;
  mode?: 'outlined' | 'flat';
  error?: boolean;
}

export function ThemedSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  multiple,
  lightColor,
  darkColor,
  mode = 'outlined',
  error,
}: ThemedSelectProps) {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'surface');
  const textColor = useThemeColor({}, 'onSurface');
  const primaryColor = useThemeColor({}, 'primary');
  const borderColor = useThemeColor({}, 'outline');
  const labelColor = useThemeColor({}, 'onSurfaceVariant');
  const surfaceColor = useThemeColor({}, 'surface');

  const handleSingleSelect = (optionValue: string) => {
    onChange(optionValue);
    setVisible(false);
  };

  const handleMultipleSelect = (optionValue: string) => {
    const currentValues = Array.isArray(value) ? value : [];

    if (currentValues.includes(optionValue)) {
      onChange(currentValues.filter((v) => v !== optionValue));
    } else {
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

  const openModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  const renderOption = ({ item }: { item: SelectOption }) => (
    <TouchableOpacity
      style={[
        styles.optionItem,
        isSelected(item.value) && { backgroundColor: primaryColor + '20' },
      ]}
      onPress={() => handleSelect(item.value)}
    >
      <Text
        style={[
          styles.optionText,
          { color: textColor },
          isSelected(item.value) && { color: primaryColor, fontWeight: '600' },
        ]}
      >
        {item.label}
      </Text>
      {isSelected(item.value) && <Text style={[styles.checkMark, { color: primaryColor }]}>✓</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openModal} activeOpacity={0.7}>
        <TextInput
          label={label}
          error={error}
          value={getDisplayText()}
          editable={false}
          pointerEvents="none"
          right={<TextInput.Icon icon={visible ? 'chevron-up' : 'chevron-down'} />}
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

      {/* Modal com opções pois a listagem normal estava bugando */}
      <Modal visible={visible} transparent animationType="fade" onRequestClose={closeModal}>
        <Pressable style={styles.overlay} onPress={closeModal}>
          <View style={[styles.modalContent, { backgroundColor: surfaceColor }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textColor }]}>{label}</Text>
              {multiple && (
                <TouchableOpacity onPress={closeModal}>
                  <Text style={[styles.doneButton, { color: primaryColor }]}>Concluir</Text>
                </TouchableOpacity>
              )}
            </View>
            <Divider />
            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={(item) => item.value}
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </Pressable>
      </Modal>

      {/* Chips para seleção múltipla */}
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 350,
    maxHeight: '70%',
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  doneButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  checkMark: {
    fontSize: 18,
    fontWeight: 'bold',
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
});
