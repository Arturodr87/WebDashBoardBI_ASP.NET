import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatCurrency,
  formatNumber,
  formatHls,
  calculateKpiSummary,
  validateSqlQuery,
  filterDataset,
  aggregateByKey,
} from './dataTransformers';

test('formatCurrency outputs correctly formatted currency string', () => {
  const result = formatCurrency(165000);
  assert.ok(result.includes('165'));
  assert.ok(result.startsWith('$'));
});

test('formatNumber outputs formatted thousands representation', () => {
  const result = formatNumber(1690);
  assert.ok(result.includes('1') && result.includes('690'));
});

test('formatHls outputs formatted hectolitros string', () => {
  const result = formatHls(18078.01);
  assert.ok(result.includes('18'));
  assert.ok(result.endsWith('Hls'));
});

test('calculateKpiSummary calculates upward positive percentage and up trend', () => {
  const summary = calculateKpiSummary(24780, 21500, true);
  assert.equal(summary.trend, 'up');
  assert.ok(summary.percentageChange > 0);
  assert.ok(summary.formattedCurrent.startsWith('$'));
});

test('calculateKpiSummary calculates negative percentage and down trend', () => {
  const summary = calculateKpiSummary(80, 100, false);
  assert.equal(summary.trend, 'down');
  assert.equal(summary.percentageChange, -20);
});

test('validateSqlQuery accepts legitimate read-only SELECT queries', () => {
  const valid1 = validateSqlQuery('SELECT TOP 10 ID, Nombre, Monto FROM Facturas WHERE Anio = 2024');
  assert.equal(valid1.isValid, true);

  const valid2 = validateSqlQuery('WITH CTE_Ventas AS (SELECT Canal, SUM(Total) as Total FROM Ventas GROUP BY Canal) SELECT * FROM CTE_Ventas');
  assert.equal(valid2.isValid, true);
});

test('validateSqlQuery rejects dangerous SQL operations', () => {
  const dropAttempt = validateSqlQuery('DROP TABLE Facturas');
  assert.equal(dropAttempt.isValid, false);

  const deleteAttempt = validateSqlQuery('DELETE FROM Clientes WHERE 1=1');
  assert.equal(deleteAttempt.isValid, false);

  const updateAttempt = validateSqlQuery('UPDATE Usuarios SET Rol = "Admin"');
  assert.equal(updateAttempt.isValid, false);
});

test('filterDataset filters rows accurately by canal and provincia', () => {
  const sample = [
    { id: 1, canal: 'Directo', provincia: 'Pichincha', monto: 100 },
    { id: 2, canal: 'Retail', provincia: 'Guayas', monto: 200 },
    { id: 3, canal: 'Directo', provincia: 'Guayas', monto: 300 },
  ];

  const filteredCanal = filterDataset(sample, { canal: 'Directo' });
  assert.equal(filteredCanal.length, 2);

  const filteredBoth = filterDataset(sample, { canal: 'Directo', provincia: 'Guayas' });
  assert.equal(filteredBoth.length, 1);
  assert.equal(filteredBoth[0].id, 3);
});

test('aggregateByKey aggregates numeric sums correctly', () => {
  const sample = [
    { canal: 'Web', total: 50 },
    { canal: 'Web', total: 70 },
    { canal: 'Tienda', total: 30 },
  ];

  const aggregated = aggregateByKey(sample, 'canal', 'total');
  const web = aggregated.find((a) => a.label === 'Web');
  const tienda = aggregated.find((a) => a.label === 'Tienda');

  assert.equal(web?.value, 120);
  assert.equal(tienda?.value, 30);
});
