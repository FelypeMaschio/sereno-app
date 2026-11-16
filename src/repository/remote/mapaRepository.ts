import { create } from 'axios';
import { ErroApp } from '../../model/comum';
import { categoriaDoMapa, LugarMapa } from '../../model/lugarMapa';
import { Coordenada } from '../../utils/distancia';

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
const apiMapa = create({ baseURL: 'https://photon.komoot.io', timeout: 10_000 });

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

export const buscarNoMapa = async (
  texto: string,
  perto: Coordenada | null,
  signal?: AbortSignal,
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
    throw new ErroApp(
      'Não conseguimos buscar no mapa agora. Verifique a internet e tente de novo.',
      null,
    );
  }
};
