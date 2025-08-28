import { View } from 'react-native';

import { Button, Text } from 'react-native-paper';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text variant="titleLarge">Olá, mundo!</Text>
      <Button mode="contained" onPress={() => console.log('Botão clicado')}>
        Clique aqui
      </Button>
    </View>
)}

