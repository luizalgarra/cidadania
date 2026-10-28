import { THEMES, COMMITMENTS, ROUTES, SOURCE_CONTEXT } from './commitments.js';
import {
  getThemeCommitments,
  selectCandidates,
  rankCommitments,
  explainRanking,
  buildPlan
} from './logic.js';
import {
  createInitialState,
  getPreviousStep,
  canContinue,
  sanitizeRestoredState
} from './app-state.js';
import {
  escapeHtml,
  formatDatePtBr,
  createPlanDefaults,
  commitmentKindLabel,
  deriveStartDateFromTarget,
  sourceAttributionLabel,
  formatPlanAsText
} from './view-helpers.js';

const STORAGE_KEY = 'compromisso-em-acao:v1';
const MAX_CANDIDATES = 4;
const root = document.querySelector('#app');
const toast = document.querySelector('.toast');

const commitmentById = new Map(COMMITMENTS.map((item) => [item.id, item]));
const themeById = new Map(THEMES.map((item) => [item.id, item]));
const routeById = new Map(ROUTES.map((item) => [item.id, item]));

const RATING_DIMENSIONS = [
  {
    key: 'interest',
    title: 'Quanto este compromisso interessa a você pessoalmente?',
    help: 'Pense no tema que você deseja compreender ou acompanhar, não em qual resposta pareceria mais correta.',
    labels: ['Não me interessa agora', 'Interessa pouco', 'Interesse moderado', 'Interessa muito', 'É prioridade para mim']
  },
  {
    key: 'relevance',
    title: 'Quanto este tema afeta pessoas no seu entorno hoje?',
    help: 'Considere sua rua, bairro, escola, trabalho ou comunidade.',
    labels: ['Não percebo impacto', 'Impacto pequeno', 'Impacto moderado', 'Impacto grande', 'Impacto muito grande']
  },
  {
    key: 'efficacy',
    title: 'Quanto você se sente capaz de realizar uma ação segura sobre este tema?',
    help: 'Não é preciso resolver o problema: basta conseguir dar um primeiro passo possível.',
    labels: ['Nada capaz agora', 'Pouco capaz', 'Talvez consiga', 'Consigo com alguma segurança', 'Consigo começar com segurança']
  },
  {
    key: 'willingness',
    title: 'Qual a chance de você agir sobre este tema nos próximos 30 dias?',
    help: 'Responda pensando no tempo e na energia que você realmente tem.',
    labels: ['Nenhuma chance agora', 'Pouca chance', 'Talvez', 'Boa chance', 'Vou tentar começar']
  }
];

const REACTION_OPTIONS = [
  { value: 'explore', title: 'Quero explorar', description: 'Quero considerar este compromisso para o meu plano.' },
  { value: 'maybe', title: 'Talvez', description: 'Ainda tenho dúvida, mas quero mantê-lo na comparação.' },
  { value: 'not-now', title: 'Não agora', description: 'É legítimo, mas não é onde desejo concentrar energia neste momento.' },
  { value: 'unknown', title: 'Não sei o que penso', description: 'Ainda não tenho informação suficiente para avaliar.' }
];

const STAGE_META = {
  themes: { number: 1, label: 'Escolha os temas' },
  reactions: { number: 2, label: 'Explore os compromissos' },
  ratings: { number: 3, label: 'Reflita sobre suas respostas' },
  finalists: { number: 4, label: 'Compare seus caminhos' },
  reflection: { number: 5, label: 'Aprofunde a escolha' },
  route: { number: 6, label: 'Escolha como agir' },
  plan: { number: 7, label: 'Monte seu plano' },
  complete: { number: 8, label: 'Seu próximo passo' }
};

function loadState() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? sanitizeRestoredState(JSON.parse(saved)) : createInitialState();
  } catch {
    return createInitialState();
  }
}

let state = loadState();
let reactionCursor = 0;
let ratingCursor = 0;
let toastTimer = null;

function normalizeReferences() {
  const validThemes = new Set([...THEMES.map((theme) => theme.id), 'all']);
  state.selectedThemes = state.selectedThemes.filter((id) => validThemes.has(id));
  state.candidates = state.candidates.filter((id) => commitmentById.has(id));
  if (state.selectedCommitmentId && !commitmentById.has(state.selectedCommitmentId)) {
    state.selectedCommitmentId = null;
  }
  if (state.selectedRouteId && !routeById.has(state.selectedRouteId)) {
    state.selectedRouteId = null;
  }

  const needsThemes = !['landing', 'welcome', 'themes'].includes(state.step);
  if (needsThemes && state.selectedThemes.length === 0) state.step = 'themes';

  const needsCandidates = ['ratings', 'finalists', 'reflection', 'route', 'plan', 'complete'].includes(state.step);
  if (needsCandidates && state.candidates.length === 0) state.step = 'reactions';

  const needsChoice = ['reflection', 'route', 'plan', 'complete'].includes(state.step);
  if (needsChoice && !state.selectedCommitmentId) state.step = 'finalists';

  const needsRoute = ['plan', 'complete'].includes(state.step);
  if (needsRoute && !state.selectedRouteId) state.step = 'route';

  if (state.planInput.targetDate && !state.planInput.startDate) {
    state.planInput.startDate = deriveStartDateFromTarget(state.planInput.targetDate);
  }

  if (state.step === 'complete' && !state.plan) state.step = 'plan';
}

function initializeCursors() {
  const commitments = currentCommitments();
  const firstReactionMissing = commitments.findIndex((item) => !Object.hasOwn(state.reactions, item.id));
  reactionCursor = firstReactionMissing >= 0 ? firstReactionMissing : Math.max(0, commitments.length - 1);

  const total = state.candidates.length * RATING_DIMENSIONS.length;
  const firstRatingMissing = Array.from({ length: total }, (_, index) => index).find((index) => {
    const commitmentId = state.candidates[Math.floor(index / RATING_DIMENSIONS.length)];
    const dimension = RATING_DIMENSIONS[index % RATING_DIMENSIONS.length].key;
    return !Object.hasOwn(state.ratings[commitmentId] ?? {}, dimension);
  });
  ratingCursor = firstRatingMissing ?? Math.max(0, total - 1);
}

normalizeReferences();
initializeCursors();

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    showToast('Não foi possível guardar o progresso neste navegador.');
  }
}

function currentCommitments() {
  return getThemeCommitments(state.selectedThemes);
}

function chosenCommitment() {
  return commitmentById.get(state.selectedCommitmentId) ?? null;
}

function chosenRoute() {
  return routeById.get(state.selectedRouteId) ?? null;
}

function selectedCandidateObjects() {
  return state.candidates.map((id) => commitmentById.get(id)).filter(Boolean);
}

function checked(condition) {
  return condition ? ' checked' : '';
}

function disabled(condition) {
  return condition ? ' disabled' : '';
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

function showInlineError(message, selector = null) {
  const error = root.querySelector('.error-message');
  if (error) {
    error.id = 'screen-error';
    error.textContent = message;
    error.classList.add('is-visible');
  }
  const target = selector ? root.querySelector(selector) : null;
  if (target) {
    target.setAttribute('aria-invalid', 'true');
    const describedBy = new Set((target.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean));
    describedBy.add('screen-error');
    target.setAttribute('aria-describedby', [...describedBy].join(' '));
    target.focus();
  } else {
    error?.focus();
  }
}

function stageHeader(step, title, description = '', detail = '') {
  const meta = STAGE_META[step];
  const sourceLabel = sourceAttributionLabel(SOURCE_CONTEXT);
  return `
    <header class="stage-header">
      <div class="stage-navigation">
        <button class="quiet-button" type="button" data-action="back">← Voltar</button>
        <span class="step-count">${escapeHtml(detail || `Etapa ${meta.number} de 8`)}</span>
      </div>
      <progress max="8" value="${meta.number}">${meta.number} de 8</progress>
      <p class="eyebrow stage-title">${escapeHtml(meta.label)}</p>
      <h2 id="${escapeHtml(step)}-heading" aria-describedby="${escapeHtml(step)}-source">${escapeHtml(title)}</h2>
      ${description ? `<p class="lede">${escapeHtml(description)}</p>` : ''}
      <p class="stage-source" id="${escapeHtml(step)}-source" role="note">
        <strong>Base desta jornada</strong>
        <span>${escapeHtml(sourceLabel)} <a class="source-link" href="${escapeHtml(SOURCE_CONTEXT.sourceUrl)}" target="_blank" rel="noopener noreferrer">Ler a íntegra e assistir ao vídeo ↗</a></span>
      </p>
    </header>
  `;
}

function responsibilities(commitment) {
  return `
    <div class="responsibility-pair">
      <div class="responsibility-box responsibility-box--citizen">
        <strong>O que cidadãos podem fazer</strong>
        <p>${escapeHtml(commitment.responsibility.citizen)}</p>
      </div>
      <div class="responsibility-box responsibility-box--state">
        <strong>O que o poder público deve fazer</strong>
        <p>${escapeHtml(commitment.responsibility.state)}</p>
      </div>
    </div>
  `;
}

function renderLanding() {
  return `
    <div class="landing-page">
      <section class="landing-hero" aria-labelledby="landing-title">
        <div class="landing-hero__copy">
          <p class="eyebrow landing-source">Discurso de vitória · outubro de 2026</p>
          <p class="landing-source-note"><a class="source-link" href="${escapeHtml(SOURCE_CONTEXT.sourceUrl)}" target="_blank" rel="noopener noreferrer">Íntegra e vídeo do pronunciamento ↗</a></p>
          <h1 id="landing-title">Do compromisso público <span>ao primeiro passo possível.</span></h1>
          <p class="landing-lede">Uma jornada individual para ler compromissos apresentados por Lula, escolher o que importa no seu entorno e criar um plano cidadão de 30 dias — sem confundir participação com dever do Estado.</p>
          <div class="landing-actions">
            <button class="primary-button landing-primary" type="button" data-action="enter-app">Conhecer a jornada <span aria-hidden="true">→</span></button>
            <a class="landing-text-link" href="#como-funciona">Ver como funciona</a>
          </div>
          <ul class="landing-facts" aria-label="Características da jornada">
            <li><strong>23</strong><span>compromissos</span></li>
            <li><strong>9</strong><span>temas</span></li>
            <li><strong>6–8 min</strong><span>para escolher</span></li>
            <li><strong>0 cadastro</strong><span>dados no navegador</span></li>
          </ul>
        </div>

        <aside class="landing-route-panel" aria-labelledby="route-panel-title">
          <p class="route-panel-kicker">Do discurso ao entorno</p>
          <h2 id="route-panel-title">Uma trilha para transformar atenção em ação.</h2>
          <ol class="landing-journey">
            <li>
              <span class="journey-node" aria-hidden="true"><b>1</b></span>
              <strong>Compromisso</strong>
              <small>O que foi apresentado no discurso</small>
            </li>
            <li class="journey-choice">
              <span class="journey-node" aria-hidden="true"><b>2</b></span>
              <strong>Sua escolha</strong>
              <small>O que encontra sentido no seu entorno</small>
            </li>
            <li>
              <span class="journey-node" aria-hidden="true"><b>3</b></span>
              <strong>Próximo passo</strong>
              <small>Uma ação segura e acompanhável</small>
            </li>
          </ol>
          <div class="landing-public-track" role="note">
            <span class="public-track-line" aria-hidden="true"></span>
            <p><strong>Responsabilidade pública continua pública.</strong> O app mostra o limite entre participação cidadã e dever do Estado.</p>
          </div>
        </aside>
      </section>

      <section class="landing-section landing-process" id="como-funciona" aria-labelledby="process-title">
        <div class="landing-section-heading">
          <p class="eyebrow">Uma escolha, não um teste</p>
          <h2 id="process-title">Você não recebe um slogan.<br>Você constrói uma decisão.</h2>
          <p>A ordem sugerida serve para comparar caminhos. A escolha final é sempre sua.</p>
        </div>
        <ol class="landing-steps">
          <li>
            <span>01</span>
            <h3>Leia no contexto</h3>
            <p>Explore sínteses e trechos de compromissos em temas como democracia, educação, saúde, clima e ambiente digital.</p>
          </li>
          <li>
            <span>02</span>
            <h3>Compare com honestidade</h3>
            <p>Reflita sobre interesse, impacto no entorno, capacidade de agir e disposição real para os próximos 30 dias.</p>
          </li>
          <li>
            <span>03</span>
            <h3>Defina um passo possível</h3>
            <p>Escolha uma rota, registre um primeiro passo, um indicador de avanço e uma revisão em sete dias.</p>
          </li>
        </ol>
      </section>

      <section class="landing-section landing-boundary" aria-labelledby="boundary-title">
        <div class="landing-boundary__copy">
          <p class="eyebrow">Um limite essencial</p>
          <h2 id="boundary-title">Ação cidadã não substitui política pública.</h2>
          <p>Participar, ajudar, mobilizar ou cobrar pode abrir caminhos. Garantir direitos, financiar serviços e executar políticas continua sendo responsabilidade do poder público.</p>
        </div>
        <div class="landing-boundary-map" aria-label="Distinção entre ação cidadã e responsabilidade pública">
          <article class="boundary-card boundary-card--citizen">
            <p class="source-label">O que pode partir de você</p>
            <h3>Conhecer, apoiar, mobilizar e acompanhar.</h3>
          </article>
          <span class="boundary-diamond" aria-hidden="true"></span>
          <article class="boundary-card boundary-card--state">
            <p class="source-label">O que cabe ao Estado</p>
            <h3>Garantir direitos, implementar e prestar contas.</h3>
          </article>
        </div>
      </section>

      <section class="landing-section landing-outcome" aria-labelledby="outcome-title">
        <div class="landing-outcome__copy">
          <p class="eyebrow">Resultado concreto</p>
          <h2 id="outcome-title">Você termina com um plano que cabe na vida real.</h2>
          <ul>
            <li>um compromisso escolhido por você;</li>
            <li>uma rota de atuação cidadã;</li>
            <li>um primeiro passo e um indicador;</li>
            <li>um ciclo de 30 dias com revisão em sete.</li>
          </ul>
        </div>
        <article class="landing-plan-preview" aria-label="Exemplo da estrutura do plano final">
          <p class="source-label">Exemplo de estrutura</p>
          <p class="landing-plan-sentence">Até <span>uma data definida</span>, vou <span>dar meu primeiro passo</span> em <span>meu território</span>.</p>
          <div class="landing-preview-meta">
            <p><strong>Como saberei que avancei</strong><br>Um resultado observável registrado.</p>
            <p><strong>Revisão</strong><br>Daqui a sete dias.</p>
          </div>
        </article>
      </section>

      <section class="landing-final" aria-labelledby="landing-final-title">
        <p class="eyebrow">Comece pela escolha</p>
        <h2 id="landing-final-title">Qual compromisso merece sua atenção agora?</h2>
        <p>Sem cadastro, sem resposta “certa” e sem substituir o papel do Estado.</p>
        <button class="primary-button landing-primary" type="button" data-action="enter-app">Quero conhecer a jornada <span aria-hidden="true">→</span></button>
        <details class="landing-method">
          <summary>Fonte e critérios editoriais</summary>
          <p>${escapeHtml(SOURCE_CONTEXT.provenance)}</p>
          <p><a class="source-link" href="${escapeHtml(SOURCE_CONTEXT.sourceUrl)}" target="_blank" rel="noopener noreferrer">Ler a íntegra e assistir ao vídeo ↗</a></p>
          <p>Sínteses, classificações, rotas e ações sugeridas são editoriais. A ordenação ajuda a comparar respostas; não mede alinhamento político, mérito ou probabilidade de sucesso.</p>
        </details>
      </section>
    </div>
  `;
}

function renderWelcome() {
  const sourceLabel = sourceAttributionLabel(SOURCE_CONTEXT);
  return `
    <section class="screen welcome-screen" aria-labelledby="welcome-title">
      <button class="quiet-button welcome-back" type="button" data-action="return-to-landing">← Voltar à apresentação</button>
      <p class="eyebrow">Jornada individual · 6–8 minutos</p>
      <p class="source-banner" role="note"><strong>Base desta jornada:</strong> ${escapeHtml(sourceLabel)}</p>
      <div class="responsibility-map" aria-label="Ação cidadã e responsabilidade pública caminham juntas">
        <div class="map-track map-track--citizen"><span>O que posso fazer</span></div>
        <div class="map-track map-track--state"><span>O que o Estado deve fazer</span></div>
        <span class="map-marker" aria-hidden="true"></span>
      </div>
      <h1 id="welcome-title">Um compromisso.<br>Um próximo passo possível.</h1>
      <p class="lede">Reflita sobre esses compromissos, escolha onde sua energia faz sentido agora e monte um plano de ação cidadã para os próximos 30 dias.</p>
      <button class="primary-button" type="button" data-action="start">Começar minha escolha</button>
      <details class="how-it-works">
        <summary>Como funciona</summary>
        <ol>
          <li>Você escolhe até três temas.</li>
          <li>O app sugere compromissos a partir das suas respostas.</li>
          <li>Você decide qual deles transformar em plano.</li>
        </ol>
        <p><strong>Fonte pública:</strong> <a class="source-link" href="${escapeHtml(SOURCE_CONTEXT.sourceUrl)}" target="_blank" rel="noopener noreferrer">íntegra e vídeo do pronunciamento ↗</a></p>
        <p>${escapeHtml(SOURCE_CONTEXT.provenance)}</p>
        <p>Sínteses, classificações e rotas de ação são editoriais; o trecho correspondente aparece para conferência.</p>
      </details>
      <p class="privacy-note">Sem cadastro. Suas respostas ficam neste navegador até você usar “Recomeçar” ou apagar os dados do site. Em aparelho compartilhado, apague-as ao terminar.</p>
    </section>
  `;
}

function renderThemes() {
  const selected = new Set(state.selectedThemes);
  const hasAll = selected.has('all');
  const maximumReached = !hasAll && selected.size >= 3;
  const cards = THEMES.map((theme) => `
    <label class="choice-card">
      <input
        type="checkbox"
        name="themes"
        value="${escapeHtml(theme.id)}"
        data-theme="${escapeHtml(theme.id)}"
        ${checked(selected.has(theme.id))}
        ${disabled(hasAll || (maximumReached && !selected.has(theme.id)))}
      >
      <span>
        <strong>${escapeHtml(theme.title)}</strong>
        <span>${escapeHtml(theme.description)}</span>
      </span>
    </label>
  `).join('');

  return `
    <section class="screen" aria-labelledby="themes-heading">
      ${stageHeader('themes', 'O que merece sua energia agora?', 'Escolha até três temas. Isso reduz o questionário sem esconder os demais compromissos.')}
      <fieldset>
        <legend class="visually-hidden">Escolha de um a três temas</legend>
        <div class="choice-grid">
          ${cards}
          <label class="choice-card choice-card--all">
            <input type="checkbox" name="themes" value="all" data-theme="all" ${checked(hasAll)}>
            <span>
              <strong>Quero explorar todos</strong>
              <span>A jornada ficará mais longa e mostrará todos os compromissos.</span>
            </span>
          </label>
        </div>
      </fieldset>
      <p class="selection-note">${hasAll ? 'Todos os temas serão exibidos.' : `${selected.size} de 3 temas escolhidos.`}</p>
      <p class="error-message" tabindex="-1" role="alert"></p>
      <div class="screen-actions">
        <button class="primary-button" type="button" data-action="continue-themes" ${disabled(!canContinue(state))}>Ver compromissos</button>
      </div>
    </section>
  `;
}

function renderReactions() {
  const commitments = currentCommitments();
  if (commitments.length === 0) return renderRecovery('Nenhum compromisso foi encontrado para os temas escolhidos.');
  reactionCursor = Math.min(Math.max(0, reactionCursor), commitments.length - 1);
  const commitment = commitments[reactionCursor];
  const selectedReaction = state.reactions[commitment.id];
  const theme = themeById.get(commitment.themeId);
  const chosenCount = commitments.filter((item) => ['explore', 'maybe'].includes(state.reactions[item.id])).length;

  const options = REACTION_OPTIONS.map((option) => `
    <label class="reaction-option">
      <input type="radio" name="reaction" value="${option.value}" data-commitment="${escapeHtml(commitment.id)}" ${checked(selectedReaction === option.value)}>
      <span><strong>${escapeHtml(option.title)}</strong><span>${escapeHtml(option.description)}</span></span>
    </label>
  `).join('');

  return `
    <section class="screen" aria-labelledby="reactions-heading">
      ${stageHeader('reactions', 'Quais compromissos você quer comparar?', 'Marque no máximo quatro entre “Quero explorar” e “Talvez”. Nenhuma opção mede seu valor moral.', `Compromisso ${reactionCursor + 1} de ${commitments.length}`)}
      <article class="commitment-card">
        <p class="theme-label">${escapeHtml(theme?.title ?? '')}</p>
        <h3 id="reaction-title">${escapeHtml(commitment.title)}</h3>
        <p>${escapeHtml(commitment.summary)}</p>
        <p class="classification-note"><strong>Grau de especificidade:</strong> ${escapeHtml(commitmentKindLabel(commitment.kind))}</p>
        <p class="source-label">Trecho do discurso de vitória de Lula · ${escapeHtml(SOURCE_CONTEXT.dateLabel)} · <a class="source-link" href="${escapeHtml(SOURCE_CONTEXT.sourceUrl)}" target="_blank" rel="noopener noreferrer">conferir íntegra ↗</a></p>
        <blockquote>${escapeHtml(commitment.excerpt)}</blockquote>
        <details>
          <summary>Quem pode fazer o quê?</summary>
          ${responsibilities(commitment)}
        </details>
      </article>
      <fieldset class="option-list">
        <legend>Como este compromisso entra na sua lista?</legend>
        ${options}
      </fieldset>
      <p class="selection-note">${chosenCount} de ${MAX_CANDIDATES} compromissos separados para comparação.</p>
      <p class="error-message" tabindex="-1" role="alert"></p>
      <div class="screen-actions screen-actions--split">
        <button class="quiet-button" type="button" data-action="previous-reaction" ${disabled(reactionCursor === 0)}>Compromisso anterior</button>
        <button class="primary-button" type="button" data-action="next-reaction">
          ${reactionCursor === commitments.length - 1 ? 'Comparar minha lista' : 'Próximo compromisso'}
        </button>
      </div>
    </section>
  `;
}

function renderRatings() {
  const candidates = selectedCandidateObjects();
  if (candidates.length === 0) return renderRecovery('Sua lista de comparação ficou vazia.');
  const total = candidates.length * RATING_DIMENSIONS.length;
  ratingCursor = Math.min(Math.max(0, ratingCursor), total - 1);
  const commitmentIndex = Math.floor(ratingCursor / RATING_DIMENSIONS.length);
  const dimensionIndex = ratingCursor % RATING_DIMENSIONS.length;
  const commitment = candidates[commitmentIndex];
  const dimension = RATING_DIMENSIONS[dimensionIndex];
  const rating = state.ratings[commitment.id] ?? {};
  const isAnswered = Object.hasOwn(rating, dimension.key);

  const choices = dimension.labels.map((label, index) => {
    const value = index + 1;
    return `
      <label class="likert-option">
        <input type="radio" name="rating" value="${value}" data-commitment="${escapeHtml(commitment.id)}" data-dimension="${dimension.key}" ${checked(isAnswered && rating[dimension.key] === value)}>
        <span><strong>${value}</strong><span>${escapeHtml(label)}</span></span>
      </label>
    `;
  }).join('');

  return `
    <section class="screen" aria-labelledby="ratings-heading">
      ${stageHeader('ratings', commitment.title, commitment.summary, `Item ${ratingCursor + 1} de ${total}`)}
      <p class="theme-label">${escapeHtml(themeById.get(commitment.themeId)?.title ?? '')}</p>
      <fieldset>
        <legend id="rating-title">${escapeHtml(dimension.title)}</legend>
        <p class="supporting-copy">${escapeHtml(dimension.help)}</p>
        <div class="option-list">
          ${choices}
          <label class="likert-option">
            <input type="radio" name="rating" value="unknown" data-commitment="${escapeHtml(commitment.id)}" data-dimension="${dimension.key}" ${checked(isAnswered && rating[dimension.key] === null)}>
            <span><strong>Não sei</strong><span>Não tenho informação suficiente para responder agora.</span></span>
          </label>
        </div>
      </fieldset>
      <p class="error-message" tabindex="-1" role="alert"></p>
      <div class="screen-actions screen-actions--split">
        <button class="quiet-button" type="button" data-action="previous-rating" ${disabled(ratingCursor === 0)}>Pergunta anterior</button>
        <button class="primary-button" type="button" data-action="next-rating">${ratingCursor === total - 1 ? 'Ver meus caminhos' : 'Continuar'}</button>
      </div>
    </section>
  `;
}

function scoreLabel(value) {
  if (value === null || value === undefined) return 'não avaliada';
  if (value >= 4) return 'alta';
  if (value >= 3) return 'moderada';
  return 'baixa';
}

function rankedFinalists() {
  return rankCommitments(state.ratings, selectedCandidateObjects());
}

function renderFinalists() {
  const finalists = rankedFinalists();
  if (finalists.length === 0) return renderRecovery('Não foi possível formar sua lista final.');

  const cards = finalists.map((item) => `
    <div class="finalist-card">
      <input id="finalist-${escapeHtml(item.id)}" type="radio" name="finalist" value="${escapeHtml(item.id)}" ${checked(state.selectedCommitmentId === item.id)}>
      <label class="finalist-content" for="finalist-${escapeHtml(item.id)}">
        <span class="theme-label">${escapeHtml(themeById.get(item.themeId)?.title ?? '')}</span>
        <strong class="finalist-title">${escapeHtml(item.title)}</strong>
        <span class="finalist-summary">${escapeHtml(item.summary)}</span>
        <span class="classification-note"><strong>Grau de especificidade:</strong> ${escapeHtml(commitmentKindLabel(item.kind))}</span>
        <span class="metric-row">
          <span class="metric-chip">Importância: ${escapeHtml(scoreLabel(item.meaningScore))}</span>
          <span class="metric-chip">Prontidão: ${escapeHtml(scoreLabel(item.readinessScore))}</span>
          <span class="metric-chip">Informação: ${item.informationComplete ? 'completa' : 'parcial'}</span>
        </span>
        <span class="why-result"><strong>Por que apareceu?</strong> ${escapeHtml(explainRanking(item.rating))}</span>
      </label>
    </div>
  `).join('');

  return `
    <section class="screen" aria-labelledby="finalists-heading">
      ${stageHeader('finalists', 'Seus caminhos possíveis', 'A ordem é apenas uma sugestão transparente. Compare todos os caminhos e escolha explicitamente o que deseja transformar em plano.')}
      <fieldset>
        <legend>Qual compromisso você quer levar adiante?</legend>
        <div class="finalist-grid">${cards}</div>
      </fieldset>
      <details class="method-note">
        <summary>Como a sugestão foi formada?</summary>
        <p>O app agrupa suas respostas de interesse e relevância como “importância”, e capacidade e disposição como “prontidão”. Caminhos com todas as respostas conhecidas aparecem antes dos que contêm “Não sei”; dentro de cada grupo, as respostas mais altas vêm primeiro. A ordem serve apenas para comparar caminhos: não mede compatibilidade política, personalidade, mérito ou probabilidade real de sucesso.</p>
      </details>
      <p class="error-message" tabindex="-1" role="alert"></p>
      <div class="screen-actions">
        <button class="primary-button" type="button" data-action="continue-finalists" ${disabled(!canContinue(state))}>Refletir sobre esta escolha</button>
      </div>
    </section>
  `;
}

function renderReflection() {
  const commitment = chosenCommitment();
  if (!commitment) return renderRecovery('Escolha um compromisso antes de continuar.');
  const fields = [
    { key: 'affected', label: 'Quem é afetado por esse problema?', help: 'Pense em pessoas e grupos concretos, sem registrar nomes ou dados pessoais.', required: true },
    { key: 'change', label: 'Que mudança concreta você gostaria de observar?', help: 'Descreva algo pequeno o bastante para ser reconhecido.', required: true },
    { key: 'roles', label: 'O que cabe a cidadãos e o que cabe ao Estado?', help: 'Você pode complementar a distinção sugerida pelo app.', required: false },
    { key: 'caution', label: 'Que risco, objeção ou efeito indesejado deve ser evitado?', help: 'Uma boa ação também considera limites e consequências.', required: false }
  ];
  const prompts = fields.map((field) => `
    <div class="field">
      <label for="reflection-${field.key}">${escapeHtml(field.label)} ${field.required ? '<span class="required-mark" aria-hidden="true">*</span>' : '<span>(opcional)</span>'}</label>
      <small id="help-${field.key}">${escapeHtml(field.help)}</small>
      <textarea id="reflection-${field.key}" name="${field.key}" data-reflection aria-describedby="help-${field.key}" ${field.required ? 'required' : ''}>${escapeHtml(state.reflections[field.key])}</textarea>
    </div>
  `).join('');

  return `
    <section class="screen" aria-labelledby="reflection-heading">
      ${stageHeader('reflection', commitment.title, 'Antes de agir, faça uma pausa para enxergar pessoas, responsabilidades e riscos.')}
      <article>
        ${responsibilities(commitment)}
        <div class="prompt-list">${prompts}</div>
      </article>
      <p class="error-message" tabindex="-1" role="alert"></p>
      <div class="screen-actions">
        <button class="primary-button" type="button" data-action="continue-reflection">Escolher como agir</button>
      </div>
    </section>
  `;
}

function renderRoute() {
  const commitment = chosenCommitment();
  if (!commitment) return renderRecovery('Escolha um compromisso antes de definir uma rota.');
  const cards = ROUTES.map((route) => `
    <label class="route-card">
      <input type="radio" name="route" value="${escapeHtml(route.id)}" ${checked(state.selectedRouteId === route.id)}>
      <span>
        <strong>${escapeHtml(route.title)}</strong>
        <span>${escapeHtml(route.description)}</span>
        ${route.id === commitment.suggestedRouteId ? '<em>Rota sugerida para este compromisso</em>' : ''}
      </span>
    </label>
  `).join('');

  return `
    <section class="screen" aria-labelledby="route-heading">
      ${stageHeader('route', 'Como você prefere contribuir?', `Todas as rotas podem gerar um plano válido para “${commitment.title}”. A sugestão não é uma obrigação.`)}
      <fieldset>
        <legend>Escolha uma rota de atuação</legend>
        <div class="route-grid">${cards}</div>
      </fieldset>
      <p class="error-message" tabindex="-1" role="alert"></p>
      <div class="screen-actions">
        <button class="primary-button" type="button" data-action="continue-route" ${disabled(!canContinue(state))}>Montar meu plano</button>
      </div>
    </section>
  `;
}

function renderPlan() {
  const commitment = chosenCommitment();
  const route = chosenRoute();
  if (!commitment || !route) return renderRecovery('Defina um compromisso e uma rota antes de montar o plano.');
  const input = state.planInput;

  return `
    <section class="screen" aria-labelledby="plan-heading">
      ${stageHeader('plan', 'Transforme intenção em próximo passo', `${commitment.title} · ${route.title}`)}
      <form id="plan-form" novalidate>
        <div class="form-grid">
          <div class="field">
            <label for="territory">Onde você quer começar? <span class="required-mark" aria-hidden="true">*</span></label>
            <input id="territory" name="territory" data-plan-field value="${escapeHtml(input.territory)}" required autocomplete="off">
          </div>
          <div class="field">
            <label for="availableTime">Quanto tempo você realmente dispõe? <span class="required-mark" aria-hidden="true">*</span></label>
            <select id="availableTime" name="availableTime" data-plan-field required>
              ${['15 minutos nesta semana', '1 hora por mês', '2 horas por mês', '1 hora por semana', 'Quero definir depois'].map((option) => `<option value="${escapeHtml(option)}" ${input.availableTime === option ? 'selected' : ''}>${escapeHtml(option)}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label for="result">Que resultado você quer buscar? <span class="required-mark" aria-hidden="true">*</span></label>
            <textarea id="result" name="result" data-plan-field required>${escapeHtml(input.result)}</textarea>
          </div>
          <div class="field">
            <label for="firstAction">Qual será seu primeiro passo? <span class="required-mark" aria-hidden="true">*</span></label>
            <textarea id="firstAction" name="firstAction" data-plan-field required>${escapeHtml(input.firstAction)}</textarea>
          </div>
          <div class="field">
            <label for="partner">Quem pode fazer isso com você? <span>(opcional)</span></label>
            <input id="partner" name="partner" data-plan-field value="${escapeHtml(input.partner)}" autocomplete="off">
          </div>
          <div class="field">
            <label for="indicator">Como você saberá que avançou? <span class="required-mark" aria-hidden="true">*</span></label>
            <textarea id="indicator" name="indicator" data-plan-field required>${escapeHtml(input.indicator)}</textarea>
          </div>
          <div class="field">
            <label for="targetDate">Data para concluir este ciclo de 30 dias <span class="required-mark" aria-hidden="true">*</span></label>
            <small id="help-target-date">Ciclo iniciado em ${escapeHtml(formatDatePtBr(input.startDate))}; a data final permanece válida se você retomar o plano outro dia.</small>
            <input id="targetDate" name="targetDate" data-plan-field type="date" value="${escapeHtml(input.targetDate)}" aria-describedby="help-target-date" required readonly>
          </div>
        </div>
        <p class="error-message" tabindex="-1" role="alert"></p>
        <div class="screen-actions">
          <button class="primary-button" type="submit">Gerar meu plano</button>
        </div>
      </form>
    </section>
  `;
}

function renderComplete() {
  const commitment = chosenCommitment();
  const route = chosenRoute();
  const plan = state.plan;
  if (!commitment || !route || !plan) return renderRecovery('Seu plano ainda não foi gerado.');
  const partner = plan.partner
    ? `<div class="plan-detail"><p class="plan-label">Possível parceria</p><p>${escapeHtml(plan.partner)}</p></div>`
    : '';
  const caution = plan.caution
    ? `<div class="plan-detail"><p class="plan-label">Cuidado que quero preservar</p><p>${escapeHtml(plan.caution)}</p></div>`
    : '';

  return `
    <section class="screen" aria-labelledby="complete-heading">
      ${stageHeader('complete', 'Seu plano de ação', 'Ele está salvo somente neste aparelho. Você pode imprimir ou copiar o texto.')}
      <article class="plan-card">
        <section class="plan-source" aria-labelledby="plan-source-title">
          <p class="source-label" id="plan-source-title">Origem do compromisso</p>
          <p><strong>Este plano de ação cidadã parte de um compromisso apresentado por ${escapeHtml(SOURCE_CONTEXT.speaker)} em seu ${escapeHtml(SOURCE_CONTEXT.event)}, em ${escapeHtml(SOURCE_CONTEXT.dateLabel)}.</strong></p>
          <blockquote>${escapeHtml(commitment.excerpt)}</blockquote>
          <p>As ações concretas deste plano foram definidas por você; não são citações nem instruções diretas de Lula.</p>
          <p class="source-caveat">${escapeHtml(SOURCE_CONTEXT.provenance)} <a class="source-link" href="${escapeHtml(SOURCE_CONTEXT.sourceUrl)}" target="_blank" rel="noopener noreferrer">Ler a íntegra e assistir ao vídeo ↗</a></p>
        </section>
        <p class="theme-label">${escapeHtml(themeById.get(commitment.themeId)?.title ?? '')}</p>
        <h3 id="complete-title">${escapeHtml(commitment.title)}</h3>
        <div class="responsibility-map responsibility-map--joined" aria-label="Sua ação encontra a responsabilidade pública">
          <div class="map-track map-track--citizen"><span>Sua ação</span></div>
          <div class="map-track map-track--state"><span>Responsabilidade pública</span></div>
          <span class="map-marker" aria-hidden="true"></span>
        </div>
        <p class="plan-statement">Até ${escapeHtml(formatDatePtBr(plan.targetDate))}, vou ${escapeHtml(plan.firstAction)} em ${escapeHtml(plan.territory)}.</p>
        <div class="plan-details">
          <div class="plan-detail"><p class="plan-label">Rota escolhida</p><p>${escapeHtml(route.title)}</p></div>
          <div class="plan-detail"><p class="plan-label">Tempo disponível</p><p>${escapeHtml(plan.availableTime)}</p></div>
          <div class="plan-detail"><p class="plan-label">Resultado buscado</p><p>${escapeHtml(plan.desiredResult)}</p></div>
          <div class="plan-detail"><p class="plan-label">Como saberei que avancei</p><p>${escapeHtml(plan.indicator)}</p></div>
          ${partner}
          ${caution}
        </div>
        ${responsibilities(commitment)}
        <label class="review-check">
          <input type="checkbox" data-review-done ${checked(state.reviewDone)}>
          <span><strong>Revisar em 7 dias</strong><br>Marque quando tiver conferido o que avançou, o que bloqueou e o que precisa mudar.</span>
        </label>
      </article>
      <div class="inline-actions">
        <button class="primary-button" type="button" data-action="copy-plan">Copiar plano</button>
        <button class="secondary-button" type="button" data-action="print-plan">Imprimir ou salvar em PDF</button>
        <button class="quiet-button" type="button" data-action="edit-plan">Editar plano</button>
      </div>
      <p class="privacy-note">Ao compartilhar, lembre que o plano pode revelar preferências políticas ou informações sobre seu território.</p>
    </section>
  `;
}

function renderRecovery(message) {
  return `
    <section class="screen" aria-labelledby="recovery-title">
      <p class="eyebrow">Precisamos retomar uma etapa</p>
      <h2 id="recovery-title">${escapeHtml(message)}</h2>
      <p class="supporting-copy">Seu progresso local pode estar incompleto ou ter sido alterado. Recomece para criar um novo plano.</p>
      <button class="primary-button" type="button" data-action="reset-now">Recomeçar</button>
    </section>
  `;
}

function render({ focus = false, restoreControl = null } = {}) {
  document.body.classList.toggle('has-progress', !['landing', 'welcome'].includes(state.step));
  document.body.classList.toggle('is-landing', state.step === 'landing');
  root.dataset.step = state.step;
  const screens = {
    landing: renderLanding,
    welcome: renderWelcome,
    themes: renderThemes,
    reactions: renderReactions,
    ratings: renderRatings,
    finalists: renderFinalists,
    reflection: renderReflection,
    route: renderRoute,
    plan: renderPlan,
    complete: renderComplete
  };
  root.innerHTML = (screens[state.step] ?? renderLanding)();
  if (restoreControl) {
    window.requestAnimationFrame(() => {
      const control = [...root.querySelectorAll('[name]')].find((candidate) => (
        candidate.name === restoreControl.name && candidate.value === restoreControl.value
      ));
      control?.focus({ preventScroll: true });
    });
  } else if (focus) {
    window.scrollTo({ top: 0, behavior: 'auto' });
    window.requestAnimationFrame(() => {
      const focusTarget = root.querySelector('h1, h2') ?? root;
      if (focusTarget !== root) focusTarget.setAttribute('tabindex', '-1');
      focusTarget.focus({ preventScroll: true });
    });
  }
}

function renderPreservingControl(input) {
  render({
    restoreControl: {
      name: input.name,
      value: input.value
    }
  });
}

function goTo(step) {
  state.step = step;
  persist();
  render({ focus: true });
}

function resetDownstreamFromThemes() {
  state.reactions = {};
  state.ratings = {};
  state.candidates = [];
  state.rankedCandidates = [];
  state.selectedCommitmentId = null;
  state.reflections = createInitialState().reflections;
  state.selectedRouteId = null;
  state.planInput = createInitialState().planInput;
  state.plan = null;
  state.reviewDone = false;
}

function planAsText() {
  const plan = state.plan;
  const commitment = chosenCommitment();
  return formatPlanAsText({ plan, commitment, sourceContext: SOURCE_CONTEXT });
}

async function copyPlan() {
  try {
    await navigator.clipboard.writeText(planAsText());
    showToast('Plano copiado.');
  } catch {
    showToast('O navegador não permitiu copiar. Use “Imprimir ou salvar em PDF”.');
  }
}

function resetJourney(skipConfirmation = false) {
  if (!skipConfirmation && !window.confirm('Apagar as respostas deste aparelho e recomeçar?')) return;
  window.localStorage.removeItem(STORAGE_KEY);
  state = createInitialState();
  reactionCursor = 0;
  ratingCursor = 0;
  render({ focus: true });
}

root.addEventListener('change', (event) => {
  const input = event.target;

  if (input.matches('[data-theme]')) {
    const id = input.dataset.theme;
    if (id === 'all') {
      state.selectedThemes = input.checked ? ['all'] : [];
    } else {
      const selected = new Set(state.selectedThemes.filter((item) => item !== 'all'));
      input.checked ? selected.add(id) : selected.delete(id);
      if (selected.size > 3) {
        showToast('Escolha no máximo três temas.');
        renderPreservingControl(input);
        return;
      }
      state.selectedThemes = [...selected];
    }
    resetDownstreamFromThemes();
    persist();
    renderPreservingControl(input);
    return;
  }

  if (input.matches('input[name="reaction"]')) {
    const id = input.dataset.commitment;
    const oldValue = state.reactions[id];
    const wasCandidate = ['explore', 'maybe'].includes(oldValue);
    const willBeCandidate = ['explore', 'maybe'].includes(input.value);
    const currentCount = Object.values(state.reactions).filter((value) => ['explore', 'maybe'].includes(value)).length;
    if (!wasCandidate && willBeCandidate && currentCount >= MAX_CANDIDATES) {
      showToast('Sua lista já tem quatro compromissos. Revise uma escolha anterior para trocar.');
      renderPreservingControl(input);
      return;
    }
    state.reactions[id] = input.value;
    persist();
    renderPreservingControl(input);
    return;
  }

  if (input.matches('input[name="rating"]')) {
    const id = input.dataset.commitment;
    const dimension = input.dataset.dimension;
    state.ratings[id] ??= {};
    state.ratings[id][dimension] = input.value === 'unknown' ? null : Number(input.value);
    persist();
    renderPreservingControl(input);
    return;
  }

  if (input.matches('input[name="finalist"]')) {
    state.selectedCommitmentId = input.value;
    state.selectedRouteId = null;
    state.planInput = createInitialState().planInput;
    state.plan = null;
    persist();
    renderPreservingControl(input);
    return;
  }

  if (input.matches('input[name="route"]')) {
    state.selectedRouteId = input.value;
    state.planInput = createPlanDefaults(chosenCommitment(), input.value);
    state.plan = null;
    persist();
    renderPreservingControl(input);
    return;
  }

  if (input.matches('[data-review-done]')) {
    state.reviewDone = input.checked;
    persist();
  }
});

root.addEventListener('input', (event) => {
  const input = event.target;
  if (input.matches('[data-reflection]')) {
    state.reflections[input.name] = input.value;
    persist();
  }
  if (input.matches('[data-plan-field]')) {
    state.planInput[input.name] = input.value;
    persist();
  }
});

root.addEventListener('submit', (event) => {
  if (!event.target.matches('#plan-form')) return;
  event.preventDefault();
  if (!canContinue(state)) {
    showInlineError('Preencha os campos obrigatórios para gerar o plano.', '#territory');
    return;
  }
  try {
    state.plan = buildPlan(
      { ...state.planInput, caution: state.reflections.caution },
      chosenCommitment(),
      chosenRoute()
    );
    goTo('complete');
  } catch {
    showInlineError('Confira a data e os campos do plano. O ciclo precisa terminar em 30 dias.', '#targetDate');
  }
});

root.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;

  if (action === 'enter-app') {
    goTo('welcome');
    return;
  }
  if (action === 'return-to-landing') {
    goTo('landing');
    return;
  }
  if (action === 'start') {
    goTo('themes');
    return;
  }
  if (action === 'reset-now') {
    resetJourney(true);
    return;
  }
  if (action === 'back') {
    if (state.step === 'reactions' && reactionCursor > 0) {
      reactionCursor -= 1;
      render({ focus: true });
      return;
    }
    if (state.step === 'ratings' && ratingCursor > 0) {
      ratingCursor -= 1;
      render({ focus: true });
      return;
    }
    goTo(getPreviousStep(state.step));
    return;
  }
  if (action === 'continue-themes') {
    if (!canContinue(state)) {
      showInlineError('Escolha pelo menos um tema para continuar.', 'input[name="themes"]');
      return;
    }
    reactionCursor = 0;
    goTo('reactions');
    return;
  }
  if (action === 'previous-reaction') {
    reactionCursor = Math.max(0, reactionCursor - 1);
    render({ focus: true });
    return;
  }
  if (action === 'next-reaction') {
    const commitments = currentCommitments();
    const current = commitments[reactionCursor];
    if (!current || !Object.hasOwn(state.reactions, current.id)) {
      showInlineError('Escolha uma opção para este compromisso antes de continuar.', 'input[name="reaction"]');
      return;
    }
    if (reactionCursor < commitments.length - 1) {
      reactionCursor += 1;
      render({ focus: true });
      return;
    }
    try {
      const candidates = selectCandidates(state.reactions, commitments, MAX_CANDIDATES);
      if (candidates.length === 0) {
        showInlineError('Separe pelo menos um compromisso como “Quero explorar” ou “Talvez”.');
        return;
      }
      state.candidates = candidates.map((item) => item.id);
      state.ratings = {};
      ratingCursor = 0;
      goTo('ratings');
    } catch {
      showInlineError('Sua lista tem mais de quatro compromissos. Volte e escolha quais deseja comparar.');
    }
    return;
  }
  if (action === 'previous-rating') {
    ratingCursor = Math.max(0, ratingCursor - 1);
    render({ focus: true });
    return;
  }
  if (action === 'next-rating') {
    const candidates = selectedCandidateObjects();
    const total = candidates.length * RATING_DIMENSIONS.length;
    const commitment = candidates[Math.floor(ratingCursor / RATING_DIMENSIONS.length)];
    const dimension = RATING_DIMENSIONS[ratingCursor % RATING_DIMENSIONS.length];
    if (!commitment || !Object.hasOwn(state.ratings[commitment.id] ?? {}, dimension.key)) {
      showInlineError('Escolha uma opção, inclusive “Não sei”, antes de continuar.', 'input[name="rating"]');
      return;
    }
    if (ratingCursor < total - 1) {
      ratingCursor += 1;
      render({ focus: true });
      return;
    }
    state.rankedCandidates = rankedFinalists().map((item) => ({
      id: item.id,
      meaningScore: item.meaningScore,
      readinessScore: item.readinessScore,
      score: item.score
    }));
    goTo('finalists');
    return;
  }
  if (action === 'continue-finalists') {
    if (!canContinue(state)) {
      showInlineError('Escolha explicitamente um compromisso para continuar.', 'input[name="finalist"]');
      return;
    }
    goTo('reflection');
    return;
  }
  if (action === 'continue-reflection') {
    if (!canContinue(state)) {
      showInlineError('Responda quem é afetado e qual mudança concreta você gostaria de observar.', '#reflection-affected');
      return;
    }
    goTo('route');
    return;
  }
  if (action === 'continue-route') {
    if (!canContinue(state)) {
      showInlineError('Escolha uma rota de atuação para continuar.', 'input[name="route"]');
      return;
    }
    if (!state.planInput.targetDate) state.planInput = createPlanDefaults(chosenCommitment(), state.selectedRouteId);
    goTo('plan');
    return;
  }
  if (action === 'copy-plan') {
    await copyPlan();
    return;
  }
  if (action === 'print-plan') {
    window.print();
    return;
  }
  if (action === 'edit-plan') {
    goTo('plan');
  }
});

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-global-action="reset"]');
  if (button) resetJourney(false);
});

render();
