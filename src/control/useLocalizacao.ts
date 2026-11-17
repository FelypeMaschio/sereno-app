import { useCallback, useState } from 'react';
import { Linking } from 'react-native';
import * as Location from 'expo-location';
import { Coordenada } from '../utils/distancia';

/**
 * Estados possíveis da localização. Um "union type" em vez de vários booleanos
 * (carregando, negada, erro…) impede estados impossíveis, como "carregando e negada"
 * ao mesmo tempo, e obriga a tela a tratar cada caso.
 */
export type EstadoLocalizacao =
  | { tipo: 'ocioso' }
  | { tipo: 'carregando' }
  | { tipo: 'ok'; coordenada: Coordenada }
  | { tipo: 'negada'; podePerguntarDeNovo: boolean }
  | { tipo: 'gpsDesligado' }
  | { tipo: 'erro' };

const LIMITE_LEITURA_MS = 8_000;

/** Resolve com null se a promessa passar do tempo limite. */
const comLimiteDeTempo = <T>(promessa: Promise<T>, ms: number): Promise<T | null> =>
  Promise.race([promessa, new Promise<null>((resolve) => setTimeout(() => resolve(null), ms))]);

/**
 * Localização sob demanda. A permissão só é pedida quando a pessoa toca no botão
 * (nunca ao abrir o app), como recomendam as guidelines da Apple e do Google.
 * O app funciona normalmente se a permissão for negada.
 */
export const useLocalizacao = () => {
  const [estado, setEstado] = useState<EstadoLocalizacao>({ tipo: 'ocioso' });

  const obter = useCallback(async (): Promise<EstadoLocalizacao> => {
    setEstado({ tipo: 'carregando' });
    let novo: EstadoLocalizacao;
    try {
      if (!(await Location.hasServicesEnabledAsync())) {
        novo = { tipo: 'gpsDesligado' };
      } else {
        const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          novo = { tipo: 'negada', podePerguntarDeNovo: canAskAgain };
        } else {
          // Primeiro a última posição conhecida (instantânea); se não houver, uma
          // leitura nova com precisão "equilibrada", que basta para distâncias em km.
          // A leitura nova tem limite de tempo: com localização só aproximada, o Android
          // pode demorar muito, e a pessoa não pode ficar esperando sem resposta.
          const posicao =
            (await Location.getLastKnownPositionAsync({ maxAge: 30 * 60_000 })) ??
            (await comLimiteDeTempo(
              Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
              LIMITE_LEITURA_MS,
            )) ??
            (await Location.getLastKnownPositionAsync());
          if (!posicao) throw new Error('Sem posição');
          novo = {
            tipo: 'ok',
            coordenada: {
              latitude: posicao.coords.latitude,
              longitude: posicao.coords.longitude,
            },
          };
        }
      }
    } catch {
      novo = { tipo: 'erro' };
    }
    setEstado(novo);
    return novo;
  }, []);

  /** Quando a pessoa marcou "não perguntar de novo", só dá para liberar nas configurações. */
  const abrirConfiguracoes = () => Linking.openSettings();

  return { estado, obter, abrirConfiguracoes };
};
