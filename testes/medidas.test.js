// Os numeros do README, presos. Se o codigo mudar e um numero mudar, isto
// quebra antes de o README virar mentira.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  nosSemPoda,
  tabelaVarredura,
  tabelaPoda,
  tabelaOrbitas,
  tabelaAlgebrica,
  tabelaConstrucoes,
  tabelaVetores,
} from '../src/medidas.js';

const MINUTO = 120_000;

test('as doze primeiras ordens batem com os valores conhecidos', { timeout: MINUTO }, () => {
  const linhas = tabelaVarredura(12);
  assert.deepEqual(
    linhas.map((l) => l.total),
    [1, 2, 4, 12, 40, 116, 200, 444, 760, 2160, 4368, 7852]
  );
  for (const l of linhas) assert.equal(l.bate, true, 'n=' + l.n);
});

test('a fracao de permutacoes que e de Costas desaba de 100% a 0,0016%', { timeout: MINUTO }, () => {
  const linhas = tabelaVarredura(12);
  assert.equal((linhas[0].fracao * 100).toFixed(4), '100.0000');
  assert.equal((linhas[6].fracao * 100).toFixed(4), '3.9683');
  assert.equal((linhas[11].fracao * 100).toFixed(4), '0.0016');
  for (let i = 2; i < linhas.length; i++) {
    assert.ok(linhas[i].fracao < linhas[i - 1].fracao, 'n=' + linhas[i].n);
  }
});

test('o numero ABSOLUTO cresce enquanto a fracao desaba', { timeout: MINUTO }, () => {
  const linhas = tabelaVarredura(12);
  assert.equal(linhas[11].total, 7852);
  assert.equal(linhas[6].total, 200);
  assert.ok(linhas[11].total > linhas[6].total);
  assert.ok(linhas[11].fracao < linhas[6].fracao);
});

test('a poda nao economiza nada ate a ordem 3 e economiza 53x na ordem 12', { timeout: MINUTO }, () => {
  const linhas = tabelaPoda(12);
  for (let i = 0; i < 3; i++) {
    assert.equal(linhas[i].nos, linhas[i].semPoda, 'n=' + linhas[i].n);
    assert.equal(linhas[i].razao, 1);
  }
  const doze = linhas[11];
  assert.equal(doze.n, 12);
  assert.equal(doze.nos, 24_547_436);
  assert.equal(doze.semPoda, 1_302_061_344);
  assert.equal(doze.razao.toFixed(1), '53.0');
});

test('o preco de cada array achado sobe de 1 no para 3.126', { timeout: MINUTO }, () => {
  const linhas = tabelaPoda(12);
  assert.equal(linhas[0].nosPorArray.toFixed(1), '1.0');
  assert.equal(linhas[11].nosPorArray.toFixed(1), '3126.3');
  for (let i = 4; i < linhas.length; i++) {
    assert.ok(linhas[i].nosPorArray > linhas[i - 1].nosPorArray, 'n=' + linhas[i].n);
  }
});

test('os nos sem poda sao a soma dos arranjos, nao n!', { timeout: MINUTO }, () => {
  assert.equal(nosSemPoda(1), 1);
  assert.equal(nosSemPoda(2), 4); // 2 + 2
  assert.equal(nosSemPoda(3), 15); // 3 + 6 + 6
  assert.equal(nosSemPoda(12), 1_302_061_344);
});

test('o tamanho medio da orbita sobe para 7,87 e nunca chega a 8', { timeout: MINUTO }, () => {
  const linhas = tabelaOrbitas(11);
  for (const l of linhas) assert.ok(l.tamanhoMedio <= 8, 'n=' + l.n);
  const onze = linhas[10];
  assert.equal(onze.n, 11);
  assert.equal(onze.total, 4368);
  assert.equal(onze.orbitas, 555);
  assert.equal(onze.tamanhoMedio.toFixed(2), '7.87');
  assert.equal(onze.orbitasSimetricas, 18);
  assert.equal(onze.arraysSimetricos, 72);
});

test('toda ordem tem array simetrico: a coluna nunca zera', { timeout: MINUTO }, () => {
  for (const l of tabelaOrbitas(11)) {
    assert.ok(l.orbitasSimetricas > 0, 'n=' + l.n);
    assert.ok(l.arraysSimetricos > 0, 'n=' + l.n);
  }
});

test('a ordem 7 e a UNICA sem nenhum array vindo de Welch ou Golomb primo', { timeout: MINUTO }, () => {
  const linhas = tabelaAlgebrica(11);
  const zeradas = linhas.filter((l) => l.cobertos === 0);
  assert.equal(zeradas.length, 1);
  assert.equal(zeradas[0].n, 7);
  assert.equal(zeradas[0].total, 200);
  assert.equal(zeradas[0].familia, 0);
});

test('a cobertura algebrica cai de 100% para 0,73% na ordem 11', { timeout: MINUTO }, () => {
  const linhas = tabelaAlgebrica(11);
  assert.equal((linhas[0].fracao * 100).toFixed(2), '100.00'); // n=3
  assert.equal((linhas[1].fracao * 100).toFixed(2), '100.00'); // n=4
  assert.equal((linhas[2].fracao * 100).toFixed(2), '30.00'); // n=5
  const onze = linhas[linhas.length - 1];
  assert.equal(onze.n, 11);
  assert.equal(onze.cobertos, 32);
  assert.equal((onze.fracao * 100).toFixed(2), '0.73');
});

test('a familia algebrica nunca tem array que a varredura nao achou', { timeout: MINUTO }, () => {
  for (const l of tabelaAlgebrica(11)) {
    assert.equal(l.familia, l.cobertos, 'n=' + l.n);
  }
});

test('663 construcoes algebricas, todas de Costas', { timeout: MINUTO }, () => {
  const t = tabelaConstrucoes(40);
  assert.equal(t.welchs, 70);
  assert.equal(t.golombs, 593);
  assert.equal(t.total, 663);
});

test('os vetores sao distintos em todo array de toda ordem ate a 10', { timeout: MINUTO }, () => {
  const linhas = tabelaVetores(10);
  for (const l of linhas) assert.equal(l.distintosSempre, true, 'n=' + l.n);
  assert.equal(linhas[9].arrays, 2160);
  assert.equal(linhas[9].vetoresPorArray, 45);
});
