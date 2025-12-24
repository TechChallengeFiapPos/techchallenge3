import { useAuth } from '@src/contexts/AuthContext';
import { TransactionAttachment } from '@src/domain/entities/Transaction';
import { useCards } from '@src/presentation/hooks/card/useCards';
import {
  TransactionFormData,
  TransactionFormField,
  TransactionFormProps,
} from '@src/presentation/types/TransactionFormTypes';
import { maskCardNumber } from '@src/utils/cards';
import {
  getCategoriesByType,
  methodRequiresCard,
  paymentMethods,
  transactionTypeOptions,
} from '@src/utils/transactions';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, StyleSheet, View } from 'react-native';
import { DateController, InputController } from '../inputs';
import { CurrencyInputController } from '../inputs/CurrencyInputController';
import { SelectController } from '../selects/SelectController';
import { ThemedButton } from '../ThemedButton';
import { ThemedText } from '../ThemedText';
import { AttachmentPicker } from '../upload/TransactionAttachmentPicker';

const transactionFields: TransactionFormField[] = [
  {
    name: 'type',
    label: 'Tipo de Transação',
    placeholder: 'Selecione o tipo',
    required: true,
    type: 'select',
  },
  {
    name: 'value',
    label: 'Valor',
    placeholder: 'R$ 0,00',
    required: true,
    type: 'currency',
    keyboardType: 'numeric',
  },
  {
    name: 'categoryId',
    label: 'Categoria',
    placeholder: 'Selecione a categoria',
    required: true,
    type: 'select',
  },
  {
    name: 'methodId',
    label: 'Método de Pagamento',
    placeholder: 'Selecione o método',
    required: true,
    type: 'select',
  },
  {
    name: 'cardId',
    label: 'Cartão',
    placeholder: 'Selecione o cartão',
    required: true,
    type: 'select',
    conditional: (formData) => methodRequiresCard(formData.methodId),
  },
  {
    name: 'description',
    label: 'Descrição',
    placeholder: 'Descrição da transação (opcional)',
    required: false,
    type: 'text',
    maxLength: 20,
  },
  {
    name: 'date',
    label: 'Data',
    placeholder: 'Data da transação',
    required: true,
    type: 'date',
  },
];

export function TransactionRegisterForm({
  onSubmit,
  disabled,
  errors,
  initialData,
  mode = 'create',
}: TransactionFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  
  const { cards } = useCards();
  
  const [attachment, setAttachment] = useState<TransactionAttachment | undefined>(
    initialData?.attachment
  );

  const cardOptions = useMemo(() => {
    return cards.map((card) => ({
      label: `${card.category} - ${maskCardNumber(card.number)}`,
      value: card.id!,
    }));
  }, [cards]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors: formErrors },
  } = useForm<TransactionFormData>({
    mode: 'onBlur',
    defaultValues: {
      type: 'expense',
      value: 0,
      categoryId: '',
      methodId: '',
      cardId: '',
      description: '',
      date: new Date(),
      ...initialData,
    },
  });

  const watchedType = watch('type');
  const watchedMethod = watch('methodId');
  const watchedCard = watch('cardId');

  useEffect(() => {
    setValue('categoryId', '');
  }, [watchedType, setValue]);

  // Validação de cartão
  useEffect(() => {
    if (!methodRequiresCard(watchedMethod)) return;
    if (mode === 'edit' && watchedCard) return;
    if (cardOptions.length > 0) return;

    Alert.alert(
      'Nenhum cartão cadastrado',
      'Você precisa cadastrar um cartão antes de usar este método de pagamento.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => {
            setValue('methodId', '');
          },
        },
        {
          text: 'Cadastrar Cartão',
          onPress: () => {
            router.push('/create-card');
          },
        },
      ]
    );
  }, [watchedMethod, cardOptions, mode, watchedCard]);

  const renderField = (field: TransactionFormField) => {
    if (field.conditional) {
      const formData = watch();
      if (!field.conditional(formData)) {
        return null;
      }
    }

    const baseRules = {
      required: field.required ? `${field.label} é obrigatório` : false,
    };

    if (field.type === 'select') {
      let options = field.options || [];

      if (field.name === 'type') {
        options = transactionTypeOptions;
      } else if (field.name === 'categoryId') {
        options = getCategoriesByType(watchedType);
      } else if (field.name === 'methodId') {
        options = paymentMethods;
      } else if (field.name === 'cardId') {
        options = cardOptions;
      }

      return (
        <View key={field.name}>
          <SelectController
            control={control}
            name={field.name}
            label={field.label}
            rules={baseRules}
            options={options}
            placeholder={field.placeholder || 'Selecione uma opção'}
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

    if (field.type === 'currency') {
      return (
        <View key={field.name}>
          <CurrencyInputController
            control={control}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            rules={{
              required: 'Valor é obrigatório',
              validate: (value: any) => {
                const numValue = typeof value === 'string' ? parseInt(value) : value;

                if (!numValue || numValue === 0) {
                  return 'Valor é obrigatório';
                }

                if (numValue <= 0) {
                  return 'Valor deve ser maior que zero';
                }

                if (numValue > 99999999) {
                  return 'Valor máximo: R$ 999.999,99';
                }

                return true;
              },
            }}
            disabled={disabled}
          />
          {(formErrors[field.name] || errors?.[field.name]) && (
            <ThemedText textType="default" colorName="error" style={styles.errorText}>
              {formErrors[field.name]?.message || errors?.[field.name]}
            </ThemedText>
          )}
        </View>
      );
    }

    if (field.type === 'date') {
      return (
        <View key={field.name}>
          <DateController
            control={control}
            name={field.name}
            label={field.label}
            rules={{
              required: 'Data é obrigatória',
              validate: (value: Date) => {
                if (!value) return 'Data é obrigatória';

                const today = new Date();
                today.setHours(23, 59, 59, 999);

                if (value > today) {
                  return 'Data não pode ser futura';
                }

                return true;
              },
            }}
            defaultValue={initialData?.date || new Date()}
          />
          {(formErrors[field.name] || errors?.[field.name]) && (
            <ThemedText textType="default" colorName="error" style={styles.errorText}>
              {formErrors[field.name]?.message || errors?.[field.name]}
            </ThemedText>
          )}
        </View>
      );
    }

    return (
      <View key={field.name}>
        <InputController
          control={control}
          name={field.name}
          label={field.label}
          rules={{
            ...baseRules,
            ...(field.maxLength && {
              maxLength: {
                value: field.maxLength,
                message: `${field.label} deve ter no máximo ${field.maxLength} caracteres`,
              },
            }),
          }}
          placeholder={field.placeholder}
          keyboardType="default"
          maxLength={field.maxLength}
        />
        {(formErrors[field.name] || errors?.[field.name]) && (
          <ThemedText textType="default" colorName="error" style={styles.errorText}>
            {formErrors[field.name]?.message || errors?.[field.name]}
            </ThemedText>
        )}
      </View>
    );
  };

  const processSubmit = (data: TransactionFormData) => {
    const processedData = {
      ...data,
      value: typeof data.value === 'string' ? parseInt(data.value) || 0 : data.value,
      attachment,
    };

    onSubmit(processedData);
  };

  return (
    <View style={styles.container}>
      {transactionFields.map(renderField)}

      <AttachmentPicker
        attachment={attachment}
        onAttachmentChange={setAttachment}
        disabled={disabled}
      />

      <ThemedButton
        title={mode === 'edit' ? 'Atualizar Transação' : 'Salvar Transação'}
        onPress={handleSubmit(processSubmit)}
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
    paddingBottom: 10,
  },
  errorText: {
    fontSize: 12,
    marginTop: -4,
  },
  submitButton: {
    marginTop: 24,
  },
});