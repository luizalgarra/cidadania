export const SOROCABA = Object.freeze({
  name: 'Sorocaba',
  ibgeCode: '3552205',
  state: 'SP'
});

const ELDERLY_AGE_BANDS = Object.freeze([
  Object.freeze({ id: '60-64', label: '60 a 64 anos', total: 36960, men: 16614, women: 20346 }),
  Object.freeze({ id: '65-69', label: '65 a 69 anos', total: 28817, men: 12801, women: 16016 }),
  Object.freeze({ id: '70-74', label: '70 a 74 anos', total: 20560, men: 8865, women: 11695 }),
  Object.freeze({ id: '75-79', label: '75 a 79 anos', total: 13302, men: 5544, women: 7758 }),
  Object.freeze({ id: '80-84', label: '80 a 84 anos', total: 8234, men: 3160, women: 5074 }),
  Object.freeze({ id: '85-89', label: '85 a 89 anos', total: 4440, men: 1514, women: 2926 }),
  Object.freeze({ id: '90-94', label: '90 a 94 anos', total: 1913, men: 568, women: 1345 }),
  Object.freeze({ id: '95-99', label: '95 a 99 anos', total: 481, men: 129, women: 352 }),
  Object.freeze({ id: '100-plus', label: '100 anos ou mais', total: 62, men: 17, women: 45 })
]);

export const SOROCABA_ELDERLY_PROFILE = Object.freeze({
  referencePeriod: '2022',
  retrievedAt: '2026-11-01',
  totalPopulation: 723682,
  elderlyPopulation: 114769,
  ageBands: ELDERLY_AGE_BANDS,
  highlights: Object.freeze({
    elderlyShareOfPopulation: 15.9,
    womenShareOfElderly: 57.1,
    population80Plus: 15130,
    population80PlusShareOfElderly: 13.2,
    population90Plus: 2456
  }),
  source: Object.freeze({
    organization: 'IBGE · Censo Demográfico 2022',
    treatmentOrganization: 'Base dos Dados',
    tableTitle: 'População por Idade e Sexo',
    bigQueryId: 'basedosdados.br_ibge_censo_2022.populacao_idade_sexo',
    datasetUrl: 'https://basedosdados.org/dataset/08a1546e-251f-4546-9fe0-b1e6ab2b203d?table=a886aa3c-cfe3-4885-a40c-54dab2f0cdd0',
    originalUrl: 'https://sidra.ibge.gov.br/tabela/9514'
  })
});

const AUTONOMY_AGE_BANDS = Object.freeze([
  Object.freeze({
    id: '60-64',
    label: '60 a 64 anos',
    total: Object.freeze({ peopleEstimate: 37819, meanMonthlyIncome: 2841.78, medianMonthlyIncome: 1500 }),
    men: Object.freeze({ peopleEstimate: 17114, meanMonthlyIncome: 3923.74, medianMonthlyIncome: 2400 }),
    women: Object.freeze({ peopleEstimate: 20705, meanMonthlyIncome: 1947.51, medianMonthlyIncome: 1212 })
  }),
  Object.freeze({
    id: '65-69',
    label: '65 a 69 anos',
    total: Object.freeze({ peopleEstimate: 28437, meanMonthlyIncome: 2653.18, medianMonthlyIncome: 1500 }),
    men: Object.freeze({ peopleEstimate: 12293, meanMonthlyIncome: 3348, medianMonthlyIncome: 2500 }),
    women: Object.freeze({ peopleEstimate: 16144, meanMonthlyIncome: 2124.08, medianMonthlyIncome: 1212 })
  }),
  Object.freeze({
    id: '70-74',
    label: '70 a 74 anos',
    total: Object.freeze({ peopleEstimate: 21721, meanMonthlyIncome: 2799.53, medianMonthlyIncome: 1500 }),
    men: Object.freeze({ peopleEstimate: 9442, meanMonthlyIncome: 3936.8, medianMonthlyIncome: 2500 }),
    women: Object.freeze({ peopleEstimate: 12279, meanMonthlyIncome: 1925.02, medianMonthlyIncome: 1212 })
  }),
  Object.freeze({
    id: '75-79',
    label: '75 a 79 anos',
    total: Object.freeze({ peopleEstimate: 13155, meanMonthlyIncome: 2511.26, medianMonthlyIncome: 1400 }),
    men: Object.freeze({ peopleEstimate: 5585, meanMonthlyIncome: 3203.79, medianMonthlyIncome: 2000 }),
    women: Object.freeze({ peopleEstimate: 7570, meanMonthlyIncome: 2000.32, medianMonthlyIncome: 1212 })
  }),
  Object.freeze({
    id: '80-plus',
    label: '80 anos ou mais',
    total: Object.freeze({ peopleEstimate: 16153, meanMonthlyIncome: 2317.27, medianMonthlyIncome: 1300 }),
    men: Object.freeze({ peopleEstimate: 5441, meanMonthlyIncome: 2902.87, medianMonthlyIncome: 1950 }),
    women: Object.freeze({ peopleEstimate: 10712, meanMonthlyIncome: 2019.83, medianMonthlyIncome: 1212 })
  })
]);

export const SOROCABA_ELDERLY_AUTONOMY_PROFILE = Object.freeze({
  referencePeriod: '2022',
  retrievedAt: '2026-11-01',
  ageBands: AUTONOMY_AGE_BANDS,
  source: Object.freeze({
    organization: 'IBGE · Censo Demográfico 2022',
    sidraTable: '10299',
    tableUrl: 'https://sidra.ibge.gov.br/tabela/10299',
    apiUrl: 'https://servicodados.ibge.gov.br/api/v3/agregados/10299/periodos/2022/variaveis/1641%7C13502%7C13503?localidades=N6%5B3552205%5D&classificacao=2%5B6794,4,5%5D%7C629%5B32385%5D%7C58%5B1152,1153,1154,1155,2503%5D'
  })
});

const ACCESSIBILITY_METRICS = Object.freeze([
  Object.freeze({
    id: 'sidewalk',
    label: 'Calçada / passeio',
    conditionLabel: 'moram em via com calçada / passeio',
    favorable: true
  }),
  Object.freeze({
    id: 'obstacle',
    label: 'Obstáculo na calçada',
    conditionLabel: 'moram em via com obstáculo na calçada',
    favorable: false
  }),
  Object.freeze({
    id: 'ramp',
    label: 'Rampa para cadeirante',
    conditionLabel: 'moram em via com rampa para cadeirante',
    favorable: true
  }),
  Object.freeze({
    id: 'transit-stop',
    label: 'Ponto de ônibus / van',
    conditionLabel: 'moram em via com ponto de ônibus / van',
    favorable: true
  }),
  Object.freeze({
    id: 'lighting',
    label: 'Iluminação pública',
    conditionLabel: 'moram em via com iluminação pública',
    favorable: true
  })
]);

export const SOROCABA_ELDERLY_ACCESSIBILITY_PROFILE = Object.freeze({
  referencePeriod: '2022',
  retrievedAt: '2026-11-01',
  metrics: ACCESSIBILITY_METRICS,
  ageBands: Object.freeze([
    Object.freeze({
      id: '60-69',
      label: '60 a 69 anos',
      universe: 63566,
      values: Object.freeze({
        sidewalk: 61206,
        obstacle: 43313,
        ramp: 6527,
        'transit-stop': 11917,
        lighting: 62738
      })
    }),
    Object.freeze({
      id: '70-plus',
      label: '70 anos ou mais',
      universe: 47016,
      values: Object.freeze({
        sidewalk: 45543,
        obstacle: 30851,
        ramp: 5152,
        'transit-stop': 8742,
        lighting: 46519
      })
    })
  ]),
  source: Object.freeze({
    organization: 'IBGE · Censo Demográfico 2022',
    sidraTable: '6591',
    tableUrl: 'https://sidra.ibge.gov.br/tabela/6591',
    apiUrl: 'https://servicodados.ibge.gov.br/api/v3/agregados/6591/periodos/2022/variaveis/9598?localidades=N6%5B3552205%5D&classificacao=2%5B6794%5D%7C58%5B3520,3244%5D%7C14%5B200,72254,72258,72266,72270,72274%5D'
  })
});

export const SOROCABA_ELDERLY_HEALTH_PROFILE = Object.freeze({
  indicator: Object.freeze({
    label: 'Internações por fratura de fêmur em pessoas com 60+',
    value: 21.89,
    unit: 'por 10 mil habitantes',
    referencePeriod: '2024',
    target2029: 20
  }),
  source: Object.freeze({
    organization: 'Secretaria da Saúde de Sorocaba',
    title: 'Plano Municipal de Saúde 2026–2029 · indicador 41',
    url: 'https://saude.sorocaba.sp.gov.br/wp-content/uploads/2026/03/plano-municipal-2026-a-2029-com-o-anexo-1.pdf',
    originalSystem: 'SIH/DATASUS'
  }),
  caveat: 'A taxa mede internações hospitalares registradas, não o número de quedas, pessoas únicas, qualidade do cuidado ou cobertura da atenção básica.'
});

export const SOROCABA_ELDERLY_PROTECTION_PROFILE = Object.freeze({
  cadUnicoElderly: Object.freeze({
    label: 'Pessoas idosas em famílias com renda de até 3 salários mínimos no Cadastro Único',
    value: 13675,
    referencePeriod: 'março de 2021'
  }),
  bpcElderly: Object.freeze({
    label: 'Pessoas idosas beneficiárias do BPC',
    value: 3890,
    referencePeriod: 'junho de 2022'
  }),
  source: Object.freeze({
    organization: 'Secretaria da Cidadania de Sorocaba',
    title: 'Projeto básico do serviço de Centro-Dia do Idoso',
    url: 'https://cidadania.sorocaba.sp.gov.br/editalselecao/wp-content/uploads/sites/2/2022/10/anexo-i-projeto-basico.pdf',
    bpcReference: 'Cadastro Único e BPC/LOAS'
  }),
  caveat: 'É um retrato histórico de públicos cadastrados ou beneficiários; não representa toda a população idosa, nem todas as pessoas idosas em pobreza ou que precisam de proteção.'
});

export const SOROCABA_ELDERLY_INQUIRIES = Object.freeze([
  Object.freeze({
    id: 'care',
    title: 'O cuidado está chegando?',
    indicators: Object.freeze([
      Object.freeze({
        id: 'consultation',
        label: 'Consulta no último ano',
        description: 'Ao menos uma consulta médica ou de enfermagem nos últimos 12 meses.',
        status: 'source-to-monitor'
      }),
      Object.freeze({
        id: 'influenza-vaccination',
        label: 'Vacinação contra influenza',
        description: 'Registro de vacinação contra influenza nos últimos 12 meses.',
        status: 'source-to-monitor'
      }),
      Object.freeze({
        id: 'home-visits',
        label: 'Visitas domiciliares',
        description: 'Ao menos duas visitas de ACS ou TACS, separadas por 30 dias ou mais.',
        status: 'source-to-monitor'
      }),
      Object.freeze({
        id: 'aps-follow-up',
        label: 'Acompanhamento pela atenção primária',
        description: 'Peso e altura registrados no mesmo atendimento nos últimos 12 meses.',
        status: 'source-to-monitor'
      })
    ]),
    municipalContext: Object.freeze({
      apsCoverage: 34.58,
      registrations: 250294,
      referencePeriod: 'dezembro de 2024',
      universe: 'população geral cadastrada, não apenas pessoas idosas'
    }),
    caveat: 'Esta versão apresenta as definições oficiais a acompanhar, mas não publica um percentual municipal de 60+ sem um extrato público reproduzível.'
  }),
  Object.freeze({
    id: 'protection',
    title: 'Quem depende da proteção social?',
    historicalMetrics: Object.freeze([
      Object.freeze({ id: 'bpc', value: 3890, referencePeriod: 'junho de 2022' }),
      Object.freeze({ id: 'cadunico', value: 13675, referencePeriod: 'março de 2021' })
    ]),
    benefitQuery: Object.freeze({
      table: 'basedosdados.br_mps_beneficios.beneficio_mantido_municipio_mes',
      municipalityId: '3552205',
      measure: 'benefícios ativos e renda mensal por benefício, não pessoas únicas'
    }),
    caveat: 'O Cadastro Único retrata a população cadastrada de menor renda e não representa toda a população idosa; quantidade de benefícios também não equivale a pessoas únicas.'
  }),
  Object.freeze({
    id: 'aggravations',
    title: 'Quais agravos mais atingem os idosos?',
    metrics: Object.freeze([
      Object.freeze({
        id: 'femur-fracture',
        label: 'Internações por fratura de fêmur',
        value: 21.89,
        unit: 'por 10 mil habitantes',
        referencePeriod: '2024',
        universe: 'pessoas com 60 anos ou mais'
      }),
      Object.freeze({
        id: 'circulatory-hospitalizations',
        label: 'Internações por doenças do aparelho circulatório',
        value: 1102,
        unit: 'internações',
        referencePeriod: '2024',
        universe: 'todas as idades'
      }),
      Object.freeze({
        id: 'diabetes-records',
        label: 'Diabetes entre condições registradas na APS',
        value: 17.6,
        unit: '% dos registros apresentados',
        referencePeriod: '2023',
        universe: 'todas as idades'
      }),
      Object.freeze({
        id: 'primary-care-sensitive-hospitalizations',
        label: 'Internações por condições sensíveis à atenção básica',
        value: 19.8,
        unit: '%',
        referencePeriod: '2024',
        universe: 'todas as idades'
      })
    ]),
    caveat: 'Somente a fratura de fêmur tem recorte explícito de 60+; os demais números dão contexto municipal e não medem, sozinhos, os agravos da população idosa.'
  }),
  Object.freeze({
    id: 'network',
    title: 'Qual rede existe para atender?',
    points: Object.freeze([
      Object.freeze({ id: 'ubs', label: 'UBS e unidades com ESF', value: 33 }),
      Object.freeze({ id: 'cras', label: 'CRAS', value: 12 }),
      Object.freeze({ id: 'creas', label: 'CREAS', value: 3 }),
      Object.freeze({ id: 'cri', label: 'Centro de Referência do Idoso', value: 1 })
    ]),
    capacity: Object.freeze([
      Object.freeze({ id: 'aps-teams', label: 'equipes de APS financiadas', value: 89, referencePeriod: 'dezembro de 2024' }),
      Object.freeze({ id: 'emad', label: 'Equipes Multiprofissionais de Atenção Domiciliar', value: 6 }),
      Object.freeze({ id: 'emap', label: 'Equipe Multiprofissional de Apoio', value: 1 }),
      Object.freeze({ id: 'aps-registrations', label: 'cadastros na APS', value: 250294, universe: 'população geral' })
    ]),
    composition: Object.freeze({
      completeTeamsPercentage: 94,
      referencePeriod: '2024',
      interpretation: 'composição registrada das equipes, não qualidade assistencial'
    }),
    caveat: 'A contagem de pontos e equipes descreve presença e capacidade registrada; não mede tempo de espera, cobertura específica de 60+ nem qualidade do atendimento.'
  })
]);

const ELDERLY_SEX_LABELS = Object.freeze({
  total: 'Todas as pessoas',
  women: 'Mulheres',
  men: 'Homens'
});

function roundOneDecimal(value) {
  return Number(value.toFixed(1));
}

export function elderlyPopulationFor({ ageBand = 'all', sex = 'total' } = {}) {
  if (!(sex in ELDERLY_SEX_LABELS)) {
    throw new RangeError(`Sexo não disponível: ${sex}`);
  }

  const selectedBand = ageBand === 'all'
    ? null
    : SOROCABA_ELDERLY_PROFILE.ageBands.find((band) => band.id === ageBand);
  if (ageBand !== 'all' && !selectedBand) {
    throw new RangeError(`Faixa etária não disponível: ${ageBand}`);
  }

  const value = selectedBand
    ? selectedBand[sex]
    : SOROCABA_ELDERLY_PROFILE.ageBands.reduce((sum, band) => sum + band[sex], 0);

  return {
    value,
    ageLabel: selectedBand?.label ?? '60 anos ou mais',
    sexLabel: ELDERLY_SEX_LABELS[sex],
    shareOfElderly: roundOneDecimal(100 * value / SOROCABA_ELDERLY_PROFILE.elderlyPopulation),
    shareOfSorocaba: roundOneDecimal(100 * value / SOROCABA_ELDERLY_PROFILE.totalPopulation)
  };
}

export function elderlyAutonomyFor({ ageBand = '60-64', sex = 'total' } = {}) {
  if (!(sex in ELDERLY_SEX_LABELS)) {
    throw new RangeError(`Sexo não disponível: ${sex}`);
  }

  const selectedBand = SOROCABA_ELDERLY_AUTONOMY_PROFILE.ageBands.find((band) => (
    band.id === ageBand
  ));
  if (!selectedBand) {
    throw new RangeError(`Faixa etária não disponível: ${ageBand}`);
  }

  return {
    ageLabel: selectedBand.label,
    sexLabel: ELDERLY_SEX_LABELS[sex],
    ...selectedBand[sex]
  };
}

export function elderlyAccessibilityFor({ ageBand = '60-69', metric = 'sidewalk' } = {}) {
  const selectedBand = SOROCABA_ELDERLY_ACCESSIBILITY_PROFILE.ageBands.find((band) => (
    band.id === ageBand
  ));
  if (!selectedBand) {
    throw new RangeError(`Faixa etária não disponível: ${ageBand}`);
  }

  const selectedMetric = SOROCABA_ELDERLY_ACCESSIBILITY_PROFILE.metrics.find((item) => (
    item.id === metric
  ));
  if (!selectedMetric) {
    throw new RangeError(`Condição do entorno não disponível: ${metric}`);
  }

  const observed = selectedBand.values[metric];
  return {
    ageLabel: selectedBand.label,
    metricLabel: selectedMetric.label,
    conditionLabel: selectedMetric.conditionLabel,
    observed,
    universe: selectedBand.universe,
    percentage: roundOneDecimal(100 * observed / selectedBand.universe),
    favorable: selectedMetric.favorable
  };
}

export const SOROCABA_INDICATORS = Object.freeze([
  Object.freeze({
    id: 'pessoas-60-mais',
    commitmentIds: Object.freeze(['cuidado-pessoa-idosa']),
    title: 'Pessoas com 60 anos ou mais',
    displayValue: '114.769 pessoas',
    supportingValue: '15,9% da população',
    referencePeriod: '2022',
    retrievedAt: '2026-11-01',
    relation: 'context',
    relationLabel: 'Dado de contexto',
    illustration: Object.freeze({
      src: './assets/sorocaba-cuidado-pessoas-idosas.jpg',
      alt: 'Ilustração de cinco moradores idosos conversando em um banco de bairro, perto de uma padaria e de um ponto de ônibus; uma delas usa cadeira de rodas.'
    }),
    methodology: 'Soma das faixas de 60 a 64, 65 a 69, 70 a 74, 75 a 79, 80 a 84, 85 a 89, 90 a 94, 95 a 99 e 100 anos ou mais; proporção calculada sobre 723.682 habitantes.',
    caveat: 'O Censo descreve o tamanho e o perfil da população idosa em 2022; não mede acesso, continuidade ou qualidade do cuidado.',
    source: Object.freeze({
      originalOrganization: 'IBGE · Censo 2022',
      treatmentOrganization: 'Base dos Dados',
      datasetId: 'br_ibge_censo_2022',
      tableId: 'populacao_idade_sexo',
      datasetUrl: 'https://basedosdados.org/dataset/08a1546e-251f-4546-9fe0-b1e6ab2b203d?table=a886aa3c-cfe3-4885-a40c-54dab2f0cdd0',
      originalUrl: 'https://sidra.ibge.gov.br/tabela/9514'
    }),
    status: 'verified'
  }),
  Object.freeze({
    id: 'fundamental-anos-finais-integral',
    commitmentIds: Object.freeze(['educacao-tempo-integral']),
    title: 'Ensino fundamental em tempo integral',
    displayValue: '19.784 matrículas',
    supportingValue: '52,3% das matrículas dos anos finais',
    referencePeriod: '2023',
    retrievedAt: '2026-10-30',
    relation: 'direct',
    relationLabel: 'Indicador direto',
    illustration: Object.freeze({
      src: './assets/sorocaba-educacao-tempo-integral.jpg',
      alt: 'Ilustração de estudantes diversos em uma escola, realizando experiências, leitura, arte e esporte; um estudante usa cadeira de rodas.'
    }),
    methodology: 'Proporção entre 19.784 matrículas em tempo integral e 37.858 matrículas nos anos finais do ensino fundamental, considerando todas as dependências administrativas.',
    caveat: 'A classificação informa jornada e matrículas, mas não mede aprendizagem, alimentação, infraestrutura, proteção ou qualidade da experiência escolar. Um mesmo aluno pode ter mais de uma matrícula.',
    source: Object.freeze({
      originalOrganization: 'Inep · Censo Escolar',
      treatmentOrganization: 'Base dos Dados',
      datasetId: 'br_inep_censo_escolar',
      tableId: 'escola',
      datasetUrl: 'https://basedosdados.org/dataset/dae21af4-4b6a-42f4-b94a-4c2061ea9de5?table=15e428cb-cce2-41f8-aec5-066d685b5bd5',
      originalUrl: 'https://educacao.sorocaba.sp.gov.br/dadoseducacionais/wp-content/uploads/sites/14/2024/10/124-numero-de-matriculas-nos-anos-finais-do-ensino-fundamental-regular-em-tempo-integral-turmas-presenciais-e-parcial-por-dependencia-administrativa-2023-2007.pdf'
    }),
    status: 'verified'
  })
]);

export function indicatorsForCommitment(commitmentId) {
  return SOROCABA_INDICATORS.filter((indicator) => (
    indicator.status === 'verified' && indicator.commitmentIds.includes(commitmentId)
  ));
}
