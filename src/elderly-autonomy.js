const INTEGER_PT_BR = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 0
});

const CURRENCY_PT_BR = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

function formatCurrency(value) {
  return CURRENCY_PT_BR.format(value).replace(/\u00a0/g, ' ');
}

export function formatAutonomyMetric(metric) {
  return {
    context: `${metric.sexLabel} · ${metric.ageLabel}`,
    median: formatCurrency(metric.medianMonthlyIncome),
    mean: formatCurrency(metric.meanMonthlyIncome),
    people: `${INTEGER_PT_BR.format(metric.peopleEstimate)} pessoas consideradas na estimativa`
  };
}

export function autonomyChartRows({ profile, sex = 'total', activeAgeBand = '60-64' }) {
  const values = profile.ageBands.map((band) => band[sex]?.medianMonthlyIncome);
  if (values.some((value) => !Number.isFinite(value))) {
    throw new RangeError(`Sexo não disponível no comparativo de renda: ${sex}`);
  }
  const maximum = Math.max(...values);

  return profile.ageBands.map((band) => ({
    id: band.id,
    label: band.label.replace(/ anos(?= |$)/, ''),
    value: band[sex].medianMonthlyIncome,
    formattedValue: `R$ ${INTEGER_PT_BR.format(band[sex].medianMonthlyIncome)}`,
    widthPercent: Number((100 * band[sex].medianMonthlyIncome / maximum).toFixed(1)),
    active: band.id === activeAgeBand
  }));
}
