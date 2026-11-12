import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import Texto from './Texto';

export type Tom = 'sucesso' | 'alerta' | 'perigo' | 'info' | 'neutro' | 'primaria';

interface SeloProps {
  texto: string;
  icone?: keyof typeof MaterialCommunityIcons.glyphMap;
  tom?: Tom;
}

/** Etiqueta de status: sempre ícone + texto + cor, nunca só cor. */
const Selo = ({ texto, icone, tom = 'neutro' }: SeloProps) => {
  const { tema } = useTema();
  const { cores } = tema;

  const paleta: Record<Tom, { frente: string; fundo: string }> = {
    sucesso: { frente: cores.sucesso, fundo: cores.sucessoSuave },
    alerta: { frente: cores.alerta, fundo: cores.alertaSuave },
    perigo: { frente: cores.perigo, fundo: cores.perigoSuave },
    info: { frente: cores.info, fundo: cores.infoSuave },
    primaria: { frente: cores.primaria, fundo: cores.primariaSuave },
    neutro: { frente: cores.textoSecundario, fundo: cores.superficieAlternativa },
  };
  const { frente, fundo } = paleta[tom];

  return (
    <View
      style={[
        estilos.selo,
        { backgroundColor: fundo, borderRadius: tema.raios.pilula, gap: tema.espacamento.xs },
      ]}
    >
      {icone && <MaterialCommunityIcons name={icone} size={16} color={frente} />}
      <Texto variante="legenda" negrito cor={frente}>
        {texto}
      </Texto>
    </View>
  );
};

const estilos = StyleSheet.create({
  selo: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});

export default Selo;
