# Compromisso em Ação

Aplicação web individual para refletir sobre compromissos apresentados por Luiz Inácio Lula da Silva em seu discurso de vitória após o segundo turno, em outubro de 2026, e transformar uma escolha em um plano cidadão de 30 dias.

## Como funciona

1. Uma landing page apresenta a origem no discurso, a proposta da jornada e o limite entre ação cidadã e dever do Estado.
2. A pessoa escolhe até três temas.
3. Separa até quatro compromissos para comparar.
4. Responde quatro perguntas por compromisso, sempre com a opção “Não sei”.
5. Escolhe explicitamente um dos caminhos sugeridos.
6. Distingue ação cidadã de responsabilidade pública.
7. Gera um plano local com primeiro passo, indicador e revisão em sete dias.

A ordenação é heurística e serve somente à reflexão. Não é teste de perfil, compatibilidade política ou probabilidade de sucesso. A fonte pública consultada reúne a [íntegra e o vídeo do pronunciamento da vitória de Lula](https://www.poder360.com.br/poder-eleicoes-2026/leia-a-integra-do-pronunciamento-da-vitoria-de-lula-2/); há também [registro audiovisual no Senado Notícias](https://www12.senado.leg.br/noticias/videos/2026/10/reeleito-presidente-lula-agradece-apoio-do-povo-e-sobretudo-das-mulheres). Sínteses, classificações, rotas e ações concretas são editoriais e não devem ser lidas como citações ou instruções diretas de Lula.

## Privacidade

Não há cadastro, analytics, fontes externas ou requisições de rede feitas pelo JavaScript. As respostas são guardadas em `localStorage` até a pessoa recomeçar a jornada ou apagar os dados do site. A política de conteúdo bloqueia conexões externas.

## Desenvolvimento

Requer Node.js 20 ou mais recente.

```sh
npm test
npm run build
```

O build estático é gerado em `dist/`.
