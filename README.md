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

## Retrato de Sorocaba

O recorte de dados desta versão é exclusivamente municipal: Sorocaba (SP), código IBGE `3552205`. Indicadores verificados aparecem na etapa de reflexão, na conclusão do plano e no catálogo de fontes. Um compromisso sem observação municipal adequada continua acompanhado somente por fontes documentais; o aplicativo não cria um número substituto.

Os snapshots publicados ficam em `src/sorocaba-data.js`. Cada registro conserva período, método, ressalva, fonte original e tabela equivalente na Base dos Dados. As consultas reproduzíveis estão em `data/queries/` e sempre filtram o código municipal `3552205`.

Primeira seleção publicada:

- população com 60 anos ou mais, Censo 2022;
- matrículas dos anos finais do ensino fundamental em tempo integral, Censo Escolar 2023.

As consultas à Base dos Dados são executadas fora do navegador. Isso preserva credenciais e custos do BigQuery e mantém a aplicação estática. Antes de atualizar um snapshot, confira a cobertura temporal, o dicionário, a fonte original e se a definição do indicador permaneceu comparável.

A ordenação é heurística e serve somente à reflexão. Não é teste de perfil, compatibilidade política ou probabilidade de sucesso. A fonte pública consultada reúne a [íntegra e o vídeo do pronunciamento da vitória de Lula](https://www.poder360.com.br/poder-eleicoes-2026/leia-a-integra-do-pronunciamento-da-vitoria-de-lula-2/); há também [registro audiovisual no Senado Notícias](https://www12.senado.leg.br/noticias/videos/2026/10/reeleito-presidente-lula-agradece-apoio-do-povo-e-sobretudo-das-mulheres). Sínteses, classificações, rotas e ações concretas são editoriais e não devem ser lidas como citações ou instruções diretas de Lula.

## Privacidade

Não há cadastro, analytics, fontes externas ou requisições de rede feitas pelo JavaScript. As respostas são guardadas em `localStorage` até a pessoa recomeçar a jornada ou apagar os dados do site. A política de conteúdo bloqueia conexões externas; os dados agregados de Sorocaba são publicados como snapshots estáticos.

## Desenvolvimento

Requer Node.js 20 ou mais recente.

```sh
npm test
npm run build
```

O build estático é gerado em `dist/`.
