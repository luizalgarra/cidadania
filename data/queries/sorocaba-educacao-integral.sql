-- Sorocaba (IBGE 3552205): matrículas dos anos finais do ensino fundamental
-- em tempo integral, considerando todas as dependências administrativas.
-- Fonte tratada: Base dos Dados / Inep Censo Escolar.

SELECT
  ano,
  SUM(quantidade_matricula_fundamental_anos_finais_integral) AS matriculas_integral,
  SUM(quantidade_matricula_fundamental_anos_finais) AS matriculas_total,
  ROUND(
    100 * SAFE_DIVIDE(
      SUM(quantidade_matricula_fundamental_anos_finais_integral),
      SUM(quantidade_matricula_fundamental_anos_finais)
    ),
    1
  ) AS percentual_integral
FROM `basedosdados.br_inep_censo_escolar.escola`
WHERE id_municipio = '3552205'
  AND ano = 2023
GROUP BY ano;
