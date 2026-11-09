// As tabelas do README. Todo numero daqui sai de um metodo; nenhum e digitado.

import {
  varrer,
  todos,
  orbitas,
  fatorial,
  quantosVetores,
  ehCostas,
  vetores,
} from './costas.js';
import { CONHECIDOS, familiaAlgebrica, conferirConstrucoes } from './juiz.js';

/**
 * Quantos nos a forca bruta abriria: todas as permutacoes PARCIAIS de 1..n, de
 * tamanho 1 a n. E o denominador honesto da poda — comparar com n! compararia
 * nos com folhas.
 */
export function nosSemPoda(n) {
  let total = 0;
  let arranjo = 1;
  for (let k = 1; k <= n; k++) {
    arranjo *= n - k + 1;
    total += arranjo;
  }
  return total;
}

/** Tabela 1 — a varredura por ordem, contra os valores conhecidos. */
export function tabelaVarredura(ate = 12) {
  const linhas = [];
  for (let n = 1; n <= ate; n++) {
    const r = varrer(n);
    linhas.push({
      n,
      permutacoes: fatorial(n),
      total: r.total,
      conhecido: CONHECIDOS[n - 1] ?? null,
      bate: CONHECIDOS[n - 1] === undefined ? null : r.total === CONHECIDOS[n - 1],
      fracao: r.total / fatorial(n),
    });
  }
  return linhas;
}

/** Tabela 2 — o que a poda economiza. */
export function tabelaPoda(ate = 12) {
  const linhas = [];
  for (let n = 1; n <= ate; n++) {
    const r = varrer(n);
    const sem = nosSemPoda(n);
    linhas.push({
      n,
      nos: r.nos,
      semPoda: sem,
      razao: sem / r.nos,
      nosPorArray: r.nos / r.total,
    });
  }
  return linhas;
}

/**
 * Tabela 3 — as orbitas das oito simetrias do quadrado.
 *
 * Um array cuja orbita tem menos de 8 elementos e um array SIMETRICO: ele
 * coincide consigo mesmo por alguma reflexao ou rotacao do tabuleiro.
 */
export function tabelaOrbitas(ate = 11) {
  const linhas = [];
  for (let n = 1; n <= ate; n++) {
    const grupos = orbitas(n);
    const total = grupos.reduce((s, g) => s + g.length, 0);
    const simetricas = grupos.filter((g) => g.length < 8);
    linhas.push({
      n,
      total,
      orbitas: grupos.length,
      tamanhoMedio: total / grupos.length,
      orbitasSimetricas: simetricas.length,
      arraysSimetricos: simetricas.reduce((s, g) => s + g.length, 0),
    });
  }
  return linhas;
}

/**
 * Tabela 4 — a cobertura das construcoes algebricas.
 *
 * E um PISO: so Welch e Golomb sobre corpo primo estao implementados. As
 * construcoes sobre corpo de ordem potencia de primo faltam, e e por isso que a
 * ordem 7 aparece com zero — ela precisaria de GF(9).
 */
export function tabelaAlgebrica(ate = 11) {
  const linhas = [];
  for (let n = 3; n <= ate; n++) {
    const familia = familiaAlgebrica(n);
    const lista = todos(n);
    let cobertos = 0;
    for (const p of lista) if (familia.has(p.join(','))) cobertos++;
    linhas.push({
      n,
      total: lista.length,
      familia: familia.size,
      cobertos,
      fracao: cobertos / lista.length,
    });
  }
  return linhas;
}

/** Tabela 5 — as construcoes algebricas conferidas uma a uma. */
export function tabelaConstrucoes(atePrimo = 40) {
  const r = conferirConstrucoes(atePrimo);
  return { ...r, atePrimo, total: r.welchs + r.golombs };
}

/**
 * Tabela 6 — os vetores.
 *
 * Um array de ordem n tem n(n-1)/2 vetores, e a exigencia e que sejam todos
 * diferentes. Esta tabela confere isso em TODOS os arrays de cada ordem, com o
 * criterio escrito do jeito ingenuo, e nao com a poda incremental da busca.
 */
export function tabelaVetores(ate = 10) {
  const linhas = [];
  for (let n = 1; n <= ate; n++) {
    const lista = todos(n);
    let distintosSempre = true;
    for (const p of lista) {
      const vs = vetores(p);
      if (vs.length !== quantosVetores(n)) distintosSempre = false;
      if (new Set(vs.map((v) => v.join(','))).size !== vs.length) distintosSempre = false;
      if (!ehCostas(p)) distintosSempre = false;
    }
    linhas.push({ n, arrays: lista.length, vetoresPorArray: quantosVetores(n), distintosSempre });
  }
  return linhas;
}
