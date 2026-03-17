// Tipos baseados nas perguntas de onboarding e lógica de mapeamento

export type Objetivo = 
  | 'migrar_digital'
  | 'prestar_servicos'
  | 'criar_infoprodutos'
  | 'vender_fisicos'
  | 'desenvolver_habilidades'
  | 'outro';

export type SubServico = 
  | 'social_media'
  | 'copywriting'
  | 'trafego_pago'
  | 'assistencia_virtual'
  | 'design'
  | 'outro';

export type Clientes = 'sim_recorrente' | 'sim_pontuais' | 'nao' | 'nao_aplica';

export type Momento = 
  | 'explorador'
  | 'construtor'
  | 'operador'
  | 'referencia';

export type Urgencia = 'imediata' | 'curto_prazo' | 'medio_prazo' | 'longo_prazo';

export type Tempo = 'menos_3h' | '3_5h' | '6_10h' | 'mais_10h';

export type Barreira = 
  | 'nao_sei_comecar'
  | 'falta_tempo'
  | 'falta_posicionamento'
  | 'dificuldade_atrair_clientes'
  | 'dificuldade_vender'
  | 'falta_conhecimento'
  | 'falta_ferramentas'
  | 'falta_rede'
  | 'medo_impostor'
  | 'procrastinacao';

export type PresencaDigital = 
  | 'ativa'
  | 'nao_estrategica'
  | 'zero';

export interface OnboardingAnswers {
  objetivo?: Objetivo;
  subServico?: SubServico;
  clientes?: Clientes;
  momento?: Momento;
  urgencia?: Urgencia;
  tempo?: Tempo;
  barreiras?: Barreira[];
  presencaDigital?: PresencaDigital;
}

export interface Fase {
  numero: number;
  titulo: string;
  descricao: string;
  acoes: Acao[];
  marco: string;
}

export interface Acao {
  id: string;
  titulo: string;
  descricao: string;
  conteudoSuporte?: ConteudoSuporte;
  conteudosAdicionais?: ConteudoSuporte[];
  tarefaEsperada: string;
  promptsOmnia: string[];
  orientacoesComunidade: string[];
  criterioConclusao: string;
}

export interface ConteudoSuporte {
  tipo: 'curso' | 'aula' | 'material';
  titulo: string;
  descricao: string;
  fonte: string;
}

export interface PlanoPersonalizado {
  perfil: string;
  jornada: string;
  momento: Momento;
  mensagemBemVinda: string;
  primeiroPasso: string;
  fases: Fase[];
}
