# Compromisso em Ação

Aplicação web individual para refletir sobre compromissos extraídos de uma transcrição atribuída a Luiz Inácio Lula da Silva e transformar uma escolha em um plano cidadão de 30 dias.

## Como funciona

1. A pessoa escolhe até três temas.
2. Separa até quatro compromissos para comparar.
3. Responde quatro perguntas por compromisso, sempre com a opção “Não sei”.
4. Escolhe explicitamente um dos caminhos sugeridos.
5. Distingue ação cidadã de responsabilidade pública.
6. Gera um plano local com primeiro passo, indicador e revisão em sete dias.

A ordenação é heurística e serve somente à reflexão. Não é teste de perfil, compatibilidade política ou probabilidade de sucesso. A transcrição foi fornecida pelo usuário; data, autoria documental e origem externa não foram verificadas pelo app. Sínteses, classificações e rotas são editoriais.

## Privacidade

Não há cadastro, analytics, fontes externas ou requisições de rede feitas pelo JavaScript. As respostas são guardadas em `localStorage` até a pessoa recomeçar a jornada ou apagar os dados do site. A política de conteúdo bloqueia conexões externas.

## Desenvolvimento

Requer Node.js 20 ou mais recente.

```sh
npm test
npm run build
```

O build estático é gerado em `dist/`.
