export const SOURCE_CONTEXT = {
  speaker: 'Luiz Inácio Lula da Silva',
  shortName: 'Lula',
  event: 'discurso de vitória após o segundo turno',
  dateLabel: 'outubro de 2026',
  context: 'Compromissos apresentados por Lula em seu discurso de vitória após o segundo turno da eleição presidencial, em outubro de 2026.',
  sourceTitle: 'Íntegra e vídeo do pronunciamento da vitória de Lula',
  sourceUrl: 'https://www.poder360.com.br/poder-eleicoes-2026/leia-a-integra-do-pronunciamento-da-vitoria-de-lula-2/',
  recordingUrl: 'https://www12.senado.leg.br/noticias/videos/2026/10/reeleito-presidente-lula-agradece-apoio-do-povo-e-sobretudo-das-mulheres',
  provenance: 'Íntegra e vídeo publicados pelo Poder360 em 25 de outubro de 2026; registro audiovisual também disponível no Senado Notícias.',
  externallyVerified: true
};

export const THEMES = [
  {
    id: 'democracia-governo',
    title: 'Democracia e governo participativo',
    description: 'Participação social, comunicação pública e respeito às instituições.'
  },
  {
    id: 'ambiente-digital',
    title: 'Ambiente digital',
    description: 'Regras, segurança e tributação no espaço digital.'
  },
  {
    id: 'direitos-cuidado',
    title: 'Direitos e cuidado',
    description: 'Proteção, respeito e liberdade para diferentes grupos da população.'
  },
  {
    id: 'educacao',
    title: 'Educação e permanência estudantil',
    description: 'Jornada escolar, apoio a estudantes e formação científica.'
  },
  {
    id: 'tecnologia-dados',
    title: 'Tecnologia e soberania de dados',
    description: 'Capacidade tecnológica nacional, infraestrutura e proteção de dados.'
  },
  {
    id: 'desenvolvimento-economico',
    title: 'Desenvolvimento econômico',
    description: 'Economias digital, verde e criativa com desenvolvimento inclusivo.'
  },
  {
    id: 'clima-internacional',
    title: 'Clima e atuação internacional',
    description: 'Política climática, cooperação, autonomia e paz.'
  },
  {
    id: 'saude-sus',
    title: 'Saúde e SUS',
    description: 'Fortalecimento do sistema público, oncologia e inovação no cuidado.'
  },
  {
    id: 'seguranca-publica',
    title: 'Segurança pública',
    description: 'Coordenação federativa, prevenção, proteção e responsabilização legal.'
  }
];

export const ROUTES = [
  {
    id: 'conhecer-mapear',
    title: 'Conhecer e mapear',
    description: 'Entender o problema, reunir dados confiáveis e ouvir quem é afetado.'
  },
  {
    id: 'ajudar-diretamente',
    title: 'Ajudar diretamente',
    description: 'Apoiar pessoas ou iniciativas existentes sem substituir serviços públicos.'
  },
  {
    id: 'mobilizar-pessoas',
    title: 'Mobilizar pessoas',
    description: 'Conectar pessoas, promover conversas e organizar uma ação coletiva segura.'
  },
  {
    id: 'acompanhar-cobrar',
    title: 'Acompanhar e cobrar',
    description: 'Monitorar decisões e resultados e dialogar com os órgãos responsáveis.'
  }
];

const PUBLIC_SOURCE_LIBRARY = {
  brasilParticipativo: {
    title: 'Brasil Participativo',
    url: 'https://brasilparticipativo.presidencia.gov.br/',
    description: 'Consulte processos participativos, propostas, consultas e dados abertos.'
  },
  portalTransparencia: {
    title: 'Portal da Transparência',
    url: 'https://portaldatransparencia.gov.br/',
    description: 'Acompanhe despesas, receitas, programas e transferências federais.'
  },
  dadosGov: {
    title: 'Portal Brasileiro de Dados Abertos',
    url: 'https://dados.gov.br/',
    description: 'Busque bases públicas e verifique órgão responsável, período e atualização.'
  },
  constituicao: {
    title: 'Constituição Federal',
    url: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm',
    description: 'Confira direitos, deveres e competências dos Poderes e entes federativos.'
  },
  camara: {
    title: 'Proposições da Câmara dos Deputados',
    url: 'https://www.camara.leg.br/busca-portal/proposicoes/pesquisa-simplificada',
    description: 'Pesquise projetos, tramitação, textos, votações e autoria.'
  },
  senado: {
    title: 'Atividade Legislativa do Senado',
    url: 'https://www25.senado.leg.br/web/atividade',
    description: 'Acompanhe matérias, comissões, agendas e votações no Senado.'
  },
  anpdMarcoCivil: {
    title: 'ANPD — Marco Civil da Internet',
    url: 'https://www.gov.br/anpd/pt-br/assuntos/marco-civil-da-internet',
    description: 'Veja normas, fiscalização e deveres de plataformas e provedores.'
  },
  anpd: {
    title: 'Autoridade Nacional de Proteção de Dados',
    url: 'https://www.gov.br/anpd/pt-br',
    description: 'Acompanhe regulação, consultas e orientações sobre proteção de dados.'
  },
  mjOuvidoria: {
    title: 'Ouvidoria do Ministério da Justiça',
    url: 'https://www.gov.br/mj/pt-br/canais_atendimento/pgouvidoria',
    description: 'Consulte os canais adequados para manifestações e encaminhamentos.'
  },
  mjDados: {
    title: 'Dados Abertos do Ministério da Justiça',
    url: 'https://www.gov.br/mj/pt-br/acesso-a-informacao/dados-abertos/capa',
    description: 'Consulte bases públicas, inclusive ocorrências e estatísticas de segurança.'
  },
  receitaDados: {
    title: 'Dados Abertos da Receita Federal',
    url: 'https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/dados-abertos',
    description: 'Procure bases e informações oficiais sobre arrecadação e administração tributária.'
  },
  pessoaIdosa: {
    title: 'Direitos da Pessoa Idosa — MDHC',
    url: 'https://www.gov.br/mdh/pt-br/navegue-por-temas/pessoa-idosa/',
    description: 'Consulte políticas, direitos, conselhos e materiais de proteção.'
  },
  mulheres: {
    title: 'Ministério das Mulheres',
    url: 'https://www.gov.br/mulheres/pt-br',
    description: 'Acompanhe políticas, programas, dados e canais de atendimento às mulheres.'
  },
  ligue180: {
    title: 'Ligue 180',
    url: 'https://www.gov.br/mulheres/pt-br/ligue180',
    description: 'Veja orientações e o canal público de atendimento e denúncia de violência contra a mulher.'
  },
  disque100: {
    title: 'Disque 100 — Direitos Humanos',
    url: 'https://www.gov.br/mdh/pt-br/ondh',
    description: 'Conheça o canal para registrar e acompanhar denúncias de violações de direitos humanos.'
  },
  censo2022: {
    title: 'Censo Demográfico 2022 — IBGE',
    url: 'https://censo2022.ibge.gov.br/',
    description: 'Consulte dados populacionais e territoriais, inclusive sobre religião.'
  },
  censoEscolar: {
    title: 'Censo Escolar — Inep',
    url: 'https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/censo-escolar',
    description: 'Acompanhe matrículas, jornada, escolas, profissionais e infraestrutura.'
  },
  escolaIntegral: {
    title: 'Programa Escola em Tempo Integral — MEC',
    url: 'https://www.gov.br/mec/pt-br/escola-em-tempo-integral',
    description: 'Consulte normas, adesões, recursos e materiais do programa.'
  },
  peDeMeia: {
    title: 'Pé-de-Meia — MEC',
    url: 'https://www.gov.br/mec/pt-br/assuntos/pe-de-meia',
    description: 'Confira regras, público, calendário e canais oficiais do programa.'
  },
  censoSuperior: {
    title: 'Censo da Educação Superior — Inep',
    url: 'https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/censo-da-educacao-superior',
    description: 'Consulte matrículas, cursos, instituições, permanência e conclusão.'
  },
  capesDados: {
    title: 'Produtos de dados da CAPES',
    url: 'https://www.gov.br/capes/pt-br/centrais-de-conteudo/produtos-digitais-da-capes',
    description: 'Explore GeoCAPES, indicadores e dados abertos sobre formação e pesquisa.'
  },
  mctiIndicadores: {
    title: 'Indicadores de Ciência, Tecnologia e Inovação — MCTI',
    url: 'https://www.gov.br/mcti/pt-br/acesso-a-informacao/dados-abertos/dados-abertos/paginas/indicadores-nacionais-de-ciencia-tecnologia-e-inovacao',
    description: 'Acompanhe investimento, formação, pesquisa, inovação e capacidade tecnológica.'
  },
  epeDataCenters: {
    title: 'EPE — Energia e data centers',
    url: 'https://epe.gov.br/pt/areas-de-atuacao/energia-eletrica/coleta-de-dados-de-data-center',
    description: 'Entenda a demanda elétrica prevista e o planejamento associado a data centers.'
  },
  aneelDados: {
    title: 'Dados Abertos da ANEEL',
    url: 'https://dadosabertos.aneel.gov.br/pt_BR/',
    description: 'Consulte geração, transmissão, distribuição, tarifas e qualidade do serviço elétrico.'
  },
  snirh: {
    title: 'Sistema Nacional de Informações sobre Recursos Hídricos',
    url: 'https://www.snirh.gov.br/',
    description: 'Verifique disponibilidade, uso e gestão de água nos territórios.'
  },
  ibamaLicenciamento: {
    title: 'Licenciamento Ambiental Federal — Ibama',
    url: 'https://www.gov.br/ibama/pt-br/assuntos/laf',
    description: 'Acompanhe processos, estudos e decisões de licenciamento ambiental federal.'
  },
  ctir: {
    title: 'Centro de Prevenção, Tratamento e Resposta a Incidentes Cibernéticos',
    url: 'https://www.gov.br/ctir/pt-br',
    description: 'Consulte alertas, recomendações e estatísticas de incidentes cibernéticos no governo.'
  },
  cetic: {
    title: 'Cetic.br — Indicadores digitais',
    url: 'https://cetic.br/',
    description: 'Use pesquisas e indicadores sobre acesso, uso da internet e transformação digital.'
  },
  bndesVerde: {
    title: 'BNDES — Economia verde e desenvolvimento social',
    url: 'https://bndes.gov.br/wps/portal/site/home/desenvolvimento-sustentavel/resultados/desembolsos-em-economia-verde-e-desenvolvimento-social',
    description: 'Acompanhe desembolsos e critérios de apoio a iniciativas verdes e sociais.'
  },
  ipeadata: {
    title: 'Ipeadata',
    url: 'https://www.ipeadata.gov.br/',
    description: 'Consulte séries econômicas, sociais, regionais e ambientais.'
  },
  sniic: {
    title: 'Sistema Nacional de Informações e Indicadores Culturais',
    url: 'https://www.gov.br/cultura/pt-br/assuntos/sistema-nacional-de-informacoes-e-indicadores-culturais-sniic',
    description: 'Busque dados, agentes, espaços e indicadores da economia e da política cultural.'
  },
  adaptaBrasil: {
    title: 'AdaptaBrasil MCTI',
    url: 'https://adaptabrasil.mcti.gov.br/',
    description: 'Consulte riscos e impactos climáticos atuais e projetados por território.'
  },
  terraBrasilis: {
    title: 'TerraBrasilis — INPE',
    url: 'https://terrabrasilis.dpi.inpe.br/',
    description: 'Acompanhe mapas e dados oficiais de desmatamento e cobertura da terra.'
  },
  mmaClima: {
    title: 'Mudança do Clima — MMA',
    url: 'https://www.gov.br/mma/pt-br/assuntos/mudanca-do-clima',
    description: 'Acompanhe planos, metas, governança e políticas climáticas federais.'
  },
  concordia: {
    title: 'Concórdia — Atos Internacionais do Brasil',
    url: 'https://concordia.itamaraty.gov.br/',
    description: 'Pesquise acordos, tratados e outros atos internacionais firmados pelo Brasil.'
  },
  abc: {
    title: 'Agência Brasileira de Cooperação',
    url: 'https://www.gov.br/abc/pt-br',
    description: 'Acompanhe programas, projetos e acordos de cooperação técnica internacional.'
  },
  datasus: {
    title: 'DATASUS',
    url: 'https://datasus.saude.gov.br/',
    description: 'Consulte sistemas e indicadores públicos sobre atendimento, saúde e gestão do SUS.'
  },
  siops: {
    title: 'SIOPS — Orçamentos Públicos em Saúde',
    url: 'https://portalfns.saude.gov.br/siops/',
    description: 'Acompanhe receitas e despesas em saúde declaradas por estados e municípios.'
  },
  conselhoSaude: {
    title: 'Conselho Nacional de Saúde',
    url: 'https://www.gov.br/conselho-nacional-de-saude/pt-br',
    description: 'Veja resoluções, agendas e caminhos de participação e controle social do SUS.'
  },
  incaPainel: {
    title: 'Painel Público de Indicadores do INCA',
    url: 'https://www.gov.br/inca/pt-br/acesso-a-informacao/transparencia-e-prestacao-de-contas/painel-publico-de-indicadores-do-inca',
    description: 'Acompanhe resultados e indicadores públicos do Instituto Nacional de Câncer.'
  },
  saes: {
    title: 'Dados da Atenção Especializada — Ministério da Saúde',
    url: 'https://www.gov.br/saude/pt-br/acesso-a-informacao/sic/dados-em-transparencia-ativa/saes',
    description: 'Consulte internações, atendimentos e produção ambulatorial e hospitalar.'
  },
  leitos: {
    title: 'Hospitais e leitos — OpenDataSUS',
    url: 'https://opendatasus.saude.gov.br/pt_BR/dataset/hospitais-e-leitos',
    description: 'Explore dados do CNES sobre estabelecimentos e leitos, inclusive complementares.'
  },
  susDigital: {
    title: 'SUS Digital — Ministério da Saúde',
    url: 'https://www.gov.br/saude/pt-br/composicao/seidigi/sus-digital',
    description: 'Acompanhe diretrizes, programas e iniciativas de transformação digital do SUS.'
  },
  sinesp: {
    title: 'Dados Nacionais de Segurança Pública — Sinesp',
    url: 'https://dados.mj.gov.br/dataset/sistema-nacional-de-estatisticas-de-seguranca-publica',
    description: 'Consulte indicadores oficiais por município e unidade da Federação, com notas metodológicas.'
  }
};

const PUBLIC_SOURCE_KEYS_BY_COMMITMENT = {
  'participacao-decisoes': ['brasilParticipativo', 'portalTransparencia', 'dadosGov'],
  'comunicacao-publica-direta': ['portalTransparencia', 'dadosGov', 'brasilParticipativo'],
  'governo-constitucional-plural': ['constituicao', 'camara', 'senado'],
  'regulacao-plataformas': ['anpdMarcoCivil', 'camara', 'senado'],
  'crimes-digitais': ['anpdMarcoCivil', 'mjOuvidoria', 'ctir'],
  'tributacao-digital': ['receitaDados', 'camara', 'portalTransparencia'],
  'cuidado-pessoa-idosa': ['pessoaIdosa', 'disque100', 'datasus'],
  'mulheres-politicas-publicas': ['mulheres', 'ligue180', 'portalTransparencia'],
  'liberdade-religiosa': ['constituicao', 'disque100', 'censo2022'],
  'educacao-tempo-integral': ['escolaIntegral', 'censoEscolar', 'portalTransparencia'],
  'pe-de-meia-ensino-medio': ['peDeMeia', 'censoEscolar', 'portalTransparencia'],
  'pe-de-meia-universitario': ['censoSuperior', 'portalTransparencia', 'brasilParticipativo'],
  'matematica-engenharia': ['censoEscolar', 'capesDados', 'mctiIndicadores'],
  'ia-brasileira': ['mctiIndicadores', 'anpd', 'cetic'],
  'data-centers-brasil': ['epeDataCenters', 'aneelDados', 'snirh', 'ibamaLicenciamento'],
  'reserva-protecao-dados': ['anpd', 'ctir', 'cetic'],
  'economias-do-futuro': ['bndesVerde', 'ipeadata', 'sniic', 'mctiIndicadores'],
  'lideranca-climatica': ['mmaClima', 'adaptaBrasil', 'terraBrasilis'],
  'cooperacao-internacional': ['concordia', 'abc', 'senado'],
  'fortalecimento-sus': ['datasus', 'siops', 'conselhoSaude'],
  'cuidado-oncologico': ['incaPainel', 'saes', 'datasus'],
  'saude-inteligente': ['susDigital', 'leitos', 'saes'],
  'coordenacao-federal-seguranca': ['sinesp', 'mjDados', 'portalTransparencia']
};

export function publicSourcesFor(commitmentId) {
  return (PUBLIC_SOURCE_KEYS_BY_COMMITMENT[commitmentId] ?? [])
    .map((sourceKey) => PUBLIC_SOURCE_LIBRARY[sourceKey])
    .filter(Boolean);
}

export const COMMITMENTS = [
  {
    id: 'participacao-decisoes',
    themeId: 'democracia-governo',
    title: 'Participação nas decisões',
    summary: 'Ampliar a participação da população nas decisões governamentais e ouvir diferentes setores sociais.',
    excerpt: '“Nós vamos fazer o povo participar mais das nossas decisões.”',
    kind: 'programmatic',
    suggestedRouteId: 'mobilizar-pessoas',
    responsibility: {
      citizen: 'Pode reunir demandas, participar de consultas e cobrar devolutivas públicas.',
      state: 'Deve criar canais acessíveis de participação, considerar contribuições e prestar contas das decisões.',
      levels: ['federal', 'estadual', 'municipal']
    }
  },
  {
    id: 'comunicacao-publica-direta',
    themeId: 'democracia-governo',
    title: 'Comunicação pública direta',
    summary: 'Ampliar o uso de canais digitais para o presidente e o governo comunicarem diretamente decisões e ações.',
    excerpt: '“A comunicação digital vai ganhar um espaço muito grande no meu governo.”',
    kind: 'programmatic',
    suggestedRouteId: 'acompanhar-cobrar',
    responsibility: {
      citizen: 'Pode comparar anúncios com atos oficiais, orçamento, cronogramas e resultados.',
      state: 'Deve oferecer comunicação pública acessível, verificável e compatível com transparência e liberdade de imprensa.',
      levels: ['federal']
    }
  },
  {
    id: 'governo-constitucional-plural',
    themeId: 'democracia-governo',
    title: 'Governo para todos',
    summary: 'Governar toda a população com respeito à Constituição e manter relação institucional com o Congresso eleito.',
    excerpt: '“Ele foi eleito para governar para todos [...] com base no respeito à Constituição, na relação com o Congresso.”',
    kind: 'programmatic',
    suggestedRouteId: 'acompanhar-cobrar',
    responsibility: {
      citizen: 'Pode acompanhar direitos, instituições e o tratamento não discriminatório dado à população.',
      state: 'Deve cumprir a Constituição, respeitar a separação de poderes e atender a população sem discriminação política.',
      levels: ['federal']
    }
  },
  {
    id: 'regulacao-plataformas',
    themeId: 'ambiente-digital',
    title: 'Regulação das plataformas digitais',
    summary: 'Criar regras para a atuação de plataformas digitais no Brasil.',
    excerpt: '“As plataformas digitais [...] nós vamos ter que regulá-las.”',
    kind: 'programmatic',
    suggestedRouteId: 'acompanhar-cobrar',
    responsibility: {
      citizen: 'Pode acompanhar propostas, comparar seus efeitos e defender direitos, transparência e liberdade de expressão.',
      state: 'Deve debater, estabelecer e fiscalizar regras legais com transparência, garantias de direitos e mecanismos de recurso.',
      levels: ['federal']
    }
  },
  {
    id: 'crimes-digitais',
    themeId: 'ambiente-digital',
    title: 'Enfrentamento de crimes digitais',
    summary: 'Tratar condutas criminosas no meio digital segundo a legislação aplicável também fora da internet.',
    excerpt: '“O crime no mundo digital tem que ser tratado igual ao crime na vida real.”',
    kind: 'programmatic',
    suggestedRouteId: 'conhecer-mapear',
    responsibility: {
      citizen: 'Pode aprender formas seguras de prevenção e denúncia, apoiar vítimas e evitar exposição ou justiça por conta própria.',
      state: 'Deve prevenir e investigar crimes, acolher vítimas e responsabilizar autores com devido processo.',
      levels: ['federal', 'estadual', 'sistema de Justiça']
    }
  },
  {
    id: 'tributacao-digital',
    themeId: 'ambiente-digital',
    title: 'Tributação da economia digital',
    summary: 'Fazer grandes empresas digitais que obtêm receita no Brasil contribuírem tributariamente no país.',
    excerpt: '“Não podemos ter empresas [...] ganhando milhões e bilhões, não pagando nenhum imposto para este país.”',
    kind: 'programmatic',
    suggestedRouteId: 'acompanhar-cobrar',
    responsibility: {
      citizen: 'Pode acompanhar projetos, regras fiscais, arrecadação e destinação de recursos.',
      state: 'Deve definir e aplicar a política tributária de forma legal, transparente e isonômica.',
      levels: ['federal']
    }
  },
  {
    id: 'cuidado-pessoa-idosa',
    themeId: 'direitos-cuidado',
    title: 'Cuidado com pessoas idosas',
    summary: 'Dar maior prioridade pública ao cuidado e à proteção das pessoas idosas, sem programa específico definido no discurso.',
    excerpt: '“Eu vou levar muito a sério a política de cuidado com os nossos velhinhos.”',
    kind: 'programmatic',
    suggestedRouteId: 'ajudar-diretamente',
    responsibility: {
      citizen: 'Pode apoiar redes locais de cuidado e encaminhar demandas, sempre com consentimento e sem assumir funções profissionais.',
      state: 'Deve garantir políticas, serviços e proteção por meio das redes de saúde, assistência social e direitos.',
      levels: ['federal', 'estadual', 'municipal']
    }
  },
  {
    id: 'mulheres-politicas-publicas',
    themeId: 'direitos-cuidado',
    title: 'Mulheres nas políticas públicas',
    summary: 'Orientar políticas públicas a tratar mulheres com mais respeito, sem instrumentos de execução detalhados no discurso.',
    excerpt: '“As mulheres serão tratadas com muito mais respeito pelas políticas públicas brasileiras.”',
    kind: 'programmatic',
    suggestedRouteId: 'conhecer-mapear',
    responsibility: {
      citizen: 'Pode identificar barreiras, apoiar serviços confiáveis e levar demandas aos espaços competentes sem expor vítimas.',
      state: 'Deve prevenir discriminação e violência e assegurar acesso efetivo a direitos e serviços públicos.',
      levels: ['federal', 'estadual', 'municipal', 'sistema de Justiça']
    }
  },
  {
    id: 'liberdade-religiosa',
    themeId: 'direitos-cuidado',
    title: 'Liberdade religiosa',
    summary: 'Assegurar igualdade entre religiões, liberdade de crença e de culto e respeito ao caráter laico do Estado.',
    excerpt: '“Ao Estado laico cabe garantir a liberdade religiosa plena.”',
    kind: 'programmatic',
    suggestedRouteId: 'mobilizar-pessoas',
    responsibility: {
      citizen: 'Pode promover convivência respeitosa entre crenças, minorias religiosas e pessoas sem religião.',
      state: 'Deve proteger a liberdade religiosa e a laicidade, prevenir favorecimentos e responder a violações.',
      levels: ['federal', 'estadual', 'municipal', 'sistema de Justiça']
    }
  },
  {
    id: 'educacao-tempo-integral',
    themeId: 'educacao',
    title: 'Educação em tempo integral',
    summary: 'Universalizar a educação em tempo integral até o ensino médio.',
    excerpt: '“Nós iremos universalizar as escolas de tempo integral neste país até o ensino médio.”',
    kind: 'operational',
    suggestedRouteId: 'acompanhar-cobrar',
    responsibility: {
      citizen: 'Pode participar da comunidade escolar e acompanhar estrutura, profissionais, alimentação, transporte e qualidade da jornada.',
      state: 'Deve financiar, regulamentar e oferecer educação integral com qualidade e proteção aos estudantes.',
      levels: ['federal', 'estadual', 'municipal']
    }
  },
  {
    id: 'pe-de-meia-ensino-medio',
    themeId: 'educacao',
    title: 'Pé-de-Meia no ensino médio',
    summary: 'Universalizar o programa Pé-de-Meia para estudantes do ensino médio.',
    excerpt: '“Nós vamos universalizar o Pé-de-Meia para o ensino médio.”',
    kind: 'operational',
    suggestedRouteId: 'ajudar-diretamente',
    responsibility: {
      citizen: 'Pode orientar estudantes sobre canais oficiais e mapear barreiras de acesso sem coletar dados pessoais desnecessários.',
      state: 'Deve definir critérios, financiar o benefício, facilitar o acesso e avaliar seus efeitos sobre a permanência escolar.',
      levels: ['federal', 'estadual', 'municipal']
    }
  },
  {
    id: 'pe-de-meia-universitario',
    themeId: 'educacao',
    title: 'Pé-de-Meia universitário',
    summary: 'Criar um apoio financeiro para evitar que estudantes universitários abandonem os estudos para trabalhar.',
    excerpt: '“Vamos criar um Pé-de-Meia universitário, para que nenhum jovem ou menina desista de estudar porque tem que trabalhar.”',
    kind: 'operational',
    suggestedRouteId: 'conhecer-mapear',
    responsibility: {
      citizen: 'Pode mapear barreiras de permanência, divulgar apoios confiáveis e levar demandas às instituições sem expor estudantes.',
      state: 'Deve formular, financiar e avaliar a política, com critérios claros de acesso, permanência e equidade.',
      levels: ['federal']
    }
  },
  {
    id: 'matematica-engenharia',
    themeId: 'educacao',
    title: 'Matemática e engenharia',
    summary: 'Ampliar a formação em matemática e engenharia como parte de uma estratégia de capacidade tecnológica nacional.',
    excerpt: '“Iremos ensinar mais matemática, mais engenharia.”',
    kind: 'programmatic',
    suggestedRouteId: 'ajudar-diretamente',
    responsibility: {
      citizen: 'Pode apoiar clubes, reforço e mentoria inclusivos em parceria com instituições responsáveis.',
      state: 'Deve assegurar currículo, profissionais preparados, infraestrutura e acesso equitativo à formação.',
      levels: ['federal', 'estadual', 'municipal']
    }
  },
  {
    id: 'ia-brasileira',
    themeId: 'tecnologia-dados',
    title: 'Inteligência artificial brasileira',
    summary: 'Desenvolver capacidade brasileira em inteligência artificial para reduzir dependência tecnológica externa.',
    excerpt: '“Eu não quero ficar dependendo de inteligência artificial chinesa ou americana. Eu quero criar uma brasileira.”',
    kind: 'programmatic',
    suggestedRouteId: 'conhecer-mapear',
    responsibility: {
      citizen: 'Pode mapear necessidades, apoiar pesquisa aberta e cobrar transparência, proteção de dados e avaliação de impactos.',
      state: 'Deve definir estratégia, investir em pesquisa e infraestrutura e estabelecer salvaguardas de direitos.',
      levels: ['federal']
    }
  },
  {
    id: 'data-centers-brasil',
    themeId: 'tecnologia-dados',
    title: 'Data centers no Brasil',
    summary: 'Atrair data centers aproveitando o potencial brasileiro de energia renovável.',
    excerpt: '“Aproveitar o potencial energético [...] para trazer para cá os data centers necessários.”',
    kind: 'programmatic',
    suggestedRouteId: 'acompanhar-cobrar',
    responsibility: {
      citizen: 'Pode acompanhar consumo de energia e água, território, incentivos, empregos e impactos comunitários dos projetos.',
      state: 'Deve definir critérios, licenciar, fiscalizar impactos e publicar benefícios e contrapartidas dos empreendimentos.',
      levels: ['federal', 'estadual', 'municipal']
    }
  },
  {
    id: 'reserva-protecao-dados',
    themeId: 'tecnologia-dados',
    title: 'Infraestrutura para dados brasileiros',
    summary: 'Exigir que parte da infraestrutura dos data centers seja destinada a informações brasileiras.',
    excerpt: '“Essa gente vai ter que deixar uma parte do data center para informações brasileiras.”',
    kind: 'programmatic',
    suggestedRouteId: 'acompanhar-cobrar',
    responsibility: {
      citizen: 'Pode cobrar clareza sobre armazenamento, acesso, segurança, contratos e proteção de dados pessoais.',
      state: 'Deve transformar a proposta em regras claras, proteger direitos e fiscalizar a segurança e o interesse público.',
      levels: ['federal']
    }
  },
  {
    id: 'economias-do-futuro',
    themeId: 'desenvolvimento-economico',
    title: 'Economias digital, verde e criativa',
    summary: 'Investir nas economias digital, verde e criativa como parte da ambição de tornar o país mais desenvolvido e menos periférico.',
    excerpt: '“Muito investimento na economia digital, na economia verde e na economia criativa.”',
    kind: 'programmatic',
    suggestedRouteId: 'mobilizar-pessoas',
    responsibility: {
      citizen: 'Pode fortalecer iniciativas locais e defender trabalho digno, inclusão e sustentabilidade.',
      state: 'Deve formular políticas, financiar bens públicos, regular mercados e avaliar impactos sociais e ambientais.',
      levels: ['federal', 'estadual', 'municipal']
    }
  },
  {
    id: 'lideranca-climatica',
    themeId: 'clima-internacional',
    title: 'Liderança climática',
    summary: 'Fazer o Brasil exercer papel de referência internacional em política climática, sem nova meta quantificada no discurso.',
    excerpt: '“Nós vamos ensinar ao mundo como é que se trata a política climática neste país.”',
    kind: 'aspirational',
    suggestedRouteId: 'acompanhar-cobrar',
    responsibility: {
      citizen: 'Pode acompanhar riscos locais, desmatamento, emissões, adaptação, orçamento e resultados.',
      state: 'Deve prevenir e reduzir impactos climáticos, proteger territórios e cumprir metas transparentes e verificáveis.',
      levels: ['federal', 'estadual', 'municipal']
    }
  },
  {
    id: 'cooperacao-internacional',
    themeId: 'clima-internacional',
    title: 'Cooperação, autonomia e paz',
    summary: 'Aumentar a influência do Brasil nas decisões políticas e econômicas internacionais e em iniciativas de paz.',
    excerpt: '“Nós queremos ser um país central nas decisões políticas, econômicas e na decisão pela paz.”',
    kind: 'aspirational',
    suggestedRouteId: 'conhecer-mapear',
    responsibility: {
      citizen: 'Pode acompanhar posições internacionais e comparar compromissos externos com políticas internas.',
      state: 'Deve conduzir a política externa, negociar e prestar contas conforme as competências constitucionais.',
      levels: ['federal']
    }
  },
  {
    id: 'fortalecimento-sus',
    themeId: 'saude-sus',
    title: 'Fortalecimento do SUS',
    summary: 'Dar continuidade à ampliação e modernização do SUS e preservar seu caráter público.',
    excerpt: '“Nós vamos continuar [...] fazendo a revolução no SUS.”',
    kind: 'programmatic',
    suggestedRouteId: 'acompanhar-cobrar',
    responsibility: {
      citizen: 'Pode participar dos conselhos de saúde e acompanhar financiamento, filas e atenção básica.',
      state: 'Deve financiar, gerir e prestar os serviços públicos de saúde com acesso universal e controle social.',
      levels: ['federal', 'estadual', 'municipal']
    }
  },
  {
    id: 'cuidado-oncologico',
    themeId: 'saude-sus',
    title: 'Tratamento do câncer',
    summary: 'Ampliar fortemente o acesso ao tratamento do câncer; a comparação mundial não vem acompanhada de indicador definido.',
    excerpt: '“O Brasil será o país com maior percentual de tratamento de câncer entre todos os países do mundo.”',
    kind: 'aspirational',
    suggestedRouteId: 'conhecer-mapear',
    responsibility: {
      citizen: 'Pode acompanhar tempos entre suspeita, diagnóstico e tratamento usando dados agregados e protegendo pacientes.',
      state: 'Deve organizar e financiar a rede oncológica, reduzir atrasos e publicar indicadores comparáveis.',
      levels: ['federal', 'estadual', 'municipal']
    }
  },
  {
    id: 'saude-inteligente',
    themeId: 'saude-sus',
    title: 'Hospitais e UTIs inteligentes',
    summary: 'Implantar um hospital inteligente e 15 UTIs inteligentes para reduzir mortes associadas à falta ou demora de tratamento.',
    excerpt: '“Vamos ter 15 UTIs inteligentes neste país, para a gente não permitir que as pessoas morram por falta de tratamento ou por tempo.”',
    kind: 'operational',
    suggestedRouteId: 'acompanhar-cobrar',
    responsibility: {
      citizen: 'Pode monitorar locais, prazos, custos, proteção de dados, treinamento e resultados clínicos.',
      state: 'Deve implantar, operar e avaliar a tecnologia com segurança, equidade, transparência e supervisão humana.',
      levels: ['federal', 'estadual', 'municipal']
    }
  },
  {
    id: 'coordenacao-federal-seguranca',
    themeId: 'seguranca-publica',
    title: 'Coordenação federal da segurança',
    summary: 'Ampliar a participação da União na segurança pública, em coordenação com os estados, buscando proteção e responsabilização legal.',
    excerpt: '“Os estados não dão conta. Nós vamos entrar [...] para devolver [...] a tranquilidade, a paz de que eles precisam.”',
    kind: 'programmatic',
    suggestedRouteId: 'acompanhar-cobrar',
    responsibility: {
      citizen: 'Pode usar dados públicos e cobrar prevenção, investigação, redução da violência e respeito ao devido processo.',
      state: 'Deve coordenar políticas, prevenir violência, investigar crimes e responsabilizar autores dentro da lei.',
      levels: ['federal', 'estadual', 'municipal', 'sistema de Justiça']
    }
  }
];
