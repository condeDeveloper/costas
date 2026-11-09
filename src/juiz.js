// O juiz. Nao compartilha nada com a busca: aqui os arrays de Costas nao sao
// procurados, sao CONSTRUIDOS por algebra, e a varredura tem de encontrar todos
// eles sozinha.
//
// Duas construcoes classicas, as duas de 1984:
//
//   Welch  — tome um primo p e uma raiz primitiva g dele. O array de ordem
//            p-1 com a[i] = g^i mod p e de Costas.
//   Golomb — tome duas raizes primitivas a e b. O array de ordem p-2 que poe
//            na coluna i o j tal que a^i + b^j = 1 e de Costas.
//
// As duas valem para qualquer corpo finito. Aqui so estao implementadas sobre
// corpo PRIMO: as de ordem potencia de primo (GF(4), GF(8), GF(9), ...) ficaram
// de fora, e por isso a cobertura medida no README e um PISO, nao o total.
//
// Tambem mora aqui a tabela dos valores conhecidos, que e o gabarito de fora.

import { ehCostas, orbita } from './costas.js';

/** Quantos arrays de Costas tem cada ordem, de 1 a 16 (OEIS A008404). */
export const CONHECIDOS = [
  1, 2, 4, 12, 40, 116, 200, 444, 760, 2160, 4368, 7852, 12828, 17252, 19612, 21104,
];

/** Os primos ate n, pela peneira. */
export function primos(ate) {
  const composto = new Uint8Array(ate + 1);
  const lista = [];
  for (let i = 2; i <= ate; i++) {
    if (composto[i]) continue;
    lista.push(i);
    for (let j = i * i; j <= ate; j += i) composto[j] = 1;
  }
  return lista;
}

/** As raizes primitivas de um primo p. */
export function raizesPrimitivas(p) {
  if (p === 2) return [1];
  const raizes = [];
  for (let g = 2; g < p; g++) {
    const vistos = new Set();
    let x = 1;
    for (let i = 1; i < p; i++) {
      x = (x * g) % p;
      vistos.add(x);
    }
    if (vistos.size === p - 1) raizes.push(g);
  }
  return raizes;
}

/**
 * A construcao de Welch: ordem p-1, a[i] = g^i mod p.
 *
 * Nao confere nada: entrega o array. Quem confere e `ehCostas`, e a varredura.
 */
export function welch(p, g) {
  const a = [];
  let x = 1;
  for (let i = 1; i <= p - 1; i++) {
    x = (x * g) % p;
    a.push(x);
  }
  return a;
}

/**
 * A construcao de Golomb sobre corpo primo: ordem p-2.
 *
 * Na coluna i vai o j com a^i + b^j = 1 (mod p). Com a e b primitivos, esse j
 * existe e e unico para todo i de 1 a p-2.
 */
export function golomb(p, a, b) {
  const potenciaDeB = new Map();
  let y = 1;
  for (let j = 1; j <= p - 2; j++) {
    y = (y * b) % p;
    potenciaDeB.set(y, j);
  }
  const array = [];
  let x = 1;
  for (let i = 1; i <= p - 2; i++) {
    x = (x * a) % p;
    const alvo = ((1 - x) % p + p) % p;
    const j = potenciaDeB.get(alvo);
    if (j === undefined) return null;
    array.push(j);
  }
  return array;
}

/**
 * Tira um canto do array, quando ele tem canto: se a primeira coluna marca o 1
 * ou o n, ou se a ultima marca, da para apagar aquela coluna e aquela linha e o
 * que sobra continua sendo de Costas.
 *
 * E assim que Welch e Golomb geram tambem as ordens vizinhas (as variantes que
 * a literatura chama W2, W3, G3, G4).
 */
export function semCanto(p) {
  const n = p.length;
  const saidas = [];
  const corta = (indice, valor) => {
    const resto = [];
    for (let i = 0; i < n; i++) {
      if (i === indice) continue;
      resto.push(p[i] > valor ? p[i] - 1 : p[i]);
    }
    return resto;
  };
  if (p[0] === 1 || p[0] === n) saidas.push(corta(0, p[0]));
  if (p[n - 1] === 1 || p[n - 1] === n) saidas.push(corta(n - 1, p[n - 1]));
  return saidas;
}

/**
 * A familia algebrica de ordem n: tudo que Welch e Golomb sobre corpo primo
 * produzem nessa ordem, direto ou tirando cantos, fechado pelas oito simetrias
 * do quadrado.
 *
 * E um PISO da cobertura algebrica, porque faltam as construcoes sobre corpo de
 * ordem potencia de primo.
 */
export function familiaAlgebrica(n, folga = 3) {
  const semente = [];
  for (const p of primos(n + folga + 2)) {
    const raizes = raizesPrimitivas(p);
    for (const g of raizes) {
      const w = welch(p, g);
      if (w.length >= n && w.length <= n + folga) semente.push(w);
    }
    for (const a of raizes) {
      for (const b of raizes) {
        const gol = golomb(p, a, b);
        if (gol && gol.length >= n && gol.length <= n + folga) semente.push(gol);
      }
    }
  }

  const familia = new Set();
  const fila = [];
  for (const s of semente) {
    for (const q of orbita(s)) fila.push(q);
  }
  const vistos = new Set();
  while (fila.length) {
    const atual = fila.pop();
    const chave = atual.length + ':' + atual.join(',');
    if (vistos.has(chave)) continue;
    vistos.add(chave);
    if (atual.length === n) familia.add(atual.join(','));
    if (atual.length > n) {
      for (const menor of semCanto(atual)) {
        for (const q of orbita(menor)) fila.push(q);
      }
    }
  }
  return familia;
}

/**
 * Confere que toda construcao algebrica realmente devolve um array de Costas.
 *
 * Se alguma nao devolver, ou a construcao esta mal escrita ou `ehCostas` esta,
 * e nos dois casos a varredura nao vale nada.
 */
export function conferirConstrucoes(atePrimo = 30) {
  let welchs = 0;
  let golombs = 0;
  for (const p of primos(atePrimo)) {
    const raizes = raizesPrimitivas(p);
    for (const g of raizes) {
      if (!ehCostas(welch(p, g))) throw new Error('Welch(' + p + ',' + g + ') nao e de Costas');
      welchs++;
    }
    for (const a of raizes) {
      for (const b of raizes) {
        const gol = golomb(p, a, b);
        if (gol === null || gol.length === 0) continue;
        if (!ehCostas(gol)) throw new Error('Golomb(' + p + ',' + a + ',' + b + ') nao e de Costas');
        golombs++;
      }
    }
  }
  return { welchs, golombs };
}
