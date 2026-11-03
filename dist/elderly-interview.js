import { buildSupportPlan } from './elderly-support-plan.js';
const form = document.querySelector('#interview-form');
const plan = document.querySelector('#personal-plan');
const intro = document.querySelector('#interview-intro');
const items = document.querySelector('#plan-items');
function el(tag, text, cls) {
  const n = document.createElement(tag); n.textContent = text;
  if (cls) n.className = cls; return n;
}
form.reset();
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const answers = Object.fromEntries(new FormData(form));
  items.replaceChildren();
  buildSupportPlan(answers).forEach((step, index) => {
    const card = el('article', '', 'guide-card guide-reading');
    card.append(el('h2', (index + 1) + '. ' + step.title), el('p', step.reason), el('p', step.action), el('h3', 'O que perguntar'), el('p', step.question));
    const action = el('a', step.url.startsWith('./') ? 'Encontrar serviço e telefone →' : 'Abrir Meu INSS ↗', 'primary-button');
    action.href = step.url;
    if (!step.url.startsWith('./')) { action.target = '_blank'; action.rel = 'noopener noreferrer'; }
    const source = el('a', 'Conferir orientação oficial ↗');
    source.href = step.source; source.target = '_blank'; source.rel = 'noopener noreferrer';
    card.append(action, el('p', '', 'guide-source'));
    card.lastElementChild.append(source);
    items.append(card);
  });
  document.querySelector('#plan-date').textContent = 'Plano gerado em ' + new Date().toLocaleDateString('pt-BR') + '.';
  document.querySelector('#plan-scope').textContent = answers.age === 'under60' ? 'Você informou menos de 60 anos. As orientações gerais podem ajudar, mas a condição de pessoa idosa não se aplica por essa idade. Não há indicação de BPC por idade.' : 'As respostas “não sei” não foram tratadas como ausência de necessidade. Não atribuímos pontuação nem grau de elegibilidade.';
  form.hidden = true; intro.hidden = true; plan.hidden = false; plan.focus();
});
document.querySelector('#edit-interview').addEventListener('click', () => {
  plan.hidden = true; form.hidden = false; intro.hidden = false; form.querySelector('input').focus();
});
document.querySelectorAll('.erase-interview').forEach(button => button.addEventListener('click', () => {
  form.reset(); items.replaceChildren();
  document.querySelector('#plan-date').textContent = '';
  document.querySelector('#plan-scope').textContent = '';
  plan.hidden = true; form.hidden = false; intro.hidden = false; form.querySelector('input').focus();
}));
document.querySelector('#print-plan').addEventListener('click', () => window.print());
window.addEventListener('pageshow', event => {
  if (event.persisted) { form.reset(); items.replaceChildren(); plan.hidden = true; form.hidden = false; intro.hidden = false; }
});

