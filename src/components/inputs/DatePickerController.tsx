import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { ThemedDateInput } from './ThemedDateInput';

interface DateControllerProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  rules?: object;
  defaultValue?: Date | null;
}

export function DateController<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  rules,
  defaultValue = null,
}: DateControllerProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue as any}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <ThemedDateInput label={label} value={value} onChange={onChange} error={!!error} />
      )}
    />
  );
}
