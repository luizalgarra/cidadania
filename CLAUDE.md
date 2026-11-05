# Compromisso em Ação

App web estático (pt-BR, mobile-first) para refletir sobre compromissos do discurso de vitória de Lula (out/2026) e gerar um plano cidadão de 30 dias. Recorte de dados: Sorocaba (SP), IBGE `3552205`. Começou no Codex/ChatGPT; agora segue no Claude Code.

## Comandos

- `npm test` — Node test runner, sem dependências.
- `RUN_BROWSER_SMOKE=1 npm test` — inclui os smoke tests de navegador (precisa de Chrome).
- `npm run build` — copia `src/` para `dist/`.

## Regras

- Zero dependências, zero rede no JS, zero analytics/cadastro. Estado só em `localStorage`. A CSP bloqueia conexões externas.
- Todo arquivo novo em `src/` precisa entrar em `SOURCE_FILES` (`scripts/build.mjs`), senão não vai para `dist/`.
- Rodar `npm run build` depois de editar `src/`; `dist/` é versionado e é o que vai ao ar.
- Dados de Sorocaba são snapshots em `src/sorocaba-data.js` (com período, método, ressalva e fonte). Consultas reproduzíveis em `data/queries/` (BigQuery / Base dos Dados), executadas fora do navegador. Nunca inventar número quando não houver dado municipal.
- Neutralidade: não inferir voto, partido, ideologia ou perfil. Distinguir ação cidadã de dever do Estado. Sínteses são editoriais, não citações de Lula.
- Acessibilidade: alvos de toque ≥ 48px, foco visível, `prefers-reduced-motion`, toda escala Likert com "Não sei".
- TDD: teste em `tests/*.test.js` antes da implementação.

## Estrutura

- `src/index.html` + `app.js` / `app-state.js` / `logic.js` / `commitments.js` — jornada principal (temas → compromissos → perguntas → rota → plano).
- `src/fontes.html` + `sources-page.js` / `sorocaba-query.js` — catálogo de fontes e pesquisa da população idosa.
- `src/idosos.html` (três portas: `#procuro`, `#quem-cuida`, `ajudar.html`), `entrevista.html`, `ajudar.html` + `elderly-*.js`, `local-services.js` — módulo pessoas idosas.
- `docs/superpowers/plans/` — plano original de implementação.

## Deploy

No ar em https://cidadania.institutointersistemico.com.br — Cloudflare Worker `compromisso-em-acao` (só assets estáticos, conta Luiz Algarra), config em `wrangler.jsonc`. Repo: https://github.com/luizalgarra/cidadania.

Push na `main` publica sozinho (Cloudflare Workers Builds: `npm test` → `npx wrangler deploy`). Como `dist/` é versionado, rode `npm run build` e commite `dist/` antes do push. Deploy manual, se preciso: `npx wrangler deploy`.

O domínio raiz `institutointersistemico.com.br` é outro app (Lovable, repo `luizalgarra/senior-vertem`) — não mexer. Workers redireciona `/x.html` → `/x` (307), normal. O antigo `.openai/hosting.json` (OpenAI Sites) ficou obsoleto.
