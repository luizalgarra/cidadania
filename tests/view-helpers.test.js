import test from 'node:test';
import assert from 'node:assert/strict';

import {
  escapeHtml,
  formatDatePtBr,
  createPlanDefaults,
  commitmentKindLabel,
  deriveStartDateFromTarget
} from '../src/view-helpers.js';
import * as viewHelpers from '../src/view-helpers.js';
import { SOROCABA, indicatorsForCommitment } from '../src/sorocaba-data.js';

test('renders a verified Sorocaba snapshot with provenance and methodological limits', () => {
  assert.equal(typeof viewHelpers.renderLocalSnapshot, 'function');
  if (typeof viewHelpers.renderLocalSnapshot !== 'function') return;

  const html = viewHelpers.renderLocalSnapshot({
    territory: { name: 'Sorocaba', ibgeCode: '3552205', state: 'SP' },
    indicators: [{
      id: 'pessoas-idosas',
      title: 'Pessoas com 60 anos ou mais',
      displayValue: '114.769 pessoas',
      supportingValue: '15,9% da população',
      referencePeriod: '2022',
      relation: 'context',
      relationLabel: 'Dado de contexto',
      methodology: 'Soma das faixas etárias a partir de 60 anos.',
      caveat: 'O Censo não mede a qualidade do cuidado.',
      source: {
        originalOrganization: 'IBGE',
        treatmentOrganization: 'Base dos Dados',
        datasetUrl: 'https://basedosdados.org/dataset/exemplo',
        originalUrl: 'https://sidra.ibge.gov.br/tabela/9514'
      }
    }]
  });

  assert.match(html, /Retrato de Sorocaba/);
  assert.match(html, /114\.769 pessoas/);
  assert.match(html, /15,9% da população/);
  assert.match(html, /Dado de contexto/);
  assert.match(html, /IBGE/);
  assert.match(html, /Base dos Dados/);
  assert.match(html, /Período: 2022/);
  assert.match(html, /não prova, isoladamente, o cumprimento/i);
  assert.match(html, /O Censo não mede a qualidade do cuidado/);
});

test('renders local data for a commitment without leaking another commitment snapshot', () => {
  assert.equal(typeof viewHelpers.renderCommitmentLocalSnapshot, 'function');
  if (typeof viewHelpers.renderCommitmentLocalSnapshot !== 'function') return;

  const elderlyHtml = viewHelpers.renderCommitmentLocalSnapshot({
    commitmentId: 'cuidado-pessoa-idosa',
    territory: SOROCABA,
    indicatorsForCommitment
  });
  const platformHtml = viewHelpers.renderCommitmentLocalSnapshot({
    commitmentId: 'regulacao-plataformas',
    territory: SOROCABA,
    indicatorsForCommitment
  });

  assert.match(elderlyHtml, /114\.769 pessoas/);
  assert.doesNotMatch(elderlyHtml, /19\.784 matrículas/);
  assert.equal(platformHtml, '');
});

test('states the political origin of the journey without implying that the plan is a quotation', () => {
  assert.equal(typeof viewHelpers.sourceAttributionLabel, 'function');

  const sourceContext = {
    speaker: 'Luiz Inácio Lula da Silva',
    shortName: 'Lula',
    event: 'discurso de vitória após o segundo turno',
    dateLabel: 'outubro de 2026'
  };

  assert.equal(
    viewHelpers.sourceAttributionLabel(sourceContext),
    'Compromissos apresentados por Lula em seu discurso de vitória após o segundo turno, em outubro de 2026.'
  );
  assert.equal(
    viewHelpers.sourceAttributionLabel(sourceContext, { fullName: true }),
    'Compromissos apresentados por Luiz Inácio Lula da Silva em seu discurso de vitória após o segundo turno, em outubro de 2026.'
  );
});

test('keeps the Lula victory-speech origin and the editorial boundary in copied plans', () => {
  assert.equal(typeof viewHelpers.formatPlanAsText, 'function');

  const text = viewHelpers.formatPlanAsText({
    plan: {
      routeTitle: 'Acompanhar e cobrar',
      targetDate: '2026-11-27',
      territory: 'meu bairro',
      availableTime: '1 hora por semana',
      desiredResult: 'obter uma resposta pública',
      firstAction: 'enviar uma pergunta ao órgão responsável',
      partner: '',
      indicator: 'uma resposta registrada',
      caution: '',
      citizenBoundary: 'acompanhar e formular perguntas',
      publicResponsibility: 'responder e prestar contas'
    },
    commitment: {
      title: 'Participação nas decisões',
      excerpt: '“Nós vamos fazer o povo participar mais das nossas decisões.”'
    },
    publicSources: [
      {
        title: 'Brasil Participativo',
        url: 'https://brasilparticipativo.presidencia.gov.br/',
        description: 'Consulte processos participativos, propostas e dados abertos.'
      }
    ],
    sourceContext: {
      speaker: 'Luiz Inácio Lula da Silva',
      shortName: 'Lula',
      event: 'discurso de vitória após o segundo turno',
      dateLabel: 'outubro de 2026',
      sourceUrl: 'https://www.poder360.com.br/poder-eleicoes-2026/leia-a-integra-do-pronunciamento-da-vitoria-de-lula-2/',
      provenance: 'Íntegra e vídeo publicados pelo Poder360 em 25 de outubro de 2026.'
    }
  });

  assert.match(text, /Origem deste plano: compromisso apresentado por Luiz Inácio Lula da Silva em seu discurso de vitória após o segundo turno, em outubro de 2026\./);
  assert.match(text, /Trecho do discurso: “Nós vamos fazer o povo participar mais das nossas decisões\.”/);
  assert.match(text, /As ações concretas deste plano foram definidas por você; não são citações nem instruções diretas de Lula\./);
  assert.match(text, /Fonte pública: https:\/\/www\.poder360\.com\.br\/poder-eleicoes-2026\/leia-a-integra-do-pronunciamento-da-vitoria-de-lula-2\//);
  assert.match(text, /Íntegra e vídeo publicados pelo Poder360 em 25 de outubro de 2026\./);
  assert.match(text, /ONDE SE INFORMAR E ACOMPANHAR/);
  assert.match(text, /Brasil Participativo — Consulte processos participativos, propostas e dados abertos\./);
  assert.match(text, /https:\/\/brasilparticipativo\.presidencia\.gov\.br\//);
  assert.doesNotMatch(text, /transcrição fornecida/i);
});

test('includes the verified Sorocaba snapshot when copying a related plan', () => {
  const indicator = indicatorsForCommitment('cuidado-pessoa-idosa')[0];
  const text = viewHelpers.formatPlanAsText({
    plan: {
      routeTitle: 'Conhecer e mapear',
      targetDate: '2026-11-29',
      territory: 'meu bairro em Sorocaba',
      availableTime: '1 hora por mês',
      desiredResult: 'entender uma necessidade',
      firstAction: 'conversar com uma pessoa idosa',
      partner: '',
      indicator: 'uma necessidade registrada',
      caution: '',
      citizenBoundary: 'Ouvir e mapear.',
      publicResponsibility: 'Oferecer cuidado público.'
    },
    commitment: {
      title: 'Cuidado com pessoas idosas',
      excerpt: '“Vamos cuidar dos idosos.”'
    },
    sourceContext: {
      speaker: 'Luiz Inácio Lula da Silva',
      event: 'discurso de vitória',
      dateLabel: 'outubro de 2026'
    },
    localTerritory: SOROCABA,
    localIndicators: [indicator]
  });

  assert.match(text, /RETRATO DE SOROCABA/);
  assert.match(text, /Pessoas com 60 anos ou mais: 114\.769 pessoas/);
  assert.match(text, /15,9% da população/);
  assert.match(text, /Período: 2022/);
  assert.match(text, /O Censo descreve o tamanho e o perfil da população idosa/);
});

test('escapes user text before it is inserted into an HTML template', () => {
  assert.equal(
    escapeHtml('<img src=x onerror="alert(1)"> & ação'),
    '&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; ação'
  );
});

test('formats an ISO date in Portuguese without shifting the calendar day', () => {
  assert.equal(formatDatePtBr('2026-11-26'), '26 de novembro de 2026');
});

test('creates a 30-day monitoring plan without preselecting a partner', () => {
  const defaults = createPlanDefaults(
    { title: 'Fortalecimento do SUS' },
    'acompanhar-cobrar',
    new Date('2026-10-27T12:00:00Z')
  );

  assert.deepEqual(defaults, {
    startDate: '2026-10-27',
    territory: 'meu bairro ou comunidade',
    availableTime: '2 horas por mês',
    result: 'acompanhar uma entrega concreta ligada a fortalecimento do SUS',
    firstAction: 'identificar o órgão responsável e formular uma pergunta objetiva sobre fortalecimento do SUS',
    partner: '',
    indicator: 'uma resposta oficial ou atualização verificável registrada',
    targetDate: '2026-11-26'
  });
});

test('keeps the 30-day target anchored to the user local calendar near midnight', () => {
  const nearMidnightInBrasilia = new Date('2026-10-27T23:30:00-03:00');
  const defaults = createPlanDefaults(
    { title: 'Fortalecer a atenção básica' },
    'acompanhar-cobrar',
    nearMidnightInBrasilia
  );

  assert.equal(defaults.targetDate, '2026-11-26');
});

test('recovers the original cycle start for an older saved 30-day target', () => {
  assert.equal(deriveStartDateFromTarget('2026-11-26'), '2026-10-27');
  assert.equal(deriveStartDateFromTarget('data-inválida'), '');
});

test('explains the editorial specificity assigned to a commitment', () => {
  assert.equal(
    commitmentKindLabel('operational'),
    'Medida descrita de forma concreta no discurso.'
  );
  assert.equal(
    commitmentKindLabel('programmatic'),
    'Direção de governo sem execução completa definida no discurso.'
  );
  assert.equal(
    commitmentKindLabel('aspirational'),
    'Aspiração ampla sem indicador completo definido no discurso.'
  );
  assert.equal(
    commitmentKindLabel('unknown'),
    'Classificação editorial não informada.'
  );
});
