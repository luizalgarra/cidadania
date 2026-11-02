const INTEGER_PT_BR = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 0
});

const DECIMAL_PT_BR = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});

export function formatAccessibilityMetric(metric) {
  return {
    context: `${metric.ageLabel} · ${metric.metricLabel}`,
    value: `${DECIMAL_PT_BR.format(metric.percentage)}%`,
    count: `${INTEGER_PT_BR.format(metric.observed)} de ${INTEGER_PT_BR.format(metric.universe)} pessoas ${metric.conditionLabel}`,
    tone: metric.favorable ? 'favorable' : 'attention'
  };
}

export function accessibilityChartRows({ profile, ageBand = '60-69', activeMetric = 'sidewalk' }) {
  const selectedBand = profile.ageBands.find((band) => band.id === ageBand);
  if (!selectedBand) {
    throw new RangeError(`Faixa etária não disponível no entorno: ${ageBand}`);
  }

  return profile.metrics.map((metric) => {
    const value = Number((100 * selectedBand.values[metric.id] / selectedBand.universe).toFixed(1));
    return {
      id: metric.id,
      label: metric.label,
      value,
      formattedValue: `${DECIMAL_PT_BR.format(value)}%`,
      favorable: metric.favorable,
      active: metric.id === activeMetric
    };
  });
}
