const INTEGER_PT_BR = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 0
});

const DECIMAL_PT_BR = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});

function formatShare(value, population) {
  return population > 0 && value === 0
    ? 'menos de 0,1%'
    : `${DECIMAL_PT_BR.format(value)}%`;
}

export function formatElderlyMetric(metric) {
  return {
    context: `${metric.sexLabel} · ${metric.ageLabel}`,
    value: INTEGER_PT_BR.format(metric.value),
    share: `${formatShare(metric.shareOfSorocaba, metric.value)} da população de Sorocaba · ${formatShare(metric.shareOfElderly, metric.value)} das pessoas com 60 anos ou mais`
  };
}

export function elderlyChartRows({ profile, sex = 'total', activeAgeBand = 'all' }) {
  const values = profile.ageBands.map((band) => band[sex]);
  if (values.some((value) => !Number.isFinite(value))) {
    throw new RangeError(`Sexo não disponível no gráfico: ${sex}`);
  }
  const maximum = Math.max(...values);

  return profile.ageBands.map((band) => ({
    id: band.id,
    label: band.label.replace(/ anos(?= |$)/, ''),
    value: band[sex],
    formattedValue: INTEGER_PT_BR.format(band[sex]),
    widthPercent: Number((100 * band[sex] / maximum).toFixed(1)),
    active: band.id === activeAgeBand
  }));
}
