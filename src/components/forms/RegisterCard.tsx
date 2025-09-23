import { CardFormData, CardFormField, CardFormProps, SelectOption } from '@src/models/card';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { InputController } from '../input';
import { SelectController } from '../select/SelectController';
import { ThemedButton } from '../ThemedButton';
import { ThemedText } from '../ThemedText';

const functionOptions: SelectOption[] = [
  { label: 'Crédito', value: 'credit' },
  { label: 'Débito', value: 'debit' },
];

const categoryOptions: SelectOption[] = [
  { label: 'Platinum', value: 'platinum' },
  { label: 'Gold', value: 'gold' },
  { label: 'Black', value: 'black' },
];

const cardFields: CardFormField[] = [
  {
    name: 'number',
    label: 'Número',
    placeholder: 'Número do cartão',
    required: true,
    type: 'text',
    keyboardType: 'number-pad',
    autoComplete: 'cc-number',
  },
  {
    name: 'expiryDate',
    label: 'Validade',
    placeholder: 'MM/AA',
    required: true,
    type: 'text',
    keyboardType: 'number-pad',
    maxLength: 5,
    autoComplete: 'cc-exp',
  },
  {
    name: 'category',
    label: 'Categoria',
    placeholder: 'ategoria do cartão',
    required: true,
    type: 'select',
    options: categoryOptions,
  },
  {
    name: 'function',
    label: 'Função',
    placeholder: 'Função do cartão',
    required: true,
    type: 'multiselect',
    options: functionOptions,
  },
];

export function CardRegisterForm({ onSubmit, disabled, errors, initialData }: CardFormProps) {
  const { control, handleSubmit } = useForm<CardFormData>({
    mode: 'onBlur',
    defaultValues: {
      number: '',
      category: '',
      function: [],
      ...initialData,
    },
  });

  const renderField = (field: CardFormField) => {
    const defaultProps = {
      control,
      name: field.name,
      label: field.label,
      rules: {
        required: field.required ? `${field.label} é obrigatório` : false,
      },
    };

    // Renderizar campo de seleção única
    if (field.type === 'select') {
      return (
        <View key={field.name} style={styles.fieldContainer}>
          <SelectController
            {...defaultProps}
            options={field.options || []}
            placeholder={field.placeholder}
            multiple={false}
          />
          {errors?.[field.name] && (
            <ThemedText textType="default" colorName="error" style={styles.errorText}>
              {errors[field.name]}
            </ThemedText>
          )}
        </View>
      );
    }

    // Renderizar campo de seleção múltipla
    if (field.type === 'multiselect') {
      return (
        <View key={field.name} style={styles.fieldContainer}>
          <SelectController
            {...defaultProps}
            options={field.options || []}
            placeholder={field.placeholder}
            multiple={true}
          />
          {errors?.[field.name] && (
            <ThemedText textType="default" colorName="error" style={styles.errorText}>
              {errors[field.name]}
            </ThemedText>
          )}
        </View>
      );
    }

    // Renderizar campo de texto
    return (
      <View key={field.name} style={styles.fieldContainer}>
        <InputController
          {...defaultProps}
          placeholder={field.placeholder}
          secureTextEntry={field.secureTextEntry}
          keyboardType={field.keyboardType}
          maxLength={field.maxLength}
          autoComplete={field.autoComplete}
        />
        {errors?.[field.name] && (
          <ThemedText textType="default" colorName="error" style={styles.errorText}>
            {errors[field.name]}
          </ThemedText>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {cardFields.map(renderField)}

      <ThemedButton
        title="Salvar"
        onPress={handleSubmit(onSubmit)}
        disabled={disabled}
        type="defaultSemiBold"
        buttonStyle={styles.submitButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 18,
    paddingBottom: 18,
  },
  fieldContainer: {
    marginBottom: 12,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
  },
  submitButton: {
    marginTop: 24,
  },
});
