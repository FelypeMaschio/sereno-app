import { object, string, InferType } from 'yup';
import { Categoria } from './local';

/**
 * Lugar real encontrado no mapa aberto (OpenStreetMap), antes de entrar no Sereno.
 * Só dá para adicionar ao Sereno um lugar escolhido daqui: assim ninguém cadastra
 * um lugar que não existe ou com endereço inventado.
 */
export interface LugarMapa {
  /** Id do OpenStreetMap (ex.: "N123"), só para a lista do app. */
  idMapa: string;
  nome: string;
  endereco: string;
  latitude: number;
  longitude: number;
  categoria: Categoria;
  /** Tipo original no mapa (ex.: "fast_food"), mostrado só como informação. */
  tipoMapa: string;
}

/** Corpo do POST /api/locais (API Java). */
export interface LocalRequest {
  nome: string;
  descricao?: string;
  categoria: Categoria;
  endereco: string;
  latitude: number;
  longitude: number;
  recursosAcessibilidade?: string;
}

/** O que a pessoa ainda escreve (o resto vem do mapa). Mesmos limites da API Java. */
export const novoLugarSchema = object({
  descricao: string().trim().max(1000, 'A descrição pode ter até 1000 caracteres').default(''),
  recursosAcessibilidade: string()
    .trim()
    .max(500, 'Os recursos de acessibilidade podem ter até 500 caracteres')
    .default(''),
});
export type NovoLugarForm = InferType<typeof novoLugarSchema>;

/**
 * Tipos do OpenStreetMap → categorias do Sereno. A pessoa pode trocar depois,
 * mas na maioria das vezes o mapa já acerta (ex.: hamburgueria = fast_food).
 */
const porValor: Record<string, Categoria> = {
  restaurant: 'RESTAURANTE',
  fast_food: 'RESTAURANTE',
  food_court: 'RESTAURANTE',
  bar: 'RESTAURANTE',
  pub: 'RESTAURANTE',
  ice_cream: 'RESTAURANTE',
  cafe: 'CAFE',
  bakery: 'CAFE',
  library: 'BIBLIOTECA',
  museum: 'MUSEU',
  gallery: 'MUSEU',
  arts_centre: 'CENTRO_CULTURAL',
  theatre: 'CENTRO_CULTURAL',
  cinema: 'CENTRO_CULTURAL',
  community_centre: 'CENTRO_CULTURAL',
  park: 'PARQUE',
  garden: 'PARQUE',
  nature_reserve: 'PARQUE',
  mall: 'SHOPPING',
  department_store: 'SHOPPING',
  hospital: 'SAUDE',
  clinic: 'SAUDE',
  doctors: 'SAUDE',
  dentist: 'SAUDE',
  pharmacy: 'SAUDE',
  townhall: 'SERVICO_PUBLICO',
  police: 'SERVICO_PUBLICO',
  post_office: 'SERVICO_PUBLICO',
  courthouse: 'SERVICO_PUBLICO',
  fire_station: 'SERVICO_PUBLICO',
  social_facility: 'SERVICO_PUBLICO',
  school: 'EDUCACAO',
  university: 'EDUCACAO',
  college: 'EDUCACAO',
  kindergarten: 'EDUCACAO',
  bus_station: 'TRANSPORTE',
  station: 'TRANSPORTE',
  ferry_terminal: 'TRANSPORTE',
};

export const categoriaDoMapa = (chave: string, valor: string): Categoria =>
  porValor[valor] ?? (chave === 'healthcare' ? 'SAUDE' : 'OUTRO');
