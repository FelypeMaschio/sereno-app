export interface Coordenada {
  latitude: number;
  longitude: number;
}

const RAIO_DA_TERRA_KM = 6371;
const emRadianos = (graus: number) => (graus * Math.PI) / 180;

/**
 * Distância em km entre dois pontos pela fórmula de Haversine, que considera a
 * curvatura da Terra. É calculada no próprio celular: a localização da pessoa
 * nunca é enviada para nenhuma API.
 */
export const distanciaKm = (a: Coordenada, b: Coordenada): number => {
  const dLat = emRadianos(b.latitude - a.latitude);
  const dLon = emRadianos(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(emRadianos(a.latitude)) * Math.cos(emRadianos(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * RAIO_DA_TERRA_KM * Math.asin(Math.sqrt(h));
};

/** 0.35 → "a 350 m"; 2.4 → "a 2,4 km". */
export const formatarDistancia = (km: number): string =>
  km < 1
    ? `a ${Math.round((km * 1000) / 10) * 10} m`
    : `a ${km.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} km`;

/**
 * Itens com coordenadas válidas. Na API .NET elas são opcionais, e um valor de teste
 * (ex.: 90, 180) daria distâncias absurdas: aceitamos só pontos dentro do Brasil.
 */
export const temCoordenadas = <T extends { latitude?: number | null; longitude?: number | null }>(
  item: T,
): item is T & Coordenada =>
  item.latitude != null &&
  item.longitude != null &&
  item.latitude >= -34 &&
  item.latitude <= 6 &&
  item.longitude >= -74 &&
  item.longitude <= -28;
