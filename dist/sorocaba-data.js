export const SOROCABA = Object.freeze({
  name: 'Sorocaba',
  ibgeCode: '3552205',
  state: 'SP'
});

export const SOROCABA_INDICATORS = Object.freeze([
  Object.freeze({
    id: 'pessoas-60-mais',
    commitmentIds: Object.freeze(['cuidado-pessoa-idosa']),
    title: 'Pessoas com 60 anos ou mais',
    displayValue: '114.769 pessoas',
    supportingValue: '15,9% da população',
    referencePeriod: '2022',
    retrievedAt: '2026-10-30',
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
