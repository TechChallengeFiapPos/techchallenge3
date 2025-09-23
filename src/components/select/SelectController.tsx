import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { ThemedSelect } from './ThemedSelect';

export type SelectOption = {
  label: string;
  value: string;
};

interface SelectControllerProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  multiple?: boolean;
  rules?: object;
}

export function SelectController<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = 'Selecione...',
  multiple = false,
  rules,
}: SelectControllerProps<TFieldValues>) {
  return (
    <Controller
      rules={rules}
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <ThemedSelect
          label={label}
          value={value}
          onChange={onChange}
          options={options}
          placeholder={placeholder}
          multiple={multiple}
          error={!!error}
          errorMessage={error?.message}
        />
      )}
    />
  );
}
