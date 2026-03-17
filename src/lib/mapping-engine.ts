import type {
  OnboardingAnswers,
  PlanoPersonalizado,
  Momento,
  Fase,
  Acao,
  Barreira
} from '@/types/onboarding';

// Tipo interno — aulas de apoio são convertidas em Acao antes de entrar no plano
interface AulaApoioInterna {
  id: string;
  titulo: string;
  descricao: string;
  conteudoSuporte: { tipo: 'curso' | 'aula' | 'material'; titulo: string; descricao: string; fonte: string };
  tarefaContextualizada: string;
  criterioConclusao: string;
  barreiraOrigem: Barreira;
}

/**
 * Engine de mapeamento — Logica de Mapeamento - Social Media.md
 *
 * REGRAS FUNDAMENTAIS (R1-R16):
 * - R1: O plano SEMPRE tem exatamente 3 fases
 * - R2: Cada fase tem 3-4 passos (nunca mais)
 * - R7: MVP — Explorador NUNCA começa por "estudar a profissão", começa por PRODUZIR
 * - R8: Se urgência >= ALTA, inserir prospecção na Fase 1
 * - R9: Se urgência = CRÍTICA, escolher 1 formato vendável
 * - R14: P2 > P3 quando há contradição
 */

// ─── ETAPA 2: Determinação do Momento (P2×P3 cross-validation) ───

function determinarMomento(answers: OnboardingAnswers): Momento {
  const p3 = answers.momento ?? 'explorador';
  const p2 = answers.clientes ?? 'nao';

  if (p3 === 'explorador') {
    if (p2 === 'sim_pontuais') return 'construtor';
    if (p2 === 'sim_recorrente') return 'operador';
    return 'explorador';
  }
  if (p3 === 'construtor') {
    if (p2 === 'sim_recorrente') return 'operador';
    return 'construtor';
  }
  if (p3 === 'operador') {
    if (p2 === 'nao' || p2 === 'nao_aplica') return 'construtor';
    return 'operador';
  }
  if (p3 === 'referencia') {
    if (p2 === 'nao' || p2 === 'nao_aplica') return 'explorador';
    if (p2 === 'sim_pontuais') return 'construtor';
    return 'referencia';
  }
  if (p2 === 'nao_aplica') return 'explorador';
  return p3;
}

// ─── Pool de ações reutilizáveis ───

function acaoCriarCarrosseis(urgente: boolean): Acao {
  return {
    id: 'exp1-carrosseis',
    titulo: 'Criar seus primeiros carrosséis profissionais',
    descricao: urgente
      ? 'Você ainda não precisa ser especialista. O objetivo é criar seu primeiro carrossel, mesmo que imperfeito. Essa será a sua primeira peça de portfólio.'
      : 'O formato mais acessível para começar a produzir e montar portfólio.',
    conteudoSuporte: { tipo: 'curso', titulo: 'Estrutura de Carrosséis', descricao: '8 elementos de copywriting para carrossel + 5 princípios de design + 12 estruturas prontas.', fonte: 'Curso Estrutura de Carrosséis' },
    tarefaEsperada: '1. Escolha 1 estrutura de carrossel (recomendamos "erros e acertos" ou "checklist")\n2. Crie 1 carrossel de 5+ slides aplicando os 8 elementos de copy e os 5 princípios de design\n3. Use o Canva para montar as peças visuais\n4. Publique nas suas redes ou na comunidade',
    promptsOmnia: [
      'Me ajude a criar um carrossel no formato "erros e acertos" sobre [tema]. Quero 7 slides com stop scrolling no primeiro e CTA no último.',
      'Revise o texto do meu carrossel e me diga se os 8 elementos de copy estão presentes.',
    ],
    orientacoesComunidade: [
      'Publique seu carrossel na comunidade e pergunte: "O gancho do slide 1 faz vocês quererem continuar lendo? O que melhoraria?"',
      'Veja carrosséis de outros membros e comente o que chamou sua atenção. Isso treina seu olhar crítico.',
    ],
    criterioConclusao: 'Você terminou quando tiver 1 carrossel de 5+ slides criado no Canva, revisado com ajuda da Omnia e publicado. Não precisa ser perfeito. Precisa existir.',
  };
}

function acaoCanva(): Acao {
  return {
    id: 'exp1-canva',
    titulo: 'Montar peças visuais no Canva',
    descricao: 'Criar conteúdo com visual profissional sem precisar de formação em design.',
    conteudoSuporte: { tipo: 'curso', titulo: 'Canva', descricao: 'Templates, identidade visual, brand kit, exportação em alta qualidade.', fonte: 'Curso Canva' },
    tarefaEsperada: '1. Configure o brand kit no Canva (cores, fontes, logo)\n2. Crie 1 peça visual usando o brand kit configurado',
    promptsOmnia: ['Me ajude a definir uma paleta de cores e fontes para o nicho [nicho].'],
    orientacoesComunidade: ['Mostre seu brand kit na comunidade e pergunte: "A paleta transmite a personalidade da marca?"'],
    criterioConclusao: 'Você domina o Canva quando consegue criar uma peça visual profissional em menos de 30 minutos.',
  };
}

function acaoReels(): Acao {
  return {
    id: 'exp1-reels',
    titulo: 'Escrever roteiros de vídeos curtos (Reels)',
    descricao: 'Estruturar vídeos com roteiro em vez de improvisar. Formato muito pedido no mercado.',
    conteudoSuporte: { tipo: 'curso', titulo: 'Roteiro para Reels', descricao: 'Jornada Z + Teia da Criatividade para roteiros de vídeos curtos.', fonte: 'Curso Roteiro para Reels' },
    tarefaEsperada: '1. Use a Teia da Criatividade para gerar 9 pautas de vídeo\n2. Escolha 1 e escreva roteiro completo com a Jornada Z',
    promptsOmnia: ['Me ajude a aplicar a Teia da Criatividade para gerar 9 pautas de Reels sobre [tema].'],
    orientacoesComunidade: ['Publique seu roteiro na comunidade para feedback antes de gravar.'],
    criterioConclusao: 'Você terminou quando tiver 1 roteiro de Reels com Jornada Z escrito.',
  };
}

function acaoNicho(): Acao {
  return {
    id: 'exp1-nicho',
    titulo: 'Entender a profissão e escolher seu nicho',
    descricao: 'Saber o que a profissão exige de verdade e definir para quem trabalhar.',
    conteudoSuporte: { tipo: 'aula', titulo: 'Como Começar na Profissão Social Media', descricao: '4 dicas de profissionalismo (CNPJ, mentalidade, transformação), 4 passos para começar (clareza, case de sucesso, perfil, canais de divulgação) e ferramentas essenciais.', fonte: 'Aula Como Começar na Profissão Social Media' },
    tarefaEsperada: '1. Tenha clareza sobre a profissão: estude o que faz um SM e quais atributos precisa desenvolver\n2. Defina seu primeiro case de sucesso (atenda gratuitamente nos primeiros 2 meses)\n3. Configure seu perfil profissional e canais de divulgação (networking, WhatsApp, LinkedIn)',
    promptsOmnia: ['Me ajude a escolher um nicho de atuação como Social Media. Meus interesses são [interesses].'],
    orientacoesComunidade: ['Compartilhe seu nicho escolhido na comunidade e peça feedback.'],
    criterioConclusao: 'Você terminou quando tiver 1 nicho definido e pacote de entrada com preço.',
  };
}

function acaoConteudoEstrategico(): Acao {
  return {
    id: 'est-conteudo',
    titulo: 'Criar conteúdos estratégicos com o exercício P3D',
    descricao: 'Aplicar os 4 requisitos para relacionamento genuíno com a audiência e usar o exercício P3D para gerar 200 ideias de conteúdo.',
    conteudoSuporte: { tipo: 'aula', titulo: 'Como Criar Conteúdos Estratégicos', descricao: '4 requisitos para relacionamento genuíno: presença diária, mostrar quem é, assuntos do momento, resolver dores relevantes. Exercício P3D (Problemas, Dificuldades, Dúvidas, Desejos) que gera 200 ideias de conteúdo a partir de 5 itens por categoria.', fonte: 'Aula Conteúdos Estratégicos' },
    tarefaEsperada: '1. Execute o exercício P3D: liste 5 problemas, 5 dificuldades, 5 dúvidas e 5 desejos da sua audiência\n2. Para cada dor, elabore uma solução\n3. Entregue cada solução em 2 formatos diferentes (= 200 ideias)',
    promptsOmnia: ['Me ajude a fazer o exercício P3D para o nicho [nicho]: quais são os 5 principais problemas, dificuldades, dúvidas e desejos da audiência?'],
    orientacoesComunidade: ['Compartilhe sua lista P3D na comunidade e pergunte se identificam as mesmas dores da audiência.'],
    criterioConclusao: 'Você terminou quando tiver a lista P3D completa com pelo menos 20 dores mapeadas e soluções para cada uma.',
  };
}

function acaoLinhaEditorial(): Acao {
  return {
    id: 'est-linha',
    titulo: 'Construir sua linha editorial',
    descricao: 'Definir os temas, a voz e o tom que guiam toda a produção de conteúdo.',
    conteudoSuporte: { tipo: 'curso', titulo: 'Linha Editorial', descricao: 'Método 6Q1O para definir público-alvo (7 perguntas), buyer persona, 4 linhas editoriais (principal 70% + auxiliares 30%), Big Idea (original, outsider, nichada) e Big Picture.', fonte: 'Curso Linha Editorial' },
    tarefaEsperada: '1. Defina seu público-alvo com o método 6Q1O (7 perguntas)\n2. Estruture as 4 linhas editoriais: principal (70%), auxiliar 1, auxiliar 2, respiro (30%)\n3. Construa sua Big Idea com as 3 regras: original, outsider, nichada',
    promptsOmnia: ['Me ajude a construir uma linha editorial para o nicho [nicho]. Preciso de: público-alvo (6Q1O), 4 linhas editoriais com proporção 70/30 e Big Idea.'],
    orientacoesComunidade: ['Publique sua linha editorial na comunidade para feedback: "Minha Big Idea é clara? Ela me diferencia?"'],
    criterioConclusao: 'Você terminou quando tiver: público-alvo definido + 4 linhas editoriais com proporção + Big Idea documentada.',
  };
}

function acaoCalendario(): Acao {
  return {
    id: 'est-calendario',
    titulo: 'Montar o calendário editorial de 30 dias',
    descricao: 'Transformar ideias em rotina organizada de produção, com fluxo de aprovação.',
    conteudoSuporte: { tipo: 'curso', titulo: 'Calendário Editorial', descricao: 'Análise SWOT do negócio, 6 tipos de conteúdo (conexão, técnico, venda, autoridade + pautas quentes + analogias), sequência ideal de publicação, método SMART para metas, regra 98/2 (relacionamento vs. venda) e funil de conteúdo.', fonte: 'Curso Calendário Editorial' },
    tarefaEsperada: '1. Faça a análise SWOT do negócio\n2. Distribua os 6 tipos de conteúdo na sequência ideal (conexão→técnico→autoridade→conexão→venda)\n3. Defina metas SMART para os próximos 30 dias\n4. Aplique a regra 98/2: 98% relacionamento, 2% venda',
    promptsOmnia: ['Crie um calendário editorial de 30 dias para o nicho [nicho] usando a sequência conexão→técnico→autoridade→conexão→venda e a regra 98/2.'],
    orientacoesComunidade: ['Compartilhe seu calendário na comunidade: "Montei meu primeiro calendário de 30 dias com a regra 98/2."'],
    criterioConclusao: 'Você terminou quando tiver o calendário de 30 dias com SWOT + sequência + metas SMART.',
  };
}

function acaoMedirResultados(): Acao {
  return {
    id: 'est-metricas',
    titulo: 'Aprender a medir e reportar resultados',
    descricao: 'Entender a diferença entre métricas, KPIs e resultados, e saber quais acompanhar em cada cenário (lançamento, perpétuo, comercial).',
    conteudoSuporte: { tipo: 'aula', titulo: 'Análise de Métricas de Vendas no Digital', descricao: 'Diferença métricas/KPI/resultado. Métricas por cenário: lançamento (captação, aquecimento, ao vivo, carrinho), perpétuo e comercial. Testes A/B por área.', fonte: 'Aula Análise de Métricas' },
    tarefaEsperada: '1. Diferencie métricas, KPIs e resultados para o seu contexto\n2. Defina 3 KPIs estratégicos com metas para 90 dias\n3. Proponha 2 testes A/B para otimizar criativos ou páginas',
    promptsOmnia: ['Me ajude a definir os KPIs mais importantes para meu cenário de [lançamento/perpétuo/comercial] e propor testes A/B.'],
    orientacoesComunidade: ['Poste seus KPIs na comunidade e pergunte: "Esses indicadores refletem resultado real do meu trabalho?"'],
    criterioConclusao: 'Você terminou quando tiver 3 KPIs definidos e 2 testes A/B estruturados com hipóteses claras.',
  };
}

function acaoEsteiraPSM(): Acao {
  return {
    id: 'vender-psm',
    titulo: 'Estruturar seu serviço com o Método PSM',
    descricao: 'Transformar sua entrega em um produto com Instalação + Manutenção, recorrência previsível e preço por valor, não por hora.',
    conteudoSuporte: { tipo: 'curso', titulo: 'Método PSM — Prospectar, Servir, Manter', descricao: 'Como produtizar o serviço de Social Media no modelo Instalação + Manutenção, criar isca de valor e estruturar recorrência com 5–7 clientes.', fonte: 'Curso Método PSM' },
    tarefaEsperada: '1. Defina a transformação que você entrega (não a lista de tarefas)\n2. Separe seu serviço em Instalação (fase intensiva) e Manutenção (contrato recorrente), com escopo e preço de cada\n3. Crie sua isca de valor (ex: diagnóstico gratuito do perfil)\n4. Calcule preço mínimo: despesas mensais ÷ horas disponíveis',
    promptsOmnia: [
      'Me ajude a formatar meu serviço de Social Media no modelo Instalação + Manutenção do Método PSM. Meu nicho é [nicho].',
      'Crie uma isca de valor (diagnóstico gratuito) para eu usar na prospecção do nicho [nicho]. Quero algo que mostre minha expertise em 1 página.',
    ],
    orientacoesComunidade: ['Compartilhe na comunidade: "Reformulei meu serviço com Instalação + Manutenção. Qual parte ficou menos clara no escopo?"'],
    criterioConclusao: 'Você terminou quando tiver Instalação e Manutenção definidas com escopo, preço e isca de valor criada.',
  };
}

function acaoPescaEmBalde(): Acao {
  return {
    id: 'vender-pesca',
    titulo: 'Captar clientes com Pesca em Balde',
    descricao: 'Encontrar e pescar clientes em grupos online segmentados usando iscas de conteúdo, sem tráfego pago e sem spam.',
    conteudoSuporte: { tipo: 'curso', titulo: 'Tráfego Orgânico e Pesca em Balde', descricao: 'A internet não é um oceano, é um conjunto de baldes (grupos coesos). 4 passos: identificar grupos onde seu cliente ideal está → interagir genuinamente → criar iscas de conteúdo (posts que ensinam, não propaganda) → gerar interesse e iniciar conversas. Como avaliar balde bom vs. balde ruim.', fonte: 'Curso Pesca em Balde' },
    tarefaEsperada: '1. Liste 5 grupos (Facebook, WhatsApp, comunidades pagas) onde seu cliente ideal está\n2. Avalie cada grupo: é balde bom (engajamento real, público qualificado) ou ruim (spam, sem moderação)?\n3. Crie 2 iscas de conteúdo (posts que ensinam ou inspiram, não propaganda) e publique nos melhores baldes\n4. Interaja genuinamente por 1 semana e registre quantas conversas iniciou',
    promptsOmnia: ['Me ajude a criar uma isca de conteúdo para pescar clientes em um grupo de [nicho]. A isca precisa ensinar algo útil, não parecer propaganda.'],
    orientacoesComunidade: ['Compartilhe na comunidade: "Comecei a pescar clientes com iscas de conteúdo em grupos. Publiquei X iscas e iniciei Y conversas. O que posso melhorar?"'],
    criterioConclusao: 'Você terminou quando tiver 2 iscas publicadas em baldes qualificados + pelo menos 3 conversas iniciadas.',
  };
}

function acaoProspecaoIA(): Acao {
  return {
    id: 'vender-ia-prosp',
    titulo: 'Prospectar clientes com IA',
    descricao: 'Usar o framework PELI no ChatGPT para criar mensagens de prospecção personalizadas em volume, combinando com a estratégia RAI (Reciprocidade + Autoridade Instantânea).',
    conteudoSuporte: { tipo: 'curso', titulo: 'IA na Prospecção de Clientes', descricao: 'Framework PELI (Personagem, Exemplo, Linha de pensamento, Iteração) para gerar mensagens com IA. Estratégia RAI: entregar valor antes de pedir (Reciprocidade) com apresentação que transmita competência (Autoridade Instantânea). Script de 9 etapas para mensagem de abordagem. Onde encontrar prospects: Instagram, sites de depoimentos, comunidades, YouTube. Meta: 100 perfis/dia. Criar apresentações comerciais com Gamma + 3 técnicas de copy (FOMO, ancoragem, escassez).', fonte: 'Curso IA na Prospecção de Clientes' },
    tarefaEsperada: '1. Mapeie 10 leads reais em uma plataforma (Instagram, sites de depoimentos, comunidades)\n2. Use o PELI no ChatGPT para criar 1 mensagem personalizada para cada lead\n3. Itere pelo menos 3 versões da primeira mensagem antes de enviar\n4. Envie as 10 mensagens e registre a taxa de resposta',
    promptsOmnia: ['Use o framework PELI para criar uma mensagem de prospecção para um [tipo de negócio] do nicho [nicho]. Personagem: sou social media especialista em [área]. Exemplo: [cole referência]. Linha de pensamento: elogio real → observação estratégica → oferta de isca. Iteração: me dê 3 versões.'],
    orientacoesComunidade: ['Compartilhe na comunidade: "Mandei X mensagens PELI e recebi Y respostas. Qual versão vocês acham mais forte?"'],
    criterioConclusao: 'Você terminou quando tiver 10 mensagens PELI enviadas + taxa de resposta registrada + pelo menos 1 reunião agendada.',
  };
}

function acaoConduzirReuniao(): Acao {
  return {
    id: 'vender-reuniao',
    titulo: 'Conduzir reuniões de venda com o Método DEF',
    descricao: 'Conduzir conversa de venda consultiva sem parecer que está vendendo, usando escuta ativa, perguntas abertas e o Método DEF (Descoberta, Encantamento, Fechamento).',
    conteudoSuporte: { tipo: 'curso', titulo: 'Vendas 1:1 — Método DEF', descricao: 'Descoberta (50% escutando: entender a dor real do cliente com perguntas abertas, conexão genuína, PUV) → Encantamento (mostrar a solução vinculada ao que o cliente disse, usar storytelling e prova social) → Fechamento (definir próximo passo concreto, lidar com objeções: "está caro", "vou pensar", "vou falar com meu sócio"). Mentalidade: vendedor = guru que orienta, não empurra.', fonte: 'Curso Vendas 1:1 — Método DEF' },
    tarefaEsperada: '1. Prepare 10 perguntas abertas de Descoberta para sua reunião de SM (foco em entender a dor, não em apresentar o serviço)\n2. Conduza pelo menos 2 reuniões seguindo DEF: Descoberta → Encantamento → Fechamento\n3. Grave (com permissão) e analise: quanto % do tempo você falou vs. o cliente? (ideal: cliente fala 50%+)',
    promptsOmnia: [
      'Simule uma reunião de vendas DEF comigo. Você é um prospect do nicho [nicho] com objeções reais. Eu conduzo a reunião.',
      'Crie 10 perguntas de Descoberta para eu usar em reunião de vendas de Social Media com clientes do nicho [nicho].',
    ],
    orientacoesComunidade: ['Peça roleplay na comunidade: um membro faz o papel de cliente difícil. Treine a resposta às objeções "está caro" e "vou pensar".'],
    criterioConclusao: 'Você terminou quando tiver conduzido 2 reuniões DEF e identificado onde fugiu da estrutura.',
  };
}

function acaoFormalizarCliente(): Acao {
  return {
    id: 'vender-briefing',
    titulo: 'Formalizar o projeto com briefing estruturado',
    descricao: 'Iniciar o projeto com clareza total: briefing com as 4 categorias (negócio, redes, marca, entrega) que vira insumo para linha editorial, calendário e proposta comercial.',
    conteudoSuporte: { tipo: 'aula', titulo: 'Briefing — Primeiro Passo dos Projetos', descricao: 'Como criar, conduzir e documentar briefings eficazes. 4 categorias: negócio (modelo, público, concorrência), redes (canais ativos, frequência, resultados), marca (identidade, tom de voz, referências), entrega (escopo, prazos, expectativas). Um briefing bem feito elimina 80% das revisões. As respostas viram insumo para linha editorial, calendário e proposta comercial.', fonte: 'Aula 437' },
    tarefaEsperada: '1. Crie seu modelo de briefing com pelo menos 15 perguntas nas 4 categorias (negócio, redes, marca, entrega)\n2. Aplique o briefing no primeiro cliente (reunião ou formulário)\n3. Documente as respostas e identifique os insumos para a linha editorial e o calendário',
    promptsOmnia: [
      'Me ajude a criar um modelo de briefing para clientes de social media com perguntas sobre negócio, redes sociais, marca e entrega.',
      'Com base nestas respostas de briefing [cole as respostas], identifique os principais insumos para montar a linha editorial e o calendário do cliente.',
    ],
    orientacoesComunidade: ['Compartilhe seu modelo de briefing na comunidade: "Quantas perguntas vocês usam? Tem alguma que nunca pode faltar?"'],
    criterioConclusao: 'Você terminou quando tiver briefing aplicado em pelo menos 1 cliente + respostas documentadas.',
  };
}

function acaoGptCliente(): Acao {
  return {
    id: 'ia-gpt',
    titulo: 'Configurar assistente de IA por cliente',
    descricao: 'Criar um GPT personalizado por cliente, configurado com tom de voz, temas, vocabulário e restrições da marca, para automatizar tarefas repetitivas como copys, legendas e pautas.',
    conteudoSuporte: { tipo: 'curso', titulo: 'Criação de Agentes com GPT', descricao: 'Estrutura de prompt OCPC (Objetivo, Contexto, Processo, Critérios de saída). Como configurar GPTs no ChatGPT: nome, instruções, conversation starters e knowledge com brand guidelines do cliente. Casos de uso: agente de copy, de pauta, de briefing e de relatório.', fonte: 'Curso Criação de Agentes com GPT' },
    tarefaEsperada: '1. Escolha 1 cliente e reúna os materiais: brand guidelines, tom de voz, vocabulário proibido/permitido, exemplos de legendas\n2. Configure um GPT com OCPC: defina o Objetivo, o Contexto (nicho, público), o Processo (passo a passo) e os Critérios de saída (formato, tamanho)\n3. Adicione os materiais no Knowledge do GPT\n4. Teste com 3 inputs diferentes (1 legenda, 1 pauta, 1 copy de carrossel) e avalie a qualidade',
    promptsOmnia: ['Me ajude a montar as instruções OCPC para um GPT de copy para o cliente do nicho [nicho]. O tom de voz é [tom] e o público é [público].', 'Identifique 3 tarefas repetitivas da minha rotina de SM que poderiam ser automatizadas com um agente GPT.'],
    orientacoesComunidade: ['Compartilhe na comunidade: "Criei meu primeiro GPT personalizado para um cliente. Quem quer testar e me dar feedback?"'],
    criterioConclusao: 'Você terminou quando tiver 1 GPT configurado com OCPC + knowledge + testado com 3 inputs de qualidade aceitável.',
  };
}

function acaoFotografiaIA(): Acao {
  return {
    id: 'ia-foto',
    titulo: 'Criar fotografias profissionais com IA',
    descricao: 'Usar Midjourney e DALL·E/Sora para criar imagens profissionais para clientes: ensaios fotográficos, fotos de produto e imagens de campanha sem necessidade de estúdio.',
    conteudoSuporte: { tipo: 'curso', titulo: 'Fotografia Profissional com IA', descricao: 'Midjourney (imagens cinematográficas, prompts em inglês) e DALL·E/Sora (integrado ao ChatGPT, aceita português). Anatomia de prompt eficaz: sujeito, composição, iluminação, estilo, atmosfera, câmera/lente. Freepik para ensaios fotográficos automatizados. Como oferecer ensaios com IA como serviço adicional.', fonte: 'Curso Fotografia Profissional com IA' },
    tarefaEsperada: '1. Crie um prompt detalhado de fotografia (sujeito + composição + iluminação + estilo + atmosfera) e gere 5 imagens no DALL·E ou Midjourney\n2. Identifique 2 clientes do seu portfólio que se beneficiariam de ensaios com IA\n3. Monte uma proposta de serviço adicional de ensaio fotográfico com IA',
    promptsOmnia: [
      'Me ajude a criar um prompt profissional de fotografia com IA para [descrição do produto/pessoa]: defina sujeito, composição, iluminação, estilo e atmosfera.',
    ],
    orientacoesComunidade: ['Mostre seu mini-portfólio de imagens com IA na comunidade: "Dá para distinguir de foto real? Vocês ofereceriam ensaios com IA como serviço?"'],
    criterioConclusao: 'Você terminou quando tiver mini-portfólio de 5 imagens com IA + proposta de serviço adicional.',
  };
}

function acaoClonesIA(): Acao {
  return {
    id: 'ia-clones',
    titulo: 'Criar clones digitais e vídeos com IA',
    descricao: 'Usar Heygen (avatar em vídeo) e ElevenLabs (clonagem de voz) para escalar produção de vídeo sem o cliente precisar gravar.',
    conteudoSuporte: { tipo: 'curso', titulo: 'Criação de Clones e Vídeos com IA', descricao: 'Heygen: avatar digital com sincronia labial a partir de 1 vídeo de treino. ElevenLabs: clonagem de voz com entonação natural. Freepik: ensaios fotográficos do clone para criar thumbnails e imagens. Fluxo completo: Freepik → ElevenLabs → Heygen → integrar nos canais do cliente.', fonte: 'Curso Criação de Clones e Vídeos com IA' },
    tarefaEsperada: '1. Use o Heygen para criar 1 vídeo de 30 segundos com avatar digital\n2. Clone uma voz no ElevenLabs e teste a naturalidade\n3. Identifique 2 clientes que se beneficiariam de vídeos com clone (ex: conteúdo em escala, tradução)',
    promptsOmnia: [
      'Quais são os melhores casos de uso de clone digital (Heygen + ElevenLabs) para um social media que atende o nicho [nicho]?',
    ],
    orientacoesComunidade: ['Mostre seu vídeo com clone na comunidade: "Vocês conseguem perceber que é um avatar? Usariam isso para seus clientes?"'],
    criterioConclusao: 'Você terminou quando tiver 1 vídeo com clone + voz clonada + 2 casos de uso identificados.',
  };
}

function acaoVendasB2B(): Acao {
  return {
    id: 'vender-b2b',
    titulo: 'Prospectar empresas como clientes (B2B)',
    descricao: 'Entrar no mercado empresarial: prospecção pelo LinkedIn, qualificação com os 3Ps (Problema, Poder, Porte) e gestão de ciclos longos com múltiplos decisores.',
    conteudoSuporte: { tipo: 'curso', titulo: 'Vendas B2B — Prospecção e Qualificação', descricao: 'Qualificação com os 3Ps (Problema, Poder, Porte), funil B2B (Lead → Prospect → SQL → SAL → Cliente), prospecção ativa com fluxo de cadência, CAC/LTV e vendedor desafiador.', fonte: 'Curso Vendas B2B' },
    tarefaEsperada: '1. Identifique 5 empresas do seu nicho ideal no LinkedIn\n2. Aplique os 3Ps para qualificar cada uma (Problema: tem dor que você resolve? Poder: fala com decisor? Porte: tem verba?)\n3. Escreva 1 mensagem de abordagem personalizada por empresa (mencione um problema específico das redes delas)\n4. Envie as mensagens e registre os resultados',
    promptsOmnia: [
      'Analise o perfil do Instagram/LinkedIn da empresa [nome] e me diga: quais são os 3 principais problemas de conteúdo? Quais oportunidades estão sendo perdidas?',
      'Com base nessa análise [cole a análise], crie uma mensagem de abordagem B2B personalizada para Social Media.',
    ],
    orientacoesComunidade: ['Compartilhe na comunidade: "Estou começando a prospectar empresas B2B. Alguém já fez isso? O que funcionou?"'],
    criterioConclusao: 'Você terminou quando tiver feito 5 abordagens B2B qualificadas com os 3Ps.',
  };
}

function acaoMetricasProf(): Acao {
  return {
    id: 'ope-metricas',
    titulo: 'Profissionalizar sua análise de métricas',
    descricao: 'Dashboard de KPIs por cenário (lançamento, perpétuo, comercial) para cada cliente. Checklist de métricas e testes A/B.',
    conteudoSuporte: { tipo: 'aula', titulo: 'Análise de Métricas de Vendas no Digital', descricao: 'Métricas vs. KPI vs. resultado. Checklist por cenário: lançamento (captação→aquecimento→ao vivo→carrinho), perpétuo (CAC, conversão, ticket médio), comercial (MQL/SQL, ciclo de vendas, LTV). Testes A/B por área.', fonte: 'Aula Análise de Métricas' },
    tarefaEsperada: '1. Defina dashboard de KPIs por cenário para seu principal cliente\n2. Monte checklist de métricas + proponha testes A/B para otimização',
    promptsOmnia: ['Monte um dashboard de KPIs para meu cliente do nicho [nicho] no cenário [lançamento/perpétuo/comercial] com checklist de métricas.'],
    orientacoesComunidade: ['Peça feedback: "Meu checklist de métricas cobre as variáveis mais importantes?"'],
    criterioConclusao: 'Você terminou quando tiver dashboard de KPIs por cenário + checklist de métricas + testes A/B estruturados.',
  };
}

function acaoRefinarEstrategia(): Acao {
  return {
    id: 'ope-refine',
    titulo: 'Refinar estratégia com base em dados',
    descricao: 'Ajustar linha editorial, calendário e mix de pilares com base nos resultados reais dos últimos 30 dias.',
    conteudoSuporte: { tipo: 'aula', titulo: 'Estratégia de Social Media', descricao: 'Diagnóstico dos 5 tipos de objetivo do cliente, 4 tipos de conteúdo (conexão, autoridade, técnico, venda), linha editorial (principal, auxiliares, respiro) e proposta personalizada.', fonte: 'Aula Estratégia de Social Media' },
    tarefaEsperada: '1. Analise os últimos 20 posts: quais geraram mais saves e cliques?\n2. Ajuste sua linha editorial e a distribuição dos 4 tipos de conteúdo com base nos dados\n3. Reavalie se a proposta está personalizada ou baseada em pacotes',
    promptsOmnia: [
      'Analise estes dados dos meus últimos 20 posts e me diga quais padrões explicam os melhores resultados: [dados].',
      'Com base nesta análise [cole a análise], sugira como ajustar minha linha editorial e o mix dos 4 tipos de conteúdo.',
    ],
    orientacoesComunidade: ['Compartilhe seus achados na comunidade: "Analisei meus dados e descobri isso. Alguém teve padrão similar?"'],
    criterioConclusao: 'Você terminou quando tiver ajustado sua estratégia com base em dados reais.',
  };
}

function acaoAumentarTicket(): Acao {
  return {
    id: 'ope-ticket',
    titulo: 'Aumentar seu ticket com o framework CSO + POP',
    descricao: 'Usar Clareza, Segurança e Organização (CSO) para definir exatamente o que você entrega, e Posicionamento, Oferta e Precificação (POP) para cobrar pelo valor, não pelas horas.',
    conteudoSuporte: { tipo: 'aula', titulo: 'Como Cobrar o Que Seu Trabalho Vale', descricao: 'Framework CSO (Clareza do escopo, Segurança via diagnóstico/estratégia/execução, Organização com Eisenhower e Pomodoro) + Framework POP (Posicionamento, Oferta personalizada sem pacotes, Precificação com roteiro de 8 perguntas). Regra dos descontos: só dar em 3 situações justificáveis.', fonte: 'Aula 376' },
    tarefaEsperada: '1. Responda as 4 perguntas de Clareza: o que você faz, o que não faz, o que entrega como extra, o que comunica como overdelivery\n2. Execute o roteiro de 8 perguntas de precificação e chegue ao preço mínimo e ideal\n3. Monte uma oferta personalizada (sem pacotes) para apresentar ao cliente usando urgência e prazo\n4. Revise seus descontos atuais: cada um se encaixa nas 3 situações justificáveis?',
    promptsOmnia: ['Me ajude a aplicar o framework CSO para definir exatamente o escopo do meu serviço de Social Media para o nicho [nicho]. O que eu faço, o que não faço, e o que é overdelivery?', 'Execute comigo o roteiro de 8 perguntas de precificação da Aula 376 para chegar no meu preço ideal.'],
    orientacoesComunidade: ['Pergunte na comunidade: "Quanto outros SMs com resultados similares cobram? Alguém já aplicou o CSO para definir escopo?"'],
    criterioConclusao: 'Você terminou quando tiver o CSO preenchido (escopo claro) + preço calculado com o roteiro de 8 perguntas + 1 proposta personalizada apresentada.',
  };
}

function acaoPadronizar(): Acao {
  return {
    id: 'ope-processos',
    titulo: 'Padronizar processos de onboarding de clientes',
    descricao: 'Criar templates reutilizáveis para o fluxo completo de entrada de novos clientes: briefing estruturado, onboarding com datas e canal de atendimento, e programa de indicação.',
    conteudoSuporte: { tipo: 'aula', titulo: 'Briefing — Primeiro Passo dos Projetos', descricao: 'Como criar, conduzir e documentar briefings eficazes com as 4 categorias: negócio, redes, marca e entrega. Um briefing bem feito elimina 80% das revisões. As respostas viram insumo para linha editorial, calendário e proposta comercial.', fonte: 'Aula 437' },
    tarefaEsperada: '1. Crie seu template de briefing padrão (mínimo 15 perguntas nas 4 categorias: negócio, redes, marca, entrega)\n2. Documente o fluxo de onboarding: agendar todas as datas das fases na agenda do cliente, definir canal de atendimento com horários claros, preparar bônus surpresa baseado em algo que o cliente mencionou\n3. Estruture um programa de indicação: ao final da Instalação, ofereça cashback na Manutenção quando o cliente indicar alguém que feche',
    promptsOmnia: [
      'Me ajude a criar um template de briefing para projetos de social media com perguntas sobre negócio, redes, marca e entrega.',
      'Crie um checklist de onboarding de novos clientes de social media: desde o fechamento até o início da entrega.',
    ],
    orientacoesComunidade: ['Compartilhe seus templates na comunidade e pergunte: "O que falta neste briefing para ser completo? E no onboarding?"'],
    criterioConclusao: 'Você terminou quando tiver template de briefing + checklist de onboarding + programa de indicação documentados.',
  };
}

function acaoBrandingPessoal(): Acao {
  return {
    id: 'ref-branding',
    titulo: 'Consolidar posicionamento de marca pessoal',
    descricao: 'Aplicar para si o que você já faz para clientes: construir sua plataforma de marca pessoal com missão, diferencial intangível e público ideal.',
    conteudoSuporte: { tipo: 'curso', titulo: 'Branding e Posicionamento de Marca', descricao: 'Identidade vs. imagem de marca, diferencial intangível, plataforma de marca pessoal (missão, valores, público ideal), Lei de Pareto aplicada (20% dos clientes geram 80% dos resultados). Posicionamento: como a marca quer ser percebida vs. como é percebida de fato.', fonte: 'Curso Branding e Posicionamento de Marca' },
    tarefaEsperada: '1. Responda as perguntas de posicionamento: "Quem sou? O que faço? Como faço? Por que faço? Para quem sou?"\n2. Identifique seu público ideal usando critérios objetivos (quem gera mais receita, quem é mais fiel)\n3. Defina seus diferenciais intangíveis, ou seja, o que faz você ser único entre outros Social Media\n4. Documente 3 cases de resultado com: contexto, desafio, solução e resultados com números',
    promptsOmnia: [
      'Me ajude a construir minha plataforma de marca pessoal como Social Media: missão, público ideal, diferenciais intangíveis e posicionamento.',
      'Me ajude a documentar um case de resultado para meu cliente do nicho [nicho]. Preciso: contexto, desafio, solução, resultado com números.',
    ],
    orientacoesComunidade: ['Compartilhe um case documentado na comunidade e ofereça mentorar membros em fase anterior à sua.'],
    criterioConclusao: 'Você terminou quando tiver plataforma de marca pessoal documentada + 3 cases documentados.',
  };
}

function acaoConteudo5Camadas(): Acao {
  return {
    id: 'ref-5camadas',
    titulo: 'Produzir conteúdo com as 5 Camadas',
    descricao: 'Usar a Teoria das 5 Camadas de Conteúdo de forma consciente para consolidar autoridade e gerar conversão.',
    conteudoSuporte: { tipo: 'curso', titulo: 'Fundamentos do Conteúdo — Teoria das 5 Camadas', descricao: 'Metaconteúdo (bastidores, processo), conteúdo próprio (expertise, 70% da produção), conteúdo público (participações externas, collabs), conteúdo interno (comunicação íntima, close friends), conteúdo privado/direct (fechamento, regra dos 5 minutos). A 5ª camada é onde a venda acontece.', fonte: 'Curso Fundamentos do Conteúdo' },
    tarefaEsperada: '1. Mapeie sua produção atual: qual % está em cada camada?\n2. Ajuste para ter 70% na camada própria (expertise)\n3. Produza conteúdo usando as 5 camadas de forma consciente por 1 semana\n4. Aplique a regra dos 5 minutos: responda a todo direct em até 5 minutos durante o horário de pico',
    promptsOmnia: [
      'Revise meu conteúdo da última semana e me diga se estou usando as 5 camadas de conteúdo (metaconteúdo, próprio, público, interno, direct) de forma estratégica.',
    ],
    orientacoesComunidade: ['Compartilhe na comunidade: "Mapeei meu conteúdo nas 5 camadas. Descobri que X% está na camada Y. Vocês têm distribuição parecida?"'],
    criterioConclusao: 'Você terminou quando tiver produzido conteúdo usando as 5 camadas por 1 semana e avaliado os resultados.',
  };
}

function acaoCarrosseisProfissional(): Acao {
  return {
    id: 'con1-carrosseis',
    titulo: 'Criar carrosséis com os 8 elementos de copy',
    descricao: 'Aplicar a estrutura profissional de carrossel: copy que para o scroll no slide 1 e leva ao CTA no último.',
    conteudoSuporte: { tipo: 'curso', titulo: 'Estrutura de Carrosséis', descricao: '8 elementos de copywriting para carrossel + 5 princípios de design + 12 estruturas prontas para qualquer nicho.', fonte: 'Curso Estrutura de Carrosséis' },
    tarefaEsperada: '1. Escolha 1 das 12 estruturas de carrossel do curso\n2. Crie 2 carrosséis aplicando os 8 elementos de copy e os 5 princípios de design\n3. Publique ou salve para usar como portfólio',
    promptsOmnia: [
      'Revise o texto do meu carrossel e me diga se os 8 elementos de copy estão presentes. [cole o texto]',
      'Me ajude a criar um carrossel no formato [estrutura escolhida] sobre [tema] para o nicho [nicho].',
    ],
    orientacoesComunidade: ['Publique um dos carrosséis na comunidade e pergunte: "O gancho do slide 1 faz vocês quererem continuar lendo?"'],
    criterioConclusao: 'Você terminou quando tiver 2 carrosséis criados com os 8 elementos de copy aplicados.',
  };
}

function acaoRotierosProfissional(): Acao {
  return {
    id: 'con1-reels',
    titulo: 'Escrever roteiros de Reels com a Jornada Z',
    descricao: 'Estruturar vídeos curtos com roteiro usando a Jornada Z e a Teia da Criatividade, para nunca mais improvisar na frente da câmera.',
    conteudoSuporte: { tipo: 'curso', titulo: 'Roteiro para Reels', descricao: 'Jornada Z para estruturar o roteiro + Teia da Criatividade para gerar 9 pautas a partir de qualquer tema.', fonte: 'Curso Roteiro para Reels' },
    tarefaEsperada: '1. Use a Teia da Criatividade para gerar 9 pautas de Reels do seu nicho\n2. Escolha 2 pautas e escreva os roteiros completos com a Jornada Z\n3. Grave pelo menos 1 dos roteiros',
    promptsOmnia: [
      'Me ajude a aplicar a Teia da Criatividade para gerar 9 pautas de Reels sobre [tema] no nicho [nicho].',
      'Estruture este roteiro de Reel com a Jornada Z: [ideia do vídeo].',
    ],
    orientacoesComunidade: ['Publique seu roteiro na comunidade antes de gravar e peça: "O gancho dos primeiros 3 segundos prende?"'],
    criterioConclusao: 'Você terminou quando tiver 2 roteiros escritos com a Jornada Z e pelo menos 1 gravado.',
  };
}

function acaoCanvaProfissional(): Acao {
  return {
    id: 'con1-canva',
    titulo: 'Configurar identidade visual no Canva',
    descricao: 'Criar brand kit com cores, fontes e logo para que todas as peças do cliente tenham visual consistente.',
    conteudoSuporte: { tipo: 'curso', titulo: 'Canva como Ferramenta de Design', descricao: 'Brand kit, templates profissionais, identidade visual, exportação em alta qualidade e como criar peças em menos de 30 minutos.', fonte: 'Curso Canva' },
    tarefaEsperada: '1. Configure o brand kit no Canva: cores, fontes, logo\n2. Crie 2 peças visuais usando o brand kit configurado (podem ser os carrosséis já escritos)\n3. Teste: exporte em alta qualidade e veja se ficou profissional',
    promptsOmnia: [
      'Me ajude a definir uma paleta de cores e fontes para uma marca do nicho [nicho] com posicionamento [posicionamento].',
    ],
    orientacoesComunidade: ['Mostre seu brand kit na comunidade: "A paleta transmite a personalidade da marca? Parece profissional?"'],
    criterioConclusao: 'Você terminou quando tiver brand kit configurado e 2 peças criadas com identidade visual consistente.',
  };
}

// ─── CATÁLOGO DE AULAS DE APOIO — Mapa de Conexões — Aulas de Apoio.md ───

function apoioPorOndeComecar(barreira: Barreira): AulaApoioInterna {
  return {
    id: 'apoio-305',
    titulo: 'Encontrar seu ponto de partida',
    descricao: 'Descobrir por onde começar usando a Regra dos Terços e a distinção entre desejo e escolha.',
    conteudoSuporte: { tipo: 'aula', titulo: 'Por Onde Começar', descricao: 'Regra dos Terços (1/3 vai dar certo, 1/3 razoável, 1/3 não funciona), diferença entre desejo e escolha, como encontrar propósito e direção.', fonte: 'Aula 305' },
    tarefaContextualizada: 'Escreva 3 coisas que já sabe fazer no digital. Para cada uma, avalie: é desejo ou escolha? Defina 1 ação concreta para esta semana.',
    criterioConclusao: 'Você terminou quando tiver listado 3 habilidades, classificado cada uma e definido 1 ação concreta para a semana.',
    barreiraOrigem: barreira,
  };
}

function apoioIniciativa(barreira: Barreira): AulaApoioInterna {
  return {
    id: 'apoio-412',
    titulo: 'Desenvolver iniciativa e proatividade',
    descricao: 'Sair do "conforto do zero" e dar o primeiro passo com pequenas vitórias.',
    conteudoSuporte: { tipo: 'aula', titulo: 'Como Ter Iniciativa', descricao: 'Conforto do zero (a inércia é confortável mas improdutiva), estratégia de pequenas vitórias, como ir além do esperado sem esperar permissão.', fonte: 'Aula 412' },
    tarefaContextualizada: 'Identifique 1 situação esta semana onde pode ir além do esperado. Execute e registre o resultado.',
    criterioConclusao: 'Você terminou quando tiver identificado a situação, agido e registrado o resultado.',
    barreiraOrigem: barreira,
  };
}

function apoioGestaoTarefas(barreira: Barreira): AulaApoioInterna {
  return {
    id: 'apoio-383',
    titulo: 'Organizar tarefas e prioridades',
    descricao: 'Usar os 3 horizontes de planejamento para organizar o que precisa fazer.',
    conteudoSuporte: { tipo: 'aula', titulo: 'Gestão de Tarefas', descricao: '3 horizontes de planejamento (dia, semana, mês), matriz de priorização, como sair da reatividade e entrar no planejamento.', fonte: 'Aula 383' },
    tarefaContextualizada: 'Liste todas as tarefas pendentes e classifique nos 3 horizontes (dia, semana, mês). Priorize as 3 mais importantes do dia.',
    criterioConclusao: 'Você terminou quando tiver todas as tarefas classificadas e as 3 prioridades do dia definidas.',
    barreiraOrigem: barreira,
  };
}

function apoioRotina(barreira: Barreira): AulaApoioInterna {
  return {
    id: 'apoio-366',
    titulo: 'Criar rotina produtiva com blocos de tempo',
    descricao: 'Montar uma rotina que concilie trabalho e estudo usando blocos de tempo e a regra dos 2 minutos.',
    conteudoSuporte: { tipo: 'aula', titulo: 'Conciliar Vida Pessoal e Trabalho', descricao: 'Blocos de tempo, regra dos 2 minutos, Os 7 Hábitos (Covey), como criar rotina sustentável sem burnout.', fonte: 'Aula 366' },
    tarefaContextualizada: 'Monte sua rotina ideal da semana com blocos de tempo dedicados ao plano. Reserve pelo menos 2 blocos de 1 hora.',
    criterioConclusao: 'Você terminou quando tiver sua rotina semanal montada com pelo menos 2 blocos de 1 hora dedicados ao plano.',
    barreiraOrigem: barreira,
  };
}

function apoioMedoVideo(barreira: Barreira): AulaApoioInterna {
  return {
    id: 'apoio-415',
    titulo: 'Perder o medo de aparecer em vídeo',
    descricao: 'Técnicas práticas para superar o desconforto de se expor: Power Pose, prática deliberada e aceitação da imperfeição.',
    conteudoSuporte: { tipo: 'aula', titulo: 'Medo de Falar em Vídeos', descricao: 'Power Pose (2 min antes de gravar), prática deliberada, gravar sem publicar como treino, lidar com julgamento e exposição.', fonte: 'Aula 415' },
    tarefaContextualizada: 'Grave 1 vídeo de 30 segundos sobre algo que você domina. Não precisa publicar, apenas grave e assista.',
    criterioConclusao: 'Você terminou quando tiver gravado e assistido ao vídeo de 30 segundos.',
    barreiraOrigem: barreira,
  };
}

function apoioTomadaDecisao(barreira: Barreira): AulaApoioInterna {
  return {
    id: 'apoio-416',
    titulo: 'Tomar decisões com mais segurança',
    descricao: 'Usar árvore de decisão e reconhecer vieses cognitivos para decidir melhor em reuniões e negociações.',
    conteudoSuporte: { tipo: 'aula', titulo: 'Tomada de Decisões', descricao: 'Vieses cognitivos (ancoragem, confirmação, disponibilidade), árvore de decisão, análise pré-mortem, decidir sob pressão sem paralisar.', fonte: 'Aula 416' },
    tarefaContextualizada: 'Identifique 1 decisão pendente na sua jornada e aplique a árvore de decisão para escolher o melhor caminho.',
    criterioConclusao: 'Você terminou quando tiver aplicado a árvore de decisão a 1 decisão pendente e feito a escolha.',
    barreiraOrigem: barreira,
  };
}

function apoioMetas(barreira: Barreira): AulaApoioInterna {
  return {
    id: 'apoio-428',
    titulo: 'Definir metas claras e mensuráveis',
    descricao: 'Usar OKRs e o modelo NICE para criar metas que direcionam o aprendizado e mantêm a disciplina.',
    conteudoSuporte: { tipo: 'aula', titulo: 'Definir Metas', descricao: 'OKRs (Objetivos e Key Results), modelo NICE (Próximo do coração, Inspiradora, Contextual, Energizante), revisão semanal e mensal.', fonte: 'Aula 428' },
    tarefaContextualizada: 'Defina 1 meta para os próximos 30 dias usando o modelo NICE. Desdobre em 3 Key Results mensuráveis.',
    criterioConclusao: 'Você terminou quando tiver 1 meta NICE definida com 3 Key Results mensuráveis.',
    barreiraOrigem: barreira,
  };
}

function apoioCriatividade(barreira: Barreira): AulaApoioInterna {
  return {
    id: 'apoio-441',
    titulo: 'Gerar ideias criativas para conteúdo',
    descricao: 'Usar os Seis Chapéus de Pensamento e o Método Disney para criar conteúdo de forma estruturada.',
    conteudoSuporte: { tipo: 'aula', titulo: 'Ideias Criativas', descricao: 'Seis Chapéus de Pensamento (De Bono), Método Disney (Sonhador, Realista, Crítico), como gerar ideias mesmo sem inspiração.', fonte: 'Aula 441' },
    tarefaContextualizada: 'Escolha 1 tema e aplique os Seis Chapéus de Pensamento para gerar 6 abordagens diferentes de conteúdo.',
    criterioConclusao: 'Você terminou quando tiver 6 abordagens diferentes geradas a partir de 1 tema.',
    barreiraOrigem: barreira,
  };
}

function apoioProcrastinacao(barreira: Barreira): AulaApoioInterna {
  return {
    id: 'apoio-442',
    titulo: 'Vencer a procrastinação',
    descricao: 'Técnicas práticas para sair da inércia: Pomodoro, autorregulação e mindfulness aplicado à produtividade.',
    conteudoSuporte: { tipo: 'aula', titulo: 'Vencer Procrastinação', descricao: 'Técnica Pomodoro (25 min foco + 5 min pausa), autorregulação emocional, mindfulness como ferramenta de foco, identificar gatilhos de procrastinação.', fonte: 'Aula 442' },
    tarefaContextualizada: 'Aplique a técnica Pomodoro (25 min foco + 5 min pausa) por 1 dia inteiro e registre o que produziu.',
    criterioConclusao: 'Você terminou quando tiver aplicado Pomodoro por 1 dia inteiro e registrado a produção.',
    barreiraOrigem: barreira,
  };
}

function apoioAprenderComFalhas(barreira: Barreira): AulaApoioInterna {
  return {
    id: 'apoio-444',
    titulo: 'Aprender com falhas e erros',
    descricao: 'Transformar medo de errar em motor de aprendizado usando neurociência do erro e a zona de crescimento.',
    conteudoSuporte: { tipo: 'aula', titulo: 'Aprender com Falhas', descricao: 'Neurociência do erro (errar ativa aprendizado), modelo FBI de feedback (Fato, Behavior, Impacto), 3 zonas (conforto, crescimento, pânico).', fonte: 'Aula 444' },
    tarefaContextualizada: 'Liste 3 erros recentes e para cada um escreva: o que aprendi e o que faço diferente agora. Identifique em qual zona está.',
    criterioConclusao: 'Você terminou quando tiver analisado 3 erros e identificado a zona em que está.',
    barreiraOrigem: barreira,
  };
}

function apoioComunicacaoLateral(barreira: Barreira): AulaApoioInterna {
  return {
    id: 'apoio-com-lateral',
    titulo: 'Comunicar-se melhor com clientes e colegas',
    descricao: 'Praticar os 3 Cs (Clareza, Comunicação, Cooperação) e escuta ativa para construir rede de contatos.',
    conteudoSuporte: { tipo: 'curso', titulo: 'Comunicação Lateral', descricao: '3 Cs (Clareza, Comunicação, Cooperação), escuta ativa e empatia, assertividade, comunicação não verbal.', fonte: 'Curso Comunicação Lateral' },
    tarefaContextualizada: 'Pratique escuta ativa em 1 conversa esta semana: parafraseie o que a pessoa disse antes de responder.',
    criterioConclusao: 'Você terminou quando tiver praticado escuta ativa em pelo menos 1 conversa.',
    barreiraOrigem: barreira,
  };
}

function apoioFeedback(barreira: Barreira): AulaApoioInterna {
  return {
    id: 'apoio-feedback',
    titulo: 'Dar e receber feedback com eficácia',
    descricao: 'Identificar os 3 gatilhos que bloqueiam feedback e praticar feedback construtivo em reuniões de venda.',
    conteudoSuporte: { tipo: 'curso', titulo: 'Dar e Receber Feedbacks', descricao: '3 gatilhos (verdade, relacionamento, identidade), feedback positivo e corretivo, como solicitar feedback específico.', fonte: 'Curso Dar e Receber Feedbacks' },
    tarefaContextualizada: 'Dê 1 feedback positivo a alguém hoje usando fatos específicos. Identifique qual dos 3 gatilhos é mais forte em você.',
    criterioConclusao: 'Você terminou quando tiver dado 1 feedback com fatos específicos e identificado seu gatilho principal.',
    barreiraOrigem: barreira,
  };
}

function apoioAdaptabilidade(barreira: Barreira): AulaApoioInterna {
  return {
    id: 'apoio-adaptabilidade',
    titulo: 'Desenvolver adaptabilidade',
    descricao: 'Avaliar seu Quociente de Adaptabilidade e usar a ferramenta GROW para planejar adaptações.',
    conteudoSuporte: { tipo: 'curso', titulo: 'Adaptabilidade', descricao: 'Quociente de Adaptabilidade (flexibilidade, curiosidade, coragem, resiliência), ferramenta GROW (Goals, Reality, Options, Wrap Up), mundo BANI.', fonte: 'Curso Adaptabilidade' },
    tarefaContextualizada: 'Avalie seu QA (1 a 10) para cada elemento: flexibilidade, curiosidade, coragem, resiliência. Aplique GROW ao menor.',
    criterioConclusao: 'Você terminou quando tiver avaliado os 4 elementos e aplicado GROW ao mais fraco.',
    barreiraOrigem: barreira,
  };
}

function apoioNetworking(barreira: Barreira): AulaApoioInterna {
  return {
    id: 'apoio-405',
    titulo: 'Construir sua rede de contatos',
    descricao: 'Aprender técnicas práticas de networking para criar conexões profissionais que geram oportunidades.',
    conteudoSuporte: { tipo: 'aula', titulo: 'Como Fazer Networking', descricao: 'Como iniciar conversas, manter relacionamentos profissionais, networking em eventos e online, follow-up estratégico.', fonte: 'Aula 405' },
    tarefaContextualizada: 'Identifique 3 pessoas do seu nicho que gostaria de conhecer. Inicie uma conversa genuína com pelo menos 1 delas esta semana.',
    criterioConclusao: 'Você terminou quando tiver iniciado contato com pelo menos 1 pessoa da sua lista.',
    barreiraOrigem: barreira,
  };
}

function apoioTerrenoEhVoce(barreira: Barreira): AulaApoioInterna {
  return {
    id: 'apoio-378',
    titulo: 'Reconhecer seu valor e construir autoconfiança',
    descricao: 'Entender que o terreno é você: seus conhecimentos, experiências e perspectiva única são seu maior ativo profissional.',
    conteudoSuporte: { tipo: 'aula', titulo: 'O Terreno É Você', descricao: 'Autoconhecimento como base profissional, identificar pontos fortes únicos, construir confiança a partir do que já sabe, parar de se comparar.', fonte: 'Aula 378' },
    tarefaContextualizada: 'Liste 5 coisas que você já sabe fazer bem (mesmo que pareçam simples). Para cada uma, escreva como ela pode ser útil para um cliente.',
    criterioConclusao: 'Você terminou quando tiver listado 5 habilidades e conectado cada uma a um benefício para o cliente.',
    barreiraOrigem: barreira,
  };
}

// ─── CONVERSÃO AulaApoioInterna → Acao ───

function apoioParaAcao(apoio: AulaApoioInterna): Acao {
  return {
    id: apoio.id,
    titulo: apoio.titulo,
    descricao: apoio.descricao,
    conteudoSuporte: apoio.conteudoSuporte,
    tarefaEsperada: apoio.tarefaContextualizada,
    promptsOmnia: [],
    orientacoesComunidade: [],
    criterioConclusao: apoio.criterioConclusao,
  };
}

// ─── MAPEAMENTO BARREIRA → AULAS DE APOIO (com seleção por contexto) ───
//
// Barreiras COMPORTAMENTAIS têm múltiplos candidatos de apoio.
// A função selecionarApoio escolhe o melhor com base nas outras respostas do usuário.
// Barreiras TÉCNICAS retornam [] (o plano regular já resolve).

interface CandidatoApoio {
  gerar: (b: Barreira) => AulaApoioInterna;
  /** Quando este candidato é preferido — verificado contra OnboardingAnswers */
  quando?: (answers: OnboardingAnswers) => boolean;
}

type BarreiraApoioMap = Record<Barreira, CandidatoApoio[]>;

const MAPA_APOIO: BarreiraApoioMap = {
  // ─── COMPORTAMENTAIS (com candidatos + contexto) ───

  nao_sei_comecar: [
    // Se explorador ou sem clientes → "Por Onde Começar" (framework de direção)
    { gerar: apoioPorOndeComecar, quando: (a) => a.momento === 'explorador' || a.clientes === 'nao' },
    // Se já tem alguma noção mas trava na ação → "Iniciativa" (sair da inércia)
    { gerar: apoioIniciativa },
  ],

  falta_tempo: [
    // Se urgência alta → Gestão de Tarefas (priorização imediata)
    { gerar: apoioGestaoTarefas, quando: (a) => a.urgencia === 'imediata' || a.urgencia === 'curto_prazo' },
    // Se também tem procrastinação → Metas (OKRs para direcionar o pouco tempo)
    { gerar: apoioMetas, quando: (a) => (a.barreiras ?? []).includes('procrastinacao') },
    // Default → Rotina (blocos de tempo)
    { gerar: apoioRotina },
  ],

  procrastinacao: [
    // Sempre → Procrastinação (Pomodoro, autorregulação) — é direto no problema
    { gerar: apoioProcrastinacao },
  ],

  medo_impostor: [
    // Se explorador (começando do zero) → "O Terreno É Você" (construir confiança)
    { gerar: apoioTerrenoEhVoce, quando: (a) => a.momento === 'explorador' || a.clientes === 'nao' },
    // Se já tem clientes mas se sente inseguro → "Aprender com Falhas" (neurociência do erro)
    { gerar: apoioAprenderComFalhas },
  ],

  falta_rede: [
    // Se explorador ou sem presença → "Networking" (como iniciar do zero)
    { gerar: apoioNetworking, quando: (a) => a.momento === 'explorador' || a.presencaDigital === 'zero' },
    // Se já tem alguma presença → "Comunicação Lateral" (melhorar a comunicação existente)
    { gerar: apoioComunicacaoLateral },
  ],

  // ─── TÉCNICAS — sem apoio extra (o plano regular já resolve) ───
  falta_posicionamento: [],
  dificuldade_atrair_clientes: [],
  dificuldade_vender: [],
  falta_conhecimento: [],
  falta_ferramentas: [],
};

/** Seleciona o melhor apoio entre os candidatos, baseado no contexto do usuário */
function selecionarApoio(
  candidatos: CandidatoApoio[],
  barreira: Barreira,
  answers: OnboardingAnswers
): AulaApoioInterna | null {
  if (!candidatos.length) return null;

  // Procurar o primeiro candidato cuja condição "quando" é true
  for (const c of candidatos) {
    if (c.quando && c.quando(answers)) {
      return c.gerar(barreira);
    }
  }
  // Se nenhuma condição específica bateu, usar o último (default/fallback)
  const fallback = candidatos[candidatos.length - 1];
  return fallback.gerar(barreira);
}

// ─── POSICIONAMENTO: onde inserir cada barreira ───
//
// 'inicio'  → posição 0 da fase (precisa resolver ANTES de qualquer ação)
// 'fim'     → final da fase (complemento)
//
// Lógica:
// - procrastinacao/nao_sei_comecar/medo_impostor/falta_tempo → início (bloqueia a execução)
// - falta_conhecimento/falta_ferramentas → fim (complementa)
// - dificuldade_atrair_clientes/dificuldade_vender → início da fase de vendas
// - falta_posicionamento → início da fase de estratégia
// - falta_rede → fim da fase de vendas

type PosicaoInsercao = 'inicio' | 'fim';

const POSICAO_BARREIRA: Record<Barreira, PosicaoInsercao> = {
  procrastinacao: 'inicio',
  nao_sei_comecar: 'inicio',
  medo_impostor: 'inicio',
  falta_tempo: 'inicio',
  falta_posicionamento: 'inicio',
  dificuldade_atrair_clientes: 'inicio',
  dificuldade_vender: 'inicio',
  falta_conhecimento: 'fim',
  falta_ferramentas: 'fim',
  falta_rede: 'fim',
};

// Barreiras que devem ser injetadas na fase que contém vendas (em vez de Fase 1)
const BARREIRAS_FASE_VENDAS: Barreira[] = [
  'dificuldade_atrair_clientes',
  'dificuldade_vender',
  'falta_rede',
];

// Barreiras que devem ser injetadas na fase que contém estratégia/branding
const BARREIRAS_FASE_ESTRATEGIA: Barreira[] = [
  'falta_posicionamento',
];

function identificarFaseAlvo(
  fases: Fase[],
  barreira: Barreira
): number {
  if (BARREIRAS_FASE_VENDAS.includes(barreira)) {
    const idx = fases.findIndex(f =>
      f.acoes.some(a =>
        a.id.startsWith('vender-') || a.titulo.toLowerCase().includes('vend')
      )
    );
    return idx >= 0 ? idx : 0;
  }
  if (BARREIRAS_FASE_ESTRATEGIA.includes(barreira)) {
    const idx = fases.findIndex(f =>
      f.acoes.some(a =>
        a.id.startsWith('est-') || a.id.startsWith('ref-branding') ||
        a.titulo.toLowerCase().includes('estratég') ||
        a.titulo.toLowerCase().includes('linha editorial') ||
        a.titulo.toLowerCase().includes('posicionamento')
      )
    );
    return idx >= 0 ? idx : 0;
  }
  // Maioria das barreiras → Fase 1 (índice 0)
  return 0;
}

// Máximo de ações por fase (R2: 3-4 passos, nunca mais)
const MAX_ACOES_POR_FASE = 4;

function aplicarAulasApoio(fases: Fase[], barreiras: Barreira[], answers: OnboardingAnswers): void {
  if (!barreiras.length) return;

  // 1. Para cada barreira comportamental, selecionar o melhor apoio pelo contexto
  const injecoes: { faseIdx: number; posicao: PosicaoInsercao; acao: Acao }[] = [];
  const idsVistos = new Set<string>();

  for (const barreira of barreiras) {
    const candidatos = MAPA_APOIO[barreira];
    if (!candidatos || !candidatos.length) continue;

    const apoio = selecionarApoio(candidatos, barreira, answers);
    if (!apoio) continue;

    if (idsVistos.has(apoio.id)) continue;
    idsVistos.add(apoio.id);

    const faseIdx = identificarFaseAlvo(fases, barreira);
    const posicao = POSICAO_BARREIRA[barreira];
    injecoes.push({ faseIdx, posicao, acao: apoioParaAcao(apoio) });
  }

  // 2. Máximo 1 aula de apoio por fase
  const contadorPorFase = new Map<number, number>();
  const injecoesFiltradas = injecoes.filter(({ faseIdx }) => {
    const count = contadorPorFase.get(faseIdx) ?? 0;
    if (count >= 1) return false;
    contadorPorFase.set(faseIdx, count + 1);
    return true;
  });

  // 3. Inserir na posição certa, garantindo que a fase nunca exceda MAX_ACOES_POR_FASE
  for (const { faseIdx, posicao, acao } of injecoesFiltradas) {
    const fase = fases[faseIdx];

    // Se já está no limite, remover a última ação regular para dar espaço
    if (fase.acoes.length >= MAX_ACOES_POR_FASE) {
      if (posicao === 'inicio') {
        fase.acoes.pop(); // Remove a última para manter o limite
      } else {
        fase.acoes.pop(); // Remove a última para substituir pelo apoio
      }
    }

    if (posicao === 'inicio') {
      fase.acoes.splice(0, 0, acao);
    } else {
      fase.acoes.push(acao);
    }
  }
}

// ─── OS 4 PLANOS — SEMPRE 3 FASES (R1) ───

function planoExplorador(urgente: boolean, critica: boolean, tempoLimitado: boolean): Fase[] {
  // SM-EXP: MVP — começa por PRODUÇÃO, não fundamentos
  // Sem urgência: F1 Criar → F2 Estratégia → F3 Vender
  // Com urgência: F1 Criar + Nicho → F2 Vender (precisa faturar) → F3 Estratégia (refinar)

  const fase1Acoes: Acao[] = [acaoCriarCarrosseis(urgente), acaoCanva()];
  if (!tempoLimitado) fase1Acoes.push(acaoReels());
  fase1Acoes.push(acaoNicho());
  // R2: max 4 ações por fase
  const f1Final = fase1Acoes.slice(0, 4);

  if (urgente || critica) {
    // URGÊNCIA: Fase 2 = Vendas (precisa faturar logo), Fase 3 = Estratégia (refinamento)
    return [
      {
        numero: 1,
        titulo: 'Criar suas primeiras entregas',
        descricao: 'Sair do zero e ter peças de conteúdo prontas para usar como portfólio e oferecer como serviço.',
        acoes: f1Final,
        marco: '3 peças de conteúdo criadas + nicho escolhido + pacote de entrada definido com preço',
      },
      {
        numero: 2,
        titulo: 'Vender seu serviço',
        descricao: 'Você precisa faturar. Use as peças criadas como portfólio e vá atrás dos primeiros clientes.',
        acoes: [
          acaoEsteiraPSM(),
          acaoPescaEmBalde(),
          acaoConduzirReuniao(),
          acaoFormalizarCliente(),
        ],
        marco: 'Esteira de serviços documentada + 2 reuniões realizadas + 1 cliente fechado com briefing',
      },
      {
        numero: 3,
        titulo: 'Dar propósito ao que você produz',
        descricao: 'Agora que já tem clientes, organize seu conteúdo com estratégia para entregar mais resultado.',
        acoes: [
          acaoConteudoEstrategico(),
          acaoLinhaEditorial(),
          acaoCalendario(),
          acaoMedirResultados(),
        ],
        marco: 'Linha editorial documentada + calendário de 30 dias montado + KPIs definidos',
      },
    ];
  }

  // SEM URGÊNCIA: ordem padrão — F1 Criar → F2 Estratégia → F3 Vender
  return [
    {
      numero: 1,
      titulo: 'Criar suas primeiras entregas',
      descricao: 'Sair do zero e ter peças de conteúdo prontas para usar como portfólio.',
      acoes: f1Final,
      marco: '3 peças de conteúdo criadas + nicho escolhido + pacote de entrada definido com preço',
    },
    {
      numero: 2,
      titulo: 'Dar propósito ao que você produz',
      descricao: 'Organizar conteúdo com estratégia para saber por que cada post existe.',
      acoes: [
        acaoConteudoEstrategico(),
        acaoLinhaEditorial(),
        acaoCalendario(),
        acaoMedirResultados(),
      ],
      marco: 'Linha editorial documentada + calendário de 30 dias montado + KPIs definidos',
    },
    {
      numero: 3,
      titulo: 'Vender seu serviço',
      descricao: 'Estruturar uma oferta profissional e conseguir os primeiros clientes.',
      acoes: [
        acaoEsteiraPSM(),
        acaoPescaEmBalde(),
        acaoConduzirReuniao(),
        acaoFormalizarCliente(),
      ],
      marco: 'Esteira de serviços documentada + 2 reuniões realizadas + 1 cliente fechado com briefing',
    },
  ];
}

function planoConstrutor(urgente: boolean): Fase[] {
  // SM-CON: Já sabe o que quer, precisa profissionalizar e vender
  // Sem urgência: F1 Produção → F2 Estratégia e Gestão → F3 Vendas
  // Com urgência: F1 Produção → F2 Vendas (precisa faturar) → F3 Estratégia (refinamento)

  if (urgente) {
    // URGÊNCIA: Fase 2 = Vendas, Fase 3 = Estratégia
    return [
      {
        numero: 1,
        titulo: 'Produção profissional',
        descricao: 'Criar peças de conteúdo com qualidade técnica para usar como portfólio e oferecer como serviço.',
        acoes: [
          acaoCarrosseisProfissional(),
          acaoRotierosProfissional(),
          acaoCanvaProfissional(),
          acaoLinhaEditorial(),
        ],
        marco: '2 carrosséis + 2 roteiros de Reels + brand kit configurado + linha editorial',
      },
      {
        numero: 2,
        titulo: 'Vender e captar clientes',
        descricao: 'Você precisa faturar. Estruture sua oferta e vá atrás dos primeiros clientes com as peças que criou.',
        acoes: [
          acaoEsteiraPSM(),
          acaoPescaEmBalde(),
          acaoConduzirReuniao(),
          acaoFormalizarCliente(),
        ],
        marco: 'Esteira PSM + 2 reuniões + 1 cliente fechado',
      },
      {
        numero: 3,
        titulo: 'Estratégia e gestão de clientes',
        descricao: 'Agora que já tem clientes, profissionalize a operação e refine a estratégia com dados.',
        acoes: [
          acaoConteudoEstrategico(),
          acaoMedirResultados(),
          acaoPadronizar(),
        ],
        marco: 'P3D completo + KPIs definidos + processos padronizados',
      },
    ];
  }

  // SEM URGÊNCIA: ordem padrão
  return [
    {
      numero: 1,
      titulo: 'Produção profissional',
      descricao: 'Criar peças de conteúdo com qualidade técnica usando os cursos específicos de cada formato.',
      acoes: [
        acaoCarrosseisProfissional(),
        acaoRotierosProfissional(),
        acaoCanvaProfissional(),
        acaoLinhaEditorial(),
      ],
      marco: '2 carrosséis + 2 roteiros de Reels + brand kit configurado + linha editorial',
    },
    {
      numero: 2,
      titulo: 'Estratégia e gestão de clientes',
      descricao: 'Dar profundidade ao conteúdo e profissionalizar a operação.',
      acoes: [
        acaoConteudoEstrategico(),
        acaoMedirResultados(),
        acaoPadronizar(),
      ],
      marco: 'P3D completo + KPIs definidos + processos padronizados',
    },
    {
      numero: 3,
      titulo: 'Vendas e crescimento',
      descricao: 'Estruturar oferta e captar clientes de forma consistente.',
      acoes: [
        acaoEsteiraPSM(),
        acaoPescaEmBalde(),
        acaoConduzirReuniao(),
        acaoFormalizarCliente(),
      ],
      marco: 'Esteira PSM + 2 reuniões + 1 cliente fechado',
    },
  ];
}

function planoOperador(urgente: boolean, barreiras: Barreira[]): Fase[] {
  // SM-OPE: Já tem clientes recorrentes, já sabe entregar.
  // Lógica de conselheiro: a Fase 1 deve ser o que a pessoa MAIS PRECISA agora.
  //
  // Sinais de que vendas é a prioridade imediata:
  //   - urgência financeira (precisa faturar mais)
  //   - barreiras: dificuldade_vender ou dificuldade_atrair_clientes
  // Se vendas é prioridade → F1 Vendas, F2 Otimizar, F3 IA
  // Se urgente mas barreira é outra → F1 Otimizar, F2 Vendas, F3 IA
  // Sem urgência → F1 Otimizar, F2 IA, F3 Vendas

  const vendaEhPrioridade = urgente && (
    barreiras.includes('dificuldade_vender') ||
    barreiras.includes('dificuldade_atrair_clientes')
  );

  const faseOtimizar: Fase = {
    numero: 0, // ajustado abaixo
    titulo: 'Otimizar sua operação',
    descricao: 'Profissionalizar métricas, processos e estratégia com base em dados reais.',
    acoes: [
      acaoMetricasProf(),
      acaoRefinarEstrategia(),
      acaoPadronizar(),
      acaoAumentarTicket(),
    ],
    marco: 'Dashboard de KPIs + estratégia ajustada + processos padronizados + ticket revisado',
  };

  const faseVendas: Fase = {
    numero: 0,
    titulo: 'Escalar vendas e faturamento',
    descricao: vendaEhPrioridade
      ? 'Você já sabe entregar e precisa faturar mais. Essa é a prioridade: escalar vendas com novos clientes e mercado B2B.'
      : 'Estruturar vendas mais sofisticadas e entrar no mercado B2B.',
    acoes: [
      acaoEsteiraPSM(),
      acaoPescaEmBalde(),
      acaoProspecaoIA(),
      acaoVendasB2B(),
    ],
    marco: 'Esteira PSM revisada + prospecção ativa + vendas B2B iniciadas',
  };

  const faseIA: Fase = {
    numero: 0,
    titulo: 'Escalar com tecnologia',
    descricao: 'Usar IA como ferramenta de escala para produzir mais sem sacrificar qualidade.',
    acoes: [
      acaoGptCliente(),
      acaoFotografiaIA(),
      acaoClonesIA(),
    ],
    marco: 'GPT por cliente configurado + portfólio de IA + vídeo com clone',
  };

  let ordenadas: Fase[];
  if (vendaEhPrioridade) {
    // Vendas primeiro — já sabe entregar, precisa de clientes/faturamento
    ordenadas = [faseVendas, faseOtimizar, faseIA];
  } else if (urgente) {
    // Urgente mas barreira não é vendas — otimiza primeiro, vende segundo
    ordenadas = [faseOtimizar, faseVendas, faseIA];
  } else {
    // Sem urgência — otimiza, escala com IA, depois vende
    ordenadas = [faseOtimizar, faseIA, faseVendas];
  }

  // Numerar fases
  ordenadas.forEach((f, i) => { f.numero = i + 1; });
  return ordenadas;
}

function planoReferencia(urgente: boolean, barreiras: Barreira[]): Fase[] {
  // SM-REF: Já é referência no mercado, clientes recorrentes, sabe entregar.
  // Lógica de conselheiro: a Fase 1 deve ser o que a pessoa MAIS PRECISA agora.
  //
  // Sinais de que vendas é a prioridade imediata:
  //   - urgência financeira (precisa escalar faturamento)
  //   - barreiras: dificuldade_vender ou dificuldade_atrair_clientes
  // Se vendas é prioridade → F1 Vendas alto valor, F2 Autoridade, F3 IA
  // Se urgente mas barreira é outra → F1 Autoridade, F2 Vendas, F3 IA
  // Sem urgência → F1 Autoridade, F2 IA, F3 Vendas

  const vendaEhPrioridade = urgente && (
    barreiras.includes('dificuldade_vender') ||
    barreiras.includes('dificuldade_atrair_clientes')
  );

  const faseAutoridade: Fase = {
    numero: 0,
    titulo: 'Consolidar sua autoridade',
    descricao: 'Posicionamento de marca pessoal, conteúdo de alto nível e cases de resultado.',
    acoes: [
      acaoBrandingPessoal(),
      acaoConteudo5Camadas(),
      acaoRefinarEstrategia(),
      acaoMedirResultados(),
    ],
    marco: 'Marca pessoal consolidada + conteúdo com 5 camadas ativo + 3 cases documentados + estratégia refinada',
  };

  const faseVendas: Fase = {
    numero: 0,
    titulo: 'Vendas de alto valor',
    descricao: vendaEhPrioridade
      ? 'Você já é referência e precisa escalar faturamento. Essa é a prioridade: entrar no B2B e aumentar seu ticket.'
      : 'Vendas B2B, ticket premium e posicionamento como referência.',
    acoes: [
      acaoEsteiraPSM(),
      acaoVendasB2B(),
      acaoConduzirReuniao(),
    ],
    marco: 'Esteira premium + vendas B2B ativas + posicionamento de referência',
  };

  const faseIA: Fase = {
    numero: 0,
    titulo: 'Escalar com IA avançada',
    descricao: 'Ferramentas de IA para escalar produção sem perder qualidade.',
    acoes: [
      acaoGptCliente(),
      acaoFotografiaIA(),
      acaoClonesIA(),
    ],
    marco: 'GPT por cliente + portfólio de IA + vídeo com clone',
  };

  let ordenadas: Fase[];
  if (vendaEhPrioridade) {
    // Vendas primeiro — já é referência, precisa converter isso em faturamento
    ordenadas = [faseVendas, faseAutoridade, faseIA];
  } else if (urgente) {
    // Urgente mas barreira não é vendas — consolida autoridade, depois vende
    ordenadas = [faseAutoridade, faseVendas, faseIA];
  } else {
    // Sem urgência — autoridade, IA, depois vendas
    ordenadas = [faseAutoridade, faseIA, faseVendas];
  }

  ordenadas.forEach((f, i) => { f.numero = i + 1; });
  return ordenadas;
}

// ─── MENSAGENS E PRIMEIRO PASSO ───

function getMensagemBemVinda(momento: Momento, urgente: boolean, vendaEhPrioridade: boolean): string {
  if (momento === 'explorador') {
    return urgente
      ? 'Você precisa de resultado rápido, e o melhor jeito de aprender Social Media é fazendo. Seu plano começa pela prática: criar conteúdo, montar portfólio e oferecer seu serviço. A teoria vem depois, como refinamento. Primeiro faz, depois melhora.'
      : 'Essa jornada foi pensada para quem está começando e quer resultados práticos. Você vai aprender fazendo: primeiro cria, depois refina com estratégia. A prioridade é produzir suas primeiras entregas e começar a se posicionar para vender.';
  }
  if (momento === 'construtor') {
    return urgente
      ? 'Você já sabe o que quer e precisa faturar. Sua jornada foca em produzir com qualidade profissional e ir atrás de clientes o mais rápido possível. A estratégia vem depois, como refinamento.'
      : 'Você já sabe o que quer, e agora é hora de estruturar. Sua jornada foca em produzir com qualidade profissional, organizar sua operação e captar clientes de forma consistente.';
  }
  if (momento === 'operador') {
    if (vendaEhPrioridade) {
      return 'Você já sabe entregar e tem clientes, mas precisa faturar mais. Seu plano começa direto por vendas: escalar a captação e entrar no mercado B2B. A otimização e a tecnologia vêm em seguida para sustentar o crescimento.';
    }
    return urgente
      ? 'Você já produz e tem clientes. Sua jornada foca em otimizar o que já funciona e escalar vendas para aumentar o faturamento. A tecnologia vem como ferramenta de escala na sequência.'
      : 'Você já produz e tem clientes. Sua jornada foca em otimizar o que já funciona, usar IA para escalar e estruturar vendas mais sofisticadas para aumentar o faturamento.';
  }
  // referencia
  if (vendaEhPrioridade) {
    return 'Você já é referência no mercado e agora precisa converter essa autoridade em faturamento. Seu plano começa por vendas de alto valor e mercado B2B. A consolidação da marca e as ferramentas de IA vêm para sustentar esse crescimento.';
  }
  return urgente
    ? 'Você já é referência. Sua jornada foca em consolidar sua marca pessoal e entrar rapidamente em vendas de alto valor no mercado B2B. A IA avançada vem depois para escalar a produção.'
    : 'Você já é referência. Sua jornada foca em consolidar sua marca pessoal, usar IA avançada para escalar e entrar em vendas de alto valor no mercado B2B.';
}

function getPrimeiroPasso(fases: Fase[]): string {
  const primeiraAcao = fases[0]?.acoes[0];
  if (!primeiraAcao) return '';

  const id = primeiraAcao.id;

  // Explorador — criar carrosséis (urgente ou não)
  if (id === 'exp1-carrosseis') {
    return 'Seu primeiro resultado está na Ação 1 da Fase 1: criar seu primeiro carrossel. Não precisa ser perfeito, precisa existir. Essa será a sua primeira peça de portfólio e o ponto de partida para tudo que vem depois.';
  }

  // Construtor — carrosséis profissionais com 8 elementos de copy
  if (id === 'con1-carrosseis') {
    return 'Seu primeiro resultado está na Ação 1 da Fase 1: produzir carrosséis aplicando os 8 elementos de copy e os 5 princípios de design. É a peça que mostra que você entrega com qualidade profissional.';
  }

  // Operador / Referência — estruturar serviço com PSM (vendaEhPrioridade)
  if (id === 'vender-psm') {
    return 'Seu primeiro resultado está na Ação 1 da Fase 1: transformar seu serviço em um produto com Instalação + Manutenção usando o Método PSM. Isso é o que separa um freelancer de um profissional com recorrência previsível.';
  }

  // Operador — profissionalizar métricas (urgente ou sem urgência, barreira ≠ venda)
  if (id === 'ope-metricas') {
    return 'Seu primeiro resultado está na Ação 1 da Fase 1: montar seu dashboard de KPIs por cenário. Isso transforma achismo em decisão baseada em dados e mostra para o cliente que seu trabalho gera resultado mensurável.';
  }

  // Referência — consolidar marca pessoal (urgente ou sem urgência, barreira ≠ venda)
  if (id === 'ref-branding') {
    return 'Seu primeiro resultado está na Ação 1 da Fase 1: construir sua plataforma de marca pessoal com missão, diferencial e público ideal. É aplicar para si o que você já faz para clientes e se posicionar como referência no mercado.';
  }

  // Fallback genérico
  return `Seu primeiro resultado está na Ação 1 da Fase 1: ${primeiraAcao.titulo.toLowerCase()}. Comece por aí e o restante do plano vai fazer sentido.`;
}

function getNomeJornada(momento: Momento): string {
  const nomes: Record<Momento, string> = {
    explorador: 'Jornada Primeiros Clientes como Social Media',
    construtor: 'Jornada Produção Profissional como Social Media',
    operador: 'Jornada Escalar como Social Media',
    referencia: 'Jornada Autoridade como Social Media',
  };
  return nomes[momento];
}

// ─── FUNÇÃO PRINCIPAL ───

export function gerarPlanoPersonalizado(
  answers: OnboardingAnswers
): PlanoPersonalizado {
  if (answers.objetivo !== 'prestar_servicos' || answers.subServico !== 'social_media') {
    throw new Error('Apenas o perfil Social Media está implementado nesta versão');
  }

  const momento = determinarMomento(answers);
  const urgente = answers.urgencia === 'imediata' || answers.urgencia === 'curto_prazo';
  const critica = answers.urgencia === 'imediata';
  const tempoLimitado = answers.tempo === 'menos_3h';
  const barreiras = (answers.barreiras ?? []) as Barreira[];
  const vendaEhPrioridade = urgente && (
    barreiras.includes('dificuldade_vender') ||
    barreiras.includes('dificuldade_atrair_clientes')
  );

  let fases: Fase[];
  switch (momento) {
    case 'explorador':
      fases = planoExplorador(urgente, critica, tempoLimitado);
      break;
    case 'construtor':
      fases = planoConstrutor(urgente);
      break;
    case 'operador':
      fases = planoOperador(urgente, barreiras);
      break;
    case 'referencia':
      fases = planoReferencia(urgente, barreiras);
      break;
  }

  // Injetar aulas de apoio baseadas nas barreiras (v1.1)
  aplicarAulasApoio(fases, barreiras, answers);

  return {
    perfil: 'Social Media',
    jornada: getNomeJornada(momento),
    momento,
    mensagemBemVinda: getMensagemBemVinda(momento, urgente, vendaEhPrioridade),
    primeiroPasso: getPrimeiroPasso(fases),
    fases,
  };
}
