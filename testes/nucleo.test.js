// O comportamento. Nada de tabela aqui: isto e o que um array de Costas e, e o
// que a algebra diz que ele e.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  ehCostas,
  vetores,
  quantosVetores,
  varrer,
  todos,
  quantos,
  fatorial,
  transposta,
  espelhoHorizontal,
  espelhoVertical,
  orbita,
  orbitas,
} from '../src/costas.js';
import {
  CONHECIDOS,
  primos,
  raizesPrimitivas,
  welch,
  golomb,
  semCanto,
  conferirConstrucoes,
} from '../src/juiz.js';

/** Todas as permutacoes de 1..n, para a conferencia ingenua. */
function* permutacoes(n) {
  const p = [];
  for (let i = 1; i <= n; i++) p.push(i);
  yield p.slice();
  for (;;) {
    let i = n - 2;
    while (i >= 0 && p[i] >= p[i + 1]) i--;
    if (i < 0) return;
    let j = n - 1;
    while (p[j] <= p[i]) j--;
    [p[i], p[j]] = [p[j], p[i]];
    for (let a = i + 1, b = n - 1; a < b; a++, b--) [p[a], p[b]] = [p[b], p[a]];
    yield p.slice();
  }
}

test('a identidade NAO e de Costas a partir de tres casas', () => {
  assert.equal(ehCostas([1]), true);
  assert.equal(ehCostas([1, 2]), true);
  assert.equal(ehCostas([1, 2, 3]), false); // (1,1) aparece duas vezes
  assert.equal(ehCostas([1, 2, 3, 4]), false);
});

test('ehCostas aceita e recusa exemplos pequenos pelo motivo certo', () => {
  assert.equal(ehCostas([2, 1, 3]), true);
  assert.equal(ehCostas([2, 3, 1]), true);
  assert.equal(ehCostas([1, 3, 2]), true);
  assert.equal(ehCostas([3, 2, 1]), false); // (1,-1) duas vezes
});

test('um array de ordem n tem n(n-1)/2 vetores', () => {
  for (let n = 1; n <= 8; n++) {
    for (const p of todos(n)) {
      assert.equal(vetores(p).length, quantosVetores(n));
    }
  }
});

test('nos arrays de Costas os vetores sao todos distintos, sem excecao', () => {
  for (let n = 1; n <= 8; n++) {
    for (const p of todos(n)) {
      const vs = vetores(p).map((v) => v.join(','));
      assert.equal(new Set(vs).size, vs.length, p.join(','));
    }
  }
});

test('a busca com poda acha exatamente o que a peneira ingenua acha', () => {
  for (let n = 1; n <= 8; n++) {
    const porPoda = new Set(todos(n).map((p) => p.join(',')));
    const porPeneira = new Set();
    for (const p of permutacoes(n)) if (ehCostas(p)) porPeneira.add(p.join(','));
    assert.deepEqual([...porPoda].sort(), [...porPeneira].sort(), 'n=' + n);
  }
});

test('a varredura nao devolve array repetido', () => {
  for (let n = 1; n <= 9; n++) {
    const lista = todos(n).map((p) => p.join(','));
    assert.equal(new Set(lista).size, lista.length);
  }
});

test('a varredura devolve permutacoes de verdade', () => {
  for (let n = 1; n <= 8; n++) {
    for (const p of todos(n)) {
      assert.deepEqual(p.slice().sort((a, b) => a - b), Array.from({ length: n }, (_, i) => i + 1));
    }
  }
});

test('as contagens batem com os valores conhecidos ate a ordem 11', () => {
  for (let n = 1; n <= 11; n++) {
    assert.equal(quantos(n), CONHECIDOS[n - 1], 'n=' + n);
  }
});

test('transposta e os dois espelhos sao involucoes', () => {
  for (const p of todos(6)) {
    assert.deepEqual(transposta(transposta(p)), p);
    assert.deepEqual(espelhoHorizontal(espelhoHorizontal(p)), p);
    assert.deepEqual(espelhoVertical(espelhoVertical(p)), p);
  }
});

test('as simetrias do quadrado levam array de Costas em array de Costas', () => {
  for (let n = 3; n <= 7; n++) {
    for (const p of todos(n)) {
      assert.equal(ehCostas(transposta(p)), true);
      assert.equal(ehCostas(espelhoHorizontal(p)), true);
      assert.equal(ehCostas(espelhoVertical(p)), true);
    }
  }
});

test('toda orbita tem no maximo 8 elementos, e o tamanho divide 8', () => {
  for (let n = 1; n <= 9; n++) {
    for (const grupo of orbitas(n)) {
      assert.ok(grupo.length <= 8, 'n=' + n + ' orbita de ' + grupo.length);
      assert.equal(8 % grupo.length, 0, 'n=' + n + ' orbita de ' + grupo.length);
    }
  }
});

test('as orbitas particionam os arrays: nada sobra e nada aparece duas vezes', () => {
  for (let n = 1; n <= 9; n++) {
    const grupos = orbitas(n);
    const todosDaOrbita = grupos.flat().map((p) => p.join(','));
    assert.equal(new Set(todosDaOrbita).size, todosDaOrbita.length);
    assert.equal(todosDaOrbita.length, quantos(n));
  }
});

test('a orbita de um array contem o proprio array', () => {
  for (const p of todos(7)) {
    assert.ok(orbita(p).some((q) => q.join(',') === p.join(',')));
  }
});

test('Welch entrega array de Costas de ordem p-1', () => {
  for (const p of primos(30)) {
    for (const g of raizesPrimitivas(p)) {
      const a = welch(p, g);
      assert.equal(a.length, p - 1, 'p=' + p);
      assert.equal(ehCostas(a), true, 'Welch(' + p + ',' + g + ')');
    }
  }
});

test('Golomb entrega array de Costas de ordem p-2', () => {
  for (const p of primos(30)) {
    const raizes = raizesPrimitivas(p);
    for (const a of raizes) {
      for (const b of raizes) {
        const g = golomb(p, a, b);
        if (g === null || g.length === 0) continue;
        assert.equal(g.length, p - 2, 'p=' + p);
        assert.equal(ehCostas(g), true, 'Golomb(' + p + ',' + a + ',' + b + ')');
      }
    }
  }
});

test('as 663 construcoes ate o primo 40 passam todas pela conferencia ingenua', () => {
  const r = conferirConstrucoes(40);
  assert.equal(r.welchs, 70);
  assert.equal(r.golombs, 593);
  assert.equal(r.welchs + r.golombs, 663);
});

test('tirar um canto de um array de Costas devolve array de Costas', () => {
  for (let n = 4; n <= 8; n++) {
    for (const p of todos(n)) {
      for (const menor of semCanto(p)) {
        assert.equal(menor.length, n - 1);
        assert.equal(ehCostas(menor), true, p.join(',') + ' -> ' + menor.join(','));
      }
    }
  }
});

test('a poda nunca abre mais nos que a forca bruta', () => {
  for (let n = 1; n <= 10; n++) {
    const r = varrer(n);
    assert.ok(r.nos <= fatorial(n) * 3, 'n=' + n);
  }
});

test('as raizes primitivas de um primo sao phi(p-1) delas', () => {
  assert.deepEqual(raizesPrimitivas(5), [2, 3]);
  assert.deepEqual(raizesPrimitivas(7), [3, 5]);
  assert.equal(raizesPrimitivas(11).length, 4);
  assert.equal(raizesPrimitivas(13).length, 4);
});
