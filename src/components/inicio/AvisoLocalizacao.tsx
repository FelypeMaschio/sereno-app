import Botao from '../Botao';
import Cartao from '../Cartao';
import Texto from '../Texto';
import { useTema } from '../../context/TemaContext';
import { EstadoLocalizacao } from '../../control/useLocalizacao';

/** Por que não temos a localização, em linguagem simples (null = temos ou está vindo). */
export const motivoSemLocalizacao = (estado: EstadoLocalizacao): string | null => {
  switch (estado.tipo) {
    case 'negada':
      return 'Sem acesso à sua localização.';
    case 'gpsDesligado':
      return 'A localização do celular está desligada.';
    case 'erro':
      return 'Não consegui descobrir onde você está.';
    case 'ocioso':
      return 'Você ainda não liberou a localização.';
    default:
      return null;
  }
};

interface AvisoLocalizacaoProps {
  estado: EstadoLocalizacao;
  /** O que a pessoa ganha liberando (ex.: "Mostrando os lugares mais tranquilos no geral."). */
  complemento: string;
  usarLocalizacao: () => void;
  abrirConfiguracoes: () => void;
}

/**
 * Cartão que explica por que falta a localização e oferece liberar.
 * Se o pedido foi bloqueado de vez, o botão leva às configurações do celular.
 */
const AvisoLocalizacao = ({
  estado,
  complemento,
  usarLocalizacao,
  abrirConfiguracoes,
}: AvisoLocalizacaoProps) => {
  const { tema } = useTema();
  const motivo = motivoSemLocalizacao(estado);
  if (!motivo) return null;

  const bloqueada = estado.tipo === 'negada' && !estado.podePerguntarDeNovo;

  return (
    <Cartao style={{ gap: tema.espacamento.sm }}>
      <Texto variante="legenda">
        {motivo} {complemento}
      </Texto>
      {bloqueada ? (
        <Botao
          titulo="Abrir configurações"
          icone="cog-outline"
          variante="secundario"
          dica="Abre as configurações do app para liberar a localização"
          onPress={abrirConfiguracoes}
        />
      ) : (
        <Botao
          titulo="Usar minha localização"
          icone="crosshairs-gps"
          variante="secundario"
          dica="A localização fica só no celular e não é enviada para nenhum servidor"
          onPress={usarLocalizacao}
        />
      )}
    </Cartao>
  );
};

export default AvisoLocalizacao;
