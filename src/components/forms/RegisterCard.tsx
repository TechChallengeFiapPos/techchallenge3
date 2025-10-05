// CardRegisterForm corrigido
import { CardFormData, CardFormField, CardFormProps, SelectOption } from '@src/models/card';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { InputController } from '../inputs';
import { SelectController } from '../selects/SelectController';
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
    placeholder: 'Categoria do cartão',
    required: true,
    type: 'select',
    options: categoryOptions,
  },
  {
    name: 'functions',
    label: 'Função',
    placeholder: 'Função do cartão',
    required: true,
    type: 'multiselect',
    options: functionOptions,
  },
];

export function CardRegisterForm({ onSubmit, disabled, errors, initialData }: CardFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<CardFormData>({
    mode: 'onBlur',
    defaultValues: {
      number: '',
      category: '',
      functions: [],
      expiryDate: '',
      ...initialData,
    },
  });
  console.log('🚀 FORMULÁRIO CARREGOU!');

  const renderField = (field: CardFormField) => {
    // Debug log para acompanhar renders
    console.log('🔄 Renderizando campo:', field.name, 'tipo:', field.type);

    const defaultProps = {
      control,
      name: field.name,
      label: field.label,
      rules: {
        required: field.required ? `${field.label} é obrigatório` : false,
        ...(field.name === 'number' && {
          minLength: {
            value: 13,
            message: 'Número deve ter no mínimo 13 dígitos',
          },
        }),
        ...(field.name === 'expiryDate' && {
          pattern: {
            value: /^(0[1-9]|1[0-2])\/\d{2}$/,
            message: 'Formato deve ser MM/AA',
          },
        }),
      },
    };

    if (field.type === 'select') {
      // Debug logs para selects
      console.log('📋 Opções para', field.name, ':', (field.options || []).length, 'itens');
      console.log('📋 Primeira opção:', (field.options || [])[0]);
      console.log('📋 Props do select:', {
        name: defaultProps.name,
        label: defaultProps.label,
        optionsCount: (field.options || []).length,
        placeholder: field.placeholder,
        multiple: false,
      });

      return (
        <View key={field.name} style={styles.fieldContainer}>
          <SelectController
            {...defaultProps}
            options={field.options || []}
            placeholder={field.placeholder}
            multiple={false}
          />
          {(formErrors[field.name] || errors?.[field.name]) && (
            <ThemedText textType="default" colorName="error" style={styles.errorText}>
              {formErrors[field.name]?.message || errors?.[field.name]}
            </ThemedText>
          )}
        </View>
      );
    }

    if (field.type === 'multiselect') {
      // Debug logs para multiselects
      console.log(
        '📋 Opções para multiselect',
        field.name,
        ':',
        (field.options || []).length,
        'itens',
      );
      console.log('📋 Primeira opção multiselect:', (field.options || [])[0]);
      console.log('📋 Props do multiselect:', {
        name: defaultProps.name,
        label: defaultProps.label,
        optionsCount: (field.options || []).length,
        placeholder: field.placeholder,
        multiple: true,
      });

      return (
        <View key={field.name} style={styles.fieldContainer}>
          <SelectController
            {...defaultProps}
            options={field.options || []}
            placeholder={field.placeholder}
            multiple={true}
          />
          {(formErrors[field.name] || errors?.[field.name]) && (
            <ThemedText textType="default" colorName="error" style={styles.errorText}>
              {formErrors[field.name]?.message || errors?.[field.name]}
            </ThemedText>
          )}
        </View>
      );
    }

    // Campo de texto
    console.log('📝 Campo de texto:', field.name);
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
        {(formErrors[field.name] || errors?.[field.name]) && (
          <ThemedText textType="default" colorName="error" style={styles.errorText}>
            {formErrors[field.name]?.message || errors?.[field.name]}
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
    paddingBottom: 20,
  },
  fieldContainer: {
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
  },
  submitButton: {
    marginTop: 20,
  },
});
