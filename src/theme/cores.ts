/**
 * Paletas de cores do Sereno.
 *
 * Todas as combinações de texto sobre fundo/superfície têm contraste de pelo menos
 * 4,5:1 (WCAG AA). Bordas de campos têm pelo menos 3:1.
 *
 * - Padrão: areia clara + verde-azulado profundo. Calmo, mas com contraste firme.
 * - Baixo estímulo: tons dessaturados e mais próximos entre si, para reduzir a carga
 *   visual de quem tem sensibilidade sensorial, mantendo a leitura acessível.
 */
export interface Cores {
  fundo: string;
  superficie: string;
  superficieAlternativa: string;
  texto: string;
  textoSecundario: string;
  textoSobrePrimaria: string;
  primaria: string;
  primariaSuave: string;
  destaque: string;
  borda: string;
  sucesso: string;
  sucessoSuave: string;
  alerta: string;
  alertaSuave: string;
  perigo: string;
  perigoSuave: string;
  info: string;
  infoSuave: string;
}

export const coresPadrao: Cores = {
  fundo: '#F6F3EC',
  superficie: '#FFFFFF',
  superficieAlternativa: '#ECE7DC',
  texto: '#1E2B2F',
  textoSecundario: '#4F5D61',
  textoSobrePrimaria: '#FFFFFF',
  primaria: '#1F6F6B',
  primariaSuave: '#DCEBE8',
  destaque: '#A4532B',
  borda: '#8C8578',
  sucesso: '#2E6E47',
  sucessoSuave: '#DDEEDF',
  alerta: '#7A5000',
  alertaSuave: '#F5E8CC',
  perigo: '#AE2A1F',
  perigoSuave: '#F7DEDA',
  info: '#2B5C8A',
  infoSuave: '#DCE7F2',
};

export const coresBaixoEstimulo: Cores = {
  fundo: '#EEF0EC',
  superficie: '#F6F7F4',
  superficieAlternativa: '#E4E7E1',
  texto: '#2C3436',
  textoSecundario: '#545E60',
  textoSobrePrimaria: '#FFFFFF',
  primaria: '#4A6B67',
  primariaSuave: '#E0E6E3',
  destaque: '#7D6552',
  borda: '#7E857E',
  sucesso: '#4A6B55',
  sucessoSuave: '#E1E7E2',
  alerta: '#6E5C3C',
  alertaSuave: '#ECE7DD',
  perigo: '#87504A',
  perigoSuave: '#EEE3E1',
  info: '#4A6178',
  infoSuave: '#E1E6EB',
};
