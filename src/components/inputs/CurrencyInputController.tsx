import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { ThemedInput } from './ThemedInput';

interface CurrencyInputControllerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  rules?: any;
  disabled?: boolean;
  error?: boolean;
}

const formatCurrency = (centavos: number): string => {
  if (!centavos || centavos === 0) return '';

  const reais = centavos / 100;
  return reais.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export function CurrencyInputController<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = '0,00',
  rules,
  disabled = false,
  error = false,
}: CurrencyInputControllerProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error: fieldError } }) => {
        const displayValue = value && value > 0 ? formatCurrency(value) : '';

        const handleChange = (text: string) => {
          const numbers = text.replace(/\D/g, '');

          if (!numbers) {
            onChange(0);
            return;
          }
          const centavos = parseInt(numbers);
          onChange(centavos);
        };

        return (
          <ThemedInput
            label={label}
            value={displayValue}
            onChange={handleChange}
            placeholder={placeholder}
            keyboardType="numeric"
            disabled={disabled}
            error={error || !!fieldError}
          />
        );
      }}
    />
  );
}
