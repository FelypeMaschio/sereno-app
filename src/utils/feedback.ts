import { AccessibilityInfo, Alert, Platform, ToastAndroid } from 'react-native';

/**
 * Aviso rápido de sucesso ("Avaliação salva"). No Android usa o ToastAndroid; no iOS,
 * que não tem toast nativo, um alerta simples. Também é anunciado ao leitor de tela.
 */
export const avisar = (mensagem: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(mensagem, ToastAndroid.SHORT);
  } else {
    Alert.alert(mensagem);
  }
  AccessibilityInfo.announceForAccessibility(mensagem);
};

/**
 * Pede confirmação antes de uma ação que não dá para desfazer (excluir, sair).
 * Devolve uma Promise para o control poder escrever `if (await confirmar(...))`.
 */
export const confirmar = (titulo: string, mensagem: string, textoConfirmar: string) =>
  new Promise<boolean>((resolve) => {
    Alert.alert(
      titulo,
      mensagem,
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
        { text: textoConfirmar, style: 'destructive', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
