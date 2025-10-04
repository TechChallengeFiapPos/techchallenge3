// SelectController atualizado
import React from 'react';
import { Controller, ControllerProps, FieldPath, FieldValues } from 'react-hook-form';
import { ThemedSelect } from './ThemedSelect';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectControllerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, 'render'> {
  label: string;
  placeholder: string | undefined;
  options: SelectOption[];
  multiple: boolean;
  lightColor?: string;
  darkColor?: string;
  mode?: 'outlined' | 'flat';
}

export function SelectController<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  rules,
  label,
  placeholder = 'teste',
  options,
  multiple,
  lightColor,
  darkColor,
  mode = 'outlined',
  ...props
}: SelectControllerProps<TFieldValues, TName>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      {...props}
      render={({ field, fieldState }) => (
        <ThemedSelect
          label={label}
          value={field.value || (multiple ? [] : '')}
          onChange={field.onChange}
          options={options}
          placeholder={placeholder}
          multiple={multiple}
          error={!!fieldState.error}
          lightColor={lightColor}
          darkColor={darkColor}
          mode={mode}
        />
      )}
    />
  );
}
