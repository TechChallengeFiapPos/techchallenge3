# 💰 Tech Challenge - Fase 03 - ByteBank

Aplicação de **Gerenciamento Financeiro** desenvolvida em **React Native (com Expo)** como parte do Tech Challenge da Fase 03.

---

## 📋 Funcionalidades Principais

### ✅ Requisitos Obrigatórios
- **Autenticação**: Login e registro de usuários com Firebase Authentication
- **Dashboard**: Visualização de resumo financeiro com gráficos interativos
- **Transações**: Adicionar, editar e visualizar transações financeiras
- **Listagem com Filtros**: Filtros avançados por tipo, categoria, método de pagamento e período
- **Upload de Recibos**: Anexar comprovantes/recibos usando Firebase Storage

### 🎯 Funcionalidades Adicionais
- **Welcome Page**: Tela de boas-vindas personalizada
- **Gerenciamento de Cartões**: Listagem, adição, edição e exclusão de cartões de crédito/débito
- **Perfil do Usuário**: Visualização de dados do usuário e logout
- **Tema Claro/Escuro**: Suporte a dark mode
- **Scroll Infinito**: Carregamento progressivo de transações
- **Animações**: Transições suaves e feedback visual
- **Validações Robustas**: Validação de formulários em tempo real


## 📊 Gráficos e Análises

### 1. **Despesas por Categoria** (Gráfico de Pizza)
Total por Categoria = Soma das despesas da categoria
Exibição: Top 5 categorias com maior valor

### 2. **Evolução Mensal** (Gráfico de Linha)
Para cada mês (últimos 6):
Receitas = Soma de transações income do mês
Despesas = Soma de transações expense do mês

### 3. **Comparativo Mensal** (Gráfico de Barras)
Mês Passado vs Mês Atual:
Receitas mês passado | Receitas mês atual
Despesas mês passado | Despesas mês atual

### 4. **Cards do Dashboard**
Total Receitas = Soma de todas income
Total Despesas = Soma de todas expense
Saldo = Receitas - Despesas


## 🛠️ Tecnologias Utilizadas

- **Framework**: [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/)
- **Linguagem**: TypeScript
- **Navegação**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Backend**: [Firebase](https://firebase.google.com/)
  - Authentication (autenticação de usuários)
  - Firestore (banco de dados NoSQL)
  - Storage (armazenamento de arquivos)
- **Gerenciamento de Estado**: Context API + React Hooks
- **Gráficos**: [Victory Native](https://formidable.com/open-source/victory/docs/native/)
- **UI Components**: [React Native Paper](https://callstack.github.io/react-native-paper/)
- **Formulários**: [React Hook Form](https://react-hook-form.com/)
- **Ícones**: [Expo Vector Icons](https://icons.expo.fyi/)
- **Persistência Local**: [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)


## 📦 Instalação e Execução

### 1. Pré-requisitos

- Node.js (v18 ou superior)
- npm ou yarn
- Expo CLI
- Conta no Firebase
- Android Studio
- Expo CLI
- Expo GO 

### 2. Clone o repositório
```bash
git clone https://github.com/seu-usuario/techchallenge3.git
cd techchallenge3
``` 

### 3. Instale as dependencias
```bash
yarn install
``` 

### 4. Variáveis de ambiente
Crie um arquivo .env na raiz do projeto baseado no .env.example:
```bash
EXPO_PUBLIC_FIREBASE_API_KEY=sua_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=seu_app_id
``` 

### 5. Configure o Firebase
- Crie um projeto no Firebase Console
- Ative Authentication (Email/Password)
- Crie um banco Firestore Database
- Ative o Storage
- Configure as regras de segurança:
```bash
//Firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /cards/{cardId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
``` 

```bash
// Storage
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /transactions/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
``` 

### 6. Inicie o Projeto no ANDROID STUDIO + EXPO GO

```bash
npx expo start -c
``` 

- Pressione A no terminal pra abrir o projeto no emulador
- Configuração do device no emulador: 1080 x 2400 (default)

## 🎨 Temas
O aplicativo suporta tema claro e tema escuro que se adapta automaticamente às preferências do sistema operacional.

## 📱 Telas Principais

1. Autenticação
- Login com email/senha
- Registro de novo usuário
- Validação de campos em tempo real

2. Dashboard
- Saudação personalizada
- Cards com resumo financeiro (receitas, despesas, saldo)
- 3 gráficos interativos
- Últimas transações

3. Transações
- Listagem paginada (scroll infinito)
- Filtros por tipo, categoria, método e período
- Adicionar/editar/excluir transações
- Upload de comprovantes

4. Cartões
- Listagem de cartões cadastrados
- Filtros por tipo (crédito/débito) e categoria (platinum/gold/black)
- Adicionar/editar/excluir cartões
- Máscara de número do cartão

5. Perfil
- Informações do usuário
- Logout

## 🔐 Segurança

- Credenciais em variáveis de ambiente (.env)
- Regras de segurança no Firestore e Storage
- Autenticação obrigatória para todas as operações
- Validação de dados no frontend e backend
- API Key com restrições configuradas


## 🧪 Validações Implementadas

- Transações: Valor obrigatório, data não futura, campos obrigatórios
- Cartões: Número válido (16 dígitos), data de expiração válida, CVV
- Autenticação: Email válido, senha mínima de 6 caracteres
- Upload: Tamanho máximo de arquivo, tipos permitidos

## 👥 Autor
Eloisa Fagundes

GitHub: @EloisaFagundes


## 📄 Licença
Este projeto foi desenvolvido para fins acadêmicos como parte do Tech Challenge da Pós-Graduação.