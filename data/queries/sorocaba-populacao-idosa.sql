-- Sorocaba (IBGE 3552205): perfil da população com 60 anos ou mais.
-- Fonte tratada: Base dos Dados / IBGE Censo 2022.
-- Tabela: basedosdados.br_ibge_censo_2022.populacao_idade_sexo
-- Verificação independente: SIDRA, tabela 9514.
--
-- Importante: esta tabela não possui linhas “Total” em sexo ou na forma de
-- declaração da idade. Data de nascimento e idade presumida são parcelas
-- complementares e devem ser somadas. Os totais abaixo são calculados.

WITH idosos AS (
  SELECT
    sexo,
    CASE
      WHEN idade_anos BETWEEN 60 AND 64 THEN '60 a 64 anos'
      WHEN idade_anos BETWEEN 65 AND 69 THEN '65 a 69 anos'
      WHEN idade_anos BETWEEN 70 AND 74 THEN '70 a 74 anos'
      WHEN idade_anos BETWEEN 75 AND 79 THEN '75 a 79 anos'
      WHEN idade_anos BETWEEN 80 AND 84 THEN '80 a 84 anos'
      WHEN idade_anos BETWEEN 85 AND 89 THEN '85 a 89 anos'
      WHEN idade_anos BETWEEN 90 AND 94 THEN '90 a 94 anos'
      WHEN idade_anos BETWEEN 95 AND 99 THEN '95 a 99 anos'
      ELSE '100 anos ou mais'
    END AS faixa_etaria,
    populacao
  FROM `basedosdados.br_ibge_censo_2022.populacao_idade_sexo`
  WHERE id_municipio = '3552205'
    AND idade_anos >= 60
),
por_faixa_e_sexo AS (
  SELECT faixa_etaria, sexo, SUM(populacao) AS pessoas
  FROM idosos
  GROUP BY faixa_etaria, sexo
),
por_faixa_total AS (
  SELECT faixa_etaria, 'Total' AS sexo, SUM(populacao) AS pessoas
  FROM idosos
  GROUP BY faixa_etaria
),
resultado AS (
  SELECT * FROM por_faixa_total
  UNION ALL
  SELECT * FROM por_faixa_e_sexo
),
total_idosos AS (
  SELECT SUM(populacao) AS pessoas_60_mais
  FROM idosos
),
populacao_municipal AS (
  -- Total de Sorocaba no Censo 2022 (IBGE SIDRA, tabela 9514).
  SELECT 723682 AS pessoas_total
)
SELECT
  faixa_etaria,
  sexo,
  pessoas,
  ROUND(100 * SAFE_DIVIDE(pessoas, pessoas_60_mais), 1) AS percentual_das_pessoas_60_mais,
  ROUND(100 * SAFE_DIVIDE(pessoas, pessoas_total), 1) AS percentual_da_populacao_de_sorocaba
FROM resultado
CROSS JOIN total_idosos
CROSS JOIN populacao_municipal
ORDER BY
  CASE faixa_etaria
    WHEN '60 a 64 anos' THEN 1
    WHEN '65 a 69 anos' THEN 2
    WHEN '70 a 74 anos' THEN 3
    WHEN '75 a 79 anos' THEN 4
    WHEN '80 a 84 anos' THEN 5
    WHEN '85 a 89 anos' THEN 6
    WHEN '90 a 94 anos' THEN 7
    WHEN '95 a 99 anos' THEN 8
    ELSE 9
  END,
  CASE sexo WHEN 'Total' THEN 1 WHEN 'Mulheres' THEN 2 ELSE 3 END;
