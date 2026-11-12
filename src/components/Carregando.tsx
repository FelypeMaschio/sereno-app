import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTema } from '../context/TemaContext';
import Texto from './Texto';

interface CarregandoProps {
  mensagem?: string;
  /**
   * Texto exibido se a espera passar de `segundosAteMensagemLenta`. As APIs ficam no
   * plano gratuito do Render, que "dorme" sem uso: a primeira chamada pode levar até
   * um minuto. Avisar evita que a pessoa ache que o app travou.
   */
  mensagemLenta?: string;
  segundosAteMensagemLenta?: number;
}

const Carregando = ({
  mensagem = 'Carregando…',
  mensagemLenta = 'Acordando o servidor, isso pode levar até um minuto…',
  segundosAteMensagemLenta = 6,
}: CarregandoProps) => {
  const { tema } = useTema();
  const [demorando, setDemorando] = useState<boolean>(false);

  useEffect(() => {
    const temporizador = setTimeout(() => setDemorando(true), segundosAteMensagemLenta * 1000);
    // Limpa o timer se a tela sair antes, evitando atualizar um componente desmontado.
    return () => clearTimeout(temporizador);
  }, [segundosAteMensagemLenta]);

  return (
    <View
      style={[estilos.container, { gap: tema.espacamento.md, padding: tema.espacamento.lg }]}
      // "polite": o leitor de tela anuncia a mudança de texto sem interromper a pessoa.
      accessibilityLiveRegion="polite"
    >
      <ActivityIndicator size="large" color={tema.cores.primaria} />
      <Texto secundario style={estilos.texto}>
        {demorando ? mensagemLenta : mensagem}
      </Texto>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  texto: {
    textAlign: 'center',
  },
});

export default Carregando;
