-- Sorocaba (IBGE 3552205): população com 60 anos ou mais no Censo 2022.
-- Fonte tratada: Base dos Dados / IBGE Censo 2022.
-- Verificação independente: SIDRA, tabela 9514.

WITH populacao_idosa AS (
  SELECT
    SUM(populacao) AS pessoas_60_mais
  FROM `basedosdados.br_ibge_censo_2022.populacao_idade_sexo`
  WHERE id_municipio = '3552205'
    AND sexo = 'Total'
    AND forma_declaracao_idade = 'Total'
    AND idade_anos >= 60
),
populacao_total AS (
  SELECT
    populacao_residente AS pessoas_total
  FROM `basedosdados.br_ibge_censo_2022.area_territorial_densidade_demografica_municipio`
  WHERE id_municipio = '3552205'
)
SELECT
  pessoas_60_mais,
  pessoas_total,
  ROUND(100 * SAFE_DIVIDE(pessoas_60_mais, pessoas_total), 1) AS percentual_60_mais
FROM populacao_idosa
CROSS JOIN populacao_total;
