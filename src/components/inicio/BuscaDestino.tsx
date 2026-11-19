import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CampoBusca from '../CampoBusca';
import MensagemErro from '../MensagemErro';
import Texto from '../Texto';
import { useTema } from '../../context/TemaContext';
import { useInicioControl } from '../../control/useInicioControl';
import { categorias, rotuloCategoria } from '../../model/local';
import { AREA_MINIMA_DE_TOQUE } from '../../theme';

type NomeIcone = keyof typeof MaterialCommunityIcons.glyphMap;

interface ResultadoProps {
  titulo: string;
  subtitulo: string;
  icone: NomeIcone;
  onPress: () => void;
}

/** Uma linha de resultado da busca de destino (do Sereno ou do mapa). */
const Resultado = ({ titulo, subtitulo, icone, onPress }: ResultadoProps) => {
  const { tema } = useTema();
  const { cores } = tema;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Ir para ${titulo}, ${subtitulo}`}
      style={({ pressed }) => [
        estilos.resultado,
        {
          backgroundColor: cores.superficie,
          borderColor: cores.borda,
          borderRadius: tema.raios.medio,
          paddingHorizontal: tema.espacamento.md,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <MaterialCommunityIcons name={icone} size={20} color={cores.primaria} />
      <View style={estilos.flex}>
        <Texto negrito numberOfLines={1}>
          {titulo}
        </Texto>
        <Texto variante="legenda" secundario numberOfLines={1}>
          {subtitulo}
        </Texto>
      </View>
    </Pressable>
  );
};

interface BuscaDestinoProps {
  controle: ReturnType<typeof useInicioControl>;
}

/**
 * Busca do destino em duas fontes: primeiro os lugares do Sereno (que têm índice de
 * calma e previsão), depois qualquer lugar real do mapa aberto.
 */
const BuscaDestino = ({ controle }: BuscaDestinoProps) => {
  const { tema } = useTema();
  const semResultados =
    controle.resultadosSereno.length === 0 && controle.resultadosMapa.length === 0;

  return (
    <View style={{ gap: tema.espacamento.sm }}>
      <CampoBusca
        valor={controle.busca}
        onChange={controle.setBusca}
        placeholder="Ex.: Parque Ibirapuera, Shopping Aricanduva"
        rotuloAcessivel="Buscar o lugar para onde você vai"
      />
      {controle.poucasLetras ? (
        <Texto variante="legenda" secundario>
          Busque um lugar do Sereno ou qualquer endereço do mapa.
        </Texto>
      ) : (
        <>
          {controle.erroBusca && <MensagemErro mensagem={controle.erroBusca} />}

          {controle.resultadosSereno.length > 0 && (
            <Texto variante="legenda" negrito secundario>
              No Sereno (com avaliações)
            </Texto>
          )}
          {controle.resultadosSereno.map((local) => (
            <Resultado
              key={`s${local.id}`}
              titulo={local.nome}
              subtitulo={`${rotuloCategoria(local.categoria)} · ${local.endereco}`}
              icone={categorias[local.categoria]?.icone ?? 'map-marker-outline'}
              onPress={() => controle.escolherLocal(local)}
            />
          ))}

          {controle.resultadosMapa.length > 0 && (
            <Texto variante="legenda" negrito secundario>
              No mapa
            </Texto>
          )}
          {controle.resultadosMapa.map((lugar) => (
            <Resultado
              key={`m${lugar.idMapa}`}
              titulo={lugar.nome}
              subtitulo={lugar.endereco}
              icone={categorias[lugar.categoria].icone}
              onPress={() => controle.escolherDoMapa(lugar)}
            />
          ))}

          {controle.buscando && <ActivityIndicator color={tema.cores.primaria} />}
          {!controle.buscando && !controle.erroBusca && semResultados && (
            <Texto secundario>
              {controle.erroMapa ??
                'Nenhum lugar encontrado. Tente acrescentar o bairro ou a cidade.'}
            </Texto>
          )}
          {controle.resultadosMapa.length > 0 && (
            <Texto variante="legenda" secundario>
              Dados do mapa © colaboradores do OpenStreetMap
            </Texto>
          )}
        </>
      )}
    </View>
  );
};

const estilos = StyleSheet.create({
  flex: {
    flex: 1,
  },
  resultado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    minHeight: AREA_MINIMA_DE_TOQUE + 8,
    paddingVertical: 8,
  },
});

export default BuscaDestino;
