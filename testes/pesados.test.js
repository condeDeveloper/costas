// As varreduras grandes, separadas porque passam de meio minuto: as ordens 13 e
// 14. A 15 leva quase quatro minutos e ficou de fora do CI; a 16, onde a
// sequencia tem o pico, leva mais de vinte e ficou de fora do repositorio.
//
// A tabela do README diz o que foi medido aqui, e nada alem.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { varrer, fatorial } from '../src/costas.js';
import { nosSemPoda } from '../src/medidas.js';

const DEZ_MINUTOS = 600_000;

let treze = null;
let catorze = null;

test('ordem 13: 12.828 arrays de Costas em 6.227.020.800 permutacoes', { timeout: DEZ_MINUTOS }, () => {
  treze = varrer(13);
  assert.equal(treze.total, 12_828);
  assert.equal(fatorial(13), 6_227_020_800);
  assert.equal(treze.nos, 131_091_269);
  assert.equal(((treze.total / fatorial(13)) * 100).toFixed(6), '0.000206');
});

test('ordem 14: 17.252 arrays, e a poda ja economiza 335 vezes', { timeout: DEZ_MINUTOS }, () => {
  catorze = varrer(14);
  assert.equal(catorze.total, 17_252);
  assert.equal(catorze.nos, 706_309_620);
  assert.equal(nosSemPoda(14), 236_975_164_804);
  assert.equal((nosSemPoda(14) / catorze.nos).toFixed(1), '335.5');
  assert.equal((catorze.nos / catorze.total).toFixed(1), '40940.7');
  assert.equal(fatorial(14), 87_178_291_200);
  assert.equal(((catorze.total / fatorial(14)) * 100).toFixed(7), '0.0000198');
});

test('de 13 para 14 o numero sobe 34% e a fracao cai pela metade', { timeout: DEZ_MINUTOS }, () => {
  const a = treze ?? varrer(13);
  const b = catorze ?? varrer(14);
  assert.equal(((b.total / a.total - 1) * 100).toFixed(1), '34.5');
  const fracaoA = a.total / fatorial(13);
  const fracaoB = b.total / fatorial(14);
  assert.ok(fracaoB < fracaoA / 2);
});
