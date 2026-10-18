import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateFlooring, convertLength, toFeet, SQFT_PER_SQM } from '../src/core/calculations.js';
import { validatedSettings } from '../src/core/state.js';
const base = { width:12, length:18, unit:'ft', waste:10, coverage:24, price:45, tax:0 };
test('spec sample: area, requirement, rounded boxes, cost', () => {
  const x = calculateFlooring(base);
  assert.equal(x.valid, true);
  assert.equal(x.areaSqFt, 216);
  assert.equal(x.neededSqFt, 237.60000000000002);
  assert.equal(x.boxes, 10);
  assert.equal(x.materialCost, 450);
  assert.equal(x.totalCost, 450);
});
test('metric inputs preserve measurement accurately', () => {
  const m = {...base, width:convertLength(12,'ft','m'), length:convertLength(18,'ft','m'), unit:'m'};
  const result = calculateFlooring(m);
  assert.ok(Math.abs(result.areaSqFt - 216) < 1e-8);
  assert.equal(result.boxes,10);
  assert.ok(Math.abs(result.areaSqM - 216/SQFT_PER_SQM) < 1e-8);
});
test('coverage rounding and exact divisible amount', () => {
  assert.equal(calculateFlooring({...base, waste:0, coverage:24}).boxes,9);
  assert.equal(calculateFlooring({...base, waste:10, coverage:24}).boxes,10);
});
test('tax adds separately without rounding intermediates', () => {
  const x=calculateFlooring({...base, tax:8.5});
  assert.equal(x.taxAmount,38.25);
  assert.equal(x.totalCost,488.25);
});
test('validates geometry, missing/invalid, absurd values', () => {
  for (const candidate of [
    {...base, width:0}, {...base,length:-4}, {...base, width:'foo'},
    {...base, length:501}, {...base,coverage:0}, {...base,waste:55},
    {...base,price:-1}, {...base,tax:41}, {...base,unit:'in'}
  ]) assert.equal(calculateFlooring(candidate).valid,false);
});
test('metric length upper limit is physically equivalent', () => {
  const maxM = 500/3.280839895013123;
  assert.equal(calculateFlooring({...base, width: maxM, unit:'m'}).valid, true);
  assert.equal(calculateFlooring({...base, width: maxM+1, unit:'m'}).valid, false);
});
test('share/load sanitization resets unsafe settings', () => {
  assert.equal(validatedSettings({ width: -999 }).width,12);
  assert.equal(validatedSettings({ material:'bad' }).material,'vinyl');
  assert.equal(validatedSettings({ width:'15', length:'20' }).width,15);
});
test('conversion constants match reference', () => {
  assert.ok(Math.abs(toFeet(1,'m')-3.280839895)<1e-9);
});
