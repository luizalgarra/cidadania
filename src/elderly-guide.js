import { findServices, SERVICE_SOURCES } from './local-services.js';

const query = document.querySelector('#service-search');
const type = document.querySelector('#service-type');
const results = document.querySelector('#service-results');
function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function link(label, href, external = false) {
  const node = element('a', label, 'quiet-button');
  node.href = href;
  if (external) { node.target = '_blank'; node.rel = 'noopener noreferrer'; }
  return node;
}
function renderServices() {
  const matches = findServices(query.value, type.value);
  results.replaceChildren();
  document.querySelector('#service-count').textContent = matches.length + (matches.length === 1 ? ' unidade encontrada' : ' unidades encontradas');
  if (!matches.length) {
    results.append(element('p', 'Não encontramos esse termo nesta lista. Tente apenas uma palavra, limpe a busca ou consulte os diretórios oficiais abaixo. Isso não significa que seu bairro não tenha atendimento.'));
    return;
  }
  for (const service of matches) {
    const card = element('article', '', 'guide-card');
    card.append(element('h3', service.type + ' ' + service.name), element('p', service.address + ' · Sorocaba/SP'));
    const actions = element('div', '', 'guide-actions');
    for (const phone of service.phones) actions.append(link('Ligar (15) ' + phone, 'tel:+5515' + phone.replace(/\D/g, '')));
    actions.append(link('Ver endereço no mapa ↗', 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(service.type + ' ' + service.name + ', ' + service.address + ', Sorocaba SP'), true));
    card.append(actions, element('p', 'Confirme se esta unidade atende seu endereço antes de ir.', 'guide-note'));
    card.append(link('Conferir na fonte oficial ↗', SERVICE_SOURCES[service.type], true));
    results.append(card);
  }
}
query.addEventListener('input', renderServices);
type.addEventListener('change', renderServices);
document.querySelector('#service-clear').addEventListener('click', () => {
  query.value = ''; type.value = 'all'; renderServices(); query.focus();
});
const needs = {
  income: ['Apoio para a renda e o dia a dia', 'Procure o CRAS para orientação sobre a rede de assistência social.', 'Quais apoios posso buscar? Como faço ou atualizo meu Cadastro Único? Quais documentos devo levar?', 'CRAS'],
  benefit: ['Entenda seu benefício ou pedido', 'Procure os canais oficiais do INSS: Meu INSS ou telefone 135.', 'Como acompanho meu pedido? Há alguma pendência? Se já tiver protocolo, tenha o número à mão.', 'INSS'],
  health: ['Consulta, vacina e acompanhamento', 'Entre em contato com uma UBS e confirme qual atende seu endereço.', 'Como agendo atendimento e verifico as vacinas disponíveis? Quais documentos preciso levar?', 'UBS'],
  home: ['Cuidado para quem tem dificuldade de sair de casa', 'Comece pela equipe da UBS responsável pelo endereço da pessoa.', 'Como solicitar uma avaliação para cuidado domiciliar? Explique a dificuldade de deslocamento. A equipe avalia a indicação e a disponibilidade do serviço.', 'UBS'],
  help: ['Ajude respeitando as escolhas da pessoa', 'Converse com a pessoa idosa e escolha com ela uma necessidade concreta.', 'Você gostaria de ajuda para encontrar um serviço, fazer uma ligação ou ir a um atendimento?', 'HELP']
};
document.querySelectorAll('[data-need]').forEach(choice => choice.addEventListener('click', event => {
  event.preventDefault();
  const [title, where, question, destination] = needs[choice.dataset.need];
  document.querySelectorAll('[data-need]').forEach(item => item.removeAttribute('aria-current'));
  choice.setAttribute('aria-current', 'true');
  document.querySelector('#need-title').textContent = title;
  document.querySelector('#need-where').textContent = where;
  document.querySelector('#need-question').textContent = question;
  const actions = document.querySelector('#need-actions');
  actions.replaceChildren();
  if (destination === 'INSS') {
    actions.append(link('Ligar 135', 'tel:135'), link('Abrir Meu INSS ↗', 'https://meu.inss.gov.br/', true));
  } else if (destination === 'HELP') {
    actions.append(link('Ver serviços', '#localizador'), link('Planejar meu primeiro passo', '#primeiro-passo'));
  } else {
    type.value = destination; query.value = ''; renderServices();
    actions.append(link('Encontrar ' + destination + ' e telefone', '#localizador'));
  }
  const panel = document.querySelector('#need-result');
  panel.hidden = false; panel.focus();
}));
renderServices();
