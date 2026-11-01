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
