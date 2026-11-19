import { create } from 'axios';
import * as Location from 'expo-location';
import { ErroApp } from '../../model/comum';
import { categoriaDoMapa, LugarMapa } from '../../model/lugarMapa';
import { Coordenada, temCoordenadas } from '../../utils/distancia';

/**
 * Busca de lugares reais no mapa aberto (OpenStreetMap), pelo serviço Photon.
 *
 * Por que não o Google Places: ele exige cartão de crédito e uma chave de API, e uma
 * chave dentro do app fica exposta (qualquer pessoa a extrai do APK). O Photon é
 * gratuito, não tem chave e foi feito para "buscar enquanto digita".
 * Os dados são © colaboradores do OpenStreetMap (licença ODbL): o app mostra o crédito.
 *
 * Este cliente NÃO usa os interceptors das APIs do grupo: o token JWT do Sereno
 * nunca é enviado para um serviço de fora.
 */
const apiMapa = create({
  baseURL: 'https://photon.komoot.io',
  timeout: 10_000,
  // O serviço gratuito bloqueia (erro 403) pedidos com identificação genérica, como o
  // "okhttp" que o Android usa por padrão. Por isso o app se identifica pelo nome,
  // como pede a política de uso justo dos serviços do OpenStreetMap.
  headers: {
    'User-Agent': 'Sereno/1.0 (app academico FIAP GS 2026; github.com/FelypeMaschio/sereno-app)',
  },
});

// Sem localização, a busca dá preferência a São Paulo (onde o Sereno começa).
const SAO_PAULO: Coordenada = { latitude: -23.5505, longitude: -46.6333 };
// Só resultados dentro do Brasil: minLon, minLat, maxLon, maxLat.
const BRASIL = '-74,-34,-28,6';
// Ruas, bairros, cidades e rios não são "lugares" que dá para avaliar.
const CHAVES_IGNORADAS = [
  'highway',
  'place',
  'boundary',
  'landuse',
  'natural',
  'waterway',
  'route',
];

interface FeaturePhoton {
  geometry: { coordinates: [number, number] };
  properties: {
    osm_id: number;
    osm_type: string;
    osm_key: string;
    osm_value: string;
    name?: string;
    street?: string;
    housenumber?: string;
    district?: string;
    city?: string;
    state?: string;
  };
}

/** Monta "Rua X, 123 - Bairro, Cidade - Estado" com o que o mapa tiver. */
const montarEndereco = ({ properties: p }: FeaturePhoton) => {
  const rua = [p.street, p.housenumber].filter(Boolean).join(', ');
  const regiao = [p.district, p.city].filter(Boolean).join(', ');
  const texto = [rua, regiao].filter(Boolean).join(' - ');
  return [texto, p.state].filter(Boolean).join(' - ') || (p.name ?? '');
};

/** "pinacoteca do estado" → "Pinacoteca Do Estado" (o nome que a pessoa digitou). */
const comIniciaisMaiusculas = (texto: string) =>
  texto
    .trim()
    .replace(/(^|\s)(\S)/g, (_, espaco: string, letra: string) => espaco + letra.toUpperCase());

/**
 * Plano B: o geocodificador do próprio celular (Android/Google), sem chave de API.
 * Só acha a posição do endereço, não uma lista de estabelecimentos; por isso serve
 * só para escolher DESTINO, nunca para cadastrar lugar novo (isso exige o mapa).
 * No Android ele só funciona com a localização liberada.
 */
const buscarPeloCelular = async (texto: string): Promise<LugarMapa[]> => {
  const { granted } = await Location.getForegroundPermissionsAsync();
  if (!granted) return [];
  const pontos = (await Location.geocodeAsync(texto)).filter(temCoordenadas).slice(0, 3);
  return Promise.all(
    pontos.map(async ({ latitude, longitude }) => {
      const [endereco] = await Location.reverseGeocodeAsync({ latitude, longitude }).catch(
        () => [],
      );
      const rua = [endereco?.street, endereco?.streetNumber].filter(Boolean).join(', ');
      const regiao = [endereco?.district, endereco?.city ?? endereco?.subregion]
        .filter(Boolean)
        .join(', ');
      return {
        idMapa: `gps-${latitude.toFixed(5)},${longitude.toFixed(5)}`,
        nome: comIniciaisMaiusculas(texto).slice(0, 120),
        endereco: ([rua, regiao, endereco?.region].filter(Boolean).join(' - ') || texto).slice(
          0,
          255,
        ),
        latitude,
        longitude,
        categoria: 'OUTRO' as const,
        tipoMapa: 'endereco',
      };
    }),
  );
};

export const buscarNoMapa = async (
  texto: string,
  perto: Coordenada | null,
  signal?: AbortSignal,
  /** true na busca de destino: se o mapa falhar, tenta o geocodificador do celular. */
  permitirPlanoB = false,
): Promise<LugarMapa[]> => {
  const centro = perto ?? SAO_PAULO;
  try {
    const { data } = await apiMapa.get<{ features: FeaturePhoton[] }>('/api/', {
      params: {
        q: texto.trim(),
        limit: 15,
        lat: centro.latitude,
        lon: centro.longitude,
        bbox: BRASIL,
      },
      signal,
    });
    return data.features
      .filter((f) => f.properties.name && !CHAVES_IGNORADAS.includes(f.properties.osm_key))
      .slice(0, 8)
      .map((f) => ({
        idMapa: `${f.properties.osm_type}${f.properties.osm_id}`,
        nome: (f.properties.name ?? '').slice(0, 120),
        endereco: montarEndereco(f).slice(0, 255),
        latitude: f.geometry.coordinates[1],
        longitude: f.geometry.coordinates[0],
        categoria: categoriaDoMapa(f.properties.osm_key, f.properties.osm_value),
        tipoMapa: f.properties.osm_value,
      }));
  } catch (erro) {
    if ((erro as { name?: string })?.name === 'CanceledError') throw erro;
    if (permitirPlanoB) {
      const pelocelular = await buscarPeloCelular(texto).catch(() => []);
      if (pelocelular.length > 0) return pelocelular;
    }
    throw new ErroApp(
      permitirPlanoB
        ? 'O serviço de mapa não respondeu. Libere a localização para buscar pelo celular, ou tente de novo em instantes.'
        : 'O serviço de mapa não respondeu agora. Tente de novo em instantes.',
      null,
    );
  }
};
