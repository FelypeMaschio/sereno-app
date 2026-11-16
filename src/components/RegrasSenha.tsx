import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import { regrasSenha } from '../model/usuario';
import Texto from './Texto';

interface RegrasSenhaProps {
  senha: string;
  confirmacao?: string;
}

/**
 * Lista das regras da senha que vai ficando verde enquanto a pessoa digita.
 * Cada regra tem ícone + texto (✓ verde / ✗ vermelho), então não depende só da cor,
 * e o leitor de tela anuncia "atendida" ou "não atendida".
 */
const RegrasSenha = ({ senha, confirmacao }: RegrasSenhaProps) => {
  const { tema } = useTema();
  const { cores } = tema;

  const regras = [
    ...regrasSenha.map(({ rotulo, teste }) => ({ rotulo, ok: teste(senha) })),
    ...(confirmacao !== undefined
      ? [{ rotulo: 'As duas senhas são iguais', ok: senha !== '' && senha === confirmacao }]
      : []),
  ];

  return (
    <View style={{ gap: tema.espacamento.xs }} accessibilityLiveRegion="polite">
      {regras.map(({ rotulo, ok }) => (
        <View
          key={rotulo}
          style={[estilos.linha, { gap: tema.espacamento.sm }]}
          accessible
          accessibilityLabel={`${rotulo}: ${ok ? 'atendida' : 'não atendida'}`}
        >
          <MaterialCommunityIcons
            name={ok ? 'check-circle' : 'close-circle-outline'}
            size={18}
            color={ok ? cores.sucesso : cores.perigo}
          />
          <Texto variante="legenda" negrito={ok} cor={ok ? cores.sucesso : cores.textoSecundario}>
            {rotulo}
          </Texto>
        </View>
      ))}
    </View>
  );
};

const estilos = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default RegrasSenha;
